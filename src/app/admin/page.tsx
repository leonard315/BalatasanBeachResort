'use client';
import { useUser } from '@/firebase';
import { useUserById, useAllBookings } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import type { Booking } from '@/lib/types';

function AdminBookingsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-1 h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1 h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1 h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-6 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
    const { data: bookingUser, isLoading } = useUserById(booking.userId);

    if (isLoading) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
            </TableRow>
        )
    }

    const getStatusVariant = (
        status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
          case 'confirmed':
            return 'default';
          case 'completed':
            return 'secondary';
          case 'cancelled':
          case 'no_show':
            return 'destructive';
          case 'pending':
            return 'outline';
          default:
            return 'outline';
        }
      };
      
    return (
        <TableRow key={booking.id}>
            <TableCell>
                <div className="font-medium">{bookingUser?.firstName} {bookingUser?.lastName}</div>
                <div className="text-sm text-muted-foreground">{bookingUser?.email}</div>
            </TableCell>
            <TableCell>
              <p className="font-medium">{booking.item_name}</p>
              <p className="text-sm text-muted-foreground">
                Ref: {booking.booking_reference}
              </p>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {new Date(booking.check_in_date).toLocaleDateString()}
              </div>
              {booking.check_out_date && (
                <div className="text-sm text-muted-foreground">
                  to{' '}
                  {new Date(
                    booking.check_out_date
                  ).toLocaleDateString()}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(booking.booking_status)}>
                {booking.booking_status.replace(/_/g, ' ')}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              ${booking.total_amount.toFixed(2)}
            </TableCell>
        </TableRow>
    )
}

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const { data: userProfile, isLoading: isProfileLoading } = useUserById(user?.uid || null);
  const { data: allBookings, isLoading: bookingsLoading } = useAllBookings();

  const isLoading = isUserLoading || isProfileLoading || bookingsLoading;
  const isAdmin = userProfile?.userType === 'admin';

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          View and manage all user bookings.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bookingsLoading ? <AdminBookingsSkeleton /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBookings?.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {allBookings?.length === 0 && !bookingsLoading && (
        <div className="py-16 text-center text-muted-foreground">
          There are no bookings yet.
        </div>
      )}
    </div>
  );
}
