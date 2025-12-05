import { createClient } from '@/lib/supabase/server'
import type { Assignment, Flashcard } from '@/lib/types'

export async function getAssignments(topicId: string): Promise<Assignment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAssignment(
  topicId: string,
  title: string
): Promise<Assignment> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('assignments')
    .insert({
      topic_id: topicId,
      title,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAssignment(
  id: string,
  updates: Partial<Pick<Assignment, 'title'>>
): Promise<Assignment> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('assignments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAssignment(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getAssignmentWithFlashcards(id: string) {
  const supabase = await createClient()
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', id)
    .single()

  if (assignmentError) throw assignmentError

  const { data: flashcards, error: flashcardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('assignment_id', id)
    .order('created_at', { ascending: false })

  if (flashcardsError) throw flashcardsError

  return { assignment, flashcards: flashcards || [] }
}
