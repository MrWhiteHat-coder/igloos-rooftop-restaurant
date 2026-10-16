import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import type { StaffProfile } from "../lib/types";

interface StaffAuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: StaffProfile | null;
  /** Authenticated but not an active staff member → deny dashboard access. */
  unauthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const StaffAuthContext = createContext<StaffAuthState | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);

  const loadProfile = useCallback(async (sessionIn: Session | null) => {
    if (!sessionIn?.user) {
      setProfile(null);
      return;
    }
    const sb = getSupabase();
    const { data, error } = await sb
      .from("staff_profiles")
      .select("*")
      .eq("user_id", sessionIn.user.id)
      .maybeSingle();
    if (error || !data) {
      setProfile(null);
    } else {
      const p = data as StaffProfile;
      setProfile(p.active ? p : null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const sb = getSupabase();
    sb.auth
      .getSession()
      .then(async ({ data: { session: s } }) => {
        if (cancelled) return;
        setSession(s);
        await loadProfile(s);
        if (!cancelled) setLoading(false);
      });

    const { data: sub } = sb.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      await loadProfile(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: "Supabase environment variables are missing on this deployment." };
    }
    const sb = getSupabase();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login")) {
        return { error: "Incorrect email or password." };
      }
      return { error: error.message };
    }
    const { data: { session: s } } = await sb.auth.getSession();
    await loadProfile(s);
    return { error: null };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await getSupabase().auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo<StaffAuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      unauthorized: loading ? true : (session !== null && profile === null),
      signIn,
      signOut,
      refreshProfile: () => loadProfile(session),
    }),
    [loading, session, profile, signIn, signOut, loadProfile]
  );

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth(): StaffAuthState {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
