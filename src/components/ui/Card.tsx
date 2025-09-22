import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const baseClasses = 'bg-white rounded-xl border border-slate-200 shadow-sm'
  const hoverClasses = hover ? 'hover:shadow-lg transition-all duration-300' : ''
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
