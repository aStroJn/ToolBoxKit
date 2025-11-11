/* global process */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Define all routes of the application
const routes = [
  '',
  '/calculator',
  '/SimpleCalculatorPage',
  '/InterestCalculatorPage',
  '/converter',
  '/digital',
  '/unit-converter',
  '/about'
];

// Base URL (update this to your production domain)
const baseUrl = process.env.SITE_URL || 'https://toolboxkit.com';

// Generate sitemap XML
const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Block access to sensitive files
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
Disallow: /_redirects

# Allow search engines to crawl CSS and JS
Allow: /assets/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.ico$
`;
};

// Main function
const main = () => {
  try {
    // Ensure dist directory exists
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }

    // Generate sitemap
    const sitemap = generateSitemap();
    writeFileSync(join('dist', 'sitemap.xml'), sitemap);
    console.log('✅ Generated sitemap.xml');

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    writeFileSync(join('dist', 'robots.txt'), robotsTxt);
    console.log('✅ Generated robots.txt');

    // Generate version file
    const versionInfo = {
      version: process.env.npm_package_version || '1.0.0',
      buildTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      gitCommit: process.env.GIT_COMMIT || 'unknown'
    };
    writeFileSync(join('dist', 'version.json'), JSON.stringify(versionInfo, null, 2));
    console.log('✅ Generated version.json');

    console.log('\n🎉 All SEO files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
  }
};

main();
