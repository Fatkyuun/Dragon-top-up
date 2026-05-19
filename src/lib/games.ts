import mlCover from "@/assets/games/mobile-legends.jpg";
import ffCover from "@/assets/games/free-fire.jpg";
import pubgCover from "@/assets/games/pubg-mobile.jpg";
import valCover from "@/assets/games/valorant.jpg";
import giCover from "@/assets/games/genshin-impact.jpg";
import hsrCover from "@/assets/games/honkai-star-rail.jpg";
import zzzCover from "@/assets/games/zenless-zone-zero.jpg";
import robloxCover from "@/assets/games/roblox.jpg";
import eaCover from "@/assets/games/ea-fc-mobile.jpg";
import codCover from "@/assets/games/cod-mobile.jpg";
import wrCover from "@/assets/games/wild-rift.jpg";
import wwCover from "@/assets/games/wuthering-waves.jpg";

export type Game = {
  name: string;
  slug: string;
  cover: string;
  tag?: string;
};

export const games: Game[] = [
  { name: "Mobile Legends", slug: "mobile-legends", cover: mlCover, tag: "Hot" },
  { name: "Free Fire", slug: "free-fire", cover: ffCover, tag: "Hot" },
  { name: "PUBG Mobile", slug: "pubg-mobile", cover: pubgCover },
  { name: "Valorant", slug: "valorant", cover: valCover, tag: "New" },
  { name: "Genshin Impact", slug: "genshin-impact", cover: giCover },
  { name: "Honkai: Star Rail", slug: "honkai-star-rail", cover: hsrCover },
  { name: "Zenless Zone Zero", slug: "zenless-zone-zero", cover: zzzCover, tag: "New" },
  { name: "Roblox", slug: "roblox", cover: robloxCover },
  { name: "EA FC Mobile", slug: "ea-fc-mobile", cover: eaCover },
  { name: "Call of Duty: Mobile", slug: "cod-mobile", cover: codCover },
  { name: "League of Legends: Wild Rift", slug: "wild-rift", cover: wrCover },
  { name: "Wuthering Waves", slug: "wuthering-waves", cover: wwCover, tag: "New" },
];
