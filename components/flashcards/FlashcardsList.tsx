'use client'

import { useState } from 'react'
import { Flashcard } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2 } from 'lucide-react'

interface FlashcardsListProps {
  flashcards: Flashcard[]
}

const STATUS_CONFIG = {
  new: { label: 'Nuevo', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  learning: { label: 'Aprendiendo', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  mastered: { label: 'Dominado', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
}

export function FlashcardsList({ flashcards }: FlashcardsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => {
        const isExpanded = expandedId === flashcard.id
        const statusConfig = STATUS_CONFIG[flashcard.status]

        return (
          <div
            key={flashcard.id}
            className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${statusConfig.color} border`}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {flashcard.question}
                </h4>
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-1">Respuesta:</p>
                    <p className="text-white">{flashcard.answer}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpandedId(isExpanded ? null : flashcard.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
