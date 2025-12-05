'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-96 h-96 bg-violet-600 top-1/4 -left-48 animate-float" />
          <div className="orb w-80 h-80 bg-purple-600 top-1/2 right-1/4 animate-float-delayed" />
          <div className="orb w-72 h-72 bg-indigo-600 bottom-1/4 left-1/3 animate-float" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                Email enviado
              </h2>
              <p className="text-slate-300">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Por favor revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
            </p>
            <Link href="/auth/login">
              <Button className="glass-panel-hover active:scale-95 transition-transform font-medium">
                Volver al login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600 top-1/4 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-purple-600 top-1/2 right-1/4 animate-float-delayed" />
        <div className="orb w-72 h-72 bg-indigo-600 bottom-1/4 left-1/3 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
              Recuperar Contraseña
            </h1>
            <p className="text-slate-300">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="glass-panel border-white/20 text-white placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full glass-panel-hover active:scale-95 transition-transform font-medium"
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperación'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
