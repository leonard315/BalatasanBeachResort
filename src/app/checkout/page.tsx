'use client';
import { useSearchParams } from 'next/navigation';
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
import { CreditCard, Landmark, CircleDollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activityId');
  const allActivities = getWaterSports();

  const activity = allActivities.find((a) => a.id === activityId);

  if (!activity) {
    return (
      <div className="container mx-auto py-8 md:py-12 text-center">
        <h1 className="font-headline text-2xl font-bold">Activity not found</h1>
        <p className="text-muted-foreground">
          The requested water sport could not be found.
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => `₱${price.toLocaleString()}`;

  const price = activity.price ?? activity.basePrice ?? 0;
  const serviceFee = price * 0.05;
  const total = price + serviceFee;

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl mb-8">
          Complete Your Booking
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Juan Dela Cruz" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="juan@example.com" />
                  </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Input id="date" type="date" />
                  </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose how you'd like to pay for your activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Credit/Debit Card
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Landmark className="mb-3 h-6 w-6" />
                      On-site Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
               <CardFooter className="flex-col items-start gap-4">
                  <Label>Payment Option</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Pay full amount</SelectItem>
                      <SelectItem value="partial">Pay 50% downpayment</SelectItem>
                    </SelectContent>
                  </Select>
               </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Price</span>
                  <span>{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className='text-muted-foreground'>Service Fee (5%)</span>
                  <span className='text-muted-foreground'>{formatPrice(serviceFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Confirm & Pay</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
