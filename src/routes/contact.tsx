import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MapPin, Mail, Clock, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    report_text: "",
    screenshot_link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_reports").insert([
        {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp || null,
          complaint: formData.report_text,
          screenshot_url: formData.screenshot_link || null,
          status: "Menunggu",
        },
      ]);

      if (error) throw error;

      toast.success("Laporan berhasil dikirim, tim kami akan segera merespons!");
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        report_text: "",
        screenshot_link: "",
      });
    } catch (err: any) {
      console.error("Error submitting report:", err);
      toast.error("Gagal mengirim laporan", {
        description: err.message || "Terjadi kesalahan pada sistem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gradient-neon mb-4">
            Hubungi Kami & Laporan
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Punya pertanyaan, kendala saat transaksi, atau menemukan bug? 
            Jangan ragu untuk menghubungi kami melalui form di bawah ini.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Kolom Kiri: Peta & Info */}
          <div className="space-y-8">
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-card glow-neon shadow-lg w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24009761942!2d106.8271528!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1716440927000!5m2!1sid!2sid" 
                width="100%" 
                height="300" 
                style={{ border: 0, borderRadius: '8px' }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm">
                <Mail className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Email Support</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">support@neontopup.com</p>
                <p className="text-muted-foreground text-xs sm:text-sm">admin@neontopup.com</p>
              </div>
              <div className="p-5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Jam Operasional</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Senin - Minggu</p>
                <p className="text-muted-foreground text-xs sm:text-sm">08:00 - 23:00 WIB</p>
              </div>
              <div className="p-5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm sm:col-span-2">
                <MapPin className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Lokasi Kantor</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Gedung Cyber 2 Tower, Jl. H. R. Rasuna Said Blok X-5, 
                  Kuningan, Jakarta Selatan, DKI Jakarta 12950
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Laporan */}
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Kirim Laporan / Pesan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nama Pengguna <span className="text-red-500">*</span></label>
                  <input
                    id="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-border/60 bg-input/50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Nama lengkap kamu"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email <span className="text-red-500">*</span></label>
                  <input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-border/60 bg-input/50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="text-sm font-medium text-muted-foreground">Nomor WhatsApp <span className="text-xs text-muted-foreground/60">(Opsional)</span></label>
                <input
                  id="whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full rounded-lg border border-border/60 bg-input/50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="081234567890"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="report_text" className="text-sm font-medium text-muted-foreground">Detail Keluhan / Laporan Bug <span className="text-red-500">*</span></label>
                <textarea
                  id="report_text"
                  required
                  rows={4}
                  value={formData.report_text}
                  onChange={(e) => setFormData({ ...formData, report_text: e.target.value })}
                  className="w-full rounded-lg border border-border/60 bg-input/50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Jelaskan secara detail masalah atau pesan yang ingin kamu sampaikan..."
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="screenshot_link" className="text-sm font-medium text-muted-foreground">Link Screenshot Bukti <span className="text-xs text-muted-foreground/60">(Opsional)</span></label>
                <input
                  id="screenshot_link"
                  type="url"
                  value={formData.screenshot_link}
                  onChange={(e) => setFormData({ ...formData, screenshot_link: e.target.value })}
                  className="w-full rounded-lg border border-border/60 bg-input/50 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="https://imgur.com/... atau link Google Drive"
                />
                <p className="text-[11px] text-muted-foreground/70">Untuk melampirkan bukti gambar, silakan unggah ke Imgur atau Google Drive lalu *paste* linknya di sini.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 rounded-xl bg-gradient-neon py-3 px-4 text-sm font-bold text-primary-foreground shadow-[0_0_20px_-5px_var(--neon-purple)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>Kirim Pesan</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
