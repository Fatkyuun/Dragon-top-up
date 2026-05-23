import { Gamepad2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const paymentMethods = ["QRIS", "GoPay", "DANA", "OVO", "ShopeePay", "BCA", "BNI", "Mandiri"];
const quickLinks = [
  { label: "Syarat & Ketentuan", href: "/" },
  { label: "Kebijakan Privasi", href: "/" },
  { label: "FAQ", href: "/" },
  { label: "Hubungi Kami", href: "/contact" },
  { label: "Lapor Bug / Masalah", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-neon text-primary-foreground">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-gradient-neon">NeonTopUp</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Platform top up game & jasa joki terpercaya di Indonesia. Proses kilat, harga
              bersaing, dan tim support 24/7 yang ngerti gamer.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Tautan Cepat
            </h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Metode Pembayaran
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {paymentMethods.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border/60 bg-secondary/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NeonTopUp. Semua hak dilindungi.
          </p>
          <p className="text-xs text-muted-foreground">
            Dibuat untuk gamer, oleh gamer.
          </p>
        </div>
      </div>
    </footer>
  );
}
