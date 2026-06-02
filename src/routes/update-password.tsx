import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [{ title: "Update Password — NeonTopUp" }],
  }),
  component: UpdatePassword,
});

function UpdatePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;
      
      toast.success("Password berhasil diperbarui! Silakan login kembali.");
      router.navigate({ to: "/admin-login" });
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0000] px-4 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-[24px] border border-border/30 bg-[#120505]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-900 shadow-[0_0_24px_-4px_rgba(139,92,246,0.5)] mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Update <span className="text-violet-500">Password</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Masukkan password baru Anda
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3 text-center">
                <p className="text-sm font-semibold text-violet-500">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <input
                  type="password"
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-black/40 py-4 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground transition-colors group-focus-within:text-violet-500" />
                <input
                  type="password"
                  placeholder="Konfirmasi Password Baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-black/40 py-4 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full mt-4 rounded-xl bg-violet-600 py-4 text-[15px] font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Password Baru"
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()} NeonTopUp Internal System
        </p>
      </div>
    </div>
  );
}
