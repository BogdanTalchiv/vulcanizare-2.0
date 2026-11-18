export interface Photo {
  widths: number[];
  width: number;
  height: number;
  sizes: string;
  alt: string;
}

/** Graded workshop photos produced by `npm run images` (see scripts/grade-photos.mjs). */
export const photos = {
  'atelier-interior': {
    widths: [480, 720, 960, 1200],
    width: 1200,
    height: 1500,
    sizes: '(min-width: 1100px) 40vw, 100vw',
    alt: 'Interiorul atelierului Force-Car: rafturi cu anvelope noi și standul de echilibrare',
  },
  'atelier-noapte': {
    widths: [640, 960, 1280, 1600],
    width: 1600,
    height: 1200,
    sizes: '(min-width: 900px) 52vw, 100vw',
    alt: 'Atelierul Force-Car noaptea: indicatorul VULCANIZARE, bannerul 24/24 și raftul cu anvelope pe stoc',
  },
  'atelier-raft': {
    widths: [640, 960, 1280, 1600],
    width: 1600,
    height: 1000,
    sizes: '(min-width: 768px) 58vw, 100vw',
    alt: 'Raft cu anvelope noi pe stoc la Force-Car',
  },
  'jante-sudura': {
    widths: [600, 900, 1200, 1500],
    width: 1500,
    height: 1000,
    sizes: '(min-width: 768px) 42vw, 100vw',
    alt: 'Sudura unei jante din aliaj la Force-Car',
  },
} satisfies Record<string, Photo>;

export type PhotoName = keyof typeof photos;
