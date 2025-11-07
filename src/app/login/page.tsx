'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { login, type LoginState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPlaceholderImage } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { auth, firebaseApp } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateUser } from '@/lib/data';

/**
 * Helper function to determine redirect path based on user email
 * Admin users are redirected to /admin, regular users to /bookings
 */
function getRedirectPath(email: string): string {
  return email === 'admin@balatasan.com' ? '/admin' : '/bookings';
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
      suppressHydrationWarning
    >
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Login
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: LoginState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(login, initialState);

  useEffect(() => {
    // One-time debug log to verify the project ID
    if (firebaseApp) {
      console.log('Firebase App is connected to Project ID:', firebaseApp.options.projectId);
    }
  }, []);

  useEffect(() => {
    async function handleLogin() {
      if (state.success && state.data && auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            state.data.email,
            state.data.password
          );
          const user = userCredential.user;
          // Create user document if it doesn't exist
          await createOrUpdateUser(user);
          // Redirect based on user role
          const redirectPath = getRedirectPath(user.email || '');
          router.push(redirectPath);
        } catch (e) {
          const error = e as AuthError;
          let description = error.message;
          if (error.code === 'auth/invalid-credential') {
            description =
              'The email or password you entered is incorrect. Please check your credentials and try again.';
          } else if (error.code === 'auth/operation-not-allowed') {
             description =
              'Email/Password authentication is not enabled. Please check your Firebase project settings.';
          }
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description,
          });
        }
      } else if (!state.success && state.message) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: state.message,
        });
      }
    }
    handleLogin();
  }, [state, router, toast]);

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Create user document if it doesn't exist
      await createOrUpdateUser(result.user);
      // Redirect based on user role
      const redirectPath = getRedirectPath(result.user.email || '');
      router.push(redirectPath);
    } catch (e) {
       const error = e as AuthError;
       let description = error.message;
        if (error.code === 'auth/operation-not-allowed') {
            description =
             'Google Sign-In is not enabled. Please check your Firebase project settings.';
        }
      console.error('Google login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: description,
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-57px)] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="font-headline text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form action={dispatch} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                suppressHydrationWarning
              />
              {state?.errors?.email && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                suppressHydrationWarning
              />
              {state?.errors?.password && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            {state?.message && !state.success && (
              <p className="text-sm font-medium text-destructive">
                {state.message}
              </p>
            )}
            <SubmitButton />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              suppressHydrationWarning
            >
              Login with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={getPlaceholderImage('login-background').imageUrl}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="beach background"
        />
      </div>
    </div>
  );
}
