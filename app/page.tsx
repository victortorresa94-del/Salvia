import Nav from '@/components/Nav'
import RoseScrollHeroWrapper from '@/components/RoseScrollHeroWrapper'
import AvocadoBannerWrapper from '@/components/AvocadoBannerWrapper'
import Problem from '@/components/Problem'
import HowItWorks from '@/components/HowItWorks'
import Plans from '@/components/Plans'
import Stack from '@/components/Stack'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <RoseScrollHeroWrapper />
      <AvocadoBannerWrapper />
      <Problem />
      <HowItWorks />
      <Plans />
      <Stack />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
