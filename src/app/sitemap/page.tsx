import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sitemap - MonBaril™',
    description: 'Plan du site MonBaril - Navigation facile vers tous nos produits et pages',
    robots: 'noindex, nofollow'
  };
}

export default function SitemapPage() {
  const baseUrl = 'https://monbaril.fr';
  
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/collections', priority: 0.9, changefreq: 'weekly' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/terms', priority: 0.5, changefreq: 'yearly' },
    { url: '/privacy', priority: 0.5, changefreq: 'yearly' },
    { url: '/login', priority: 0.6, changefreq: 'monthly' },
    { url: '/signup', priority: 0.6, changefreq: 'monthly' },
    { url: '/cart', priority: 0.8, changefreq: 'daily' },
    { url: '/profile', priority: 0.7, changefreq: 'weekly' },
    { url: '/orders', priority: 0.7, changefreq: 'weekly' },
    { url: '/favorites', priority: 0.7, changefreq: 'weekly' }
  ];

  const categories = [
    { url: '/collections/racing', priority: 0.8, changefreq: 'weekly' },
    { url: '/collections/military', priority: 0.8, changefreq: 'weekly' },
    { url: '/collections/vintage', priority: 0.8, changefreq: 'weekly' }
  ];

  const allPages = [...staticPages, ...categories];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sitemap XML</h1>
          <p className="text-gray-600 mb-6">
            Voici le sitemap XML généré automatiquement pour MonBaril™
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">URL du sitemap :</h2>
            <code className="text-blue-600 break-all">
              {baseUrl}/sitemap.xml
            </code>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Pages incluses :</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {allPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{baseUrl}{page.url || '/'}</span>
                  <span className="text-sm text-gray-500">Priorité: {page.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions :</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Ajoutez <code className="bg-blue-100 px-1 rounded">{baseUrl}/sitemap.xml</code> à Google Search Console</li>
              <li>• Le sitemap est automatiquement mis à jour</li>
              <li>• Les pages produits seront ajoutées dynamiquement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
