
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2, ShieldCheck, User } from "lucide-react";
import { UserColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { UserData } from "@/lib/data";
import { useAuth } from "@/context/auth-context";

interface CellActionProps {
  data: UserColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const onRoleChange = async (newRole: UserData['role']) => {
    if (data.id === currentUser?.uid) {
        toast({ title: "Error", description: "You cannot change your own role.", variant: "destructive" });
        return;
    }

    try {
      setLoading(true);
      
      const userDocRef = doc(firestore, 'users', data.id);
      await updateDoc(userDocRef, { role: newRole });

      toast({ title: "Role Updated", description: `User role has been successfully changed to ${newRole}.` });
    } catch (error: any) {
      console.error("Role change error:", error);
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => onRoleChange('admin')} 
            disabled={loading || data.role === 'admin'}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Make Admin
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onRoleChange('customer')} 
            disabled={loading || data.role === 'customer'}
          >
            <User className="mr-2 h-4 w-4" />
            Make Customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
