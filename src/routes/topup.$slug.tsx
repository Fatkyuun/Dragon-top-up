import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Zap, Diamond, CreditCard, CheckCircle2 } from "lucide-react";
import { games } from "@/lib/games";
import { getTopUpData } from "@/lib/topup-data";

export const Route = createFileRoute("/topup/$slug")({
  head: ({ params }) => {
    const game = games.find((g) => g.slug === params.slug);
    const name = game?.name ?? "Game";
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

function TopUpDetailPage() {
  const { slug } = Route.useParams();
  const game = games.find((g) => g.slug === slug);
  const topUp = getTopUpData(slug);

  const [selectedDenom, setSelectedDenom] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");

  const selectedPrice = useMemo(() => {
    if (!selectedDenom) return 0;
    const d = topUp.denominations.find((d) => d.id === selectedDenom);
    return d?.price ?? 0;
  }, [selectedDenom, topUp.denominations]);

  const gameName = game?.name ?? topUp.name;
  const gameCover = game?.cover ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* ═══════════════════════════════════════════
          HEADER — blurred cover background
         ═══════════════════════════════════════════ */}
      <header className="relative overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={gameCover}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover scale-110 blur-xl brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
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
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-[0_0_24px_-4px_var(--neon-purple)]">
            <img
              src={gameCover}
              alt={gameName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {gameName}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-accent">
              <Zap className="h-3.5 w-3.5" />
              {topUp.subtitle}
            </p>
          </div>
        </div>
      </header>

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
            Masukkan User ID
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="input-user-id"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                User ID
              </label>
              <input
                id="input-user-id"
                type="text"
                placeholder="Contoh: 123456789"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label
                htmlFor="input-zone-id"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Zone ID
              </label>
              <input
                id="input-zone-id"
                type="text"
                placeholder="Contoh: 1234"
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
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
            {topUp.denominations.map((d) => {
              const active = selectedDenom === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDenom(d.id)}
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
                    {d.label}
                  </span>
                  <span className={`text-xs font-medium ${active ? "text-accent" : "text-muted-foreground"}`}>
                    {formatRupiah(d.price)}
                  </span>
                </button>
              );
            })}
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
            {topUp.paymentMethods.map((pm) => {
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
            disabled={!selectedDenom || !selectedPayment || !userId}
            className="shrink-0 rounded-xl bg-gradient-neon px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-[0_0_24px_-4px_var(--neon-purple)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <CreditCard className="mr-1.5 inline-block h-4 w-4 -mt-0.5" />
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
