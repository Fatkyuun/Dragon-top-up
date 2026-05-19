import { Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { games } from "@/lib/games";

export function GameGrid() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Flame className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Sedang Tren</span>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
            Pilih Game Favoritmu
          </h2>
        </div>
        <a
          href="#"
          className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Lihat semua →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {games.map((g) => (
          <Link
            key={g.slug}
            to="/topup/$slug"
            params={{ slug: g.slug }}
            className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/70 hover:shadow-[0_0_24px_-6px_var(--neon-purple)] hover:-translate-y-1"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={g.cover}
                alt={`Cover ${g.name}`}
                width={768}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Tag */}
            {g.tag && (
              <span className="absolute left-2 top-2 rounded-md bg-gradient-neon px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground shadow-md">
                {g.tag}
              </span>
            )}

            {/* Bottom gradient + name */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10">
              <h3 className="line-clamp-2 text-sm font-semibold text-white">{g.name}</h3>
              <p className="mt-0.5 text-[11px] text-white/70">Top Up & Joki</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
