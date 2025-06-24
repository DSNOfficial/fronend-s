const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://tsnh.gov.kh' });
  const writeStream = createWriteStream('./public/sitemap.xml');

  sitemap.pipe(writeStream);

  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/page/books', changefreq: 'weekly', priority: 0.8 });
  sitemap.write({ url: '/page/patient-out', changefreq: 'weekly', priority: 0.7 });
  sitemap.write({ url: '/page/patient-in', changefreq: 'weekly', priority: 0.6 });
  sitemap.write({ url: '/page/contact', changefreq: 'monthly', priority: 0.5 });
  sitemap.write({ url: '/page/trainers', changefreq: 'monthly', priority: 0.4 });

  sitemap.end();

  await streamToPromise(sitemap); // Use the sitemap stream, not writeStream

  console.log('✅ Sitemap generated at /public/sitemap.xml');
})();
