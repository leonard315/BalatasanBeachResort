'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebase';

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * Hook for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * It is the single source of truth for auth state.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const [userState, setUserState] = useState<UserHookResult>({
    user: auth.currentUser,
    isUserLoading: auth.currentUser === null, // Start loading only if no user is initially available
    userError: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUserState({ user, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("useUser hook: onAuthStateChanged error:", error);
        setUserState({ user: null, isUserLoading: false, userError: error });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return userState;
};
