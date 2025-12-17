import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ============================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MIN_EMAIL_LENGTH = 5;
const MAX_REGISTRATIONS_PER_IP = 5; // Máximo 5 registros por IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 3; // Máximo 3 intentos por minuto por IP

// Store para rate limiting (en producción usa Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Lista de dominios temporales conocidos (expandir según necesidad)
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 
  '10minutemail.com', 'throwaway.email', 'mailinator.com',
  'trashmail.com', 'fakeinbox.com', 'yopmail.com'
];

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

function validateEmail(email: string): { valid: boolean; error?: string } {
  // Longitud
  if (email.length < MIN_EMAIL_LENGTH || email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: "Email con longitud inválida" };
  }

  // Formato regex mejorado
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Formato de email inválido" };
  }

  // Validar dominio
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return { valid: false, error: "Email sin dominio válido" };
  }

  // Bloquear emails temporales
  if (TEMP_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: "No se permiten emails temporales" };
  }

  // Validar caracteres sospechosos
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { valid: false, error: "Email con formato inválido" };
  }

  return { valid: true };
}

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (record) {
    // Si el tiempo de reset pasó, limpiar
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
      return { allowed: true };
    }

    // Verificar si excede el límite
    if (record.count >= MAX_REQUESTS_PER_MINUTE) {
      const secondsLeft = Math.ceil((record.resetTime - now) / 1000);
      return { 
        allowed: false, 
        error: `Demasiados intentos. Espera ${secondsLeft} segundos.` 
      };
    }

    // Incrementar contador
    record.count++;
  } else {
    // Crear nuevo registro
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
  }

  return { allowed: true };
}

async function checkIpRegistrationLimit(ip: string): Promise<{ allowed: boolean; error?: string }> {
  try {
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip);

    if (error) throw error;

    if (count && count >= MAX_REGISTRATIONS_PER_IP) {
      return { 
        allowed: false, 
        error: "Esta IP ha alcanzado el límite de registros permitidos" 
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking IP limit:", error);
    // En caso de error, permitir (fail open)
    return { allowed: true };
  }
}

// ============================================
// ENDPOINT POST
// ============================================

export async function POST(request: Request) {
  try {
    // 1. Capturar IP del usuario
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

    // 2. Verificar rate limiting
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.error },
        { status: 429 }
      );
    }

    // 3. Obtener y sanitizar email
    const body = await request.json();
    let { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // Sanitizar: trim y lowercase
    email = email.trim().toLowerCase();

    // 4. Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // 5. Verificar límite de registros por IP
    const ipLimitCheck = await checkIpRegistrationLimit(ip);
    if (!ipLimitCheck.allowed) {
      return NextResponse.json(
        { error: ipLimitCheck.error },
        { status: 403 }
      );
    }

    // 6. Insertar en Supabase
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ 
        email,
        ip_address: ip 
      }])
      .select();

    if (error) {
      // Error de email duplicado
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Este email ya está registrado" },
          { status: 409 }
        );
      }

      console.error("Error de Supabase:", error);
      return NextResponse.json(
        { error: "Error al guardar el email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "¡Listo! Te notificaremos cuando estemos listos." 
    });

  } catch (error) {
    console.error("Error en waitlist:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Endpoint opcional para ver cuántos registros hay (admin)
export async function GET() {
  try {
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({ total: count });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}