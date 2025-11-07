'use server';

import { moderateReview as moderateReviewFlow } from '@/ai/flows/review-moderation-and-suggestions';
import { z } from 'zod';
import type { ModerateReviewOutput } from '@/ai/flows/review-moderation-and-suggestions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { adminDb } from '@/firebase/server';

const ReviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required.').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  reviewText: z.string().min(10, 'Review must be at least 10 characters long.'),
  itemId: z.string(),
  itemType: z.enum(['accommodation', 'tour']),
  userId: z.string().min(1, 'User must be logged in.'),
  userName: z.string().min(1, 'User name is required.'),
  userAvatar: z.string().url('Invalid user avatar URL.').or(z.literal('')),
});

export type ReviewState = {
  errors?: {
    rating?: string[];
    title?: string[];
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
    title: formData.get('title'),
    reviewText: formData.get('reviewText'),
    itemId: formData.get('itemId'),
    itemType: formData.get('itemType'),
    userId: formData.get('userId'),
    userName: formData.get('userName'),
    userAvatar: formData.get('userAvatar'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to submit review. Please check the fields.',
      success: false,
    };
  }

  const { reviewText, rating, itemType, itemId, userId, userName, userAvatar, title } =
    validatedFields.data;

  try {
    const aiResponse = await moderateReviewFlow({
      reviewText,
      rating,
      itemType,
      itemId,
    });

    await addDoc(collection(adminDb, 'reviews'), {
      itemId: itemId,
      itemType: itemType,
      userId: userId,
      user_name: userName,
      user_avatar: userAvatar,
      rating: rating,
      title: title,
      comment: aiResponse.revisedReviewText,
      isApproved: aiResponse.isAppropriate,
      created_at: serverTimestamp(),
      original_comment: reviewText,
    });

    revalidatePath(`/accommodations/${validatedFields.data.itemId}`);

    return {
      message:
        'Thank you for your review! It has been submitted for moderation.',
      aiResponse,
      success: true,
    };
  } catch (error) {
    console.error('Review submission error:', error);
    return {
      message:
        'An error occurred while processing your review. Please try again later.',
      success: false,
    };
  }
}

// --- New Booking Action ---

const BookingSchema = z.object({
  activityId: z.string(),
  userId: z.string().min(1, 'User must be logged in.'),
  date: z.string().min(1, 'Please select a date.'),
  paymentMethod: z.string().min(1, 'Please select a payment method.'),
  guests: z.coerce.number().min(1),
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  gCashNumber: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'gcash') {
        return data.gCashNumber && data.gCashNumber.length > 0;
    }
    return true;
}, {
    message: 'GCash number is required for this payment method.',
    path: ['gCashNumber'],
});

export type BookingState = {
  errors?: z.ZodError<z.infer<typeof BookingSchema>>['formErrors']['fieldErrors'];
  message?: string | null;
  success?: boolean;
  data?: z.infer<typeof BookingSchema> | null;
};

export async function processBooking(
  prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const validatedFields = BookingSchema.safeParse({
    activityId: formData.get('activityId'),
    userId: formData.get('userId'),
    date: formData.get('date'),
    paymentMethod: formData.get('paymentMethod'),
    guests: formData.get('guests'),
    name: formData.get('name'),
    email: formData.get('email'),
    gCashNumber: formData.get('gCashNumber'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }

  // Validation successful, return data to client
  return {
    success: true,
    message: 'Validation successful. Proceeding with booking...',
    data: validatedFields.data,
  };
}

// --- AUTH ACTIONS ---

const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
  data?: z.infer<typeof LoginSchema> | null;
  success?: boolean;
};

export async function login(prevState: LoginState, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
      success: false,
    };
  }

  return {
    success: true,
    data: validatedFields.data,
  };
}

const SignupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type SignupState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
  data?: z.infer<typeof SignupSchema> | null;
};

export async function signup(prevState: SignupState, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      success: false,
    };
  }

  return {
    success: true,
    message: 'Validation successful. Proceeding with account creation...',
    data: validatedFields.data,
  };
}

export async function logout() {
  // This is a placeholder for a client-side action
  // The actual logout is handled in the Header component which calls Firebase auth.signOut()
  // and then uses the `action` attribute on a form to re-render the page.
  redirect('/login');
}
