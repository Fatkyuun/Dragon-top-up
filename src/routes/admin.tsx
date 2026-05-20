import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Gamepad2,
  Swords,
  LogOut,
  RefreshCcw,
  Wallet,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — NeonTopUp" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [jokiOrders, setJokiOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn !== "true") {
      router.navigate({ to: "/admin-login" });
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [topupRes, jokiRes] = await Promise.all([
        supabase.from("topup_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("joki_orders").select("*").order("created_at", { ascending: false }),
      ]);
      if (topupRes.data) setOrders(topupRes.data);
      if (jokiRes.data) setJokiOrders(jokiRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast.success("Berhasil keluar dari Admin Portal");
    router.navigate({ to: "/admin-login" });
  };

  const handleTopupStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      setOrders((prev) => prev.map((o) => (o.invoice_id === invoiceId ? { ...o, status: newStatus } : o)));
      const { error } = await supabase.from("topup_orders").update({ status: newStatus }).eq("invoice_id", invoiceId);
      if (error) throw error;
      toast.success("Status Diperbarui", { description: `Pesanan ${invoiceId} → ${newStatus}.` });
    } catch {
      toast.error("Gagal memperbarui status");
      fetchOrders();
    }
  };

  const handleJokiStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      setJokiOrders((prev) => prev.map((o) => (o.invoice_id === invoiceId ? { ...o, status: newStatus } : o)));
      const { error } = await supabase.from("joki_orders").update({ status: newStatus }).eq("invoice_id", invoiceId);
      if (error) throw error;
      toast.success("Status Diperbarui", { description: `Pesanan ${invoiceId} → ${newStatus}.` });
    } catch {
      toast.error("Gagal memperbarui status");
      fetchOrders();
    }
  };

  const formatRupiah = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");
  const formatDate = (d: string) => (!d ? "-" : new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }));
  const statusOptions = [
    { value: "menunggu_pembayaran", label: "Menunggu" },
    { value: "sedang_diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
  ];

  /* ── Dashboard stats ── */
  const allOrders = [...orders, ...jokiOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const today = new Date();
  const pendapatanHariIni = allOrders
    .filter((o) => { const d = new Date(o.created_at); return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); })
    .reduce((s, o) => s + (Number(o.total_price) || 0), 0);
  const menungguProses = allOrders.filter((o) => o.status?.toLowerCase() !== "selesai").length;
  const recentOrders = allOrders.slice(0, 5);

  /* ── Status dropdown helper ── */
  const StatusDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="relative inline-block w-40">
      <select
        value={value || "menunggu_pembayaran"}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-all focus:ring-2 focus:ring-primary/50 shadow-sm ${
          value === "selesai" ? "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
          : value === "sedang_diproses" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"
          : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
        }`}
      >
        {statusOptions.map((opt) => (<option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );

  const pageTitle = activeMenu === "topup" ? "Manajemen Pesanan Top Up" : activeMenu === "joki" ? "Manajemen Pesanan Joki" : "Admin Dashboard";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col shrink-0 relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 shadow-[0_0_12px_-2px_rgba(220,38,38,0.6)]"><Gamepad2 className="h-4 w-4 text-white" /></span>
            <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">NeonAdmin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {([["dashboard", "Dashboard", LayoutDashboard], ["topup", "Pesanan Top Up", Gamepad2], ["joki", "Pesanan Joki", Swords]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setActiveMenu(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeMenu === key ? "bg-red-500/10 text-red-500" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border/40">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer">
            <LogOut className="h-4 w-4" />Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-background/50 backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-tight">{pageTitle}</h1>
          <button onClick={fetchOrders} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary/80 border border-border/40 px-3.5 py-1.5 rounded-lg transition-all active:scale-95">
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh Data
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-8">
          {/* ═══ DASHBOARD ═══ */}
          {activeMenu === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h2 className="text-2xl font-bold">Selamat Datang di Admin Panel, Juragan!</h2>
                <p className="text-muted-foreground mt-1">Berikut adalah ringkasan performa bisnis Anda hari ini.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "Pendapatan Hari Ini", val: formatRupiah(pendapatanHariIni), color: "green", icon: Wallet },
                  { label: "Total Top Up", val: `${orders.length} Pesanan`, color: "blue", icon: Gamepad2 },
                  { label: "Total Joki", val: `${jokiOrders.length} Pesanan`, color: "purple", icon: Swords },
                  { label: "Menunggu Proses", val: `${menungguProses} Pesanan`, color: "orange", icon: Clock },
                ].map((c) => (
                  <div key={c.label} className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-6 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${c.color}-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150`} />
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-${c.color}-500/20 text-${c.color}-500 border border-${c.color}-500/30`}>
                      <c.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{loading ? <span className="animate-pulse">Memuat...</span> : c.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border/50 bg-secondary/20"><h3 className="font-bold text-lg">5 Pesanan Terakhir</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                      <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Nama Game</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat...</p></td></tr>
                      ) : recentOrders.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Belum ada pesanan.</td></tr>
                      ) : recentOrders.map((o) => {
                        const done = o.status?.toLowerCase() === "selesai";
                        const waiting = o.status?.toLowerCase().includes("menunggu") || !o.status;
                        return (
                          <tr key={o.invoice_id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                            <td className="px-6 py-4 font-bold">{o.game_name || "Game"} <span className="font-normal text-muted-foreground">({o.nominal || "Paket"})</span></td>
                            <td className="px-6 py-4 text-green-500 font-semibold">{formatRupiah(o.total_price)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${done ? "bg-green-500/10 text-green-500 border-green-500/20" : waiting ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                                {done ? "Selesai" : waiting ? "Menunggu" : "Diproses"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TOPUP ORDERS ═══ */}
          {activeMenu === "topup" && (
            <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden relative animate-in fade-in duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                    <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Invoice</th><th className="px-6 py-4">Game</th><th className="px-6 py-4">Nominal</th><th className="px-6 py-4">WhatsApp</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {loading ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-medium">Belum ada pesanan yang masuk.</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o.invoice_id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                        <td className="px-6 py-4 font-bold">{o.invoice_id}</td>
                        <td className="px-6 py-4"><p className="font-bold text-sm">{o.game_name}</p><p className="text-xs text-muted-foreground mt-0.5">ID: {o.user_id_game} {o.zone_id_game ? `(${o.zone_id_game})` : ""}</p></td>
                        <td className="px-6 py-4 font-semibold text-primary">{o.nominal}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{o.whatsapp_buyer}</td>
                        <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">{formatRupiah(o.total_price)}</td>
                        <td className="px-6 py-4"><StatusDropdown value={o.status} onChange={(v) => handleTopupStatusChange(o.invoice_id, v)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ JOKI ORDERS ═══ */}
          {activeMenu === "joki" && (
            <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden relative animate-in fade-in duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                    <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Invoice</th><th className="px-6 py-4">Game</th><th className="px-6 py-4">Nickname</th><th className="px-6 py-4">Detail Joki</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {loading ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                    ) : jokiOrders.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-medium">Belum ada pesanan joki yang masuk.</td></tr>
                    ) : jokiOrders.map((o) => (
                      <tr key={o.invoice_id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                        <td className="px-6 py-4 font-bold">{o.invoice_id}</td>
                        <td className="px-6 py-4"><p className="font-bold text-sm">{o.game_name}</p></td>
                        <td className="px-6 py-4 font-semibold text-primary">{o.nickname_game}</td>
                        <td className="px-6 py-4"><p className="font-bold text-sm">{o.target_rank}</p><p className="text-xs text-muted-foreground mt-0.5">Login: {o.login_via}</p></td>
                        <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">{formatRupiah(o.total_price)}</td>
                        <td className="px-6 py-4"><StatusDropdown value={o.status} onChange={(v) => handleJokiStatusChange(o.invoice_id, v)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
