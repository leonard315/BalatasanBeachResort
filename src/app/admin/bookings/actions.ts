'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/firebase/server';
import type { Booking } from '@/lib/types';

export async function updateBookingStatus(
  userId: string,
  bookingId: string,
  status: Booking['booking_status']
): Promise<{ success: boolean; message: string }> {
  if (!userId || !bookingId || !status) {
    return { success: false, message: 'Missing required fields.' };
  }

  try {
    const bookingRef = adminDb.collection('users').doc(userId).collection('bookings').doc(bookingId);
    await bookingRef.update({ booking_status: status });

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    revalidatePath('/bookings'); // For the user's view

    return { success: true, message: `Booking status updated to ${status}.` };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return {
      success: false,
      message: 'An error occurred while updating the booking status.',
    };
  }
}
