import { Flame, Loader2, Gamepad2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function GameGrid() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("master_games")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setGames(data || []);
      } catch (err) {
        // silently handled
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGames = games.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridRef.current) {
      const yOffset = -100; // adjust for fixed navbar
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section ref={gridRef} className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
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
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          Memuat daftar game...
        </div>
      ) : games.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <Gamepad2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>Belum ada game tersedia.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {currentGames.map((g) => (
              <Link
                key={g.slug}
                to="/topup/$slug"
                params={{ slug: g.slug }}
                className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/70 hover:shadow-[0_0_24px_-6px_var(--neon-purple)] hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  {g.image_url ? (
                    <img
                      src={g.image_url}
                      alt={`Cover ${g.name}`}
                      width={768}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary/50 grid place-items-center">
                      <Gamepad2 className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Bottom gradient + name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">{g.name}</h3>
                  <p className="mt-0.5 text-[11px] text-white/70">Top Up & Joki</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-primary/60 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center gap-1.5 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_-3px_var(--neon-purple)] border-transparent"
                        : "border border-primary/40 text-foreground hover:border-primary/80 hover:bg-primary/5"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-primary/60 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
