
'use client';

import { useState } from 'react';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Order } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: Order['status'];
}

const statuses: Order['status'][] = ['Pending Payment', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

export function StatusUpdater({ orderId, currentStatus }: StatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(currentStatus);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;
    setLoading(true);
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: selectedStatus,
        updatedAt: serverTimestamp(),
      });
      toast({ title: 'Status Updated', description: 'Order status has been successfully updated.' });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Order['status'])} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(status => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={loading || selectedStatus === currentStatus} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Status
      </Button>
    </div>
  );
}
