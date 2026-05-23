import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Zap, Diamond, CreditCard, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/topup/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `Top Up ${name} — NeonTopUp` },
        {
          name: "description",
          content: `Top up ${name} murah, cepat, dan aman. Proses otomatis 24/7. Pilih nominal dan bayar sekarang!`,
        },
      ],
    };
  },
  component: TopUpDetailPage,
});

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

const defaultPaymentMethods = [
  { id: "qris", name: "QRIS", icon: "📱" },
  { id: "gopay", name: "GoPay", icon: "💚" },
  { id: "dana", name: "DANA", icon: "💙" },
  { id: "bank", name: "Transfer Bank", icon: "🏦" },
];

function TopUpDetailPage() {
  const { slug } = Route.useParams();
  
  // Data State
  const [game, setGame] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedDenomId, setSelectedDenomId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [whatsappBuyer, setWhatsappBuyer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [gameRes, packRes] = await Promise.all([
          supabase.from("master_games").select("*").eq("slug", slug).single(),
          supabase.from("master_packages").select("*").eq("game_slug", slug).eq("category", "topup").order("price", { ascending: true })
        ]);

        if (gameRes.data) setGame(gameRes.data);
        if (packRes.data) setPackages(packRes.data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [slug]);

  const selectedPackage = useMemo(() => {
    if (!selectedDenomId) return null;
    return packages.find((p) => p.id === selectedDenomId);
  }, [selectedDenomId, packages]);

  const selectedPrice = selectedPackage?.price ?? 0;
  const gameName = game?.name || "Memuat...";
  const gameCover = game?.image_url || "";
  const gameBg = game?.background_url || "";

  // ── Fallback: game not found ──
  if (!isLoadingData && !game) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Game Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Game yang kamu cari tidak tersedia atau link-nya salah.</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-all">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedPackage || !selectedPayment || !userId || !whatsappBuyer) return;
    
    setIsSubmitting(true);
    try {
      const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`; 
      
      const { error } = await supabase.from("topup_orders").insert({
        invoice_id: invoiceId,
        game_name: gameName,
        user_id_game: userId,
        zone_id_game: zoneId || "-",
        nominal: selectedPackage.item_name,
        payment_method: selectedPayment,
        whatsapp_buyer: whatsappBuyer,
        total_price: selectedPrice,
      });

      toast.success("Pesanan berhasil disimpan!", {
        description: `Nomor Invoice: ${invoiceId}`,
      });
      router.navigate({ to: "/lacak" });
    } catch (err) {
      console.error("Supabase Insert Error:", err);
      console.log(err);
      toast.error("Gagal menyimpan pesanan", {
        description: "Silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* ═══════════════════════════════════════════
          HEADER — UniPin-style full-width HD background via inline style
         ═══════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-[280px] sm:min-h-[320px] flex flex-col justify-end px-6 md:px-20 mt-0"
        style={{
          backgroundImage: gameBg ? `url(${gameBg})` : gameCover ? `url(${gameCover})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button — top-left */}
        <div className="absolute top-4 left-4 sm:left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 backdrop-blur-md px-3 py-2 text-sm font-medium text-white transition-all hover:bg-black/60 hover:shadow-lg border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {/* Game info — bottom of the header, on top of overlay */}
        <div className="relative z-10 flex items-center gap-5 pb-6 pt-16">
          {/* Game logo/icon */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-[0_0_30px_-4px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-sm">
            <img
              src={gameCover}
              alt={gameName}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Game title + meta */}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {isLoadingData ? <span className="animate-pulse">Memuat Data Game...</span> : gameName}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-emerald-400 font-medium drop-shadow-md">
              <Zap className="h-3.5 w-3.5" />
              Proses Cepat &amp; Otomatis
            </p>
            {game?.id_label && (
              <p className="mt-1 text-xs text-gray-300/80 drop-shadow-md">
                Masukkan {game.id_label}{game.zone_label ? ` & ${game.zone_label}` : ''} di bawah
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTENT — stacked cards
         ═══════════════════════════════════════════ */}
      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-2">
        {/* ─── Card 1: User ID ─── */}
        <section
          id="card-user-id"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              1
            </span>
            Masukkan Data Akun
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="input-user-id"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                {game?.id_label || "User ID"}
              </label>
              <input
                id="input-user-id"
                type="text"
                placeholder={`Masukkan ${game?.id_label || "User ID"}`}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {game?.zone_label && (
              <div>
                <label
                  htmlFor="input-zone-id"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  {game.zone_label}
                </label>
                <input
                  id="input-zone-id"
                  type="text"
                  placeholder={`Masukkan ${game.zone_label}`}
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label
                htmlFor="input-whatsapp"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Nomor WhatsApp (Untuk Notifikasi)
              </label>
              <input
                id="input-whatsapp"
                type="text"
                placeholder="Contoh: 08123456789"
                value={whatsappBuyer}
                onChange={(e) => setWhatsappBuyer(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* ─── Card 2: Pick Denomination ─── */}
        <section
          id="card-denomination"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              2
            </span>
            Pilih Nominal
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {isLoadingData ? (
              <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                Memuat daftar harga...
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Belum ada nominal tersedia untuk game ini.
              </div>
            ) : (
              packages.map((d) => {
                const active = selectedDenomId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDenomId(d.id)}
                    className={`
                      relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-all duration-200
                      ${
                        active
                          ? "border-primary bg-primary/10 shadow-[0_0_16px_-4px_var(--neon-purple)]"
                          : "border-border/50 bg-secondary/40 hover:border-border hover:bg-secondary/70"
                      }
                    `}
                  >
                    {active && (
                      <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-primary" />
                    )}
                    <Diamond className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-semibold leading-tight ${active ? "text-foreground" : "text-foreground/90"}`}>
                      {d.item_name}
                    </span>
                    <span className={`text-xs font-medium ${active ? "text-accent" : "text-muted-foreground"}`}>
                      {formatRupiah(d.price)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ─── Card 3: Payment Method ─── */}
        <section
          id="card-payment"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              3
            </span>
            Pilih Pembayaran
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {defaultPaymentMethods.map((pm) => {
              const active = selectedPayment === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-all duration-200
                    ${
                      active
                        ? "border-primary bg-primary/10 shadow-[0_0_16px_-4px_var(--neon-purple)]"
                        : "border-border/50 bg-secondary/40 hover:border-border hover:bg-secondary/70"
                    }
                  `}
                >
                  {active && (
                    <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-primary" />
                  )}
                  <span className="text-2xl leading-none">{pm.icon}</span>
                  <span className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground/90"}`}>
                    {pm.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          STICKY CHECKOUT BAR
         ═══════════════════════════════════════════ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total Pembayaran</p>
            <p className="truncate text-lg font-bold text-gradient-neon">
              {selectedPrice > 0 ? formatRupiah(selectedPrice) : "Rp 0"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!selectedPackage || !selectedPayment || !userId || !whatsappBuyer || isSubmitting}
            className="shrink-0 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-[0_0_24px_-4px_var(--neon-purple)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              "Memproses..."
            ) : (
              <>
                <CreditCard className="mr-1.5 inline-block h-4 w-4 -mt-0.5" />
                Beli Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
