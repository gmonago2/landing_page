import React, { useState } from 'react'
import { X, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (error) {
        setError(error.message)
      } else {
        onClose()
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'Sign in to access your personalized investing journey'
              : 'Create an account to unlock all learning features'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                placeholder="••••••••"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white py-3 px-4 rounded-xl font-semibold hover:from-brand-blue/90 hover:to-brand-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-brand-blue hover:text-brand-green transition-colors font-medium hover:font-semibold"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  )
}