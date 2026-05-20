import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Swords,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/joki/")({
  head: () => ({
    meta: [
      { title: "Jasa Joki Profesional — NeonTopUp" },
      {
        name: "description",
        content:
          "Jasa joki game profesional, aman & anti-ban. Pilih game, bayar, dan biarkan pro player kami yang bermain. Support 24/7.",
      },
    ],
  }),
  component: JokiIndexPage,
});

function JokiIndexPage() {
  const [jokiGames, setJokiGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJokiGames = async () => {
      setIsLoading(true);
      try {
        // 1) Get distinct slugs that have joki packages
        const { data: pkgData } = await supabase
          .from("master_packages")
          .select("game_slug")
          .eq("category", "joki");

        if (pkgData) {
          const uniqueSlugs = [...new Set(pkgData.map((d: any) => d.game_slug))];

          // 2) Fetch game info from master_games for those slugs
          const { data: gamesData } = await supabase
            .from("master_games")
            .select("*")
            .in("slug", uniqueSlugs);

          if (gamesData) {
            setJokiGames(gamesData);
          }
        }
      } catch (err) {
        console.error("Error fetching joki games:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJokiGames();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HEADER */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-b from-primary/5 via-background to-background" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-card/60 backdrop-blur-md px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-card/90 hover:shadow-lg border border-border/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-10 pt-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-neon shadow-[0_0_32px_-4px_var(--neon-purple)]">
            <Swords className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Jasa Joki{" "}
            <span className="text-gradient-neon">Profesional</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Pilih game yang ingin kamu joki. Pro player kami siap membantu!
          </p>
        </div>
      </header>

      {/* GAME GRID */}
      <main className="mx-auto max-w-4xl px-4">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            Memuat daftar game...
          </div>
        ) : jokiGames.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <Swords className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Belum ada layanan joki tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {jokiGames.map((g) => (
              <Link
                key={g.slug}
                to="/joki/$slug"
                params={{ slug: g.slug }}
                className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/70 hover:shadow-[0_0_24px_-6px_var(--neon-purple)] hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  {g.image_url ? (
                    <img
                      src={g.image_url}
                      alt={`Cover ${g.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary/50 grid place-items-center">
                      <Swords className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Tag */}
                <span className="absolute left-2 top-2 rounded-md bg-gradient-neon px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground shadow-md">
                  Joki
                </span>

                {/* Bottom gradient + name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {g.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-white/70">
                    Jasa Joki
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
