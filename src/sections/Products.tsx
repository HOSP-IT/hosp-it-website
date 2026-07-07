import { Check, Monitor, Scan, HardHat, ArrowRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const products = [
  {
    id: 'simrs',
    icon: Monitor,
    badge: 'Best Seller',
    title: 'SIMRS Hosp-IT',
    subtitle: 'Sistem Informasi Manajemen Rumah Sakit',
    description: '61 Modul dalam 12 klaster terintegrasi. BPJS Ready, SatuSehat Ready. Mobile & Self-Service. Implementasi 90 hari.',
    image: '/images/product-simrs.jpg',
    features: [
      'Pendaftaran & Antrian Online + E-Pasien (Android/Web)',
      'Rawat Jalan / Inap / IGD lengkap',
      'Farmasi, Lab & Rekam Medis Elektronik (RME)',
      'Keuangan, Kasir & Perencanaan',
      'BPJS Kesehatan Ready (V-Claim, E-Klaim, Antrol)',
      'SatuSehat Kemenkes RI Terintegrasi',
      'Telemedicine Terintegrasi',
      'Executive Dashboard KPI (RL1–RL5)',
      'Unlimited Client License',
      'Akses Browser-Based, tanpa install',
    ],
    cta: 'Lihat Detail SIMRS',
    schema: 'SIMRS Cloud',
  },
  {
    id: 'rispacs',
    icon: Scan,
    badge: 'DICOM 3.0',
    title: 'RIS + PACS Hosp-IT',
    subtitle: 'Radiology Information System & Picture Archiving',
    description: 'Radiologi digital penuh dengan DICOM 3.0. Semua modalitas (CT, MRI, X-Ray, USG). 3D Volume Rendering + MPR. Unlimited Client License.',
    image: '/images/product-rispacs.jpg',
    features: [
      'DICOM 3.0 — All Modality Support',
      '3D Volume Rendering + MPR',
      'CTR Cardiothoracic Ratio Auto',
      'Unlimited Client License',
      'Akses Browser-Based',
      'SatuSehat Kemenkes Terintegrasi',
      'PACS Mini/Plus/Pro & RIS Mini/Basic/Ultimate',
      'NAS Backup & Display Monitor',
      'Teleradiografi & Remote Expertise',
      'Filmless — hemat biaya film 60%',
    ],
    cta: 'Lihat Detail RIS PACS',
    schema: 'RIS PACS DICOM',
  },
  {
    id: 'infra',
    icon: HardHat,
    badge: '113+ Produk',
    title: 'Medical Infra Hosp-IT',
    subtitle: 'Medical Equipment & Infrastructure',
    description: 'Modular, terstandarisasi, instalasi cepat & efisien. Dari dinding kamar operasi hingga sistem pintu hermetic — sesuai standar internasional.',
    image: '/images/product-infra.jpg',
    features: [
      'Modular Operating Theatre (Panel, Glass, Stainless)',
      'Scrub Sink & Pass Box (SUS 304, UV Sterilization)',
      'Ceiling Pendant Surgical (Single/Double, 340°)',
      'Medical Gas Installation + Alarm System',
      'Hermetic Door System (OT, ICU, X-Ray, Linac)',
      'Nurse Call System (Aiphone, IP DECT, Wireless)',
      'X-Ray LED Viewer (1–4 Layar, 100.000 jam)',
      'Vinyl Flooring Hospital Grade (Gerflor ISO Certified)',
      'Insulated Panel (EPS, PIR, Mineral Wool)',
      'Radiation Protection (PB Lead, Anti-Radiation Glass)',
    ],
    cta: 'Lihat Katalog Infra',
    schema: 'Medical Infrastructure',
  },
]

export default function Products() {
  return (
    <section id="produk" className="relative py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge badge-accent mb-4">Ekosistem Produk</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            Tiga Pilar <span className="text-gradient">Solusi Hosp-IT</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Hosp-IT menyediakan solusi komprehensif dari software manajemen rumah sakit,
            sistem radiologi digital, hingga infrastruktur medis fisik — semua terintegrasi dalam satu ekosistem.
          </p>
        </div>

        {/* Product Cards */}
        <div className="space-y-20">
          {products.map((product, idx) => (
            <div
              key={product.id}
              id={product.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className={`relative ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-accent">{product.badge}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center gap-3 text-white">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A6E7C] to-[#00C9B7] flex items-center justify-center">
                          <product.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold">{product.title}</div>
                          <div className="text-xs text-white/70">{product.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl border-2 border-[#0A6E7C]/20" />
              </div>

              {/* Content */}
              <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <h3 className="heading-2 text-[#1E293B] mb-2">{product.title}</h3>
                  <p className="text-[#64748B]">{product.subtitle}</p>
                </div>
                <p className="text-[#1E293B] leading-relaxed">{product.description}</p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#00C9B7] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#475569]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20tanya%20tentang%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary group"
                  >
                    {product.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    to="/integrasi-satusehat"
                    className="btn-outline"
                  >
                    Integrasi SatuSehat
                  </Link>
                </div>

                {/* Schema markup indicator */}
                <div className="flex items-center gap-2 pt-2 text-xs text-[#94A3B8]">
                  <Shield className="w-4 h-4 text-[#0A6E7C]" />
                  Standar: {product.schema} — Terintegrasi SatuSehat Kemenkes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
