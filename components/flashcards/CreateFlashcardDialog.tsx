'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CreateFlashcardDialogProps {
  assignmentId: string
}

export function CreateFlashcardDialog({ assignmentId }: CreateFlashcardDialogProps) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const { error: createError } = await supabase
        .from('flashcards')
        .insert({
          assignment_id: assignmentId,
          question: question.trim(),
          answer: answer.trim(),
          status: 'new',
        })

      if (createError) throw createError

      setQuestion('')
      setAnswer('')
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la flashcard')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glass-panel-hover gap-2">
          <Plus className="h-5 w-5" />
          Nueva Flashcard
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-white">Crear Nueva Flashcard</DialogTitle>
          <DialogDescription className="text-white/70">
            Agrega una pregunta y su respuesta para estudiar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-white">
                Pregunta
              </Label>
              <Textarea
                id="question"
                placeholder="Ej: ¿Cuál es la fórmula del teorema de Pitágoras?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="glass-panel border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer" className="text-white">
                Respuesta
              </Label>
              <Textarea
                id="answer"
                placeholder="Ej: a² + b² = c²"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="glass-panel border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                disabled={isCreating}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isCreating}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !question.trim() || !answer.trim()}
              className="glass-panel-hover"
            >
              {isCreating ? 'Creando...' : 'Crear Flashcard'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
