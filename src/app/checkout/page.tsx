'use client';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getWaterSports } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Landmark,
  CircleDollarSign,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { processBooking, type BookingState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Confirm & Pay
    </Button>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activityId');
  const allActivities = getWaterSports();
  const { toast } = useToast();

  const activity = allActivities.find((a) => a.id === activityId);

  const initialState: BookingState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(processBooking, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Booking Confirmed!',
        description: state.message,
      });
      // In a real app, you might redirect:
      // router.push('/bookings');
    } else if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  if (!activity) {
    return (
      <div className="container mx-auto py-8 text-center md:py-12">
        <h1 className="font-headline text-2xl font-bold">Activity not found</h1>
        <p className="text-muted-foreground">
          The requested water sport could not be found.
        </p>
      </div>
    );
  }
  
  if (state.success) {
    return (
        <div className="container mx-auto py-8 md:py-12">
            <Card className="mx-auto max-w-lg">
                <CardHeader className="items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <CardTitle className="text-2xl">Booking Successful!</CardTitle>
                    <CardDescription>
                        Your booking for {activity.name} has been confirmed. You will receive an email with the details shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/bookings">View My Bookings</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }


  const formatPrice = (price: number) => `₱${price.toLocaleString()}`;
  const price = activity.price ?? activity.basePrice ?? 0;
  const serviceFee = price * 0.05;
  const total = price + serviceFee;

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-headline mb-8 text-3xl font-bold tracking-tight md:text-4xl">
          Complete Your Booking
        </h1>
        <form action={dispatch} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <input type="hidden" name="activityId" value={activity.id} />
          <div className="space-y-8 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Juan Dela Cruz" />
                    {state.errors?.name && (
                      <p className="text-sm font-medium text-destructive">
                        {state.errors.name[0]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="juan@example.com"
                    />
                    {state.errors?.email && (
                      <p className="text-sm font-medium text-destructive">
                        {state.errors.email[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Input id="date" name="date" type="date" />
                  {state.errors?.date && (
                    <p className="text-sm font-medium text-destructive">
                      {state.errors.date[0]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you'd like to pay for your activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup name="paymentMethod" className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Credit/Debit
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="gcash"
                      id="gcash"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="gcash"
                      className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CircleDollarSign className="mb-3 h-6 w-6" />
                      GCash
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="paymaya"
                      id="paymaya"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="paymaya"
                      className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CircleDollarSign className="mb-3 h-6 w-6" />
                      PayMaya
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="onsite"
                      id="onsite"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="onsite"
                      className="flex h-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Landmark className="mb-3 h-6 w-6" />
                      On-site
                    </Label>
                  </div>
                </RadioGroup>
                 {state.errors?.paymentMethod && (
                    <p className="pt-2 text-sm font-medium text-destructive">
                      {state.errors.paymentMethod[0]}
                    </p>
                  )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Label>Payment Option</Label>
                <Select name="paymentOption" defaultValue="full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Pay full amount</SelectItem>
                    <SelectItem value="partial">Pay 50% downpayment</SelectItem>
                  </SelectContent>
                </Select>
                 {state.errors?.paymentOption && (
                    <p className="text-sm font-medium text-destructive">
                      {state.errors.paymentOption[0]}
                    </p>
                  )}
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span className="text-muted-foreground">
                    {formatPrice(serviceFee)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
