import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Swords,
  Shield,
  Lock,
  MessageSquareText,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  Trophy,
  ShieldCheck,
  Loader2,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { loginMethods, jokiPaymentMethods } from "@/lib/joki-data";

export const Route = createFileRoute("/joki/$slug")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `Jasa Joki — NeonTopUp` },
        {
          name: "description",
          content: `Jasa joki game profesional, aman & anti-ban. Pilih paket, bayar, dan biarkan pro player kami yang bermain.`,
        },
      ],
    };
  },
  component: JokiDetailPage,
});

/* ─── Helpers ─── */
function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

const inputClass =
  "w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30";

const selectClass =
  "w-full appearance-none rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer";

/* ─── Component ─── */
function JokiDetailPage() {
  const { slug } = Route.useParams();
  const router = useRouter();

  // Data State
  const [game, setGame] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Step 1 — Selected joki package
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Step 2 — Account info
  const [loginVia, setLoginVia] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  // Step 3 — Notes
  const [notes, setNotes] = useState("");

  // Step 4 — Payment
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Terms
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch game & packages ──
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [gameRes, packRes] = await Promise.all([
          supabase.from("master_games").select("*").eq("slug", slug).single(),
          supabase
            .from("master_packages")
            .select("*")
            .eq("game_slug", slug)
            .eq("category", "joki")
            .order("price", { ascending: true }),
        ]);

        if (gameRes.data) setGame(gameRes.data);
        if (packRes.data) setPackages(packRes.data);
      } catch (err) {
        console.error("Error fetching joki data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [slug]);

  // ── Derived ──
  const selectedPackage = useMemo(() => {
    if (!selectedPackageId) return null;
    return packages.find((p) => p.id === selectedPackageId) || null;
  }, [selectedPackageId, packages]);

  const selectedPrice = selectedPackage?.price ?? 0;
  const gameName = game?.name || "Memuat...";
  const gameCover = game?.image_url || "";

  const canSubmit =
    selectedPackage &&
    loginVia &&
    email &&
    password &&
    nickname &&
    selectedPayment &&
    agreedTerms;

  // ── Handle order submission ──
  const handleCheckout = async () => {
    if (!canSubmit || !selectedPackage) return;

    setIsSubmitting(true);
    try {
      const invoiceId = `INV-JK-${Math.floor(10000 + Math.random() * 90000)}`;

      const { error } = await supabase.from("joki_orders").insert({
        invoice_id: invoiceId,
        game_name: gameName,
        login_via: loginVia,
        username_game: email,
        password_game: password,
        nickname_game: nickname,
        current_rank: "-",
        target_rank: selectedPackage.item_name,
        notes: notes,
        payment_method: selectedPayment,
        total_price: selectedPrice,
      });

      if (error) {
        console.error("Supabase Insert Error:", error);
        toast.error("Gagal menyimpan pesanan", {
          description: error.message || "Silakan coba beberapa saat lagi.",
        });
        return;
      }

      toast.success("Pesanan Joki berhasil dibuat! 🎉", {
        description: `Invoice: ${invoiceId}`,
      });

      // Redirect to tracking page with the invoice pre-filled
      router.navigate({
        to: "/lacak",
        search: { invoice: invoiceId },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Gagal menyimpan pesanan", {
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* ═══════════════════════════════════════════
          HEADER — blurred cover background
         ═══════════════════════════════════════════ */}
      <header className="relative overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 -z-10">
          {gameCover && (
            <img
              src={gameCover}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover scale-110 blur-xl brightness-[0.3]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        {/* Back button */}
        <div className="mx-auto max-w-2xl px-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-card/60 backdrop-blur-md px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-card/90 hover:shadow-lg border border-border/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {/* Game info */}
        <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 flex items-center gap-4">
          {gameCover ? (
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-[0_0_24px_-4px_var(--neon-purple)]">
              <img
                src={gameCover}
                alt={gameName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/50 bg-secondary/50 grid place-items-center">
              <Swords className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {isLoadingData ? (
                <span className="animate-pulse">Memuat Data Game...</span>
              ) : (
                <>Joki {gameName}</>
              )}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-accent">
              <Swords className="h-3.5 w-3.5" />
              Pro Player • Aman & Anti-Ban
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          CONTENT — stacked cards
         ═══════════════════════════════════════════ */}
      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-2">
        {/* ─── Card 1: Pilih Layanan Joki ─── */}
        <section
          id="card-joki-package"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              1
            </span>
            <Trophy className="h-4 w-4 text-accent" />
            Pilih Layanan Joki
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {isLoadingData ? (
              <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                Memuat paket joki...
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
                Belum ada layanan joki tersedia untuk game ini.
              </div>
            ) : (
              packages.map((pkg) => {
                const active = selectedPackageId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`
                      relative flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition-all duration-200
                      ${
                        active
                          ? "border-primary bg-primary/10 shadow-[0_0_16px_-4px_var(--neon-purple)]"
                          : "border-border/50 bg-secondary/40 hover:border-border hover:bg-secondary/70"
                      }
                    `}
                  >
                    {active && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary" />
                    )}
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${active ? "bg-primary/20" : "bg-secondary/60"} transition-colors`}>
                      <Swords className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold leading-tight ${active ? "text-foreground" : "text-foreground/90"}`}>
                        {pkg.item_name}
                      </p>
                      <p className={`mt-1 text-xs font-bold ${active ? "text-accent" : "text-muted-foreground"}`}>
                        {formatRupiah(pkg.price)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected package summary */}
          {selectedPackage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Paket Terpilih</p>
                <p className="text-sm font-bold text-foreground truncate">
                  {selectedPackage.item_name}
                </p>
              </div>
              <p className="text-lg font-bold text-gradient-neon shrink-0">
                {formatRupiah(selectedPrice)}
              </p>
            </div>
          )}
        </section>

        {/* ─── Card 2: Account Info ─── */}
        <section
          id="card-account-info"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              2
            </span>
            <Lock className="h-4 w-4 text-accent" />
            Informasi Akun
            <span className="ml-auto text-[10px] font-medium text-accent/80 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Aman & Terenkripsi
            </span>
          </h2>

          <div className="mt-4 space-y-3">
            {/* Login Via */}
            <div>
              <label
                htmlFor="select-login-via"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Login Via
              </label>
              <div className="relative">
                <select
                  id="select-login-via"
                  value={loginVia}
                  onChange={(e) => setLoginVia(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Pilih metode login...
                  </option>
                  {loginMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Email / Username */}
            <div>
              <label
                htmlFor="input-joki-email"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Email / Username
              </label>
              <input
                id="input-joki-email"
                type="text"
                placeholder="Masukkan email atau username akun"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="input-joki-password"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <input
                id="input-joki-password"
                type="password"
                placeholder="Masukkan password akun"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Nickname */}
            <div>
              <label
                htmlFor="input-joki-nickname"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Nickname Game
              </label>
              <input
                id="input-joki-nickname"
                type="text"
                placeholder="Masukkan nickname in-game"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* ─── Card 3: Worker Notes ─── */}
        <section
          id="card-notes"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              3
            </span>
            <MessageSquareText className="h-4 w-4 text-accent" />
            Catatan Khusus
            <span className="ml-auto text-[10px] font-medium text-muted-foreground">
              Opsional
            </span>
          </h2>

          <div className="mt-4">
            <textarea
              id="textarea-notes"
              rows={4}
              placeholder="Contoh: Tolong gunakan hero Mage/Marksman, jangan main di atas jam 10 malam..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </section>

        {/* ─── Card 4: Payment Method ─── */}
        <section
          id="card-joki-payment"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              4
            </span>
            <CreditCard className="h-4 w-4 text-accent" />
            Metode Pembayaran
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {jokiPaymentMethods.map((pm) => {
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
                  <span
                    className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground/90"}`}
                  >
                    {pm.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Terms & Conditions ─── */}
        <section
          id="card-terms"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg"
        >
          <label
            htmlFor="checkbox-terms"
            className="flex cursor-pointer items-start gap-3 group"
          >
            <div className="relative mt-0.5 shrink-0">
              <input
                id="checkbox-terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={`
                  h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                  ${
                    agreedTerms
                      ? "border-primary bg-primary shadow-[0_0_12px_-2px_var(--neon-purple)]"
                      : "border-border/60 bg-input/60 group-hover:border-border"
                  }
                `}
              >
                {agreedTerms && (
                  <svg
                    className="h-3 w-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
              Saya setuju untuk{" "}
              <strong className="text-destructive font-semibold">
                TIDAK LOGIN
              </strong>{" "}
              ke dalam akun selama proses joki berlangsung untuk menghindari{" "}
              <strong className="text-destructive font-semibold">
                ban/nabrak
              </strong>
              .
            </span>
          </label>
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          STICKY CHECKOUT BAR
         ═══════════════════════════════════════════ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="truncate text-lg font-bold text-gradient-neon">
              {selectedPrice > 0 ? formatRupiah(selectedPrice) : "Rp 0"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!canSubmit || isSubmitting}
            className="shrink-0 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-[0_0_24px_-4px_var(--neon-purple)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 inline-block h-4 w-4 -mt-0.5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Swords className="mr-1.5 inline-block h-4 w-4 -mt-0.5" />
                Pesan Joki Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
