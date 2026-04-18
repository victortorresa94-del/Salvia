'use client'

import dynamic from 'next/dynamic'

const AvocadoBanner = dynamic(() => import('./AvocadoBanner'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#030a06' }} />,
})

export default function AvocadoBannerWrapper() {
  return <AvocadoBanner />
}
