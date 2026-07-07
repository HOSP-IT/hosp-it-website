import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'

const faqs = [
  {
    category: 'Umum',
    items: [
      {
        q: 'Apa itu Hosp-IT dan layanan yang ditawarkan?',
        a: 'Hosp-IT (Connected Medical Solutions) adalah penyedia solusi rumah sakit terintegrasi di Indonesia. Kami menawarkan tiga pilar utama: (1) SIMRS dengan 61 modul terintegrasi, (2) RIS + PACS untuk radiologi digital dengan standar DICOM 3.0, dan (3) Medical Infrastructure dengan 113+ produk peralatan dan infrastruktur medis. Semua terintegrasi dengan SatuSehat Kemenkes dan BPJS Kesehatan.',
      },
      {
        q: 'Berapa lama waktu implementasi SIMRS Hosp-IT?',
        a: 'Rata-rata implementasi SIMRS Hosp-IT memakan waktu 90 hari kerja, tergantung pada skala dan kompleksitas rumah sakit. Proses ini mencakup instalasi, migrasi data, training staff, bridging BPJS & SatuSehat, serta go-live. Kami memberikan garansi dan pemeliharaan selama 6 bulan pasca implementasi.',
      },
      {
        q: 'Apakah Hosp-IT melayani seluruh Indonesia?',
        a: 'Ya, Hosp-IT melayani seluruh wilayah Indonesia. Kami memiliki base operation di Semarang, Jawa Tengah dengan virtual office di Tangerang Selatan, DIY Yogyakarta, Surabaya, Palembang, dan Banjarmasin. Tim kami siap melakukan implementasi on-site di lokasi rumah sakit Anda.',
      },
    ],
  },
  {
    category: 'Produk & Teknologi',
    items: [
      {
        q: 'Apakah SIMRS Hosp-IT sudah terintegrasi dengan SatuSehat Kemenkes?',
        a: 'Ya, SIMRS dan RIS/PACS Hosp-IT sudah terintegrasi penuh (100% bridging) dengan platform SatuSehat Kemenkes RI menggunakan standar interoperabilitas HL7 FHIR R4. Data rekam medis elektronik (RME) dikirim secara otomatis ke SatuSehat — tanpa entri data ganda. Kami juga terintegrasi dengan BPJS Kesehatan (V-Claim, E-Klaim, Antrol, Mobile JKN).',
      },
      {
        q: 'Apakah sistem Hosp-IT berbasis cloud atau on-premise?',
        a: 'Hosp-IT mendukung kedua model deployment. SIMRS dan RIS/PACS kami berbasis web (browser-based) sehingga dapat diakses dari mana saja. Untuk deployment, RS dapat memilih model Cloud (hosting di cloud kami) atau On-Premise (server di lokasi RS). Keduanya memiliki keamanan data yang sama kuatnya dengan enkripsi AES-256.',
      },
      {
        q: 'Apakah source code SIMRS menjadi milik rumah sakit?',
        a: 'Untuk skema Lumpsum, source code SIMRS menjadi milik penuh rumah sakit. RS mendapatkan hak kekayaan intelektual atas sistem yang diimplementasikan. Untuk skema KSO (Kerja Sama Operasi), source code tetap milik Hosp-IT namun RS mendapat lisensi penggunaan penuh selama masa kontrak.',
      },
      {
        q: 'Berapa biaya implementasi SIMRS Hosp-IT?',
        a: 'Biaya implementasi disesuaikan dengan skala dan kebutuhan rumah sakit. Kami menawarkan skema Lumpsum (pembelian) dan KSO (Kerja Sama Operasi/bebas investasi awal). Untuk mendapatkan penawaran harga yang sesuai, silakan hubungi tim kami untuk assessment kebutuhan gratis.',
      },
    ],
  },
  {
    category: 'Integrasi & Compliance',
    items: [
      {
        q: 'Mengapa integrasi SatuSehat sangat penting untuk rumah sakit?',
        a: 'Integrasi SatuSehat adalah kewajiban regulasi berdasarkan PMK No. 24/2022 dan SE Menkes 1030/2023. RS yang tidak terintegrasi akan dikenakan sanksi administratif. Selain itu, integrasi SatuSehat meningkatkan kualitas pelayanan (data pasien dapat diakses lintas fasyankes), memperlancar proses akreditasi, dan memastikan compliance terhadap regulasi Kemenkes terbaru.',
      },
      {
        q: 'Apakah Hosp-IT sudah terdaftar di e-Katalog LKPP?',
        a: 'Ya, produk dan layanan Hosp-IT tersedia di e-Katalog LKPP (Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah) sehingga memudahkan proses pengadaan oleh RSUD dan fasilitas kesehatan pemerintah lainnya.',
      },
      {
        q: 'Apakah sistem Hosp-IT siap akreditasi SNARS?',
        a: 'Ya, SIMRS Hosp-IT dirancang untuk mendukung proses akreditasi SNARS (Standar Nasional Akreditasi Rumah Sakit). Sistem kami mencakup modul PMKP (Peningkatan Mutu dan Keselamatan Pasien), PPI (Pencegahan dan Pengendalian Infeksi), pelaporan RL1–RL5, dan berbagai fitur yang diperlukan untuk memenuhi standar akreditasi.',
      },
    ],
  },
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section id="faq" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-4">FAQ</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            Pertanyaan yang Sering <span className="text-gradient">Diajukan</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar produk, layanan, dan integrasi Hosp-IT.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((category, ci) => (
            <div key={ci}>
              <h3 className="text-lg font-bold text-[#0A6E7C] mb-4">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item, ii) => {
                  const key = `${ci}-${ii}`
                  const isOpen = openItems[key]
                  return (
                    <div
                      key={key}
                      className="faq-item bg-[#F8FAFC] rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium text-[#1E293B] pr-4">{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#0A6E7C] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                          }`}
                      >
                        <div className="px-5 pb-5 text-[#64748B] leading-relaxed text-sm">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-8 max-w-2xl mx-auto">
          <MessageCircle className="w-10 h-10 text-[#0A6E7C] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#1E293B] mb-2">Masih punya pertanyaan?</h3>
          <p className="text-[#64748B] mb-4">Tim kami siap membantu menjawab pertanyaan spesifik tentang kebutuhan rumah sakit Anda.</p>
          <a
            href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20punya%20pertanyaan"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <MessageCircle className="w-5 h-5" />
            Tanya via WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
