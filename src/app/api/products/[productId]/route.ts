
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[productId]
 * Returns details for a single product.
 * Requires 'x-api-key' header for authentication.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const apiKey = request.headers.get('x-api-key');
  const validKey = process.env.CHATBOT_API_KEY || 'aarya-bathware-chatbot-key-2025';

  if (apiKey !== validKey) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized.' },
      { status: 401 }
    );
  }

  const { productId } = params;

  try {
    const docRef = doc(firestore, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const product = {
      id: docSnap.id,
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

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
