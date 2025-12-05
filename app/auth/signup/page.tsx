'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const getPasswordStrength = (pass: string): string => {
    if (pass.length < 6) return 'Muy débil'
    if (pass.length < 8) return 'Débil'
    if (pass.length < 12) return 'Buena'
    return 'Fuerte'
  }

  const getPasswordStrengthColor = (pass: string): string => {
    const strength = getPasswordStrength(pass)
    switch (strength) {
      case 'Muy débil': return 'bg-red-500'
      case 'Débil': return 'bg-orange-500'
      case 'Buena': return 'bg-yellow-500'
      case 'Fuerte': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validaciones
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
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
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                ¡Cuenta creada!
              </h2>
              <p className="text-slate-300">
                Hemos enviado un email de verificación a <strong>{email}</strong>
              </p>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <Link href="/auth/login">
              <Button className="glass-panel-hover active:scale-95 transition-transform font-medium">
                Ir al login
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
            <p className="text-slate-300">
              Únete a Academic Flashcards
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-panel border-white/20 text-white placeholder:text-slate-400"
              />
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Fortaleza:</span>
                    <span className={password.length >= 12 ? 'text-green-400' : password.length >= 8 ? 'text-yellow-400' : 'text-red-400'}>
                      {getPasswordStrength(password)}
                    </span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor(password)} transition-all duration-300`}
                      style={{ width: `${Math.min((password.length / 12) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-panel border-white/20 text-white placeholder:text-slate-400"
              />
              {confirmPassword && (
                <div className="text-xs">
                  {password === confirmPassword ? (
                    <span className="text-green-400">✓ Las contraseñas coinciden</span>
                  ) : (
                    <span className="text-red-400">✗ Las contraseñas no coinciden</span>
                  )}
                </div>
              )}
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
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link
                href="/auth/login"
                className="text-violet-300 hover:text-violet-200 transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
