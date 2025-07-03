
import { MetadataRoute } from 'next'
 
// This file generates the sitemap.xml for the website.
// Next.js automatically serves it at the /sitemap.xml route.
const URL = 'https://www.aaryahardware.lk';

export default function sitemap(): MetadataRoute.Sitemap {
  
  // Define static routes with their SEO properties
  const staticRoutes = [
    { url: '/', changeFrequency: 'weekly', priority: 1.0 },
    { url: '/products', changeFrequency: 'weekly', priority: 0.9 },
    { url: '/login', changeFrequency: 'yearly', priority: 0.5 },
    { url: '/signup', changeFrequency: 'yearly', priority: 0.5 },
    { url: '/forgot-password', changeFrequency: 'yearly', priority: 0.5 },
    { url: '/checkout', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/profile', changeFrequency: 'monthly', priority: 0.6 },
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // For a dynamic application, you would also fetch product and category routes
  // from your database and add them to the sitemap here.
  
  return staticEntries;
}
