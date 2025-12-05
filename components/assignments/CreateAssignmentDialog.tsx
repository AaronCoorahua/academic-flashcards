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
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CreateAssignmentDialogProps {
  topicId: string
}

export function CreateAssignmentDialog({ topicId }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Por favor ingresa un título')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const { error: createError } = await supabase
        .from('assignments')
        .insert({
          topic_id: topicId,
          title: title.trim(),
        })

      if (createError) throw createError

      setTitle('')
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarea')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glass-panel-hover gap-2">
          <Plus className="h-5 w-5" />
          Nueva Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-white">Crear Nueva Tarea</DialogTitle>
          <DialogDescription className="text-white/70">
            Las tareas te ayudan a organizar tus flashcards por tema o lección
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Título de la Tarea
              </Label>
              <Input
                id="title"
                placeholder="Ej: Capítulo 1, Unidad 3, Examen Final..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-panel border-white/20 text-white placeholder:text-white/50"
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
              disabled={isCreating || !title.trim()}
              className="glass-panel-hover"
            >
              {isCreating ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
