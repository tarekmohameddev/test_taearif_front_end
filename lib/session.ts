export function hasSessionSync(): boolean {
  if (typeof window === "undefined") return false;

  try {
    // Check authToken cookie
    const cookies = document.cookie.split(";");
    const hasAuthCookie = cookies.some((cookie) =>
      cookie.trim().startsWith("authToken="),
    );
    if (hasAuthCookie) {
      return true;
    }

    // Check user data in localStorage
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const hasUserIdentity = !!(parsedUser && (parsedUser.token || parsedUser.email));

      if (hasUserIdentity) {
        return true;
      }
    }
  } catch {
    // Ignore storage / cookie errors and treat as no session
  }

  return false;
}

