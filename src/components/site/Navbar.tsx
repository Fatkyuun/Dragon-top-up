import { Link, useRouter } from "@tanstack/react-router";
import { Search, Menu, Gamepad2, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Lacak Pesanan", href: "/lacak" },
  { label: "Joki", href: "/joki" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-neon text-primary-foreground shadow-[0_0_16px_-2px_var(--neon-purple)]">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-gradient-neon sm:inline">
            NeonTopUp
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-auto lg:max-w-xl transition-all duration-300 focus-within:max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari game favoritmu..."
            className="h-11 rounded-full pl-11 pr-4 bg-input/40 border-border/60 text-base transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-input/80 hover:bg-input/60 shadow-sm"
          />
        </div>

        {/* Desktop nav & CTA */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-[15px] font-semibold text-muted-foreground transition-all hover:text-foreground hover:scale-[1.02]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex gap-2 rounded-full h-11 border-border/60 hover:bg-input/60 transition-all font-semibold">
                  <User className="h-4 w-4 text-primary" />
                  <span className="truncate max-w-[120px]">{user.email}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/60 rounded-xl shadow-2xl">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem className="text-muted-foreground truncate opacity-80 cursor-default focus:bg-transparent">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="hidden sm:inline-flex bg-gradient-neon text-primary-foreground font-bold hover:opacity-90 transition-all hover:shadow-[0_0_24px_-2px_var(--neon-purple)] rounded-full px-6 h-11"
            >
              <Link to="/auth">Masuk / Daftar</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card border-border">
            <SheetTitle className="text-gradient-neon">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Masuk sebagai:</p>
                    <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    variant="outline"
                    className="mt-2 w-full text-red-500 border-red-500/20 hover:bg-red-500/10 justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  className="mt-4 bg-gradient-neon text-primary-foreground font-semibold"
                >
                  <Link to="/auth" onClick={() => setOpen(false)}>Masuk / Daftar</Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
