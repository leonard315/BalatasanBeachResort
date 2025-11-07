'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/firebase/server';

export async function updateReviewApproval(
  reviewId: string,
  isApproved: boolean
): Promise<{ success: boolean; message: string }> {
  if (!reviewId) {
    return { success: false, message: 'Missing review ID.' };
  }

  try {
    const reviewRef = adminDb.collection('reviews').doc(reviewId);
    await reviewRef.update({ isApproved: isApproved });

    revalidatePath('/admin/reviews');
    revalidatePath('/admin');
    // Also revalidate the specific accommodation page if the item is an accommodation
    // This requires fetching the review to get the itemId, or passing it in.
    // For now, we'll stick to revalidating the admin pages.

    return { success: true, message: `Review status updated.` };
  } catch (error) {
    console.error('Error updating review status:', error);
    return {
      success: false,
      message: 'An error occurred while updating the review status.',
    };
  }
}
