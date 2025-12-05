import { createClient } from '@/lib/supabase/server'
import type { Flashcard } from '@/lib/types'

export async function getFlashcards(assignmentId: string): Promise<Flashcard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createFlashcard(
  assignmentId: string,
  question: string,
  answer: string,
  mediaUrl?: string
): Promise<Flashcard> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      assignment_id: assignmentId,
      question,
      answer,
      media_url: mediaUrl,
      status: 'new',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFlashcard(
  id: string,
  updates: Partial<Pick<Flashcard, 'question' | 'answer' | 'media_url' | 'status'>>
): Promise<Flashcard> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flashcards')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFlashcard(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateFlashcardStatus(
  id: string,
  status: 'new' | 'learning' | 'mastered'
): Promise<Flashcard> {
  return updateFlashcard(id, { status })
}

export async function getFlashcardsByStatus(
  assignmentId: string,
  status: 'new' | 'learning' | 'mastered'
): Promise<Flashcard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
