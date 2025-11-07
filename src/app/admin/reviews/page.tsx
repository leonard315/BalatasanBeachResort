'use client';
import { useUserById, useAllReviews } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { MoreHorizontal, Loader2, ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Review } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { updateReviewApproval } from './actions';
import { startTransition } from 'react';

function ReviewsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Author</TableHead>
          <TableHead>Review</TableHead>
          <TableHead>Rating</TableHead>
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

function ReviewRow({ review }: { review: Review }) {
    const { data: reviewUser, isLoading: isUserLoading } = useUserById(review.userId);
    const { toast } = useToast();

    const handleApprovalChange = async (isApproved: boolean) => {
        startTransition(async () => {
            const result = await updateReviewApproval(review.id, isApproved);
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
        <TableRow key={review.id}>
            <TableCell>
                <div className="font-medium">{reviewUser?.firstName} {reviewUser?.lastName}</div>
                <div className="text-sm text-muted-foreground">{reviewUser?.email}</div>
            </TableCell>
             <TableCell>
                <div className="font-medium">{review.title}</div>
                <div className="text-sm text-muted-foreground max-w-xs truncate">{review.comment}</div>
            </TableCell>
            <TableCell>
                {Array.from({length: review.rating}).map((_, i) => "⭐")}
            </TableCell>
            <TableCell>
                <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                    {review.isApproved ? 'Approved' : 'Pending'}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleApprovalChange(true)}><CheckCircle className="mr-2"/>Approve</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleApprovalChange(false)} className="text-destructive"><XCircle className="mr-2"/>Unapprove</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useAllReviews();

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Manage Reviews
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Approve or unapprove user-submitted reviews.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <ReviewsSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews?.map((review) => (
                  <ReviewRow key={review.id} review={review} />
                ))}
              </TableBody>
            </Table>
          )}
          {reviews?.length === 0 && !isLoading && (
            <div className="py-16 text-center text-muted-foreground">
              No reviews found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
