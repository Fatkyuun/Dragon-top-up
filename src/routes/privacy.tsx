import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Kebijakan Privasi — NeonTopUp" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HEADER BANNER */}
      <section className="relative mx-auto mt-4 max-w-4xl px-4 sm:px-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#16161a] min-h-[200px] flex items-center justify-center p-6 md:p-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <Link
            to="/"
            className="absolute top-4 left-4 md:top-6 md:left-6 z-20 inline-flex items-center gap-1.5 rounded-lg bg-black/50 backdrop-blur-md px-3 py-2 text-sm font-medium text-white transition-all hover:bg-black/70 border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="relative z-10 text-center w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-[0_0_32px_-4px_rgba(139,92,246,0.5)]">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
              Kebijakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Privasi</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-[24px] border border-border/50 bg-card/70 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8 text-muted-foreground leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Pengumpulan Informasi
            </h2>
            <p>
              Kami mengumpulkan informasi identitas pribadi (nama, email, nomor WhatsApp) ketika Anda mendaftar di situs kami. Kami juga mengumpulkan ID Game dan informasi yang relevan saat Anda melakukan pemesanan (top up / joki) untuk keperluan memproses pesanan tersebut secara akurat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Penggunaan Data Pribadi
            </h2>
            <p>
              Informasi yang kami kumpulkan dari Anda dapat digunakan untuk tujuan berikut:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Mempersonalisasi pengalaman pengguna di platform kami.</li>
              <li>Memproses transaksi pembayaran dan pengiriman pesanan (Top up & Joki).</li>
              <li>Mengirimkan email dan pesan WhatsApp berkala mengenai status pesanan Anda.</li>
              <li>Meningkatkan layanan pelanggan dan kebutuhan dukungan kami.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Kerahasiaan Layanan Joki
            </h2>
            <p>
              Khusus untuk layanan Jasa Joki, kredensial login game (email/password) yang Anda berikan hanya akan digunakan murni untuk keperluan bermain oleh joki yang bertugas. Kredensial tersebut bersifat sangat rahasia, dilindungi dengan enkripsi tinggi, dan akan otomatis dihapus dari database kami segera setelah pesanan diselesaikan untuk menjamin keamanan penuh akun game Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Keamanan Data
            </h2>
            <p>
              Kami menerapkan standar keamanan enkripsi terkini untuk melindungi semua komunikasi pertukaran data yang sensitif dan pribadi antara Anda dan Situs Web. Sistem keamanan kami didukung oleh infrastruktur modern guna mencegah akses yang tidak sah ke dalam informasi pribadi pengguna kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Pengungkapan ke Pihak Ketiga
            </h2>
            <p>
              Kami tidak menjual, memperdagangkan, atau menyewakan informasi identifikasi pribadi Pengguna kepada pihak luar. Kami hanya membagikan data spesifik kepada mitra tepercaya (seperti penyelenggara gateway pembayaran) secara terbatas dan aman, hanya untuk tujuan mengeksekusi pesanan pembayaran Anda.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
