import { Link } from "@tanstack/react-router";
import { Search, Menu, Gamepad2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Lacak Pesanan", href: "/" },
  { label: "Joki", href: "/joki" },
  { label: "Reseller", href: "/" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6">
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
        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari game..."
            className="h-10 pl-9 bg-input/60 border-border/60 focus-visible:ring-primary"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Button
          asChild
          className="hidden sm:inline-flex bg-gradient-neon text-primary-foreground font-semibold hover:opacity-90 transition-all hover:shadow-[0_0_20px_-2px_var(--neon-purple)]"
        >
          <Link to="/">Masuk / Daftar</Link>
        </Button>

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
              <Button
                asChild
                className="mt-4 bg-gradient-neon text-primary-foreground font-semibold"
              >
                <Link to="/" onClick={() => setOpen(false)}>Masuk / Daftar</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
