import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
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

  return allPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: page.priority,
  }));
}
