import { createClient } from '@/lib/supabase/server'
import type { Topic, Assignment, Flashcard } from '@/lib/types'

export async function getTopics(): Promise<Topic[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTopic(
  title: string,
  colorTheme: 'amber' | 'emerald' | 'violet' | 'rose' = 'violet'
): Promise<Topic> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('topics')
    .insert({
      user_id: user.id,
      title,
      color_theme: colorTheme,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTopic(
  id: string,
  updates: Partial<Pick<Topic, 'title' | 'color_theme'>>
): Promise<Topic> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('topics')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTopic(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getTopicWithAssignments(id: string) {
  const supabase = await createClient()
  const { data: topic, error: topicError } = await supabase
    .from('topics')
    .select('*')
    .eq('id', id)
    .single()

  if (topicError) throw topicError

  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select('*')
    .eq('topic_id', id)
    .order('created_at', { ascending: false })

  if (assignmentsError) throw assignmentsError

  return { topic, assignments: assignments || [] }
}
