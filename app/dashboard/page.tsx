import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { CreateTopicDialog } from '@/components/topics/CreateTopicDialog'
import { Plus, BookOpen, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Obtener topics del usuario
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600 top-1/4 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-purple-600 top-1/2 right-1/4 animate-float-delayed" />
        <div className="orb w-72 h-72 bg-indigo-600 bottom-1/4 left-1/3 animate-float" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-violet-400" />
            <h1 className="text-2xl font-serif font-bold text-white">
              Academic Flashcards
            </h1>
          </div>
          <UserAvatar user={user} />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
              Bienvenido de vuelta
            </h2>
            <p className="text-slate-300">
              Continúa tu aprendizaje donde lo dejaste
            </p>
          </div>

          {/* Topics Section */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-violet-400" />
              Mis Temas
            </h3>
            <CreateTopicDialog />
          </div>

          {/* Topics Grid */}
          {topics && topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/dashboard/topics/${topic.id}`}
                  className="glass-panel-hover rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-${topic.color_theme}-400 to-${topic.color_theme}-600 flex items-center justify-center`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {topic.title}
                  </h4>
                  <p className="text-white/60 text-sm">
                    Creado {new Date(topic.created_at).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-16 text-center">
              <FolderOpen className="h-24 w-24 text-white/20 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">
                No tienes temas aún
              </h4>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Crea tu primer tema para empezar a organizar tus flashcards y materiales de estudio
              </p>
              <CreateTopicDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
