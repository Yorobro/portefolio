import type { RequestHandler } from './$types';
import { useCases, appConfig } from '$lib/composition-root';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const baseUrl = appConfig.publicSiteUrl.replace(/\/$/, '');
  const staticPaths = ['/', '/projets', '/parcours', '/competences'];
  const projects = await useCases.listProjects({});
  const projectPaths: string[] = [];
  if (projects.ok) {
    for (const p of projects.value) {
      projectPaths.push(`/projets/${p.slug.toString()}`);
    }
  }
  const urls = [...staticPaths, ...projectPaths];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${baseUrl}${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
