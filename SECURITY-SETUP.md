# 🔒 Configuración de Seguridad - Arabella Financial OS

## ⚠️ IMPORTANTE: Pasos Obligatorios Antes de Usar en Producción

### 1. 🔐 Configurar Row Level Security (RLS) en Supabase

**CRÍTICO:** Sin RLS, cualquiera puede leer todos los emails de tu waitlist.

#### Pasos:
1. Ve a tu Dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (icono en el menú lateral)
4. Crea una nueva query
5. Copia y pega todo el contenido del archivo `supabase-setup.sql`
6. Haz clic en **Run** (o presiona Ctrl+Enter)

✅ Esto creará:
- Políticas de seguridad RLS
- Índices para mejor rendimiento
- Verificaciones de seguridad

---

### 2. 👤 Crear Usuario Administrador

Para acceder al panel de admin, necesitas crear un usuario en Supabase:

1. Dashboard → **Authentication** → **Users**
2. Haz clic en **"Add user"**
3. Completa:
   - **Email:** tu-admin@email.com
   - **Password:** (tu contraseña segura)
   - ✅ Marca **"Auto Confirm User"** (importante)
4. Haz clic en **"Create user"**

Ahora puedes iniciar sesión en `/admin` con estas credenciales.

---

### 3. 📧 Habilitar Verificación de Email (Recomendado)

Para evitar emails spam en tu waitlist:

1. Dashboard → **Authentication** → **Providers** → **Email**
2. Habilita **"Confirm email"**
3. Configura el template de email (opcional)

---

### 4. 🔑 Regenerar Credenciales (Si el repo es público)

Si tu código está en GitHub público, tus credenciales están expuestas.

#### Regenerar API Keys:
1. Dashboard → **Settings** → **API**
2. En la sección **"Project API keys"**:
   - Haz clic en **"Reset anon key"**
3. Copia la nueva key
4. Actualiza tu archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-nueva-key
   ```

⚠️ **NUNCA** hagas commit de `.env.local` (ya está en `.gitignore`)

---

## 🚀 Desarrollo Local

### Instalar dependencias
```bash
npm install
```

### Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Ejecutar en desarrollo
```bash
npm run dev
```

Accede a:
- Landing: http://localhost:4200
- Admin: http://localhost:4200/admin

---

## 📊 Estructura de Base de Datos

### Tabla: `waitlist`

| Campo       | Tipo         | Descripción                |
|-------------|--------------|----------------------------|
| id          | UUID         | Primary key (auto)         |
| email       | TEXT         | Email único, not null      |
| created_at  | TIMESTAMPTZ  | Fecha de registro          |

### Políticas RLS:
- ✅ **INSERT:** Cualquiera puede registrarse (público)
- ✅ **SELECT:** Solo usuarios autenticados pueden leer

---

## 🛡️ Características de Seguridad Implementadas

### ✅ Completado:
- [x] Row Level Security (RLS) en Supabase
- [x] Middleware con validación de sesiones
- [x] Headers de seguridad (X-Robots-Tag, X-Frame-Options, X-Content-Type-Options)
- [x] Cliente Supabase mejorado con @supabase/ssr
- [x] Validación de emails duplicados
- [x] Manejo de errores apropiado
- [x] .env.local excluido de Git

### 🔄 Recomendaciones Adicionales:
- [ ] Habilitar verificación de email
- [ ] Configurar rate limiting en API routes
- [ ] Añadir CAPTCHA en el formulario (opcional)
- [ ] Configurar alertas en Supabase para actividad sospechosa

---

## 🆘 Solución de Problemas

### Error: "Failed to fetch" al registrar email
- Verifica que las credenciales en `.env.local` sean correctas
- Asegúrate de ejecutar el script SQL para crear la tabla

### Error: "new row violates row-level security policy"
- Ejecuta el script `supabase-setup.sql` completo
- Verifica que las políticas RLS estén habilitadas

### No puedo iniciar sesión en /admin
- Asegúrate de haber creado un usuario en Supabase
- Marca "Auto Confirm User" al crear el usuario
- Verifica que el email y contraseña sean correctos

---

## 📞 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**¿Todo configurado?** 🎉 Ya puedes empezar a recibir registros en tu waitlist de forma segura.
