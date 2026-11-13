"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/** localStorage key: "1" while this browser has a signed-in user. Read by an inline script on "/". */
export const SIGNED_IN_HINT = "drivetron.signedIn";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
      // Lets the public landing page send a signed-in visitor (or an installed app that still
      // opens at "/") straight to the app before painting, instead of flashing the marketing page.
      try {
        if (u) localStorage.setItem(SIGNED_IN_HINT, "1");
        else localStorage.removeItem(SIGNED_IN_HINT);
      } catch {
        // Private mode: the landing page still redirects once auth resolves
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
