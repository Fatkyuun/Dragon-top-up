import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  FileSearch,
  MessageCircle,
  Gamepad2,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/lacak")({
  head: () => ({
    meta: [
      { title: "Lacak Pesanan — NeonTopUp" },
      {
        name: "description",
        content: "Lacak status pesanan Top Up dan Joki Anda secara real-time.",
      },
    ],
  }),
  component: LacakPage,
});

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function LacakPage() {
  const [invoice, setInvoice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase
        .from("topup_orders")
        .select("*")
        .eq("invoice_id", invoice.trim().toUpperCase())
        .single();

      if (error || !data) {
        setSearchResult(null);
      } else {
        setSearchResult(data);
      }
    } catch (err) {
      console.error(err);
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const lowerStatus = searchResult?.status?.toLowerCase() || "";

  const steps = [
    { label: "Pesanan Dibuat", status: "completed" },
    { 
      label: "Menunggu Pembayaran", 
      status: lowerStatus.includes("proses") || lowerStatus === "selesai" ? "completed" : (lowerStatus.includes("menunggu") ? "active" : "completed") 
    },
    {
      label: "Proses Pengiriman / Joki",
      status: lowerStatus === "selesai" ? "completed" : (lowerStatus.includes("proses") ? "active" : "pending"),
    },
    {
      label: "Selesai",
      status: lowerStatus === "selesai" ? "completed" : "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ═══════════════════════════════════════════
          HEADER & HERO
         ═══════════════════════════════════════════ */}
      <header className="relative pt-4 px-4 max-w-2xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-card/60 backdrop-blur-md px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-card/90 hover:shadow-lg border border-border/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        {/* Title area */}
        <div className="mt-8 text-center">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/30 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]">
            <FileSearch className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cek Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Pesananmu</span>
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Masukkan nomor invoice untuk mengetahui progres Top Up atau Joki Anda secara real-time.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <input
              type="text"
              placeholder="Contoh: INV123456789"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="w-full rounded-2xl border border-border/60 bg-input/60 py-4 pl-12 pr-4 text-center text-lg font-bold tracking-wider text-foreground placeholder:text-muted-foreground/50 placeholder:font-normal uppercase outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !invoice.trim()}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mencari...
              </>
            ) : (
              "Cari Pesanan"
            )}
          </button>
        </form>
      </header>

      {/* ═══════════════════════════════════════════
          SEARCH RESULTS
         ═══════════════════════════════════════════ */}
      <main className="max-w-2xl mx-auto px-4 mt-8">
        {!isLoading && hasSearched && !searchResult && (
          <div className="rounded-2xl border border-border/60 bg-card/50 p-8 text-center backdrop-blur-sm">
            <p className="text-muted-foreground">
              Pesanan tidak ditemukan. Pastikan nomor invoice sudah benar.
            </p>
          </div>
        )}

        {!isLoading && searchResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Status Card */}
            <section className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary/80 border border-border/50">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      {searchResult.game_name}
                    </h2>
                    <p className="text-base font-bold text-foreground">
                      {searchResult.nominal}
                    </p>
                  </div>
                </div>
                {/* Status Badge */}
                <div
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider
                  ${
                    lowerStatus === "selesai"
                      ? "border-green-500/30 bg-green-500/10 text-green-500"
                      : "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {lowerStatus === "selesai"
                    ? "Selesai"
                    : lowerStatus.includes("proses")
                    ? "Sedang Diproses"
                    : "Menunggu Pembayaran"}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 text-sm border-t border-border/40 pt-5">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Nomor Invoice</p>
                  <p className="font-semibold text-foreground tracking-wide">
                    {searchResult.invoice_id}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tanggal Transaksi</p>
                  <p className="font-semibold text-foreground">
                    {new Date(searchResult.created_at).toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Metode Pembayaran</p>
                  <p className="font-semibold text-foreground">
                    {searchResult.payment_method}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Total Harga</p>
                  <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                    {formatRupiah(searchResult.total_price)}
                  </p>
                </div>
              </div>
            </section>

            {/* Stepper / Progress Timeline */}
            <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-bold text-foreground mb-6">Status Perjalanan Pesanan</h3>
              <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-border/60">
                {steps.map((step, idx) => {
                  const isCompleted = step.status === "completed";
                  const isActive = step.status === "active";
                  
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[30px] grid h-6 w-6 place-items-center rounded-full border-[3px] bg-card transition-colors duration-300
                        ${
                          isCompleted
                            ? "border-green-500 bg-green-500/20"
                            : isActive
                            ? "border-red-500 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                            : "border-border/60 bg-input/60"
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        )}
                        {isActive && (
                          <Clock className="h-3 w-3 text-red-500 animate-pulse" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted || isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCompleted && (
                          <p className="mt-1 text-xs text-green-500 font-medium">Berhasil</p>
                        )}
                        {isActive && (
                          <p className="mt-1 text-xs text-red-400 font-medium animate-pulse">
                            Sedang kami kerjakan...
                          </p>
                        )}
                        {step.status === "pending" && (
                          <p className="mt-1 text-xs text-muted-foreground/60">
                            Menunggu proses sebelumnya
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            HELP DESK
           ═══════════════════════════════════════════ */}
        <section className="mt-10 rounded-2xl border border-border/40 bg-secondary/30 p-5 text-center">
          <p className="text-sm text-foreground mb-4">
            Pesanan belum masuk lebih dari <span className="font-bold text-red-400">10 menit</span>? Hubungi Admin kami via WhatsApp
          </p>
          <a
            href="https://wa.me/6281234567890" // example wa link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#20bd5a] hover:shadow-xl active:scale-[0.98] w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            Hubungi WhatsApp Admin
          </a>
        </section>
      </main>
    </div>
  );
}
