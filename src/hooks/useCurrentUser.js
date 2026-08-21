import { useState, useEffect } from "react";
import supabase from "../services/supabase";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get current session
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    // 2. Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // 3. Cleanup
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}