import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Loader2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [heroGames, setHeroGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const [bannersRes, gamesRes] = await Promise.all([
          supabase
            .from("master_banners")
            .select("*, game:master_games(name, image_url, background_url)")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("master_games")
            .select("*")
            .order("name", { ascending: true })
            .limit(6),
        ]);

        if (bannersRes.error) throw bannersRes.error;
        if (gamesRes.error) throw gamesRes.error;
        
        const fetchedBanners = bannersRes.data || [];
        if (fetchedBanners.length === 0) {
          // Fallback Dummy Data if Supabase is empty
          setSlides([
            {
              id: "dummy1",
              title: "Promo Spesial Blood Strike",
              button_text: "Top Up Sekarang",
              button_link: "/topup/blood-strike",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Promo+Blood+Strike",
              subtitle: "Promo spesial Top Up Blood Strike",
              tag_text: "Promo",
            },
            {
              id: "dummy2",
              title: "Diskon Diamond Free Fire",
              button_text: "Top Up Sekarang",
              button_link: "/topup/free-fire",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Diskon+Free+Fire",
              subtitle: "Dapatkan Diskon 50% Diamond",
              tag_text: "Diskon",
            },
            {
              id: "dummy3",
              title: "Promo Garena Delta Force",
              button_text: "Top Up Sekarang",
              button_link: "/topup/garena-delta-force",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Garena+Delta+Force",
              subtitle: "Top up murah, proses kilat!",
              tag_text: "Promo",
            },
            {
              id: "dummy4",
              title: "Event Bonus Wild Cores",
              button_text: "Top Up Sekarang",
              button_link: "/topup/wild-rift",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Event+Wild+Cores",
              subtitle: "Bonus ekstra Wild Cores minggu ini",
              tag_text: "Event",
            },
            {
              id: "dummy5",
              title: "Diskon Diamond MLBB",
              button_text: "Top Up Sekarang",
              button_link: "/topup/mobile-legends",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Diskon+MLBB",
              subtitle: "Promo Starlight & Diamond Pass",
              tag_text: "Diskon",
            },
            {
              id: "dummy6",
              title: "Promo Polychrome ZZZ",
              button_text: "Top Up Sekarang",
              button_link: "/topup/zenless-zone-zero",
              image_url: "https://placehold.co/1200x400/16161a/8b5cf6?text=Promo+ZZZ",
              subtitle: "Gacha hemat tanpa nguras dompet",
              tag_text: "Promo",
            }
          ]);
        } else {
          setSlides(fetchedBanners);
        }
        setHeroGames(gamesRes.data || []);
      } catch (err) {
        // silently handled
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (isLoading) {
    return (
      <section className="relative mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card glow-neon min-h-[250px] md:min-h-[350px] lg:min-h-[440px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (slides.length === 0) return null; // Or some fallback

  const slide = slides[index];
  const gameImageUrl = slide.game?.image_url;
  const bannerBgUrl = slide.image_url;

  return (
    <section className="relative mx-auto mt-4 max-w-7xl px-4 sm:px-6">
      <div 
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card glow-neon"
        style={{ backgroundImage: bannerBgUrl ? `url(${bannerBgUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Lapisan Overlay Gelap */}
        {bannerBgUrl && (
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-background/95 via-background/80 sm:via-background/90 to-background/20 sm:to-transparent"></div>
        )}

        <div className="grid md:grid-cols-2 min-h-[250px] md:min-h-[350px] lg:min-h-[440px] relative z-10">
          {/* Text */}
          <div className="flex flex-col justify-center gap-4 sm:gap-5 p-4 sm:p-6 md:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {slide.tag_text && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-accent">
                  <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  {slide.tag_text}
                </span>
              )}
              {/* Small game badge if HD background is used */}
              {bannerBgUrl && gameImageUrl && (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 py-0.5 sm:py-1 pl-1 pr-2 sm:pr-3 text-[10px] sm:text-xs font-semibold text-primary">
                  <img src={gameImageUrl} alt={slide.game?.name} className="h-4 sm:h-5 w-4 sm:w-5 rounded-full object-cover" />
                  {slide.game?.name}
                </span>
              )}
            </div>
            <h1
              key={slide.title}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] sm:leading-[1.1] animate-fade-in"
            >
              <span className="text-gradient-neon">{slide.title}</span>
            </h1>
            <p className="max-w-md text-sm md:text-base text-muted-foreground/90">{slide.subtitle}</p>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 pt-2">
              <Button
                asChild
                className="bg-gradient-neon font-semibold text-primary-foreground hover:opacity-90 animate-glow-pulse h-auto py-2.5 px-5 text-sm md:py-3 md:px-6 md:text-base w-fit"
              >
                <Link to={slide.button_link || "/"}>
                  {slide.button_text || "Mulai Sekarang"}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:h-4 md:w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border border-white/20 bg-secondary/40 hover:bg-secondary h-auto py-2.5 px-5 text-sm md:py-3 md:px-6 md:text-base w-fit"
              >
                <Link to="/lacak" search={{ invoice: "" }}>Lacak Pesanan</Link>
              </Button>
            </div>

            {/* Indicators */}
            {slides.length > 1 && (
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
            )}
          </div>

          {/* Right Side — Dynamic Game Image or Fallback Grid */}
          <div className="relative hidden md:flex items-center justify-center p-6 lg:p-10">
            {bannerBgUrl ? (
              /* Jika background HD dipakai, kosongkan sisi kanan agar artwork terlihat jelas */
              null
            ) : gameImageUrl ? (
              /* Single game image from linked promo (tanpa background HD) */
              <div
                key={slide.id}
                className="relative w-full max-w-xs aspect-[3/4] overflow-hidden rounded-2xl border-2 border-primary/40 bg-card/40 shadow-[0_0_40px_-8px_var(--neon-purple)] animate-fade-in"
              >
                <img
                  src={gameImageUrl}
                  alt={slide.game?.name || slide.title}
                  className="h-full w-full object-cover"
                />
                {/* Overlay with game name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{slide.game?.name}</span>
                  </div>
                </div>
                {/* Decorative glow ring */}
                <div className="pointer-events-none absolute -inset-1 rounded-2xl border border-primary/20 animate-glow-pulse" />
              </div>
            ) : (
              /* Fallback: 6-game grid when no game is linked */
              <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full max-w-md">
                {heroGames.map((g, i) => (
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
                      src={g.image_url}
                      alt={`game cover ${g.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Decorative neon corners */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </section>
  );
}

