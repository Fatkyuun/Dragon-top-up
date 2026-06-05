import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Syarat & Ketentuan — NeonTopUp" }],
  }),
  component: TermsPage,
});

function TermsPage() {
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
              <FileText className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
              Syarat & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Ketentuan</span>
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
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              1. Pendahuluan
            </h2>
            <p>
              Selamat datang di NeonTopUp. Dengan mengakses dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu, sebagian, atau seluruh isi dari Syarat & Ketentuan ini, maka Anda tidak diperkenankan untuk menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              2. Layanan Top Up
            </h2>
            <p>
              Kami menyediakan layanan pembelian item virtual (seperti Diamond, UC, Genesis Crystal, dll) secara instan. Kesalahan pengisian Data Akun (User ID, Server ID, atau Nickname) yang dilakukan oleh pembeli menjadi tanggung jawab penuh pembeli. NeonTopUp tidak memberikan pengembalian dana untuk kesalahan input data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              3. Layanan Jasa Joki
            </h2>
            <p>
              Layanan Joki (Game Boosting) dilakukan oleh Pro Player berpengalaman secara manual tanpa menggunakan program ilegal/cheat. Selama proses pengerjaan, pembeli <strong>DILARANG KERAS</strong> melakukan login (tabrak login) ke dalam akun yang sedang dikerjakan. Pelanggaran aturan ini dapat menyebabkan pesanan dianggap selesai tanpa pengembalian dana.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              4. Transaksi & Pembayaran
            </h2>
            <p>
              Semua transaksi pembayaran diproses melalui payment gateway resmi pihak ketiga yang telah bermitra dengan kami. Pembeli wajib memastikan nominal yang ditransfer sesuai dengan total tagihan hingga tiga digit terakhir. Pesanan baru akan diproses secara otomatis setelah sistem kami menerima konfirmasi pembayaran yang sukses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              5. Kebijakan Pengembalian Dana (Refund)
            </h2>
            <p>
              Pengembalian dana (refund) hanya dapat dilakukan apabila produk atau layanan yang dipesan sedang mengalami gangguan/habis stok, dan transaksi tidak dapat diproses dalam waktu 1x24 jam. Pengembalian dana akan dikirimkan ke rekening atau e-wallet atas nama yang sama dengan yang mentransfer, dipotong biaya administrasi bank (jika ada).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
              6. Keamanan Akun
            </h2>
            <p>
              Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi dan keamanan akun Anda di platform kami. NeonTopUp tidak akan pernah meminta kata sandi (password) akun NeonTopUp Anda melalui sarana komunikasi apa pun.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
