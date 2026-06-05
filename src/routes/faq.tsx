import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [{ title: "FAQ (Tanya Jawab) — NeonTopUp" }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HEADER BANNER */}
      <section className="relative mx-auto mt-4 max-w-4xl px-4 sm:px-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#16161a] min-h-[200px] flex items-center justify-center p-6 md:p-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <Link
            to="/"
            className="absolute top-4 left-4 md:top-6 md:left-6 z-20 inline-flex items-center gap-1.5 rounded-lg bg-black/50 backdrop-blur-md px-3 py-2 text-sm font-medium text-white transition-all hover:bg-black/70 border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="relative z-10 text-center w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-[0_0_32px_-4px_rgba(139,92,246,0.5)]">
              <MessageCircleQuestion className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
              Pertanyaan yang Sering <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Diajukan</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Cari jawaban dari kendala atau pertanyaan yang sering muncul di sini.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TOP UP FAQ */}
          <div className="rounded-[24px] border border-border/50 bg-card/70 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 flex items-center gap-2 mb-2 border-b border-border/50 pb-4">
              Layanan Top Up
            </h2>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Berapa lama proses top up memakan waktu?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Umumnya, proses top up kami berjalan secara otomatis dan instan (hanya butuh waktu sekitar 1-5 menit) setelah pembayaran Anda berhasil dikonfirmasi oleh sistem.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Bagaimana jika salah memasukkan ID / Nickname?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami sangat mengimbau Anda untuk mengecek ulang ID Game sebelum melanjutkan pembayaran. Apabila ID yang dimasukkan salah namun transaksi berhasil, proses tidak dapat dibatalkan (non-refundable).
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Pesanan sudah dibayar namun item belum masuk?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hal ini dapat terjadi akibat kendala jaringan dari server game itu sendiri atau bank/e-wallet. Harap tunggu hingga 1x24 jam. Jika masih belum masuk, silakan hubungi CS kami dengan melampirkan Invoice dan Bukti Transfer.
              </p>
            </div>
          </div>

          {/* JOKI FAQ */}
          <div className="rounded-[24px] border border-border/50 bg-card/70 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 flex items-center gap-2 mb-2 border-b border-border/50 pb-4">
              Layanan Joki Game
            </h2>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Apakah keamanan akun saya terjamin saat di-joki?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sangat terjamin. Kredensial Anda dienkripsi, dan semua worker joki kami adalah pemain profesional yang tunduk pada kode etik ketat untuk tidak menyalahgunakan inventaris atau data akun Anda.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Bolehkah saya login saat akun sedang di-joki?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Sangat Dilarang!</strong> Login ketika joki sedang bermain dapat menyebabkan putus koneksi dan kekalahan (AFK). Jika Anda dengan sengaja melakukan tabrak login, pesanan joki dianggap hangus/selesai sepihak.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">Berapa estimasi pengerjaan Joki Rank?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estimasi berbeda-beda tergantung jumlah target bintang/rank yang dipesan. Secara umum, pengerjaan memakan waktu antara 1 hari hingga 4 hari kerja penuh. Anda bisa melacak statusnya pada menu "Lacak Pesanan".
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
