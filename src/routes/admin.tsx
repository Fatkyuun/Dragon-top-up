import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Gamepad2,
  Swords,
  LogOut,
  RefreshCcw,
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
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("topup");

  useEffect(() => {
    // PROTECTED ROUTE CHECK
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
      const { data, error } = await supabase
        .from("topup_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching:", error);
      } else {
        setOrders(data || []);
      }
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

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      // Optimistic Update: langsung ubah di UI agar terasa instan
      setOrders((prev) =>
        prev.map((o) =>
          o.invoice_id === invoiceId ? { ...o, status: newStatus } : o
        )
      );

      // Request Update ke Supabase
      const { error } = await supabase
        .from("topup_orders")
        .update({ status: newStatus })
        .eq("invoice_id", invoiceId);

      if (error) throw error;
      
      toast.success("Status Diperbarui", {
        description: `Pesanan ${invoiceId} menjadi ${newStatus}.`,
      });
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Gagal memperbarui status", {
        description: "Silakan coba lagi.",
      });
      fetchOrders(); // Revert back jika gagal
    }
  };

  const formatRupiah = (n: number) => "Rp " + (n || 0).toLocaleString("id-ID");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusOptions = [
    { value: "menunggu_pembayaran", label: "Menunggu" },
    { value: "sedang_diproses", label: "Diproses" },
    { value: "selesai", label: "Selesai" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* ═══════════════════════════════════════════
          SIDEBAR
         ═══════════════════════════════════════════ */}
      <aside className="w-64 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col shrink-0 relative z-20">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 shadow-[0_0_12px_-2px_rgba(220,38,38,0.6)]">
              <Gamepad2 className="h-4 w-4 text-white" />
            </span>
            <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              NeonAdmin
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                activeMenu === "dashboard"
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }
            `}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveMenu("topup")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                activeMenu === "topup"
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }
            `}
          >
            <Gamepad2 className="h-4 w-4" />
            Pesanan Top Up
          </button>
          <button
            onClick={() => setActiveMenu("joki")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${
                activeMenu === "joki"
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }
            `}
          >
            <Swords className="h-4 w-4" />
            Pesanan Joki
          </button>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT
         ═══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Glow Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-background/50 backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-tight">
            {activeMenu === "topup" ? "Manajemen Pesanan Top Up" : "Admin Dashboard"}
          </h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary/80 border border-border/40 px-3.5 py-1.5 rounded-lg transition-all active:scale-95"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 sm:p-8">
          {activeMenu === "topup" ? (
            <div className="rounded-[20px] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  {/* Table Head */}
                  <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Invoice</th>
                      <th className="px-6 py-4">Game</th>
                      <th className="px-6 py-4">Nominal</th>
                      <th className="px-6 py-4">WhatsApp</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="divide-y divide-border/30">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground font-medium">Memuat data dari Supabase...</p>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground font-medium">
                          Belum ada pesanan yang masuk.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.invoice_id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {order.invoice_id}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm text-foreground">{order.game_name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ID: {order.user_id_game}{" "}
                              {order.zone_id_game ? `(${order.zone_id_game})` : ""}
                            </p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary">
                            {order.nominal}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground font-medium">
                            {order.whatsapp_buyer}
                          </td>
                          <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                            {formatRupiah(order.total_price)}
                          </td>
                          <td className="px-6 py-4">
                            {/* Dropdown Status */}
                            <div className="relative inline-block w-40">
                              <select
                                value={order.status || "menunggu_pembayaran"}
                                onChange={(e) =>
                                  handleStatusChange(order.invoice_id, e.target.value)
                                }
                                className={`
                                  w-full appearance-none rounded-lg border pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition-all focus:ring-2 focus:ring-primary/50 shadow-sm
                                  ${
                                    order.status === "selesai"
                                      ? "bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
                                      : order.status === "sedang_diproses" || order.status === "Diproses"
                                      ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"
                                      : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                                  }
                                `}
                              >
                                {statusOptions.map((opt) => (
                                  <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-card text-foreground"
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <svg
                                  className="h-4 w-4 opacity-70"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border/60 rounded-[20px]">
              <p className="text-muted-foreground font-medium">Halaman ini belum tersedia.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
