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
  Image as ImageIcon,
  Plus,
  Trash2,
  Package,
  Edit,
  X,
  Search,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [banners, setBanners] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Add state
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", tag_text: "", button_text: "", button_link: "", game_slug: "", image_url: "" });
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newGame, setNewGame] = useState({ name: "", slug: "", image_url: "", id_label: "User ID", zone_label: "", background_url: "" });
  const [newPackage, setNewPackage] = useState({ game_slug: "", category: "topup", item_name: "", price: "" });

  // Edit states
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Search states
  const [searchGameQuery, setSearchGameQuery] = useState("");
  const [searchPackageQuery, setSearchPackageQuery] = useState("");

  const [currentPageGames, setCurrentPageGames] = useState(1);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
      const [topupRes, jokiRes, bannersRes, gamesRes, packRes, reportsRes] = await Promise.all([
        supabase.from("topup_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("joki_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("master_banners").select("*").order("created_at", { ascending: false }),
        supabase.from("master_games").select("*").order("name", { ascending: true }),
        supabase.from("master_packages").select("*").order("game_slug", { ascending: true }),
        supabase.from("user_reports").select("*").order("created_at", { ascending: false }),
      ]);
      if (topupRes.data) setOrders(topupRes.data);
      if (jokiRes.data) setJokiOrders(jokiRes.data);
      if (bannersRes.data) setBanners(bannersRes.data);
      if (gamesRes.data) setGames(gamesRes.data);
      if (packRes.data) setPackages(packRes.data);
      if (reportsRes.data) setReports(reportsRes.data);
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

  /* ── Order Status ── */
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

  const handleReportStatusChange = async (id: number, newStatus: string) => {
    try {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      const { error } = await supabase.from("user_reports").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      toast.success("Status Laporan Diperbarui", { description: `ID Laporan: ${id} → ${newStatus}.` });
    } catch {
      toast.error("Gagal memperbarui status laporan");
      fetchOrders();
    }
  };

  /* ── Banners ── */
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("master_banners").insert([{ ...newBanner, is_active: true, game_slug: newBanner.game_slug || null }]);
      if (error) throw error;
      toast.success("Promo berhasil ditambahkan");
      setIsAddingBanner(false);
      setNewBanner({ title: "", subtitle: "", tag_text: "", button_text: "", button_link: "", game_slug: "", image_url: "" });
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal menambah promo", { description: err.message });
    }
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("master_banners").update({
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
        tag_text: editingBanner.tag_text,
        button_text: editingBanner.button_text,
        button_link: editingBanner.button_link,
        game_slug: editingBanner.game_slug || null,
        image_url: editingBanner.image_url,
      }).eq("id", editingBanner.id);
      if (error) throw error;
      toast.success("Data berhasil diperbarui!");
      setEditingBanner(null);
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal memperbarui promo", { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBannerToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, is_active: !currentStatus } : b)));
      const { error } = await supabase.from("master_banners").update({ is_active: !currentStatus }).eq("id", id);
      if (error) throw error;
      toast.success("Status promo diperbarui");
    } catch {
      toast.error("Gagal memperbarui promo");
      fetchOrders();
    }
  };

  const handleBannerDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus promo ini?")) return;
    try {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      const { error } = await supabase.from("master_banners").delete().eq("id", id);
      if (error) throw error;
      toast.success("Promo berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus promo");
      fetchOrders();
    }
  };

  /* ── Catalog Handlers ── */
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("master_games").insert([newGame]);
      if (error) throw error;
      toast.success("Game berhasil ditambahkan!");
      setIsAddingGame(false);
      setNewGame({ name: "", slug: "", image_url: "", id_label: "User ID", zone_label: "", background_url: "" });
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal menambah game", { description: err.message });
    }
  };

  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const originalSlug = editingGame._originalSlug || editingGame.slug;
      const { error } = await supabase.from("master_games").update({
        name: editingGame.name,
        slug: editingGame.slug,
        image_url: editingGame.image_url,
        background_url: editingGame.background_url || null,
        id_label: editingGame.id_label,
        zone_label: editingGame.zone_label,
      }).eq("slug", originalSlug);
      if (error) throw error;
      toast.success("Data berhasil diperbarui!");
      setEditingGame(null);
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal memperbarui game", { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteGame = async (slug: string) => {
    if (!confirm("Hapus game ini?")) return;
    try {
      setGames((prev) => prev.filter((g) => g.slug !== slug));
      const { error } = await supabase.from("master_games").delete().eq("slug", slug);
      if (error) throw error;
      toast.success("Game berhasil dihapus!");
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal menghapus game", { description: err.message });
      fetchOrders();
    }
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("master_packages").insert([{
        ...newPackage,
        price: Number(newPackage.price)
      }]);
      if (error) throw error;
      toast.success("Produk berhasil disimpan!");
      setIsAddingPackage(false);
      setNewPackage({ game_slug: "", category: "topup", item_name: "", price: "" });
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal menyimpan produk", { description: err.message });
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("master_packages").update({
        game_slug: editingPackage.game_slug,
        category: editingPackage.category,
        item_name: editingPackage.item_name,
        price: Number(editingPackage.price),
      }).eq("id", editingPackage.id);
      if (error) throw error;
      toast.success("Data berhasil diperbarui!");
      setEditingPackage(null);
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal memperbarui produk", { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      const { error } = await supabase.from("master_packages").delete().eq("id", id);
      if (error) throw error;
      toast.success("Produk berhasil dihapus!");
      fetchOrders();
    } catch (err: any) {
      toast.error("Gagal menghapus produk", { description: err.message });
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

  /* ── Filtered Catalog ── */
  const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchGameQuery.toLowerCase()));
  const totalGamesPages = Math.max(1, Math.ceil(filteredGames.length / ITEMS_PER_PAGE));
  const paginatedGames = filteredGames.slice((currentPageGames - 1) * ITEMS_PER_PAGE, currentPageGames * ITEMS_PER_PAGE);
  
  const filteredPackages = packages.filter(p => {
    const gameObj = games.find(g => g.slug === p.game_slug);
    const gameName = gameObj?.name || p.game_slug;
    const search = searchPackageQuery.toLowerCase();
    return p.item_name.toLowerCase().includes(search) || gameName.toLowerCase().includes(search);
  });
  const totalProductsPages = Math.max(1, Math.ceil(filteredPackages.length / ITEMS_PER_PAGE));
  const paginatedPackages = filteredPackages.slice((currentPageProducts - 1) * ITEMS_PER_PAGE, currentPageProducts * ITEMS_PER_PAGE);

  const StatusDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="relative inline-block w-40">
      <select
        value={value || "menunggu_pembayaran"}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-all focus:ring-2 focus:ring-primary/50 shadow-sm ${
          value === "selesai" ? "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
          : value === "sedang_diproses" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"
          : "bg-violet-500/10 border-violet-500/30 text-violet-500 hover:bg-violet-500/20"
        }`}
      >
        {statusOptions.map((opt) => (<option key={opt.value} value={opt.value} className="bg-card text-foreground">{opt.label}</option>))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className="h-4 w-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );

  const pageTitle =
    activeMenu === "topup" ? "Manajemen Pesanan Top Up"
    : activeMenu === "joki" ? "Manajemen Pesanan Joki"
    : activeMenu === "banners" ? "Manajemen Promo"
    : activeMenu === "catalog" ? "Kelola Katalog"
    : activeMenu === "reports" ? "Kotak Masuk Laporan"
    : "Admin Dashboard";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col shrink-0 relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 shadow-[0_0_12px_-2px_rgba(139,92,246,0.6)]"><Gamepad2 className="h-4 w-4 text-white" /></span>
            <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-400">NeonAdmin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          {([
            ["dashboard", "Dashboard", LayoutDashboard],
            ["topup", "Pesanan Top Up", Gamepad2],
            ["joki", "Pesanan Joki", Swords],
            ["banners", "Promo & Banner", ImageIcon],
            ["catalog", "Kelola Katalog", Package],
            ["reports", "Laporan Pengguna", MessageSquare]
          ] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setActiveMenu(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeMenu === key ? "bg-violet-500/10 text-violet-500" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border/40">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-violet-500 hover:bg-violet-500/10 transition-all cursor-pointer">
            <LogOut className="h-4 w-4" />Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
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

          {/* ═══ REPORTS ═══ */}
          {activeMenu === "reports" && (
            <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden relative animate-in fade-in duration-300">
              <div className="px-6 py-5 border-b border-border/50 bg-secondary/20"><h3 className="font-bold text-lg">Kotak Masuk Laporan</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                    <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Pengguna</th><th className="px-6 py-4">WhatsApp</th><th className="px-6 py-4">Keluhan / Pesan</th><th className="px-6 py-4">Bukti</th><th className="px-6 py-4 text-right">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {loading ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                    ) : reports.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center"><MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">Belum ada laporan masuk.</p></td></tr>
                    ) : reports.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground text-xs">{formatDate(r.created_at)}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.email}</div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{r.whatsapp || "-"}</td>
                        <td className="px-6 py-4 max-w-[300px] truncate text-muted-foreground" title={r.report_text}>{r.report_text}</td>
                        <td className="px-6 py-4">
                          {r.screenshot_link ? (
                            <a href={r.screenshot_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lihat Bukti</a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <StatusDropdown value={r.status} onChange={(v) => handleReportStatusChange(r.id, v)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-400">{formatRupiah(o.total_price)}</td>
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
                        <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-400">{formatRupiah(o.total_price)}</td>
                        <td className="px-6 py-4"><StatusDropdown value={o.status} onChange={(v) => handleJokiStatusChange(o.invoice_id, v)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ BANNERS (PROMO) ═══ */}
          {activeMenu === "banners" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Manajemen Promo (Banner)</h2>
                  <p className="text-muted-foreground mt-1">Atur promo yang tampil di halaman beranda.</p>
                </div>
                <Button onClick={() => setIsAddingBanner(!isAddingBanner)} className="bg-gradient-neon text-primary-foreground font-semibold flex items-center gap-2">
                  {isAddingBanner ? <><X className="h-4 w-4"/> Batal</> : <><Plus className="h-4 w-4"/> Tambah Promo</>}
                </Button>
              </div>

              {isAddingBanner && (
                <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
                  <h3 className="font-bold text-lg mb-4">Tambah Promo Baru</h3>
                  <form onSubmit={handleAddBanner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul (Title)</label>
                        <input required type="text" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Promo Lebaran" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Teks Tag (Opsional)</label>
                        <input type="text" value={newBanner.tag_text} onChange={e => setNewBanner({...newBanner, tag_text: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Diskon 50%" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi (Subtitle)</label>
                        <input required type="text" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Top up sekarang dan dapatkan bonus menarik." />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Teks Tombol</label>
                        <input required type="text" value={newBanner.button_text} onChange={e => setNewBanner({...newBanner, button_text: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Beli Sekarang" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Link Tombol</label>
                        <input required type="text" value={newBanner.button_link} onChange={e => setNewBanner({...newBanner, button_link: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="/topup/mobile-legends" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar Promo (Banner HD)</label>
                        <input type="text" value={newBanner.image_url} onChange={e => setNewBanner({...newBanner, image_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="https://example.com/banner.jpg" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Pilih Game (Opsional)</label>
                        <select
                          value={newBanner.game_slug}
                          onChange={e => setNewBanner({...newBanner, game_slug: e.target.value})}
                          className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none appearance-none cursor-pointer"
                        >
                          <option value="">— Tidak dihubungkan ke game —</option>
                          {games.map((g) => (
                            <option key={g.slug} value={g.slug}>{g.name}</option>
                          ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Gambar game akan ditampilkan di Hero Banner jika dihubungkan.</p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button type="submit" className="bg-primary text-primary-foreground">Simpan Promo</Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                      <tr><th className="px-6 py-4">Info Promo</th><th className="px-6 py-4">Game</th><th className="px-6 py-4">Teks Tombol</th><th className="px-6 py-4">Link Tombol</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-right">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {loading ? (
                        <tr><td colSpan={6} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                      ) : banners.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">Belum ada promo banner.</td></tr>
                      ) : banners.map((b) => (
                        <tr key={b.id} className={`hover:bg-white/5 transition-colors ${!b.is_active ? "opacity-60" : ""}`}>
                          <td className="px-6 py-4">
                            {b.tag_text && <span className="inline-block mb-1 text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded font-bold uppercase">{b.tag_text}</span>}
                            <p className="font-bold text-base text-foreground">{b.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{b.subtitle}</p>
                          </td>
                          <td className="px-6 py-4">
                            {b.game_slug ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                <Gamepad2 className="h-3 w-3" />
                                {games.find((g) => g.slug === b.game_slug)?.name || b.game_slug}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50 italic">Tidak ada</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-semibold">{b.button_text}</td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">{b.button_link}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleBannerToggleActive(b.id, b.is_active)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors ${b.is_active ? 'bg-green-500' : 'bg-muted'}`}
                            >
                              <span className="sr-only">Toggle active</span>
                              <span aria-hidden="true" className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${b.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                            <button onClick={() => setEditingBanner(b)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleBannerDelete(b.id)} className="p-2 text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CATALOG (GAMES & PACKAGES) ═══ */}
          {activeMenu === "catalog" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* KELOLA GAME */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Kelola Game</h2>
                    <p className="text-muted-foreground mt-1">Tambah atau hapus game dari website.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Cari nama game..."
                        value={searchGameQuery}
                        onChange={(e) => {
                          setSearchGameQuery(e.target.value);
                          setCurrentPageGames(1);
                        }}
                        className="w-full h-10 pl-9 pr-4 rounded-full border border-border/60 bg-input/40 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <Button onClick={() => setIsAddingGame(!isAddingGame)} className="bg-gradient-neon text-primary-foreground font-semibold flex items-center gap-2 whitespace-nowrap">
                      {isAddingGame ? "Batal" : <><Plus className="h-4 w-4"/> Tambah Game</>}
                    </Button>
                  </div>
                </div>

                {isAddingGame && (
                  <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-lg mb-4">Tambah Game Baru</h3>
                    <form onSubmit={handleAddGame} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Game</label>
                          <input required type="text" value={newGame.name} onChange={e => {
                              const name = e.target.value;
                              const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                              setNewGame({...newGame, name, slug});
                            }} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Mobile Legends" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug (Otomatis)</label>
                          <input required type="text" value={newGame.slug} onChange={e => setNewGame({...newGame, slug: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="mobile-legends" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar (Icon/Square)</label>
                          <input required type="text" value={newGame.image_url} onChange={e => setNewGame({...newGame, image_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="https://example.com/icon.jpg" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar Background (Fanart HD) — Opsional</label>
                          <input type="text" value={newGame.background_url} onChange={e => setNewGame({...newGame, background_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="https://example.com/fanart-hd.jpg" />
                          <p className="text-[10px] text-muted-foreground/60 mt-1">Gambar latar belakang HD untuk halaman detail top up (seperti UniPin). Rasio ideal: 16:9 landscape.</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Label ID Utama</label>
                          <input required type="text" value={newGame.id_label} onChange={e => setNewGame({...newGame, id_label: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="User ID" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Label Zone ID (Opsional)</label>
                          <input type="text" value={newGame.zone_label} onChange={e => setNewGame({...newGame, zone_label: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Zone ID" />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button type="submit" className="bg-primary text-primary-foreground">Simpan Game</Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                        <tr><th className="px-6 py-4">Cover</th><th className="px-6 py-4">Nama Game</th><th className="px-6 py-4">Slug</th><th className="px-6 py-4">Label Form</th><th className="px-6 py-4 text-right">Aksi</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {loading ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                        ) : paginatedGames.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">Tidak ada data yang cocok dengan pencarian Anda.</td></tr>
                        ) : paginatedGames.map((g) => (
                          <tr key={g.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <img src={g.image_url} alt={g.name} className="h-10 w-10 rounded object-cover bg-secondary/50" />
                            </td>
                            <td className="px-6 py-4 font-bold text-foreground">{g.name}</td>
                            <td className="px-6 py-4 text-muted-foreground text-xs">{g.slug}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className="block">{g.id_label}</span>
                              {g.zone_label && <span className="block text-muted-foreground">+ {g.zone_label}</span>}
                            </td>
                            <td className="px-6 py-4 text-right flex items-center justify-end gap-1 h-full pt-6">
                              <button onClick={() => setEditingGame({ ...g, _originalSlug: g.slug })} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteGame(g.slug)} className="p-2 text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalGamesPages > 1 && (
                    <div className="p-4 border-t border-border/50 flex items-center justify-between bg-secondary/10">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPageGames === 1}
                        onClick={() => setCurrentPageGames(p => Math.max(1, p - 1))}
                        className="border-border/60 hover:bg-secondary/60 text-xs"
                      >
                        Sebelumnya
                      </Button>
                      <span className="text-xs font-medium text-muted-foreground">Halaman {currentPageGames} dari {totalGamesPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPageGames === totalGamesPages}
                        onClick={() => setCurrentPageGames(p => Math.min(totalGamesPages, p + 1))}
                        className="border-border/60 hover:bg-secondary/60 text-xs"
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* KELOLA PRODUK */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Kelola Produk & Paket Joki</h2>
                    <p className="text-muted-foreground mt-1">Atur harga dan layanan untuk setiap game.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Cari nama produk / game..."
                        value={searchPackageQuery}
                        onChange={(e) => {
                          setSearchPackageQuery(e.target.value);
                          setCurrentPageProducts(1);
                        }}
                        className="w-full h-10 pl-9 pr-4 rounded-full border border-border/60 bg-input/40 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/60"
                      />
                    </div>
                    <Button onClick={() => setIsAddingPackage(!isAddingPackage)} className="bg-gradient-neon text-primary-foreground font-semibold flex items-center gap-2 whitespace-nowrap">
                      {isAddingPackage ? "Batal" : <><Plus className="h-4 w-4"/> Tambah Produk</>}
                    </Button>
                  </div>
                </div>

                {isAddingPackage && (
                  <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-lg mb-4">Tambah Produk Baru</h3>
                    <form onSubmit={handleAddPackage} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Pilih Game</label>
                          <select required value={newPackage.game_slug} onChange={e => setNewPackage({...newPackage, game_slug: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none">
                            <option value="">-- Pilih Game --</option>
                            {games.map(g => <option key={g.slug} value={g.slug}>{g.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
                          <select required value={newPackage.category} onChange={e => setNewPackage({...newPackage, category: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none">
                            <option value="topup">Top Up</option>
                            <option value="joki">Joki</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Produk / Layanan</label>
                          <input required type="text" value={newPackage.item_name} onChange={e => setNewPackage({...newPackage, item_name: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="Contoh: 140 Diamonds" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Harga (Rp)</label>
                          <input required type="number" min="0" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" placeholder="50000" />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button type="submit" className="bg-primary text-primary-foreground">Tambah Produk</Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                        <tr><th className="px-6 py-4">Game</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4">Nama Produk</th><th className="px-6 py-4">Harga</th><th className="px-6 py-4 text-right">Aksi</th></tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {loading ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center"><RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground font-medium">Memuat data...</p></td></tr>
                        ) : paginatedPackages.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">Tidak ada data yang cocok dengan pencarian Anda.</td></tr>
                        ) : paginatedPackages.map((p) => {
                          const gameObj = games.find(g => g.slug === p.game_slug);
                          return (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                                {gameObj?.image_url ? <img src={gameObj.image_url} alt="game" className="h-6 w-6 rounded object-cover" /> : <div className="h-6 w-6 rounded bg-secondary" />}
                                {gameObj?.name || p.game_slug}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.category === 'topup' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-semibold text-primary">{p.item_name}</td>
                              <td className="px-6 py-4 text-green-500 font-bold">{formatRupiah(p.price)}</td>
                              <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                                <button onClick={() => setEditingPackage(p)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeletePackage(p.id)} className="p-2 text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {totalProductsPages > 1 && (
                    <div className="p-4 border-t border-border/50 flex items-center justify-between bg-secondary/10">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPageProducts === 1}
                        onClick={() => setCurrentPageProducts(p => Math.max(1, p - 1))}
                        className="border-border/60 hover:bg-secondary/60 text-xs"
                      >
                        Sebelumnya
                      </Button>
                      <span className="text-xs font-medium text-muted-foreground">Halaman {currentPageProducts} dari {totalProductsPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPageProducts === totalProductsPages}
                        onClick={() => setCurrentPageProducts(p => Math.min(totalProductsPages, p + 1))}
                        className="border-border/60 hover:bg-secondary/60 text-xs"
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ═══ MODALS EDIT ═══ */}
      {/* Banner Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[20px] border border-border/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Promo</h3>
              <button onClick={() => setEditingBanner(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleUpdateBanner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul (Title)</label>
                  <input required type="text" value={editingBanner.title} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Teks Tag (Opsional)</label>
                  <input type="text" value={editingBanner.tag_text || ""} onChange={e => setEditingBanner({...editingBanner, tag_text: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi (Subtitle)</label>
                  <input required type="text" value={editingBanner.subtitle} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Teks Tombol</label>
                  <input required type="text" value={editingBanner.button_text} onChange={e => setEditingBanner({...editingBanner, button_text: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Link Tombol</label>
                  <input required type="text" value={editingBanner.button_link} onChange={e => setEditingBanner({...editingBanner, button_link: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar Promo (Banner HD)</label>
                  <input type="text" value={editingBanner.image_url || ""} onChange={e => setEditingBanner({...editingBanner, image_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Pilih Game (Opsional)</label>
                  <select
                    value={editingBanner.game_slug || ""}
                    onChange={e => setEditingBanner({...editingBanner, game_slug: e.target.value})}
                    className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">— Tidak dihubungkan ke game —</option>
                    {games.map((g) => (
                      <option key={g.slug} value={g.slug}>{g.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Gambar game akan ditampilkan di Hero Banner jika dihubungkan.</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingBanner(null)}>Batal</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary text-primary-foreground min-w-[120px]">
                  {isUpdating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Game Edit Modal */}
      {editingGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[20px] border border-border/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Game</h3>
              <button onClick={() => setEditingGame(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleUpdateGame} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Game</label>
                  <input required type="text" value={editingGame.name} onChange={e => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      setEditingGame({...editingGame, name, slug});
                    }} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug (Otomatis)</label>
                  <input required type="text" value={editingGame.slug} onChange={e => setEditingGame({...editingGame, slug: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar (Icon/Square)</label>
                  <input required type="text" value={editingGame.image_url} onChange={e => setEditingGame({...editingGame, image_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">URL Gambar Background (Fanart HD) — Opsional</label>
                  <input type="text" value={editingGame.background_url || ""} onChange={e => setEditingGame({...editingGame, background_url: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Gambar latar belakang HD untuk halaman detail top up. Rasio ideal: 16:9 landscape.</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Label ID Utama</label>
                  <input required type="text" value={editingGame.id_label} onChange={e => setEditingGame({...editingGame, id_label: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Label Zone ID (Opsional)</label>
                  <input type="text" value={editingGame.zone_label || ""} onChange={e => setEditingGame({...editingGame, zone_label: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingGame(null)}>Batal</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary text-primary-foreground min-w-[120px]">
                  {isUpdating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Edit Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[20px] border border-border/50 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Produk / Paket</h3>
              <button onClick={() => setEditingPackage(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleUpdatePackage} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Pilih Game</label>
                  <select required value={editingPackage.game_slug} onChange={e => setEditingPackage({...editingPackage, game_slug: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none">
                    {games.map(g => <option key={g.slug} value={g.slug}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
                  <select required value={editingPackage.category} onChange={e => setEditingPackage({...editingPackage, category: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none">
                    <option value="topup">Top Up</option>
                    <option value="joki">Joki</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Produk / Layanan</label>
                  <input required type="text" value={editingPackage.item_name} onChange={e => setEditingPackage({...editingPackage, item_name: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Harga (Rp)</label>
                  <input required type="number" min="0" value={editingPackage.price} onChange={e => setEditingPackage({...editingPackage, price: e.target.value})} className="w-full rounded-lg border border-border/60 bg-input/40 px-3 py-2 text-sm focus:border-primary focus:ring-1 outline-none" />
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingPackage(null)}>Batal</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary text-primary-foreground min-w-[120px]">
                  {isUpdating ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
