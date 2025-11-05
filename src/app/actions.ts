
'use server';

import { moderateReview as moderateReviewFlow } from '@/ai/flows/review-moderation-and-suggestions';
import { z } from 'zod';
import type { ModerateReviewOutput } from '@/ai/flows/review-moderation-and-suggestions';
import { revalidatePath } from 'next/cache';

const ReviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters long."),
  itemId: z.string(),
  itemType: z.enum(['accommodation', 'tour']),
});

export type ReviewState = {
  errors?: {
    rating?: string[];
    reviewText?: string[];
  };
  message?: string | null;
  aiResponse?: ModerateReviewOutput | null;
  success?: boolean;
};

export async function submitReview(
  prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const validatedFields = ReviewSchema.safeParse({
    rating: formData.get('rating'),
    reviewText: formData.get('reviewText'),
    itemId: formData.get('itemId'),
    itemType: formData.get('itemType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to submit review. Please check the fields.',
      success: false,
    };
  }

  try {
    const aiResponse = await moderateReviewFlow(validatedFields.data);
    
    // In a real application, you would now save the `aiResponse.revisedReviewText`
    // and other details to your database.
    // For this demo, we'll just simulate success.
    
    revalidatePath(`/accommodations/${validatedFields.data.itemId}`);
    
    return {
        message: 'Thank you for your review! It has been submitted for moderation.',
        aiResponse,
        success: true,
    }
  } catch (error) {
    console.error('Review submission error:', error);
    return {
      message: 'An error occurred while processing your review. Please try again later.',
      success: false,
    };
  }
}
