# Homepage Top Up Game & Jasa Joki

Membangun halaman utama bertema dark mode + aksen neon (ungu esports & cyan) yang mobile-first, modern, dan responsif sesuai spesifikasi.

## Design System (src/styles.css)

- Background utama: `#121212` (oklch equivalent)
- Surface/card: `#1a1a1a` sedikit lebih terang
- Aksen utama: neon purple `#A855F7`
- Aksen sekunder: cyan `#22D3EE`
- Foreground: putih lembut
- Tambah token: `--neon-purple`, `--neon-cyan`, `--gradient-hero` (linear ungu→cyan), `--glow-primary` (box-shadow neon)
- Set tema default ke dark (apply class `dark` di `__root.tsx` body / pakai variabel `:root` langsung dark)
- Tambah animasi: `hover-scale` (scale 1.05), `fade-in`, `glow-pulse` untuk CTA

## Struktur File

- `src/routes/index.tsx` — assembly homepage (ganti placeholder)
- `src/components/site/Navbar.tsx` — sticky top, logo + search + menu + CTA login
- `src/components/site/HeroCarousel.tsx` — banner (pakai shadcn `carousel`) dengan headline + CTA
- `src/components/site/GameGrid.tsx` + `GameCard.tsx` — grid responsif (2 kol mobile, 3 sm, 4 md, 6 lg) dengan 12 game dummy
- `src/components/site/FeaturesSection.tsx` — 3 kolom keunggulan
- `src/components/site/Footer.tsx` — logo, deskripsi, ikon pembayaran, quick links
- `src/lib/games.ts` — data dummy 12 game (nama + slug + prompt cover)
- Update `__root.tsx` head: title "TopUp & Joki Game Terpercaya", meta description, dll.

## Komponen Detail

**Navbar**
- Sticky `top-0 z-50`, backdrop blur, border-bottom neon tipis
- Kiri: logo (text gradient ungu→cyan, ikon Gamepad2 dari lucide)
- Tengah: Input search dengan ikon Search, placeholder "Cari game..."
- Menu (desktop): Beranda, Lacak Pesanan, Joki, Reseller
- Kanan: Tombol "Masuk / Daftar" variant neon (bg ungu + glow on hover)
- Mobile: Sheet hamburger untuk menu + search

**Hero Carousel**
- 3 slide dummy menggunakan shadcn Carousel + autoplay sederhana via `setInterval`
- Setiap slide: gradient background + ilustrasi karakter game (generate via imagegen, simpan ke `src/assets/`)
- Headline besar (text-4xl→6xl), subheadline, CTA "Lihat Semua Game" (gradient button)

**Game Grid**
- Section heading "🔥 Sedang Tren" dengan accent bar
- 12 GameCard: aspect ratio 3/4 (poster vertical), cover image, overlay gradient bawah, nama game putih
- Hover: `scale-105`, border glow ungu, transisi 300ms
- Gambar cover: generate 12 portrait images (768x1024) untuk tiap game, simpan di `src/assets/games/`

**Features**
- Grid 3 kolom (stack di mobile)
- Card dengan ikon besar (Zap, ShieldCheck, Headphones dari lucide), border neon tipis, hover glow

**Footer**
- 3 kolom: brand + deskripsi, quick links (Syarat & Ketentuan, Hubungi Kami), metode pembayaran
- Payment icons: render sebagai badge teks monospace abu-abu (QRIS, GoPay, DANA, OVO, BCA, BNI, Mandiri) — tidak generate logo asli untuk hindari trademark issue
- Bottom bar: copyright

## Teknis

- Semua warna via token semantik di `styles.css` (no hard-coded hex di komponen)
- Tailwind classes only; pakai `cn()` util
- Responsive breakpoints: default mobile, `sm:` `md:` `lg:` untuk grid columns & spacing
- SEO: title <60 char, meta description <160 char, single H1 di hero, alt text pada semua gambar
- Animasi hover via Tailwind transition + transform, plus keyframe `glow-pulse` untuk CTA utama

## Aset Gambar

- 1 hero illustration (1920x1080) — karakter game futuristik neon
- 12 game cover portraits (sesuai daftar) — gaya poster game vertical
- Total ~13 imagegen calls dengan model `fast`