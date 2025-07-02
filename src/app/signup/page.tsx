
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, Droplet } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Password must be at least 6 characters long.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: 'customer',
      });

      toast({ title: 'Signup Successful' });
      router.push('/admin');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          title: 'Signup Failed',
          description: 'An account with this email already exists. Please use the login page.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
     <div className="mx-auto grid w-full max-w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl font-headline">
             <Droplet className="h-7 w-7 text-primary" />
             Aarya Hardware
           </Link>
         <h1 className="text-3xl font-bold mt-4">Sign Up</h1>
         <p className="text-balance text-muted-foreground">
           Create an account to get started
         </p>
       </div>
       <form onSubmit={handleSignup} className="grid gap-4">
         <div className="grid gap-2">
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             type="email"
             placeholder="m@example.com"
             required
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             disabled={loading}
           />
         </div>
         <div className="grid gap-2">
           <Label htmlFor="password">Password</Label>
           <Input 
             id="password" 
             type="password" 
             required 
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             disabled={loading}
             />
         </div>
         <Button type="submit" className="w-full" disabled={loading}>
           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           Create an account
         </Button>
       </form>
       <div className="mt-4 text-center text-sm">
         Already have an account?{" "}
         <Link href="/login" className="underline">
           Login
         </Link>
       </div>
     </div>
   </div>
  );
}
