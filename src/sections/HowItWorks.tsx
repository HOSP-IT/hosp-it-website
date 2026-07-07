import { ClipboardList, Settings, Rocket, HeadphonesIcon, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Konsultasi & Assessment',
    description: 'Tim kami melakukan assessment kebutuhan RS Anda — mulai dari jumlah bed, poliklinik, modalitas radiologi, hingga kebutuhan infrastruktur fisik. Semua gratis, tanpa biaya.',
    color: 'from-[#0A6E7C] to-[#0D8A9B]',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Desain Solusi & Proposal',
    description: 'Kami susun solusi terbaik yang disesuaikan dengan budget dan skala RS Anda. Pilihan fleksibel: Lumpsum (source code milik RS) atau KSO (bebas investasi awal).',
    color: 'from-[#0D8A9B] to-[#00A8E8]',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Implementasi & Go-Live',
    description: 'Implementasi terstruktur dalam 90 hari — instalasi, migrasi data, training staff, bridging BPJS & SatuSehat, hingga go-live. Garansi & pemeliharaan 6 bulan.',
    color: 'from-[#00A8E8] to-[#00C9B7]',
  },
  {
    number: '04',
    icon: HeadphonesIcon,
    title: 'Support Berkala & Upgrade',
    description: 'Tim support kami siap membantu 24/7. Update sistem berkala sesuatu perubahan regulasi Kemenkes & BPJS. RS fokus pelayanan, teknologi serahkan pada kami.',
    color: 'from-[#00C9B7] to-[#0A6E7C]',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-4">Proses Kerja</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            4 Langkah <span className="text-gradient">Transformasi RS Anda</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Dari konsultasi awal hingga purna jual, kami dampingi setiap langkah perjalanan digitalisasi rumah sakit Anda.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0A6E7C] via-[#00A8E8] to-[#00C9B7] -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] card-hover h-full">
                  {/* Number badge */}
                  <div className="absolute -top-4 left-8">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {step.number}
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white`}>
                      <step.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E293B]">{step.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#64748B] mb-4">Siap memulai transformasi digital rumah sakit Anda?</p>
          <a
            href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20ingin%20konsultasi%20gratis"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group inline-flex"
          >
            Jadwalkan Konsultasi Gratis
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
