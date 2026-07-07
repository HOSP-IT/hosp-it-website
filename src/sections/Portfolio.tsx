import { MapPin, Building2, Star } from 'lucide-react'

const hospitals = [
  { name: 'RS Cikarang Medika', region: 'Jawa Barat', type: 'RS Swasta' },
  { name: 'RS Bunda Mulia', region: 'Jawa Barat', type: 'RS Swasta' },
  { name: 'RS Aprillia Cilacap', region: 'Jawa Tengah', type: 'RS Swasta' },
  { name: 'RS Siti Khodijah', region: 'Jawa Timur', type: 'RS Swasta' },
  { name: 'RS Comal Baru', region: 'Jawa Tengah', type: 'RS Swasta' },
  { name: 'RS Bhakti Asih Jatibarang', region: 'Jawa Barat', type: 'RS Swasta' },
  { name: 'RSUD Pemalang', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD Cileungsi', region: 'Jawa Barat', type: 'RSUD' },
  { name: 'RSUD Cibinong', region: 'Jawa Barat', type: 'RSUD' },
  { name: 'RSUD Pati', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD Ambarawa', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD Jepara', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RS Sariningsih Bandung', region: 'Jawa Barat', type: 'RS Swasta' },
  { name: 'RST Slamet Riyadi Surakarta', region: 'Jawa Tengah', type: 'RST' },
  { name: 'RSUD Tidar Magelang', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RS Brayat Minulya', region: 'DIY Yogyakarta', type: 'RS Swasta' },
  { name: 'RSUD Ajibarang', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD Samin Surosentiko Blora', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD dr. R. Goeteng Purbalingga', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RS Gunung Sawo Temanggung', region: 'Jawa Tengah', type: 'RSUD' },
  { name: 'RSUD dr. Soetomo Surabaya', region: 'Jawa Timur', type: 'RSUD' },
  { name: 'RS Intan Husada Garut', region: 'Jawa Barat', type: 'RS Swasta' },
  { name: 'RS Restu Ibu Balikpapan', region: 'Kalimantan', type: 'RS Swasta' },
  { name: 'RS Wiyung Sejahtera', region: 'Jawa Timur', type: 'RS Swasta' },
  { name: 'RS Nahdlatul Ulama Tuban', region: 'Jawa Timur', type: 'RS Swasta' },
]

const regionStats = [
  { region: 'Jawa Tengah', count: 14, color: 'bg-[#0A6E7C]' },
  { region: 'Jawa Barat', count: 6, color: 'bg-[#0D8A9B]' },
  { region: 'Jawa Timur', count: 3, color: 'bg-[#00A8E8]' },
  { region: 'DIY Yogyakarta', count: 1, color: 'bg-[#00C9B7]' },
  { region: 'Kalimantan', count: 1, color: 'bg-[#0A6E7C]' },
]

export default function Portfolio() {
  return (
    <section id="portofolio" className="relative py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-success mb-4">Terbukti & Terpercaya</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            30+ <span className="text-gradient">Referensi Rumah Sakit</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Dipercaya oleh RSUD, RS Swasta, dan RS Khusus di berbagai wilayah Indonesia. 
            Setiap implementasi adalah bukti komitmen kami terhadap kualitas.
          </p>
        </div>

        {/* Stats by Region */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {regionStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-[#E2E8F0]">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-sm font-medium text-[#1E293B]">{stat.region}</span>
              <span className="text-sm font-bold text-[#0A6E7C]">{stat.count} RS</span>
            </div>
          ))}
        </div>

        {/* Hospital Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hospitals.map((rs, i) => (
            <div
              key={i}
              className="group bg-white rounded-xl p-5 border border-[#E2E8F0] card-hover"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A6E7C]/10 to-[#00C9B7]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-[#0A6E7C]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#1E293B] group-hover:text-[#0A6E7C] transition-colors truncate">
                    {rs.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-xs text-[#94A3B8]">{rs.region}</span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                    {rs.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0A1628] to-[#0A6E7C] rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Star className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">30+</div>
              <div className="text-white/70 text-sm">Rumah Sakit Aktif</div>
            </div>
            <div className="space-y-2">
              <Building2 className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">5</div>
              <div className="text-white/70 text-sm">Wilayah Indonesia</div>
            </div>
            <div className="space-y-2">
              <MapPin className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">90</div>
              <div className="text-white/70 text-sm">Hari Rata-rata Go-Live</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
