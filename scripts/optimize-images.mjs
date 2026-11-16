import { execFile } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';
import { gradePhoto, photos } from './grade-photos.mjs';

const OUT = 'public/img';

/** Posters are the first frame of each hero video, so the swap to video playback is seamless. */
const posters = [
  { video: 'public/video/backgrounddesktop.mp4', name: 'hero-poster-desktop', widths: [960, 1440, 1920] },
  { video: 'public/video/backgroundmobile.mp4', name: 'hero-poster-mobile', widths: [480, 720] },
];

await mkdir(OUT, { recursive: true });

async function firstFrame(video) {
  const { stdout } = await promisify(execFile)(
    ffmpeg,
    ['-loglevel', 'error', '-i', video, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'],
    { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 },
  );
  return stdout;
}

async function writeVariants(input, name, widths) {
  for (const width of widths) {
    const base = sharp(input).resize({ width, withoutEnlargement: true });
    await Promise.all([
      base.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${name}-${width}.avif`),
      base.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${name}-${width}.webp`),
      base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(`${OUT}/${name}-${width}.jpg`),
    ]);
  }
}

for (const poster of posters) {
  await writeVariants(await firstFrame(poster.video), poster.name, poster.widths);
}

for (const photo of photos) {
  const graded = await (await gradePhoto(photo.src, photo)).png().toBuffer();
  await writeVariants(graded, photo.name, photo.widths);
}

const mark = await readFile('public/favicon.svg');
await sharp(mark, { density: 512 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(mark, { density: 512 }).resize(512, 512).png().toFile(`${OUT}/forcecar-mark-512.png`);

console.log('Images written to', OUT);
