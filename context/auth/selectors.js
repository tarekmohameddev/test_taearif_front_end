/**
 * Pure selector functions for the auth Zustand store.
 * Use with useAuthStore(selectUserData), useAuthStore(selectIsLoading), etc.
 * Do NOT use selectors that return new objects (e.g. selectUserDataAndIsLoading) with
 * useAuthStore() directly — they break getSnapshot stability and cause infinite loops.
 * For multiple fields, use separate selectors: useAuthStore(selectUserData) and useAuthStore(selectIsLoading).
 * Do not import useAuthStore here to avoid circular dependency.
 */

export const selectUserData = (s) => s.userData;
export const selectIsLoading = (s) => s.IsLoading;
export const selectUserIsLogged = (s) => s.UserIslogged;
export const selectOnboardingCompleted = (s) => s.onboarding_completed;
export const selectClickedOnSubButton = (s) => s.clickedOnSubButton;
export const selectError = (s) => s.error;

/**
 * @deprecated Returns new object every time; causes "getSnapshot should be cached" infinite loop.
 * Use separate selectors instead: useAuthStore(selectUserData) and useAuthStore(selectIsLoading).
 */
export const selectUserDataAndIsLoading = (s) => ({
  userData: s.userData,
  IsLoading: s.IsLoading,
});

/**
 * @deprecated Returns new object every time; causes infinite loop. Use separate selectors instead.
 */
export const selectAuthForHeader = (s) => ({
  userData: s.userData,
  fetchUserData: s.fetchUserData,
  clickedONSubButton: s.clickedONSubButton,
});
