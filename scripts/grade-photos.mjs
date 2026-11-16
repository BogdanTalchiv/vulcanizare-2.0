import sharp from 'sharp';

/**
 * Sources in assets-src/photos/hd are the originals upscaled 4× with Real-ESRGAN (realesrgan-x4plus).
 * Crops are given in original-photo pixels and scaled to the HD source.
 */
const HD_SCALE = 4;

/** Cinematic grade shared by all workshop photos: crop, resize, tone, vignette, sharpen. */
export async function gradePhoto(src, { crop, width, height, denoise = 0, saturation = 0.72, brightness = 0.96, contrast = 1.14, lift = 0, vignette = 0.55 }) {
  const region = Object.fromEntries(Object.entries(crop).map(([key, value]) => [key, Math.round(value * HD_SCALE)]));
  let pipeline = sharp(src).extract(region);
  if (denoise) pipeline = pipeline.median(denoise);

  const base = await pipeline
    .resize(width, height, { kernel: 'lanczos3', fit: 'cover' })
    .modulate({ saturation, brightness })
    .linear(contrast, 128 * (1 - contrast) + lift)
    .toBuffer();

  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <radialGradient id="v" cx="50%" cy="48%" r="75%">
          <stop offset="55%" stop-color="#0B0D10" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0B0D10" stop-opacity="${vignette}"/>
        </radialGradient>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0B0D10" stop-opacity="0.18"/>
          <stop offset="40%" stop-color="#0B0D10" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0B0D10" stop-opacity="0.32"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`,
  );

  return sharp(base)
    .composite([{ input: overlay }])
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 1.4 });
}

export const photos = [
  {
    name: 'atelier-interior',
    src: 'assets-src/photos/hd/atelier-interior.jpg',
    crop: { left: 548, top: 56, width: 476, height: 595 },
    width: 1200,
    height: 1500,
    widths: [480, 720, 960, 1200],
    saturation: 0.7,
    brightness: 0.9,
    contrast: 1.24,
    lift: -10,
    vignette: 0.7,
  },
  {
    name: 'atelier-noapte',
    src: 'assets-src/photos/hd/atelier-noapte.jpg',
    crop: { left: 396, top: 84, width: 628, height: 471 },
    width: 1600,
    height: 1200,
    widths: [640, 960, 1280, 1600],
    saturation: 0.84,
    brightness: 0.9,
    contrast: 1.2,
    lift: -6,
    vignette: 0.6,
  },
  {
    name: 'atelier-raft',
    src: 'assets-src/photos/hd/atelier-raft.jpg',
    crop: { left: 32, top: 24, width: 960, height: 600 },
    width: 1600,
    height: 1000,
    widths: [640, 960, 1280, 1600],
    saturation: 0.74,
    brightness: 0.86,
    contrast: 1.16,
    lift: -8,
    vignette: 0.62,
  },
  {
    name: 'jante-sudura',
    src: 'assets-src/photos/hd/jante-sudura.jpg',
    crop: { left: 0, top: 0, width: 600, height: 400 },
    width: 1500,
    height: 1000,
    widths: [600, 900, 1200, 1500],
    saturation: 0.82,
    brightness: 0.92,
    contrast: 1.14,
    lift: -6,
    vignette: 0.55,
  },
];
