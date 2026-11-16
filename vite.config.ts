import { defineConfig, loadEnv, type Plugin } from 'vite';
import {
  renderDial,
  renderServices,
  replacePhotos,
  replaceTokens,
  robotsTxt,
  seoHead,
  sitemapXml,
  structuredData,
} from './src/build/render.ts';

function forcecarSite(siteUrl?: string): Plugin {
  return {
    name: 'forcecar-site',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const services = renderServices();
        return replaceTokens(
          replacePhotos(html)
            .replace('<!--@seo-->', seoHead(siteUrl))
            .replace('<!--@jsonld-->', structuredData(siteUrl))
            .replace('<!--@services-note-->', services.note)
            .replace('<!--@services-->', services.cards)
            .replace('<!--@dial-->', renderDial()),
        );
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) });
      if (siteUrl) {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
      } else {
        this.warn('SITE_URL is not set: canonical URL, og:image and sitemap.xml were skipped.');
      }
    },
  };
}

/** Inlines the single page stylesheet and preloads the hero headline font. */
function criticalAssetsPlugin(): Plugin {
  return {
    name: 'forcecar-critical-assets',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle ?? {};
        let output = html;
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (asset.type !== 'asset' || !fileName.endsWith('.css')) continue;
          const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${fileName}"[^>]*>`);
          if (!link.test(output)) continue;
          output = output.replace(link, () => `<style>${String(asset.source)}</style>`);
          delete bundle[fileName];
        }
        const font = Object.keys(bundle).find((name) => /barlow-condensed-latin-700-normal.*\.woff2$/.test(name));
        if (!font) return output;
        return {
          html: output,
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${font}`, crossorigin: '' },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.SITE_URL?.replace(/\/+$/, '') || undefined;
  return {
    plugins: [forcecarSite(siteUrl), criticalAssetsPlugin()],
    build: {
      target: 'es2020',
      cssMinify: true,
      assetsInlineLimit: 0,
    },
  };
});
