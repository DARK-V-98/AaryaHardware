
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Advanced endpoint for listing products with filtering, search, and pagination.
 * 
 * Query Parameters:
 * - category_id: Filter by category ID
 * - is_featured: Filter by featured status (true/false)
 * - q: Search term for product name
 * - limit: Number of results (default: 50)
 * - offset: Number of results to skip (default: 0)
 * 
 * Authentication: Requires 'x-api-key' header.
 */
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const validKey = process.env.CHATBOT_API_KEY || 'aarya-bathware-chatbot-key-2025';

  if (apiKey !== validKey) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Invalid or missing x-api-key header.' },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const isFeatured = searchParams.get('is_featured');
    const searchTerm = searchParams.get('q')?.toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let productsCol = collection(firestore, 'products');
    let q = query(productsCol, orderBy('name', 'asc'));

    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }
    
    if (isFeatured !== null) {
      const featuredBool = isFeatured === 'true';
      q = query(q, where('featured', '==', featuredBool));
    }

    const querySnapshot = await getDocs(q);

    let products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        name_sinhala: data.name_si || null,
        description: data.description,
        description_sinhala: data.description_si || null,
        price: data.price,
        discount_price: data.discountPrice || null,
        quantity: data.quantity,
        category_id: data.categoryId,
        image_url: data.imageUrl,
        additional_images: data.additionalImageUrls || [],
        is_featured: data.featured || false,
        created_at: data.createdAt?.toDate?.() || null,
      };
    });

    // Apply client-side search (Firestore doesn't support partial string matches natively without third-party services)
    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        (p.name_sinhala && p.name_sinhala.includes(searchTerm))
      );
    }

    const totalCount = products.length;
    const paginatedProducts = products.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      pagination: {
        total: totalCount,
        limit,
        offset,
        count: paginatedProducts.length
      },
      data: paginatedProducts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
