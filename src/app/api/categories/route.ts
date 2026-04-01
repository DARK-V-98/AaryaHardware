
import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 * Returns a list of all product categories.
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
    const categoriesCol = collection(firestore, 'categories');
    const q = query(categoriesCol, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);

    const categories = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        created_at: data.createdAt?.toDate?.() || null,
      };
    });

    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
