import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { UserAvatar } from '@/components/layout/UserAvatar'
import { CreateFlashcardDialog } from '@/components/flashcards/CreateFlashcardDialog'
import { FlashcardsList } from '@/components/flashcards/FlashcardsList'
import { ArrowLeft, BookOpen, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AssignmentPageProps {
  params: Promise<{ id: string }>
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Obtener el assignment con su topic
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('*, topics(*)')
    .eq('id', id)
    .single()

  if (assignmentError || !assignment) notFound()

  // Obtener flashcards del assignment
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('assignment_id', id)
    .order('created_at', { ascending: false })

  const topic = assignment.topics

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
          <div className="flex items-center gap-2 text-white/70 mb-8">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href={`/dashboard/topics/${topic.id}`} className="hover:text-white transition-colors">
              {topic.title}
            </Link>
            <span>/</span>
            <span className="text-white">{assignment.title}</span>
          </div>

          {/* Assignment Header */}
          <div className="glass-panel rounded-3xl p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full bg-${topic.color_theme}-400`} />
                  <span className="text-white/60 text-sm">{topic.title}</span>
                </div>
                <h2 className="text-4xl font-serif font-bold text-white mb-4">
                  {assignment.title}
                </h2>
                <p className="text-white/60">
                  {flashcards?.length || 0} {flashcards?.length === 1 ? 'flashcard' : 'flashcards'}
                </p>
              </div>
              {flashcards && flashcards.length > 0 && (
                <Link href={`/study/${id}`}>
                  <Button className="glass-panel-hover gap-2" size="lg">
                    <Play className="h-5 w-5" />
                    Modo Estudio
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Flashcards Section */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              Flashcards
            </h3>
            <CreateFlashcardDialog assignmentId={id} />
          </div>

          {/* Flashcards List */}
          {flashcards && flashcards.length > 0 ? (
            <FlashcardsList flashcards={flashcards} />
          ) : (
            <div className="glass-panel rounded-3xl p-16 text-center">
              <BookOpen className="h-24 w-24 text-white/20 mx-auto mb-6" />
              <h4 className="text-2xl font-bold text-white mb-3">
                No hay flashcards aún
              </h4>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Crea tu primera flashcard para empezar a estudiar este tema
              </p>
              <CreateFlashcardDialog assignmentId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
