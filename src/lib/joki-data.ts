export type LoginMethod = {
  id: string;
  label: string;
};

export type JokiPaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

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

