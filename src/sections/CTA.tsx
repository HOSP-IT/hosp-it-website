import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export default function CTA() {
  return (
    <section id="kontak" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0A6E7C] to-[#00C9B7]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#00C9B7]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#0A6E7C]/30 rounded-full blur-3xl" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - CTA Content */}
          <div className="space-y-8">
            <div>
              <h2 className="heading-1 text-white mb-4">
                Siap Bertransformasi <span className="text-[#00C9B7]">Bersama Hosp-IT?</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Hubungi tim kami untuk presentasi, demo sistem, dan konsultasi gratis —
                disesuaikan dengan kebutuhan & skala rumah sakit Anda.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20presentasi%20dan%20demo%20sistem"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white group"
              >
                Jadwalkan Demo Gratis
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://wa.me/6287819362319"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#0A6E7C]"
              >
                <Phone className="w-5 h-5" />
                Hubungi Sales
              </a>
            </div>

            <p className="text-white/60 text-sm">
              Response time: &lt; 2 jam pada jam kerja | Tim kami akan menghubungi Anda dalam 24 jam.
            </p>
          </div>

          {/* Right - Contact Info Card */}
          <div className="glass-dark rounded-2xl p-8 space-y-6">
            <h3 className="text-white font-bold text-xl">Informasi Kontak</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#00C9B7]" />
                </div>
                <div>
                  <div className="text-white/60 text-sm">Telepon / WhatsApp</div>
                  <a href="https://wa.me/6285111244364" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#00C9B7] transition-colors">
                    0877-8943-6678
                  </a>
                  <div className="text-white/50 text-xs">Primary Contact</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#00C9B7]" />
                </div>
                <div>
                  <div className="text-white/60 text-sm">Telepon / WhatsApp (Alt)</div>
                  <a href="https://wa.me/6281931362319" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#00C9B7] transition-colors">
                    0819-3136-2319
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#00C9B7]" />
                </div>
                <div>
                  <div className="text-white/60 text-sm">Email Bisnis</div>
                  <a href="mailto:bisnis@hosp-it.id" className="text-white font-semibold hover:text-[#00C9B7] transition-colors">
                    bisnis@hosp-it.id
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#00C9B7]" />
                </div>
                <div>
                  <div className="text-white/60 text-sm">Base Operation</div>
                  <div className="text-white font-semibold">Semarang, Jawa Tengah</div>
                  <div className="text-white/50 text-xs mt-1">
                    Virtual Office: Tangerang Selatan, DIY Yogyakarta, Surabaya, Palembang, Banjarmasin
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage badge */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-[#00C9B7] text-sm">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Melayani Seluruh Indonesia — Nationwide Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
