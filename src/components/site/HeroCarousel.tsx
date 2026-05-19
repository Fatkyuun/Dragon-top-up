import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-1.jpg";

const slides = [
  {
    eyebrow: "Promo Spesial",
    title: "Top Up Cepat, Joki Aman & Terpercaya!",
    subtitle:
      "Ribuan gamer sudah pakai NeonTopUp. Proses dalam hitungan detik, harga termurah, garansi anti-ban.",
    cta: "Lihat Semua Game",
  },
  {
    eyebrow: "Joki Profesional",
    title: "Naik Rank Tanpa Drama 🚀",
    subtitle: "Tim joki ber-rating tinggi siap bawa akun kamu ke tier idaman dengan aman.",
    cta: "Mulai Sekarang",
  },
  {
    eyebrow: "Diskon Hari Ini",
    title: "Cashback Hingga 15% Pakai QRIS",
    subtitle: "Setiap transaksi otomatis dapet cashback ke saldo. Berlaku semua game.",
    cta: "Klaim Promo",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative mx-auto mt-4 max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card glow-neon">
        <div className="grid md:grid-cols-2 min-h-[360px] md:min-h-[440px]">
          {/* Text */}
          <div className="relative z-10 flex flex-col justify-center gap-5 p-6 sm:p-10 md:p-12">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {slide.eyebrow}
            </span>
            <h1
              key={slide.title}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] animate-fade-in"
            >
              <span className="text-gradient-neon">{slide.title}</span>
            </h1>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                size="lg"
                className="bg-gradient-neon font-semibold text-primary-foreground hover:opacity-90 animate-glow-pulse"
              >
                {slide.cta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/80 bg-secondary/40 hover:bg-secondary"
              >
                Lacak Pesanan
              </Button>
            </div>

            {/* Indicators */}
            <div className="mt-2 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-gradient-neon" : "w-3 bg-muted hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Dynamic grid from first 6 games */}
          <div className="relative hidden md:flex items-center justify-center p-6 lg:p-10">
            <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full max-w-md">
              {games.slice(0, 6).map((g, i) => (
                <div
                  key={g.slug}
                  className="aspect-[3/4] overflow-hidden rounded-lg border border-primary/60 bg-card/40 shadow-[0_0_18px_-6px_var(--neon-purple)] animate-float opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    animationFillMode: "forwards",
                    ['--float-delay' as string]: `${i * 0.4}s`,
                  }}
                >
                  <img
                    src={g.cover}
                    alt={`game cover ${g.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Decorative neon corners */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </section>
  );
}
