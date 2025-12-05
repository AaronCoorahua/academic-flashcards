import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FlashcardStudyMode } from '@/components/study/FlashcardStudyMode'
import { notFound } from 'next/navigation'

interface StudyPageProps {
  params: Promise<{ assignmentId: string }>
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { assignmentId } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Obtener assignment con topic
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('*, topics(*)')
    .eq('id', assignmentId)
    .single()

  if (assignmentError || !assignment) notFound()

  // Obtener flashcards
  const { data: flashcards, error: flashcardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false })

  if (flashcardsError || !flashcards || flashcards.length === 0) {
    redirect(`/dashboard/assignments/${assignmentId}`)
  }

  return <FlashcardStudyMode flashcards={flashcards} assignment={assignment} topic={assignment.topics} />
}
