const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('Por favor verifica tu archivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('🚀 Ejecutando migración de base de datos...\n')

  const sqlFile = path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql')
  const sql = fs.readFileSync(sqlFile, 'utf8')

  // Dividir el SQL en statements individuales
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📄 Ejecutando ${statements.length} statements SQL...\n`)

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
      
      if (error) {
        // Si no existe la función exec_sql, intentar ejecutar directamente
        console.log(`⚠️  No se puede usar RPC, necesitas ejecutar el SQL manualmente en Supabase Dashboard`)
        console.log(`\n📋 Instrucciones:`)
        console.log(`1. Ve a tu proyecto en https://supabase.com`)
        console.log(`2. Ve a SQL Editor`)
        console.log(`3. Crea un nuevo query`)
        console.log(`4. Copia y pega el contenido de: supabase/migrations/001_initial_schema.sql`)
        console.log(`5. Haz clic en "Run" o presiona Ctrl+Enter\n`)
        process.exit(1)
      }
      
      process.stdout.write(`✓ Statement ${i + 1}/${statements.length} ejecutado\r`)
    } catch (err) {
      console.error(`\n❌ Error en statement ${i + 1}:`, err.message)
      process.exit(1)
    }
  }

  console.log('\n\n✅ Migración completada exitosamente!')
  console.log('📊 Tablas creadas:')
  console.log('   - profiles')
  console.log('   - topics')
  console.log('   - assignments')
  console.log('   - flashcards')
  console.log('\n🔒 Row Level Security (RLS) habilitado en todas las tablas')
  console.log('✨ Trigger para auto-crear perfil configurado\n')
}

runMigration()
