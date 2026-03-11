"use client";

/**
 * Initial state and shape for the auth Zustand store.
 * Split from AuthContext.js for smaller compile units.
 */

export const initialUserData = {
  email: null,
  token: null,
  username: null,
  domain: null,
  first_name: null,
  last_name: null,
  is_free_plan: null,
  is_expired: false,
  days_remaining: null,
  package_title: null,
  package_features: [],
  project_limit_number: null,
  real_estate_limit_number: null,
  message: null,
  company_name: null,
  permissions: [],
  account_type: null,
  tenant_id: null,
};

export const authInitialState = {
  UserIslogged: false,
  IsLoading: true,
  IsDone: false,
  authenticated: false,
  error: null,
  errorLogin: null,
  errorLoginATserver: null,
  onboarding_completed: false,
  clickedOnSubButton: "domains",
  userData: initialUserData,
  googleUrlFetched: false,
  googleAuthUrl: null,
  liveEditorLoading: false,
  liveEditorError: null,
};
