import { Building2, Stethoscope, Users, Clock, Award, Shield } from 'lucide-react'

const highlights = [
  { icon: Building2, value: '30+', label: 'Rumah Sakit', desc: 'Referensi di Jawa, Bali, Sumatera & Kalimantan' },
  { icon: Stethoscope, value: '61', label: 'Modul SIMRS', desc: 'Terintegrasi dalam 12 klaster' },
  { icon: Shield, value: '100%', label: 'Satusehat Ready', desc: 'Bridging HL7 FHIR ke Kemenkes RI' },
  { icon: Users, value: '24/7', label: 'Support Teknis', desc: 'Pendampingan penuh & helpdesk' },
  { icon: Clock, value: '90', label: 'Hari Go-Live', desc: 'Implementasi cepat & terukur' },
  { icon: Award, value: '113+', label: 'Produk Infra', desc: 'Medical equipment & infrastructure' },
]

export default function Stats() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-4">Mengapa Memilih Hosp-IT</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            Satu Mitra, <span className="text-gradient">Solusi Menyeluruh</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Hosp-IT hadir sebagai mitra tunggal untuk semua kebutuhan digitalisasi dan infrastruktur medis rumah sakit Anda. 
            Tidak perlu koordinasi multi-vendor — kami mengelola semua dari satu titik kontak.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-8 border border-[#E2E8F0] card-hover"
            >
              <div className="feature-icon mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="stat-number mb-2">{item.value}</div>
              <h3 className="text-lg font-semibold text-[#1E293B] mb-1">{item.label}</h3>
              <p className="text-sm text-[#94A3B8]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-[#94A3B8] text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0A6E7C]" />
            BPJS Kesehatan Ready
          </div>
          <div className="w-1 h-1 bg-[#CBD5E1] rounded-full hidden sm:block" />
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0A6E7C]" />
            Hak Cipta Kemenkumham RI
          </div>
          <div className="w-1 h-1 bg-[#CBD5E1] rounded-full hidden sm:block" />
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0A6E7C]" />
            Lumpsum & KSO Available
          </div>
        </div>
      </div>
    </section>
  )
}
