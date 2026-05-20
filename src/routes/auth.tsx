import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Gamepad2, ArrowLeft, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Masuk atau Daftar — NeonTopUp" }],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const inputWrapperClass = "relative";
const inputClass =
  "w-full rounded-xl border border-border/60 bg-input/60 py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/20 focus:bg-input/80";
const iconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground transition-colors group-focus-within:text-red-500";

function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Email atau password salah!");
      setIsLoading(false);
    } else {
      toast.success("Berhasil masuk!");
      router.navigate({ to: "/" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Gagal mendaftar: " + error.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, full_name: fullName, whatsapp: whatsapp }
      ]);

      if (profileError) {
        toast.error("Gagal menyimpan profil: " + profileError.message);
      } else {
        toast.success("Pendaftaran Berhasil! Silakan cek email untuk verifikasi (jika diaktifkan) atau langsung masuk.");
        setActiveTab("login");
        setPassword("");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10 hidden sm:block">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-card/40 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-card/80 border border-border/40 hover:scale-[1.02]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 my-8">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]">
              <Gamepad2 className="h-7 w-7" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              NeonTopUp
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[24px] border border-border/50 bg-card/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Tabs */}
          <div className="flex p-1.5 bg-background/80 rounded-2xl mb-8 relative border border-border/40">
            {/* Active pill background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-red-600 to-orange-500 rounded-xl shadow-lg transition-all duration-300 ease-out
                ${activeTab === "login" ? "left-1.5" : "left-[calc(50%+4.5px)]"}
              `}
            />
            <button
              onClick={() => setActiveTab("login")}
              className={`relative flex-1 py-3 text-sm font-bold transition-colors z-10 rounded-xl ${activeTab === "login"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`relative flex-1 py-3 text-sm font-bold transition-colors z-10 rounded-xl ${activeTab === "register"
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Daftar
            </button>
          </div>

          <div>
            {/* =======================================
                LOGIN TAB
                ======================================= */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-left-2 duration-300 space-y-5 relative">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold text-foreground mb-1.5">
                    Selamat datang kembali, Gamer!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Masukkan detail akun untuk melanjutkan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className={`group ${inputWrapperClass}`}>
                    <Mail className={iconClass} />
                    <input
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <div className={`group ${inputWrapperClass}`}>
                      <Lock className={iconClass} />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="mt-2 text-right">
                      <a
                        href="#"
                        className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                      >
                        Lupa Password?
                      </a>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <p className="text-sm font-semibold text-red-500 text-center">{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-4 text-[15px] font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>
            )}

            {/* =======================================
                REGISTER TAB
                ======================================= */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="animate-in fade-in slide-in-from-right-2 duration-300 space-y-5 relative">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold text-foreground mb-1.5">
                    Buat Akun Baru
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Buat akun untuk nikmati promo eksklusif!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className={`group ${inputWrapperClass}`}>
                    <User className={iconClass} />
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className={`group ${inputWrapperClass}`}>
                    <Phone className={iconClass} />
                    <input
                      type="tel"
                      placeholder="Nomor WhatsApp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className={`group ${inputWrapperClass}`}>
                    <Mail className={iconClass} />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className={`group ${inputWrapperClass}`}>
                    <Lock className={iconClass} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-4 text-[15px] font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* =======================================
              SOCIAL LOGIN (BOTH TABS)
              ======================================= */}
          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-border/60"></div>
              <span className="flex-shrink-0 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase bg-card">
                ATAU
              </span>
              <div className="flex-grow border-t border-border/60"></div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-background border border-border/50 py-3.5 text-[15px] font-semibold text-foreground transition-all hover:bg-input hover:border-border active:scale-[0.98]"
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </button>
          </div>
        </div>

        {/* Mobile Back Link below card */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
