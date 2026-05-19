export type Rank = {
  id: string;
  label: string;
  tier: number; // numeric for price calculation (higher = harder)
};

export type LoginMethod = {
  id: string;
  label: string;
};

export type JokiPaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

// ── Mobile Legends Ranks ──
export const mlRanks: Rank[] = [
  { id: "warrior", label: "Warrior", tier: 1 },
  { id: "elite", label: "Elite", tier: 2 },
  { id: "master", label: "Master", tier: 3 },
  { id: "grandmaster", label: "Grandmaster", tier: 4 },
  { id: "epic", label: "Epic", tier: 5 },
  { id: "legend", label: "Legend", tier: 6 },
  { id: "mythic", label: "Mythic", tier: 7 },
  { id: "mythic-honor", label: "Mythic Honor", tier: 8 },
  { id: "mythical-glory", label: "Mythical Glory", tier: 9 },
  { id: "immortal", label: "Immortal", tier: 10 },
];

// ── Login Methods ──
export const loginMethods: LoginMethod[] = [
  { id: "moonton", label: "Moonton" },
  { id: "vk", label: "VK" },
  { id: "facebook", label: "Facebook" },
  { id: "google", label: "Google" },
  { id: "riot-id", label: "Riot ID" },
];

// ── Payment Methods ──
export const jokiPaymentMethods: JokiPaymentMethod[] = [
  { id: "qris", name: "QRIS", icon: "📱" },
  { id: "gopay", name: "GoPay", icon: "💚" },
  { id: "dana", name: "DANA", icon: "💙" },
  { id: "bca", name: "BCA", icon: "🏦" },
  { id: "mandiri", name: "Mandiri", icon: "🏛️" },
];

// ── Price Calculation ──
// Base price per tier difference, with scaling for higher tiers
const BASE_PRICE_PER_TIER = 50_000;
const HIGH_TIER_MULTIPLIER = 1.5; // tiers 6+ cost more

export function calculateJokiPrice(
  currentRankId: string,
  targetRankId: string,
): number {
  const current = mlRanks.find((r) => r.id === currentRankId);
  const target = mlRanks.find((r) => r.id === targetRankId);

  if (!current || !target) return 0;
  if (target.tier <= current.tier) return 0;

  let total = 0;
  for (let t = current.tier + 1; t <= target.tier; t++) {
    const multiplier = t >= 6 ? HIGH_TIER_MULTIPLIER : 1;
    total += BASE_PRICE_PER_TIER * multiplier;
  }

  return total;
}
