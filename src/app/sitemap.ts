
import { MetadataRoute } from 'next'
 
const URL = 'https://aarya-bathware.firebaseapp.com';

export default function sitemap(): MetadataRoute.Sitemap {
  
  const routes = [
    '/',
    '/products',
    '/login',
    '/signup',
    '/forgot-password',
    '/checkout',
    '/profile'
  ];

  const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));

  // In a real application, you would fetch dynamic routes (e.g., product pages) 
  // from a database and add them to the sitemap here.
  
  return routeEntries;
}
