# Academic Flashcards 🎓

Una aplicación web progresiva (PWA) de flashcards académicas con diseño Liquid Glass, construida con Next.js 16 y Supabase.

## ✨ Características

- 🎨 **Diseño Liquid Glass** con animaciones fluidas
- 🔐 **Autenticación segura** con Supabase (email/password)
- 📚 **Gestión de temas** con colores personalizables
- 📝 **Creación de flashcards** ilimitadas
- 🎯 **Modo estudio inmersivo** con animación 3D flip
- 📊 **Seguimiento de progreso** (nuevo, aprendiendo, dominado)
- 🔄 **Sincronización en la nube** automática
- 📱 **Diseño responsive** para todos los dispositivos

## 🚀 Tech Stack

- **Framework:** Next.js 16.0.7 (App Router)
- **Lenguaje:** TypeScript 5.7.0
- **Estilos:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **Animaciones:** Framer Motion 12.23.0
- **Iconos:** Lucide React 0.556.0
- **Backend:** Supabase 2.86.0 (Auth + PostgreSQL)

## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/AaronCoorahua/academic-flashcards.git
cd academic-flashcards
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Ejecutar migración de base de datos:**

Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard):
- SQL Editor > New Query
- Copia y pega el contenido de `supabase/migrations/001_initial_schema.sql`
- Ejecuta el query

5. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Uso

1. **Registrarse/Iniciar sesión**
2. **Crear un tema** (Matemáticas, Historia, etc.)
3. **Agregar tareas** al tema (Capítulo 1, Unidad 2, etc.)
4. **Crear flashcards** con preguntas y respuestas
5. **Estudiar** con el modo inmersivo 3D
6. **Marcar como dominadas** las flashcards aprendidas

## 🎨 Características del Diseño

- **Liquid Glass aesthetic** con blur effects
- **Animated orbs** en el fondo
- **Glass panels** con transparencia
- **3D card flip** animación en modo estudio
- **Gradientes vibrantes** con temas de color
- **Fuentes premium:** Playfair Display + Inter

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Autenticación segura con Supabase Auth
- Políticas de acceso por usuario
- Variables de entorno para credenciales

## 📝 Licencia

MIT License

## 👨‍💻 Autor

**Aaron Coorahua**
- GitHub: [@AaronCoorahua](https://github.com/AaronCoorahua)
