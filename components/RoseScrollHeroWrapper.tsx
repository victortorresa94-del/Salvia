'use client'

import { useEffect, useState } from 'react'

export default function RoseScrollHeroWrapper() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    import('./RoseScrollHero').then(mod => {
      setComponent(() => mod.default)
    }).catch(err => {
      console.error('RoseScrollHero load error:', err)
    })
  }, [])

  if (!Component) {
    return <div style={{ height: '100vh', background: '#050505' }} />
  }

  return <Component />
}
