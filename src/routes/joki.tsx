import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
} from "lucide-react";
import heroImg from "@/assets/hero-1.jpg";
import {
  mlRanks,
  loginMethods,
  jokiPaymentMethods,
  calculateJokiPrice,
} from "@/lib/joki-data";

export const Route = createFileRoute("/joki")({
  head: () => ({
    meta: [
      { title: "Jasa Joki Profesional — NeonTopUp" },
      {
        name: "description",
        content:
          "Jasa joki game profesional, aman & anti-ban. Pilih rank target, bayar, dan biarkan pro player kami yang bermain. Support 24/7.",
      },
      {
        property: "og:title",
        content: "Jasa Joki Profesional — NeonTopUp",
      },
      {
        property: "og:description",
        content:
          "Push rank aman & cepat oleh pro player berpengalaman. Anti-ban, support 24/7.",
      },
    ],
  }),
  component: JokiPage,
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
function JokiPage() {
  // Step 1 — Rank selection
  const [currentRank, setCurrentRank] = useState("");
  const [targetRank, setTargetRank] = useState("");

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

  // Derived
  const estimatedPrice = useMemo(
    () => calculateJokiPrice(currentRank, targetRank),
    [currentRank, targetRank],
  );

  const canSubmit =
    currentRank &&
    targetRank &&
    estimatedPrice > 0 &&
    loginVia &&
    email &&
    password &&
    nickname &&
    selectedPayment &&
    agreedTerms;

  // Filter target ranks: only ranks above currentRank
  const availableTargets = useMemo(() => {
    const cur = mlRanks.find((r) => r.id === currentRank);
    if (!cur) return mlRanks;
    return mlRanks.filter((r) => r.tier > cur.tier);
  }, [currentRank]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* ═══════════════════════════════════════════
          HEADER
         ═══════════════════════════════════════════ */}
      <header className="relative overflow-hidden">
        {/* Blurred background */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover scale-110 blur-xl brightness-[0.3]"
          />
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

        {/* Title area */}
        <div className="mx-auto max-w-2xl px-4 pb-10 pt-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-neon shadow-[0_0_32px_-4px_var(--neon-purple)]">
            <Swords className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Jasa Joki{" "}
            <span className="text-gradient-neon">Profesional</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Pilih game, tentukan target rank, dan biarkan pro player kami yang
            bermain. Aman, cepat & anti-ban.
          </p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          CONTENT
         ═══════════════════════════════════════════ */}
      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-2">
        {/* ─── Card 1: Detail Joki ─── */}
        <section
          id="card-joki-detail"
          className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-lg transition-all hover:border-border"
        >
          <h2 className="flex items-center gap-2 text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-neon text-xs font-extrabold text-primary-foreground shadow">
              1
            </span>
            <Trophy className="h-4 w-4 text-accent" />
            Detail Joki
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Current Rank */}
            <div>
              <label
                htmlFor="select-current-rank"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Pangkat / Rank Saat Ini
              </label>
              <div className="relative">
                <select
                  id="select-current-rank"
                  value={currentRank}
                  onChange={(e) => {
                    setCurrentRank(e.target.value);
                    // Reset target if it's no longer valid
                    const cur = mlRanks.find((r) => r.id === e.target.value);
                    const tgt = mlRanks.find((r) => r.id === targetRank);
                    if (cur && tgt && tgt.tier <= cur.tier) {
                      setTargetRank("");
                    }
                  }}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Pilih rank saat ini...
                  </option>
                  {mlRanks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Target Rank */}
            <div>
              <label
                htmlFor="select-target-rank"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Target Pangkat / Rank
              </label>
              <div className="relative">
                <select
                  id="select-target-rank"
                  value={targetRank}
                  onChange={(e) => setTargetRank(e.target.value)}
                  className={selectClass}
                  disabled={!currentRank}
                >
                  <option value="" disabled>
                    {currentRank
                      ? "Pilih target rank..."
                      : "Pilih rank saat ini dulu"}
                  </option>
                  {availableTargets.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Estimated Price */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-4 py-3">
            <Shield className="h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Estimasi Biaya</p>
              <p className="text-lg font-bold text-gradient-neon truncate">
                {estimatedPrice > 0
                  ? formatRupiah(estimatedPrice)
                  : "Rp 0"}
              </p>
            </div>
          </div>
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
            Request Khusus
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
              {estimatedPrice > 0 ? formatRupiah(estimatedPrice) : "Rp 0"}
            </p>
          </div>
          <button
            type="button"
            disabled={!canSubmit}
            className="shrink-0 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-[0_0_24px_-4px_var(--neon-purple)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <Swords className="mr-1.5 inline-block h-4 w-4 -mt-0.5" />
            Pesan Joki Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
