/* eslint-disable react/prop-types */
import {
  AuthError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  MissingIdentityError,
  oauthLogin,
  onAuthChange,
  requestPasswordRecovery,
  signup,
  updateUser,
} from "@netlify/identity";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Normalize a Netlify Identity user into the shape the UI expects
// (displayName / photoURL / email), so pages don't need to know the provider.
const toAppUser = (identityUser) => {
  if (!identityUser) return null;
  const meta = identityUser.userMetadata || {};
  return {
    id: identityUser.id,
    email: identityUser.email,
    displayName: identityUser.name || meta.full_name || "",
    photoURL: identityUser.pictureUrl || meta.avatar_url || "",
  };
};

// Turn library errors into readable messages.
// eslint-disable-next-line react-refresh/only-export-components
export const authErrorMessage = (error) => {
  if (error instanceof MissingIdentityError) {
    return "Login service is not available right now. Please try again later.";
  }
  if (error instanceof AuthError) {
    switch (error.status) {
      case 401:
        return "Invalid email or password.";
      case 403:
        return "Signups are not allowed on this site.";
      case 422:
        return error.message || "Invalid input. Check your email and password.";
      default:
        return error.message;
    }
  }
  return error?.message || "Something went wrong.";
};

// Guard so the URL-hash callback is only processed once (StrictMode runs effects twice).
let callbackPromise = null;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRecovery, setPendingRecovery] = useState(false);

  const createUser = async (email, password, name, photoURL) => {
    const data = { full_name: name };
    if (photoURL) data.avatar_url = photoURL;
    const newUser = await signup(email, password, data);
    const confirmed = Boolean(newUser.confirmedAt);
    if (confirmed) setUser(toAppUser(newUser));
    return { user: toAppUser(newUser), confirmed };
  };

  const loginUser = async (email, password) => {
    const loggedIn = await login(email, password);
    const appUser = toAppUser(loggedIn);
    setUser(appUser);
    return { user: appUser };
  };

  // Redirects to Google and back; the return trip is handled by handleAuthCallback.
  const googleLogin = () => oauthLogin("google");

  const signOutUser = async () => {
    await logout();
    setUser(null);
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    const data = {};
    if (displayName !== undefined) data.full_name = displayName;
    if (photoURL !== undefined) data.avatar_url = photoURL;
    const updated = await updateUser({ data });
    const appUser = toAppUser(updated);
    setUser(appUser);
    return appUser;
  };

  const resetPassword = (email) => requestPasswordRecovery(email);

  const setNewPassword = async (password) => {
    await updateUser({ password });
    setPendingRecovery(false);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        if (!callbackPromise) callbackPromise = handleAuthCallback();
        const result = await callbackPromise;
        if (active && result?.type === "recovery") setPendingRecovery(true);
      } catch (error) {
        console.error("Auth callback failed:", authErrorMessage(error));
      }
      const current = await getUser();
      if (active) {
        setUser(toAppUser(current));
        setLoading(false);
      }
    };
    init();

    const unsubscribe = onAuthChange((event, changedUser) => {
      if (!active) return;
      if (event === "logout") setUser(null);
      else if (changedUser) setUser(toAppUser(changedUser));
      if (event === "recovery") setPendingRecovery(true);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const authInfo = {
    createUser,
    loginUser,
    signOutUser,
    loading,
    user,
    setUser,
    updateUserProfile,
    googleLogin,
    resetPassword,
    setNewPassword,
    pendingRecovery,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
