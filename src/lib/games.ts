import mobileLegends from "@/assets/games/mobile-legends.jpg";
import freeFire from "@/assets/games/free-fire.jpg";
import pubgMobile from "@/assets/games/pubg-mobile.jpg";
import valorant from "@/assets/games/valorant.jpg";
import genshinImpact from "@/assets/games/genshin-impact.jpg";
import honkaiStarRail from "@/assets/games/honkai-star-rail.jpg";
import zenlessZoneZero from "@/assets/games/zenless-zone-zero.jpg";
import roblox from "@/assets/games/roblox.jpg";
import eaFcMobile from "@/assets/games/ea-fc-mobile.jpg";
import codMobile from "@/assets/games/cod-mobile.jpg";
import wildRift from "@/assets/games/wild-rift.jpg";
import wutheringWaves from "@/assets/games/wuthering-waves.jpg";

export type Game = {
  name: string;
  slug: string;
  cover: string;
  tag?: string;
};

export const games: Game[] = [
  { name: "Mobile Legends", slug: "mobile-legends", cover: mobileLegends, tag: "Hot" },
  { name: "Free Fire", slug: "free-fire", cover: freeFire, tag: "Hot" },
  { name: "PUBG Mobile", slug: "pubg-mobile", cover: pubgMobile },
  { name: "Valorant", slug: "valorant", cover: valorant, tag: "New" },
  { name: "Genshin Impact", slug: "genshin-impact", cover: genshinImpact },
  { name: "Honkai: Star Rail", slug: "honkai-star-rail", cover: honkaiStarRail },
  { name: "Zenless Zone Zero", slug: "zenless-zone-zero", cover: zenlessZoneZero, tag: "New" },
  { name: "Roblox", slug: "roblox", cover: roblox },
  { name: "EA FC Mobile", slug: "ea-fc-mobile", cover: eaFcMobile },
  { name: "Call of Duty: Mobile", slug: "cod-mobile", cover: codMobile },
  { name: "League of Legends: Wild Rift", slug: "wild-rift", cover: wildRift },
  { name: "Wuthering Waves", slug: "wuthering-waves", cover: wutheringWaves, tag: "New" },
];
