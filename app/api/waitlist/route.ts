import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validación básica
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Guardar en archivo CSV (temporal, luego migraremos a Supabase)
    const filePath = path.join(process.cwd(), "waitlist.csv");
    const timestamp = new Date().toISOString();
    const line = `${email},${timestamp}\n`;

    try {
      // Verificar si el archivo existe
      await fs.access(filePath);
      // Si existe, leer y verificar duplicados
      const content = await fs.readFile(filePath, "utf-8");
      if (content.includes(email)) {
        return NextResponse.json(
          { error: "Este email ya está registrado" },
          { status: 409 }
        );
      }
      // Agregar al final
      await fs.appendFile(filePath, line);
    } catch (error) {
      // Si no existe, crear con headers
      await fs.writeFile(filePath, `email,timestamp\n${line}`);
    }

    // TODO: Aquí agregarás el envío de email de confirmación
    // usando Resend o similar

    return NextResponse.json({ 
      success: true,
      message: "Email registrado exitosamente" 
    });

  } catch (error) {
    console.error("Error en waitlist:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}