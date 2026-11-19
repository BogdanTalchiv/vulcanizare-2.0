import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { autoService } from './src/data/business.ts';
import { consentServices, readConsentEnv, type ConsentService } from './src/data/consent.ts';
import {
  normalizeSiteUrl,
  pagePublicPath,
  privacyStructuredData,
  renderAutoService,
  renderConsentUi,
  renderCookieTable,
  renderDial,
  renderFooter,
  renderPrices,
  renderServices,
  replacePhotos,
  replaceTokens,
  robotsTxt,
  seoHead,
  sitemapXml,
  structuredData,
} from './src/build/render.ts';

function forcecarSite(siteUrl: string | undefined, services: ConsentService[]): Plugin {
  return {
    name: 'forcecar-site',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const path = pagePublicPath(ctx.path);
        const page = replacePhotos(html)
          .replace('<!--@seo-->', () => seoHead(siteUrl, path))
          .replace('<!--@footer-->', () => renderFooter(services))
          .replace('<!--@consent-->', () => renderConsentUi(services))
          .replace('<!--@cookie-table-->', () => renderCookieTable(services));

        if (page.includes('<!--@services-->')) {
          const offer = renderServices();
          const auto = renderAutoService();
          return replaceTokens(
            page
              .replace('<!--@jsonld-->', () => structuredData(siteUrl))
              .replace('<!--@services-note-->', () => offer.note)
              .replace('<!--@services-->', () => offer.cards)
              .replace('<!--@autoservice-list-->', () => auto.list)
              .replace('<!--@autoservice-cta-->', () => auto.cta)
              .replace('<!--@prices-->', () => renderPrices())
              .replace('<!--@dial-->', () => renderDial()),
          );
        }

        return replaceTokens(page.replace('<!--@jsonld-->', () => (path === '/confidentialitate/' ? privacyStructuredData(siteUrl) : '')));
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) });
      if (siteUrl) {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
      } else {
        this.warn('SITE_URL is not set: canonical URL, og:image and sitemap.xml were skipped. Set SITE_URL=https://your-domain.md in .env before production deploy.');
      }
      if (!autoService.url) {
        this.warn('autoService.url is empty: the Service auto button is shown as "În curând".');
      }
    },
  };
}

/** Inlines the shared stylesheet into every page and preloads the headline font. */
function criticalAssetsPlugin(): Plugin {
  const inlined = new Set<string>();
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
          inlined.add(fileName);
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
    generateBundle(_, bundle) {
      for (const fileName of inlined) delete bundle[fileName];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.SITE_URL);
  const services = consentServices(readConsentEnv(env));
  return {
    plugins: [forcecarSite(siteUrl, services), criticalAssetsPlugin()],
    build: {
      target: 'es2020',
      cssMinify: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          privacy: resolve(import.meta.dirname, 'confidentialitate/index.html'),
          notFound: resolve(import.meta.dirname, '404.html'),
        },
      },
    },
  };
});
