'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flashcard, Topic, Assignment } from '@/lib/types'
import { X, ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface FlashcardStudyModeProps {
  flashcards: Flashcard[]
  assignment: Assignment & { topics: Topic }
  topic: Topic
}

export function FlashcardStudyMode({ flashcards, assignment, topic }: FlashcardStudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const handleNext = () => {
    setIsFlipped(false)
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleMastered = async () => {
    const newMastered = new Set(masteredCards)
    newMastered.add(currentCard.id)
    setMasteredCards(newMastered)

    // Actualizar en la base de datos
    await supabase
      .from('flashcards')
      .update({ status: 'mastered' })
      .eq('id', currentCard.id)

    handleNext()
  }

  const handleExit = () => {
    router.push(`/dashboard/assignments/${assignment.id}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600 top-1/4 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-purple-600 top-1/2 right-1/4 animate-float-delayed" />
        <div className="orb w-72 h-72 bg-indigo-600 bottom-1/4 left-1/3 animate-float" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-3 w-3 rounded-full bg-${topic.color_theme}-400`} />
              <span className="text-white/60 text-sm">{topic.title}</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">
              {assignment.title}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">
              Tarjeta {currentIndex + 1} de {flashcards.length}
            </span>
            <span className="text-white/70 text-sm">
              {masteredCards.size} dominadas
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative z-10 flex items-center justify-center px-8">
        <div className="w-full max-w-4xl" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
              animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{
                transformStyle: 'preserve-3d',
                minHeight: '500px',
              }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer"
            >
              {/* Front */}
              <div
                className="glass-panel rounded-3xl p-12 absolute inset-0 backface-hidden flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                }}
              >
                <p className="text-sm text-white/50 mb-4 uppercase tracking-wider">Pregunta</p>
                <h2 className="text-3xl font-serif font-bold text-white text-center">
                  {currentCard.question}
                </h2>
                <p className="text-white/50 text-sm mt-8">Haz clic para ver la respuesta</p>
              </div>

              {/* Back */}
              <div
                className="glass-panel rounded-3xl p-12 absolute inset-0 backface-hidden flex flex-col items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <p className="text-sm text-violet-300 mb-4 uppercase tracking-wider">Respuesta</p>
                <h2 className="text-2xl text-white text-center whitespace-pre-wrap">
                  {currentCard.answer}
                </h2>
                <p className="text-white/50 text-sm mt-8">Haz clic para volver</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="glass-panel-hover gap-2"
            size="lg"
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </Button>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className="glass-panel-hover gap-2"
              size="lg"
            >
              <RotateCcw className="h-5 w-5" />
              Voltear
            </Button>
            
            {isFlipped && (
              <Button
                onClick={handleMastered}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 gap-2"
                size="lg"
              >
                <Check className="h-5 w-5" />
                Dominé esta
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="glass-panel-hover gap-2"
            size="lg"
          >
            Siguiente
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
