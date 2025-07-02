'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import { Product } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Loader2 } from 'lucide-react';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const prods: Product[] = [];
        querySnapshot.forEach((doc) => {
          prods.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prods);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.quantity <= LOW_STOCK_THRESHOLD && product.quantity > 0
  );
  
  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total products in your store</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items with 5 or less stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Items with no stock left</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
                {lowStockProducts.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead className="text-right">Quantity Left</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStockProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                      <Link href={`/admin/products/${product.id}`} className="hover:underline font-medium">
                                        {product.name}
                                      </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={product.quantity <= 2 ? 'destructive' : 'secondary'}>
                                            {product.quantity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground">No items are currently low on stock. Well done!</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
