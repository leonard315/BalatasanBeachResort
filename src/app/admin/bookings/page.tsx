'use client';
import { useUserById, useAllBookings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Loader2, Check, X, Hourglass, CalendarCheck2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Booking } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { updateBookingStatus } from './actions';
import { startTransition } from 'react';

function BookingsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-48" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-8 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
    const { data: bookingUser, isLoading: isUserLoading } = useUserById(booking.userId);
    const { toast } = useToast();

    const handleStatusChange = async (newStatus: Booking['booking_status']) => {
        startTransition(async () => {
            const result = await updateBookingStatus(booking.userId, booking.id, newStatus);
            if (result.success) {
                toast({
                    title: 'Success!',
                    description: result.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.message,
                });
            }
        });
    };

    const getStatusVariant = (status: Booking['booking_status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'confirmed': return 'default';
            case 'completed': return 'secondary';
            case 'cancelled': case 'no_show': return 'destructive';
            case 'pending': return 'outline';
            default: return 'outline';
        }
    };

    if (isUserLoading) {
         return (
            <TableRow>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
            </TableRow>
        );
    }
    
    return (
        <TableRow key={booking.id}>
            <TableCell>
                <div className="font-medium">{bookingUser?.firstName} {bookingUser?.lastName}</div>
                <div className="text-sm text-muted-foreground">{bookingUser?.email}</div>
            </TableCell>
            <TableCell>
                <p className="font-medium">{booking.item_name}</p>
                <p className="text-sm text-muted-foreground">Ref: {booking.booking_reference}</p>
            </TableCell>
            <TableCell>
                {new Date(booking.check_in_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(booking.booking_status)}>
                    {booking.booking_status.replace(/_/g, ' ')}
                </Badge>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleStatusChange('pending')}><Hourglass className="mr-2"/>Pending</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange('confirmed')}><Check className="mr-2"/>Confirm</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange('completed')}><CalendarCheck2 className="mr-2"/>Complete</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleStatusChange('cancelled')} className="text-destructive"><X className="mr-2"/>Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useAllBookings();

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Manage Bookings
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          View and update the status of all bookings.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <BookingsSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </TableBody>
            </Table>
          )}
          {bookings?.length === 0 && !isLoading && (
            <div className="py-16 text-center text-muted-foreground">
              No bookings found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
