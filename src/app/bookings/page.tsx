import Image from 'next/image';
import { getBookings } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BookingsPage() {
  const bookings = getBookings();

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
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          My Bookings
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Here is a list of your past and upcoming reservations.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Item</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-4">
                      <Image
                        src={getPlaceholderImage(booking.item_image).imageUrl}
                        alt={booking.item_name}
                        width={100}
                        height={75}
                        className="rounded-md object-cover"
                        data-ai-hint="resort booking"
                      />
                      <div>
                        <p className="font-medium">{booking.item_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Ref: {booking.booking_reference}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium md:hidden">{booking.item_name}</div>
                     <div className="text-sm text-muted-foreground md:hidden">Ref: {booking.booking_reference}</div>
                    <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                      {booking.number_of_guests} Guest(s)
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </div>
                    {booking.check_out_date && (
                      <div className="text-sm text-muted-foreground">
                        to {new Date(booking.check_out_date).toLocaleDateString()}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       {bookings.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            You have no bookings yet.
          </div>
        )}
    </div>
  );
}
