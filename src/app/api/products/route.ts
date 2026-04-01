
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Returns a list of all products in the database.
 * Requires 'x-api-key' header for authentication.
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
    const productsCol = collection(firestore, 'products');
    const q = query(productsCol, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(doc => {
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
        is_featured: data.featured || false,
        created_at: data.createdAt?.toDate?.() || null,
      };
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
