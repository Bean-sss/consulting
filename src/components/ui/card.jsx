import React from 'react'

export function Card({ children, className = '' }) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm'
  const classes = `${baseClasses} ${className}`
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
} 