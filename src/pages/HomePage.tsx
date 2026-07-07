import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import Stats from '../sections/Stats'
import Products from '../sections/Products'
import HowItWorks from '../sections/HowItWorks'
import Portfolio from '../sections/Portfolio'
import SatuSehatBanner from '../sections/SatuSehatBanner'
import FAQ from '../sections/FAQ'
import CTA from '../sections/CTA'
import Footer from '../sections/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Products />
        <HowItWorks />
        <SatuSehatBanner />
        <Portfolio />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
