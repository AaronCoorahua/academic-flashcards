import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { CreateAssignmentDialog } from '@/components/assignments/CreateAssignmentDialog'
import { ArrowLeft, BookOpen, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TopicPageProps {
  params: Promise<{ id: string }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Obtener el topic
  const { data: topic, error: topicError } = await supabase
    .from('topics')
    .select('*')
    .eq('id', id)
    .single()

  if (topicError || !topic) notFound()

  // Obtener assignments del topic
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*, flashcards(count)')
    .eq('topic_id', id)
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
          {/* Breadcrumb */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>

          {/* Topic Header */}
          <div className="glass-panel rounded-3xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br from-${topic.color_theme}-400 to-${topic.color_theme}-600 flex items-center justify-center flex-shrink-0`}>
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-serif font-bold text-white mb-2">
                  {topic.title}
                </h2>
                <p className="text-white/60">
                  {assignments?.length || 0} {assignments?.length === 1 ? 'tarea' : 'tareas'}
                </p>
              </div>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-violet-400" />
              Tareas
            </h3>
            <CreateAssignmentDialog topicId={id} />
          </div>

          {/* Assignments Grid */}
          {assignments && assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/dashboard/assignments/${assignment.id}`}
                  className="glass-panel-hover rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-violet-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {assignment.title}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {assignment.flashcards?.[0]?.count || 0} flashcards
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-16 text-center">
              <FileText className="h-24 w-24 text-white/20 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">
                No hay tareas aún
              </h4>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Crea tu primera tarea para empezar a agregar flashcards de estudio
              </p>
              <CreateAssignmentDialog topicId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
