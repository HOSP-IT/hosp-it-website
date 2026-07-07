import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk & Layanan', href: '/#produk', hasDropdown: true },
  { label: 'Integrasi SatuSehat', href: '/integrasi-satusehat' },
  { label: 'Portofolio', href: '/#portofolio' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontak', href: '/#kontak' },
]

const productDropdown = [
  { label: 'SIMRS 61 Modul', href: '/#simrs', desc: 'Sistem Informasi Rumah Sakit' },
  { label: 'RIS + PACS', href: '/#rispacs', desc: 'Radiologi Digital DICOM 3.0' },
  { label: 'Medical Infra', href: '/#infra', desc: '113+ Produk Infrastruktur Medis' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      if (location.pathname === '/') {
        e.preventDefault()
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'glass shadow-lg py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/hospit-logo.png"
              alt="Hosp-IT Logo"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-[#0A6E7C]' : 'text-white'}`}>
                Hosp-IT
              </span>
              <span className={`text-[10px] tracking-widest uppercase transition-colors ${isScrolled ? 'text-[#64748B]' : 'text-white/70'}`}>
                Connected Medical Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      className={`nav-link flex items-center gap-1 text-sm font-medium transition-colors ${isScrolled ? 'text-[#1E293B]' : 'text-white/90'
                        } hover:text-[#0A6E7C]`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-2 overflow-hidden">
                        {productDropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => handleAnchorClick(e, item.href)}
                            className="flex flex-col px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                          >
                            <span className="text-sm font-semibold text-[#1E293B]">{item.label}</span>
                            <span className="text-xs text-[#94A3B8]">{item.desc}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  link.href.startsWith('/#') ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className={`nav-link text-sm font-medium transition-colors ${isScrolled ? 'text-[#1E293B]' : 'text-white/90'
                        } hover:text-[#0A6E7C]`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={`nav-link text-sm font-medium transition-colors ${isScrolled ? 'text-[#1E293B]' : 'text-white/90'
                        } hover:text-[#0A6E7C]`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          {/* CTA & Phone */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/6285111244364"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#0A6E7C]"
              style={{ color: isScrolled ? '#1E293B' : 'white' }}
            >
              <Phone className="w-4 h-4" />
              0877-8943-6678
            </a>
            <Link
              to="/#kontak"
              onClick={(e) => handleAnchorClick(e, '/#kontak')}
              className="btn-primary text-sm"
            >
              Konsultasi Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: isScrolled ? '#1E293B' : 'white' }}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 glass border-t border-[#E2E8F0] transition-all duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="container-custom mx-auto px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="block px-4 py-3 rounded-lg text-[#1E293B] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="block px-4 py-3 rounded-lg text-[#1E293B] font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <a
              href="https://wa.me/6285111244364"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 btn-primary w-full"
            >
              <Phone className="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
