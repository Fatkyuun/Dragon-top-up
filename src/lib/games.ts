export type Game = {
  name: string;
  slug: string;
  cover: string;
  tag?: string;
};

// Placeholder kotak abu-abu gelap rasio 3:4 (768x1024) sebagai SVG inline.
// Ganti nilai `cover` di tiap entri dengan URL gambar resmi milikmu.
const placeholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 768 1024' preserveAspectRatio='xMidYMid slice'>
      <rect width='768' height='1024' fill='#1f1f24'/>
    </svg>`,
  );

export const games: Game[] = [
  { name: "Mobile Legends", slug: "mobile-legends", cover: placeholder, tag: "Hot" },
  { name: "Free Fire", slug: "free-fire", cover: placeholder, tag: "Hot" },
  { name: "PUBG Mobile", slug: "pubg-mobile", cover: placeholder },
  { name: "Valorant", slug: "valorant", cover: placeholder, tag: "New" },
  { name: "Genshin Impact", slug: "genshin-impact", cover: placeholder },
  { name: "Honkai: Star Rail", slug: "honkai-star-rail", cover: placeholder },
  { name: "Zenless Zone Zero", slug: "zenless-zone-zero", cover: placeholder, tag: "New" },
  { name: "Roblox", slug: "roblox", cover: placeholder },
  { name: "EA FC Mobile", slug: "ea-fc-mobile", cover: placeholder },
  { name: "Call of Duty: Mobile", slug: "cod-mobile", cover: placeholder },
  { name: "League of Legends: Wild Rift", slug: "wild-rift", cover: placeholder },
  { name: "Wuthering Waves", slug: "wuthering-waves", cover: placeholder, tag: "New" },
];
