import { Link } from 'react-router-dom'
import Navbar from '../sections/Navbar'
import Footer from '../sections/Footer'
import { Shield, CheckCircle, ArrowRight, FileText, Database, Lock, Zap, Globe, Clock, AlertTriangle } from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Compliance Regulasi',
    desc: 'Penuhi kewajiban PMK No. 24/2022 & SE Menkes 1030/2023. Hindari sanksi administratif.',
  },
  {
    icon: Database,
    title: 'Data Tersentralisasi',
    desc: 'Data rekam medis pasien tersinkron ke platform nasional secara real-time.',
  },
  {
    icon: Zap,
    title: 'Zero Input Ganda',
    desc: 'Data dikirim otomatis ke SatuSehat menggunakan standar HL7 FHIR R4.',
  },
  {
    icon: Lock,
    title: 'Keamanan Terjamin',
    desc: 'Enkripsi standar nasional. Data hanya dapat diakses oleh tenaga medis berwenang.',
  },
  {
    icon: Globe,
    title: 'Lintas Fasyankes',
    desc: 'Riwayat medis pasien dapat diakses di seluruh fasyankes Indonesia yang terhubung.',
  },
  {
    icon: Clock,
    title: 'Akreditasi Lancar',
    desc: 'Proses akreditasi FKTP lebih lancar karena sistem RME terstandar.',
  },
]

const regulations = [
  {
    name: 'PMK No. 24 Tahun 2022',
    desc: 'Standar Rekam Medis Elektronik (RME) — kewajiban RME dan format data standar',
    status: 'Wajib',
  },
  {
    name: 'SE Menkes HK.02.01/MENKES/1030/2023',
    desc: 'Kewajiban integrasi RME ke platform SatuSehat dengan target dan batas waktu',
    status: 'Wajib',
  },
  {
    name: 'UU No. 17 Tahun 2023',
    desc: 'Transformasi sistem kesehatan termasuk digitalisasi',
    status: 'Payung Hukum',
  },
  {
    name: 'Permenkes No. 82/2013',
    desc: 'Kewajiban SIMRS bagi seluruh rumah sakit di Indonesia',
    status: 'Wajib',
  },
]

const resources = [
  'Kunjungan (Encounter)',
  'Diagnosis (Condition)',
  'Tindakan/Procedure (Procedure)',
  'Obat/Resep (Medication)',
  'Hasil Laboratorium (Observation)',
  'Hasil Radiologi (DiagnosticReport)',
  'Alergi (AllergyIntolerance)',
  'Riwayat Keluarga (FamilyMemberHistory)',
]

