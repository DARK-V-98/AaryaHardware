
'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
    } catch (error: any) {
      // To prevent user enumeration (figuring out which emails are registered),
      // we show a generic success message even if the user is not found.
      // You can change this behavior if you prefer to show an explicit error.
      if (error.code === 'auth/user-not-found') {
         toast({
            title: 'Password Reset Email Sent',
            description: 'If an account with this email exists, a reset link has been sent.',
        });
      } else {
         toast({ title: 'Error', description: 'An unexpected error occurred. Please try again.', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
         <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 text-2xl font-bold mb-2">
                <Image src="/ah.png" alt="Aarya Bathware Logo" width={40} height={40} />
                Aarya Bathware
            </Link>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email to receive a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="grid gap-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
