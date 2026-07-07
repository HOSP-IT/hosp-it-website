import { Link } from 'react-router-dom'
import { Shield, ArrowRight, CheckCircle, FileText } from 'lucide-react'

const requirements = [
  'Wajib integrasi data RME ke SatuSehat',
  'Deadline: 31 Desember 2025',
  'Sanksi administratif untuk RS yang tidak patuh',
  'PMK No. 24 Tahun 2022 & SE Menkes 1030/2023',
]

export default function SatuSehatBanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-satusehat.jpg"
          alt="SatuSehat Integration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/90 to-[#0A6E7C]/80" />
      </div>

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C9B7] to-[#0A6E7C] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#00C9B7] font-semibold text-sm uppercase tracking-wider">
                Integrasi Wajib Kemenkes
              </span>
            </div>

            <h2 className="heading-2 text-white">
              Rumah Sakit Anda Sudah{' '}
              <span className="text-gradient">Terintegrasi SatuSehat</span>?
            </h2>

            <p className="text-white/80 text-lg leading-relaxed">
              Berdasarkan <strong className="text-white">PMK No. 24 Tahun 2022</strong> dan{' '}
              <strong className="text-white">SE Menkes HK.02.01/MENKES/1030/2023</strong>,
              seluruh rumah sakit dan klinik utama di Indonesia wajib mengirimkan data RME
              ke platform SatuSehat paling lambat akhir tahun 2025.
            </p>

            <div className="space-y-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="w-5 h-5 text-[#00C9B7] flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/integrasi-satusehat"
                className="btn-white group"
              >
                <FileText className="w-5 h-5" />
                Pelajari Integrasi SatuSehat
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20tanya%20tentang%20integrasi%20SatuSehat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#0A6E7C]"
              >
                Konsultasi Integrasi
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="glass-dark rounded-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C9B7]/20 text-[#00C9B7] text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4" />
                  Hosp-IT 100% SatuSehat Ready
                </div>
                <h3 className="text-white font-bold text-xl mb-2">SIMRS & RIS/PACS Hosp-IT</h3>
                <p className="text-white/70 text-sm">
                  Terintegrasi penuh dengan platform SatuSehat Kemenkes RI menggunakan standar HL7 FHIR R4
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-[#00C9B7]">HL7 FHIR</div>
                  <div className="text-xs text-white/60 mt-1">Standar Interoperabilitas</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-[#00C9B7]">Real-time</div>
                  <div className="text-xs text-white/60 mt-1">Sinkronisasi Data</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-[#00C9B7]">Otomatis</div>
                  <div className="text-xs text-white/60 mt-1">Zero Input Ganda</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-[#00C9B7]">Comply</div>
                  <div className="text-xs text-white/60 mt-1">Regulasi Kemenkes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