export default function SatuSehatPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/images/hero-satusehat.jpg" alt="SatuSehat Integration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/95 via-[#0A1628]/85 to-[#0A1628]/50" />
          </div>
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">Beranda</Link>
                <span className="text-white/30">/</span>
                <span className="text-[#00C9B7] text-sm font-medium">Integrasi SatuSehat</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C9B7] to-[#0A6E7C] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-[#00C9B7] text-sm font-medium">Hosp-IT × SatuSehat</div>
                  <div className="text-white/50 text-xs">Kemenkes RI Integration</div>
                </div>
              </div>

              <h1 className="heading-1 text-white mb-6">
                Integrasi <span className="text-gradient">SatuSehat</span>{' '}
                untuk Rumah Sakit Indonesia
              </h1>

              <p className="text-xl text-white/80 leading-relaxed mb-8">
                SIMRS & RIS/PACS Hosp-IT sudah <strong className="text-white">terintegrasi penuh</strong> dengan
                platform SatuSehat Kemenkes RI. Penuhi kewajiban regulasi, tingkatkan kualitas pelayanan,
                dan pastikan data pasien Anda tersinkron secara real-time ke ekosistem kesehatan nasional.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20konsultasi%20integrasi%20SatuSehat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group"
                >
                  Konsultasi Integrasi Gratis
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#regulasi"
                  className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#0A6E7C]"
                >
                  <FileText className="w-5 h-5" />
                  Dasar Hukum
                </a>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[#00C9B7]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">HL7 FHIR R4 Ready</span>
                </div>
                <div className="flex items-center gap-2 text-[#00C9B7]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2 text-[#00C9B7]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Auto Bridging</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Banner */}
        <section className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] py-6">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <AlertTriangle className="w-6 h-6 text-[#D97706]" />
              <p className="text-[#92400E] font-medium text-center">
                <strong>Deadline Wajib Integrasi:</strong> 31 Desember 2025 — RS & Klinik Utama yang tidak terintegrasi akan dikenakan sanksi administratif.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-white">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="badge badge-primary mb-4">Keunggulan</span>
              <h2 className="heading-2 text-[#1E293B] mb-4">
                Mengapa Integrasi <span className="text-gradient">SatuSehat</span> Penting?
              </h2>
              <p className="body-large max-w-2xl mx-auto">
                Integrasi dengan platform SatuSehat bukan hanya kewajiban regulasi,
                tapi juga investasi untuk meningkatkan kualitas pelayanan kesehatan.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="group bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0] card-hover">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A6E7C] to-[#00C9B7] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <b.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2">{b.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Integration Works */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="badge badge-accent mb-4">Teknologi</span>
              <h2 className="heading-2 text-[#1E293B] mb-4">
                Cara Kerja <span className="text-gradient">Integrasi</span>
              </h2>
              <p className="body-large max-w-2xl mx-auto">
                Data rekam medis dari SIMRS & RIS/PACS Hosp-IT dikirim otomatis ke SatuSehat
                menggunakan standar HL7 FHIR R4.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A6E7C] to-[#0D8A9B] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-bold text-[#1E293B] mb-2">Data di SIMRS Hosp-IT</h3>
                  <p className="text-sm text-[#64748B]">Petugas RS input data pasien, diagnosis, tindakan, obat, hasil lab/radiologi</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D8A9B] to-[#00A8E8] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-bold text-[#1E293B] mb-2">Bridging HL7 FHIR</h3>
                  <p className="text-sm text-[#64748B]">Sistem mengkonversi data ke format HL7 FHIR R4 standar Kemenkes</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A8E8] to-[#00C9B7] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-bold text-[#1E293B] mb-2">Sinkron ke SatuSehat</h3>
                  <p className="text-sm text-[#64748B]">Data tersimpan di platform nasional SatuSehat dan dapat diakses lintas fasyankes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FHIR Resources */}
        <section className="py-24 bg-white">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="badge badge-primary mb-4">FHIR Resources</span>
                <h2 className="heading-2 text-[#1E293B] mb-4">
                  Data Apa Saja yang <span className="text-gradient">Terkirim?</span>
                </h2>
                <p className="text-[#64748B] mb-6 leading-relaxed">
                  SIMRS & RIS/PACS Hosp-IT mengirimkan data rekam medis elektronik (RME)
                  ke SatuSehat meliputi seluruh aspek pelayanan:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {resources.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#00C9B7] flex-shrink-0" />
                      <span className="text-sm text-[#475569]">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0A1628] to-[#0A6E7C] rounded-2xl p-8">
                <h3 className="text-white font-bold text-xl mb-6">Standar Teknis</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-[#00C9B7] font-semibold mb-1">HL7 FHIR R4</div>
                    <div className="text-white/70 text-sm">Fast Healthcare Interoperability Resources versi Release 4</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-[#00C9B7] font-semibold mb-1">REST API</div>
                    <div className="text-white/70 text-sm">Komunikasi via HTTPS dengan autentikasi OAuth 2.0</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-[#00C9B7] font-semibold mb-1">JSON Format</div>
                    <div className="text-white/70 text-sm">Pertukaran data menggunakan format JSON standar</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-[#00C9B7] font-semibold mb-1">ICD-10 & LOINC</div>
                    <div className="text-white/70 text-sm">Standar kode diagnosis dan pemeriksaan laboratorium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regulations */}
        <section id="regulasi" className="py-24 bg-[#F8FAFC]">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="badge badge-success mb-4">Regulasi</span>
              <h2 className="heading-2 text-[#1E293B] mb-4">
                Dasar Hukum <span className="text-gradient">Integrasi SatuSehat</span>
              </h2>
              <p className="body-large max-w-2xl mx-auto">
                Integrasi SatuSehat didasarkan pada regulasi dan kebijakan Kementerian Kesehatan RI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {regulations.map((reg, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-[#E2E8F0] card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="w-6 h-6 text-[#0A6E7C]" />
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${reg.status === 'Wajib' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                      {reg.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2">{reg.name}</h3>
                  <p className="text-sm text-[#64748B]">{reg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0A6E7C] to-[#00C9B7]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-16 h-16 text-[#00C9B7] mx-auto mb-6" />
            <h2 className="heading-1 text-white mb-6">
              Pastikan RS Anda <span className="text-[#00C9B7]">SatuSehat Ready</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Jangan tunggu hingga deadline. Hubungi tim Hosp-IT sekarang untuk assessment
              kesiapan integrasi SatuSehat rumah sakit Anda — GRATIS.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20assessment%20integrasi%20SatuSehat"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-white group"
              >
                Assessment Gratis via WhatsApp
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <Link to="/" className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#0A6E7C]">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
