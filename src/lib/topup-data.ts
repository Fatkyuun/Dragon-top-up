export type Denomination = {
  id: string;
  label: string;
  price: number;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string; // emoji or text icon
};

export type GameTopUpData = {
  slug: string;
  name: string;
  subtitle: string;
  denominations: Denomination[];
  paymentMethods: PaymentMethod[];
};

const defaultPaymentMethods: PaymentMethod[] = [
  { id: "qris", name: "QRIS", icon: "📱" },
  { id: "gopay", name: "GoPay", icon: "💚" },
  { id: "dana", name: "DANA", icon: "💙" },
  { id: "bank", name: "Transfer Bank", icon: "🏦" },
];

export const topUpDataMap: Record<string, GameTopUpData> = {
  "mobile-legends": {
    slug: "mobile-legends",
    name: "Mobile Legends",
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: "ml-1", label: "86 Diamonds", price: 20000 },
      { id: "ml-2", label: "172 Diamonds", price: 38000 },
      { id: "ml-3", label: "257 Diamonds", price: 55000 },
      { id: "ml-4", label: "344 Diamonds", price: 72000 },
      { id: "ml-5", label: "429 Diamonds", price: 88000 },
      { id: "ml-6", label: "514 Diamonds", price: 105000 },
      { id: "ml-7", label: "706 Diamonds", price: 142000 },
      { id: "ml-8", label: "2010 Diamonds", price: 390000 },
    ],
    paymentMethods: defaultPaymentMethods,
  },
  "free-fire": {
    slug: "free-fire",
    name: "Free Fire",
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: "ff-1", label: "70 Diamonds", price: 15000 },
      { id: "ff-2", label: "140 Diamonds", price: 28000 },
      { id: "ff-3", label: "355 Diamonds", price: 65000 },
      { id: "ff-4", label: "720 Diamonds", price: 125000 },
      { id: "ff-5", label: "1450 Diamonds", price: 245000 },
      { id: "ff-6", label: "2180 Diamonds", price: 365000 },
    ],
    paymentMethods: defaultPaymentMethods,
  },
  "pubg-mobile": {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: "pubg-1", label: "60 UC", price: 16000 },
      { id: "pubg-2", label: "325 UC", price: 79000 },
      { id: "pubg-3", label: "660 UC", price: 155000 },
      { id: "pubg-4", label: "1800 UC", price: 395000 },
      { id: "pubg-5", label: "3850 UC", price: 790000 },
      { id: "pubg-6", label: "8100 UC", price: 1590000 },
    ],
    paymentMethods: defaultPaymentMethods,
  },
  "valorant": {
    slug: "valorant",
    name: "Valorant",
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: "val-1", label: "125 VP", price: 15000 },
      { id: "val-2", label: "420 VP", price: 45000 },
      { id: "val-3", label: "700 VP", price: 75000 },
      { id: "val-4", label: "1375 VP", price: 145000 },
      { id: "val-5", label: "2400 VP", price: 245000 },
      { id: "val-6", label: "4000 VP", price: 395000 },
    ],
    paymentMethods: defaultPaymentMethods,
  },
  "genshin-impact": {
    slug: "genshin-impact",
    name: "Genshin Impact",
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: "gi-1", label: "60 Genesis Crystals", price: 16000 },
      { id: "gi-2", label: "300 Genesis Crystals", price: 79000 },
      { id: "gi-3", label: "980 Genesis Crystals", price: 249000 },
      { id: "gi-4", label: "1980 Genesis Crystals", price: 479000 },
      { id: "gi-5", label: "3280 Genesis Crystals", price: 799000 },
      { id: "gi-6", label: "6480 Genesis Crystals", price: 1599000 },
    ],
    paymentMethods: defaultPaymentMethods,
  },
};

// Fallback for games that don't have specific top-up data
export function getTopUpData(slug: string): GameTopUpData {
  if (topUpDataMap[slug]) {
    return topUpDataMap[slug];
  }

  // Generate generic data for unknown games
  const gameName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    name: gameName,
    subtitle: "Proses Cepat & Otomatis",
    denominations: [
      { id: `${slug}-1`, label: "Small Pack", price: 15000 },
      { id: `${slug}-2`, label: "Medium Pack", price: 50000 },
      { id: `${slug}-3`, label: "Large Pack", price: 100000 },
      { id: `${slug}-4`, label: "XL Pack", price: 200000 },
      { id: `${slug}-5`, label: "XXL Pack", price: 350000 },
      { id: `${slug}-6`, label: "Mega Pack", price: 500000 },
    ],
    paymentMethods: defaultPaymentMethods,
  };
}
