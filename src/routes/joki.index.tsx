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
      {/* HEADER BANNER */}
      <section className="relative mx-auto mt-4 max-w-7xl px-4 sm:px-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#16161a] glow-neon min-h-[250px] md:min-h-[350px] flex items-center justify-center p-6 md:p-12">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Back Button */}
          <Link
            to="/"
            className="absolute top-4 left-4 md:top-6 md:left-6 z-20 inline-flex items-center gap-1.5 rounded-lg bg-black/50 backdrop-blur-md px-3 py-2 text-sm font-medium text-white transition-all hover:bg-black/70 border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="relative z-10 text-center w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-[0_0_32px_-4px_rgba(139,92,246,0.5)]">
              <Swords className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3 drop-shadow-md">
              Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Joki Rank & Jasa</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-md mx-auto drop-shadow-md">
              Pilih game yang ingin kamu joki. Pro player kami siap membantu mencapai rank impianmu dengan cepat dan aman!
            </p>
          </div>
        </div>
      </section>

      {/* GAME GRID */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
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
                <span className="absolute left-2 top-2 rounded-md bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-400 backdrop-blur-md shadow-sm">
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
