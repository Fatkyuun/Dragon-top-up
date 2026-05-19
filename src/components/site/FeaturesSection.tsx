import { Zap, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Proses Dalam Detik",
    desc: "Otomatisasi sistem membuat top up masuk ke akun dalam hitungan detik setelah pembayaran berhasil.",
  },
  {
    icon: ShieldCheck,
    title: "Joki 100% Aman / Anti-Ban",
    desc: "Tim joki berpengalaman dengan protokol keamanan ketat. Garansi tanpa banned, bisa pantau realtime.",
  },
  {
    icon: Headphones,
    title: "Layanan 24/7",
    desc: "Customer service standby kapan pun via WhatsApp & live chat. Pesan jam 3 pagi pun tetap dilayani.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Kenapa Memilih <span className="text-gradient-neon">NeonTopUp?</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Tiga alasan kenapa ribuan gamer percaya transaksi mereka di sini.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/60 hover:shadow-[0_0_24px_-8px_var(--neon-purple)]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-neon text-primary-foreground shadow-[0_0_18px_-4px_var(--neon-purple)] transition-transform group-hover:scale-110">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
