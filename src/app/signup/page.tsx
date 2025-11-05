'use client';
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { signup, type SignupState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Create an account
    </Button>
  );
}

export default function SignupPage() {
  const { toast } = useToast();
  const initialState: SignupState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(signup, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'Account created successfully!',
      });
    } else if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" placeholder="Max" required />
                {state?.errors?.firstName && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.firstName[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" placeholder="Robinson" required />
                {state?.errors?.lastName && (
                  <p className="text-sm font-medium text-destructive">
                    {state.errors.lastName[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
              {state?.errors?.password && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" />
              {state?.errors?.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    