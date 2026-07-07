import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'

const footerLinks = {
  produk: [
    { label: 'SIMRS 61 Modul', href: '/#simrs' },
    { label: 'RIS + PACS', href: '/#rispacs' },
    { label: 'Medical Infrastructure', href: '/#infra' },
    { label: 'Integrasi SatuSehat', href: '/integrasi-satusehat' },
  ],
  perusahaan: [
    { label: 'Tentang Hosp-IT', href: '/#' },
    { label: 'Portofolio RS', href: '/#portofolio' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Kontak', href: '/#kontak' },
  ],
  legal: [
    { label: 'Hak Cipta Kemenkumham RI', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/hospit-logo.png" alt="Hosp-IT" className="h-12 w-auto" />
              <div>
                <div className="text-xl font-bold">Hosp-IT</div>
                <div className="text-[10px] text-white/50 tracking-widest uppercase">Connected Medical Solutions</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              One-Stop Hospital Solution Indonesia. Solusi terintegrasi untuk digitalisasi rumah sakit —
              SIMRS, RIS PACS, dan Medical Infrastructure. Terintegrasi SatuSehat Kemenkes & BPJS.
            </p>
            <div className="space-y-3">
              <a href="https://wa.me/6285111244364" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-[#00C9B7] transition-colors text-sm">
                <Phone className="w-4 h-4" />
                0877-8943-6678
              </a>
              <a href="https://wa.me/6281931362319" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-[#00C9B7] transition-colors text-sm">
                <Phone className="w-4 h-4" />
                0819-3136-2319
              </a>
              <a href="mailto:bisnis@hosp-it.id" className="flex items-center gap-3 text-white/70 hover:text-[#00C9B7] transition-colors text-sm">
                <Mail className="w-4 h-4" />
                bisnis@hosp-it.id
              </a>
              <div className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Semarang, Jawa Tengah — Indonesia</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produk</h4>
            <ul className="space-y-3">
              {footerLinks.produk.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('/#') ? (
                    <a href={link.href} className="text-white/60 hover:text-[#00C9B7] transition-colors text-sm">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-white/60 hover:text-[#00C9B7] transition-colors text-sm">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-[#00C9B7] transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-[#00C9B7] transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Hosp-IT. Connected Medical Solutions. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>Terintegrasi dengan</span>
            <ExternalLink className="w-3 h-3" />
            <span className="text-[#00C9B7]">SatuSehat Kemenkes</span>
            <span className="mx-1">|</span>
            <span className="text-[#00C9B7]">BPJS Kesehatan</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
