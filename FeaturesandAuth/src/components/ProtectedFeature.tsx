import React from 'react'
import { Lock, ChevronRight } from 'lucide-react'

interface ProtectedFeatureProps {
  title: string
  description: string
  icon: React.ReactNode
  isProtected: boolean
  onLoginRequired: () => void
}

export function ProtectedFeature({ 
  title, 
  description, 
  icon, 
  isProtected, 
  onLoginRequired 
}: ProtectedFeatureProps) {
  const handleClick = () => {
    if (isProtected) {
      onLoginRequired()
    }
  }

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 ${
        isProtected 
          ? 'hover:shadow-xl hover:border-brand-blue/40 cursor-pointer hover:-translate-y-1' 
          : 'hover:shadow-xl hover:border-brand-green/40 hover:-translate-y-1'
      }`}
      onClick={handleClick}
    >
      {isProtected && (
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-br from-brand-yellow/30 to-brand-yellow/20 text-brand-blue p-2 rounded-lg shadow-sm border border-brand-yellow/30">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300 ${
          isProtected 
            ? 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-brand-yellow/30 group-hover:to-brand-blue/20 group-hover:text-brand-blue shadow-sm'
            : 'bg-gradient-to-br from-brand-yellow/20 to-brand-green/20 text-brand-blue group-hover:from-brand-yellow/30 group-hover:to-brand-green/30 shadow-sm'
        }`}>
          {icon}
        </div>
      </div>
      
      <h3 className={`text-xl font-semibold mb-3 ${
        isProtected ? 'text-gray-500 group-hover:text-gray-900' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      
      <p className={`leading-relaxed mb-6 ${
        isProtected ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-600'
      }`}>
        {description}
      </p>

      <div className={`flex items-center font-medium transition-colors duration-300 ${
        isProtected 
          ? 'text-gray-400 group-hover:text-brand-blue group-hover:font-semibold'
          : 'text-brand-blue group-hover:text-brand-green group-hover:font-semibold'
      }`}>
        <span>{isProtected ? 'Sign in to access' : 'Learn more'}</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  )
}