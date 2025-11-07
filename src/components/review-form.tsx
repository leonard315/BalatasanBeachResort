'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useState } from 'react';
import { submitReview, type ReviewState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InteractiveStarRating } from '@/components/star-rating';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import type { User } from 'firebase/auth';
import { Input } from './ui/input';

interface ReviewFormProps {
  itemId: string;
  itemType: 'accommodation' | 'tour';
  user: User;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Review
    </Button>
  );
}

export function ReviewForm({ itemId, itemType, user }: ReviewFormProps) {
  const initialState: ReviewState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: "Success",
        description: state.message,
      });
      // Optionally reset form state here if needed
    } else if (!state.success && state.message) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive"
      });
    }
  }, [state, toast]);

  if (state.success && state.aiResponse) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
             <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Thank you for your review!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            It has been submitted successfully and will be visible shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="itemType" value={itemType} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="userId" value={user.uid} />
      <input type="hidden" name="userName" value={user.displayName || 'Anonymous'} />
      <input type="hidden" name="userAvatar" value={user.photoURL || ''} />

      <div className="space-y-2">
        <Label htmlFor="rating">Your Rating</Label>
        <InteractiveStarRating rating={rating} setRating={setRating} />
        {state.errors?.rating && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.rating[0]}
          </p>
        )}
      </div>

       <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="A brief title for your review"
        />
        {state.errors?.title && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.title[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reviewText">Your Review</Label>
        <Textarea
          id="reviewText"
          name="reviewText"
          placeholder="Tell us about your experience..."
          rows={5}
        />
        {state.errors?.reviewText && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.reviewText[0]}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
