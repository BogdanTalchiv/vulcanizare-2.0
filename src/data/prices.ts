/** Vulcanizare price list — MDL (lei). Exact rows from the workshop list; ranges where the list shows spans. */

export type WheelRow = {
  id: string;
  label: string;
  auto: number;
  suv: number;
};

export type ExtraItem = {
  id: string;
  key: string;
  price: string;
};

export type PaintPackage = {
  id: string;
  key: string;
  from: number;
  to?: number;
};

export type RangeCard = {
  id: string;
  key: string;
  value: string;
};

/** Complet pe o roată: scos / pus / demontare / montare / balansare. */
export const wheelWork: WheelRow[] = [
  { id: 'r12-14', label: 'R12–R14', auto: 110, suv: 130 },
  { id: 'r15', label: 'R15', auto: 120, suv: 140 },
  { id: 'r16', label: 'R16', auto: 130, suv: 150 },
  { id: 'r17', label: 'R17', auto: 140, suv: 170 },
  { id: 'r18', label: 'R18', auto: 150, suv: 180 },
  { id: 'r19', label: 'R19', auto: 160, suv: 200 },
  { id: 'r20', label: 'R20', auto: 180, suv: 250 },
  { id: 'r21', label: 'R21', auto: 190, suv: 270 },
  { id: 'r22', label: 'R22', auto: 210, suv: 300 },
  { id: 'r23-24', label: 'R23–R24', auto: 230, suv: 350 },
];

/** Supliment RunFlat / volum mare (de la 265, profil 25/40). */
export const runFlatSurcharge = 40;

export const busRanges: RangeCard[] = [
  { id: 'remove', key: 'remove', value: '40–50' },
  { id: 'mount', key: 'mount', value: '60–110' },
  { id: 'balance', key: 'balance', value: '50–90' },
  { id: 'total', key: 'total', value: '150–250' },
];

export const rimAutoRanges: RangeCard[] = [
  { id: 'alloy', key: 'alloy', value: '220–650' },
  { id: 'steel', key: 'steel', value: '100–150' },
  { id: 'nitrogen', key: 'nitrogen', value: '250–350' },
];

export const rimSuvRanges: RangeCard[] = [
  { id: 'alloy', key: 'alloy', value: '270–1 000' },
  { id: 'steel', key: 'steel', value: '200–300' },
  { id: 'nitrogen', key: 'nitrogen', value: '350–550' },
];

export const patches: ExtraItem[] = [
  { id: 'up3', key: 'patchUp3', price: '50' },
  { id: 'up4', key: 'patchUp4', price: '60' },
  { id: 'tl110', key: 'patchTl110', price: '150' },
  { id: 'tl116', key: 'patchTl116', price: '170' },
  { id: 'tl120', key: 'patchTl120', price: '250' },
];

export const extras: ExtraItem[] = [
  { id: 'valve-black', key: 'valveBlack', price: '25' },
  { id: 'valve-nickel', key: 'valveNickel', price: '45' },
  { id: 'valve-short', key: 'valveShort', price: '50' },
  { id: 'valve-sensor', key: 'valveSensor', price: '150–250' },
  { id: 'clean', key: 'rimClean', price: '30' },
  { id: 'vulc', key: 'vulcanize', price: '100–1 200' },
  { id: 'blast', key: 'blastInflate', price: '30–100' },
  { id: 'air', key: 'airPressure', price: '2' },
  { id: 'argon', key: 'argonWeld', price: '550–850' },
  { id: 'antitheft', key: 'antitheft', price: '150' },
  { id: 'moto', key: 'motoVelo', price: '50' },
];

/** Vopsire jante — set (unde e cazul). */
export const paintPackages: PaintPackage[] = [
  { id: 'solid', key: 'paintSolid', from: 2800, to: 5000 },
  { id: 'diamond', key: 'paintDiamond', from: 5000, to: 8000 },
  { id: 'cutOnly', key: 'paintCutOnly', from: 3000, to: 4500 },
  { id: 'steelSet', key: 'paintSteel', from: 2200 },
  { id: 'caliper', key: 'paintCaliper', from: 2000, to: 4000 },
];

export const priceTabs = ['wheels', 'bus', 'rims', 'extra', 'paint'] as const;
export type PriceTab = (typeof priceTabs)[number];
