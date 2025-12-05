'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
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

const COLOR_THEMES = [
  { name: 'Violeta', value: 'violet', gradient: 'from-violet-400 to-violet-600' },
  { name: 'Ámbar', value: 'amber', gradient: 'from-amber-400 to-amber-600' },
  { name: 'Esmeralda', value: 'emerald', gradient: 'from-emerald-400 to-emerald-600' },
  { name: 'Rosa', value: 'rose', gradient: 'from-rose-400 to-rose-600' },
] as const

export function CreateTopicDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [colorTheme, setColorTheme] = useState<'violet' | 'amber' | 'emerald' | 'rose'>('violet')
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated')

      const { error: createError } = await supabase
        .from('topics')
        .insert({
          user_id: user.id,
          title: title.trim(),
          color_theme: colorTheme,
        })

      if (createError) throw createError

      setTitle('')
      setColorTheme('violet')
      setOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el tema')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glass-panel-hover gap-2">
          <Plus className="h-5 w-5" />
          Nuevo Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-white">Crear Nuevo Tema</DialogTitle>
          <DialogDescription className="text-white/70">
            Organiza tus flashcards por tema de estudio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Título del Tema
              </Label>
              <Input
                id="title"
                placeholder="Ej: Matemáticas, Historia, Química..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-panel border-white/20 text-white placeholder:text-white/50"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white">Color del Tema</Label>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setColorTheme(theme.value)}
                    className={`relative h-20 rounded-xl bg-gradient-to-br ${theme.gradient} transition-all duration-300 hover:scale-105 ${
                      colorTheme === theme.value
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                        : 'opacity-70'
                    }`}
                    disabled={isCreating}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
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
              {isCreating ? 'Creando...' : 'Crear Tema'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
