import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Users, CheckCircle } from 'lucide-react'

const stats = [
  { value: '61', label: 'Modul SIMRS', suffix: '+' },
  { value: '30', label: 'Referensi RS', suffix: '+' },
  { value: '113', label: 'Produk Infra', suffix: '+' },
  { value: '90', label: 'Hari Implementasi', suffix: '' },
]

const badges = [
  { icon: Shield, text: 'Terintegrasi SatuSehat Kemenkes' },
  { icon: Zap, text: 'Bridging BPJS Ready' },
  { icon: CheckCircle, text: 'Hak Cipta Kemenkumham RI' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-main.jpg"
          alt="Hospital Technology Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/85 to-[#0A1628]/40" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#0A6E7C]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00C9B7]/10 rounded-full blur-3xl" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInUp">
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm"
                >
                  <badge.icon className="w-4 h-4 text-[#00C9B7]" />
                  {badge.text}
                </div>
              ))}
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="heading-1 text-white">
                One-Stop{' '}
                <span className="text-gradient">Hospital</span>{' '}
                Solution
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                Solusi terintegrasi untuk digitalisasi rumah sakit Anda.{' '}
                <strong className="text-white">SIMRS 61 Modul</strong>,{' '}
                <strong className="text-white">RIS PACS DICOM 3.0</strong>, dan{' '}
                <strong className="text-white">113+ Produk Infrastruktur Medis</strong>{' '}
                — satu mitra, satu tanggung jawab.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20konsultasi%20tentang%20solusi%20rumah%20sakit"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group"
              >
                Konsultasi Gratis
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/integrasi-satusehat"
                className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#0A6E7C]"
              >
                <Shield className="w-5 h-5" />
                Integrasi SatuSehat
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A6E7C] to-[#00C9B7] border-2 border-[#0A1628] flex items-center justify-center text-white text-xs font-bold"
                  >
                    <Users className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <div className="text-white/80 text-sm">
                <span className="text-white font-bold">30+ Rumah Sakit</span> telah mempercayai Hosp-IT
              </div>
            </div>
          </div>

          {/* Right Content - Stats Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-dark rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-default"
              >
                <div className="text-4xl font-bold text-gradient mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
            {/* Highlight Card */}
            <div className="col-span-2 glass rounded-2xl p-6 border border-[#00C9B7]/30 animate-pulse-glow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A6E7C] to-[#00C9B7] flex items-center justify-center text-white">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">100% Compliance</div>
                  <div className="text-white/70 text-sm">Terintegrasi penuh SatuSehat Kemenkes & BPJS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float hidden lg:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
