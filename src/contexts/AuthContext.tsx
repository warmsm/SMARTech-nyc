import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/supabaseClient";

export type Office = string;

export type Role = "admin" | "user";

export interface Profile {
  id: string;
  email: string;
  office: Office;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentOffice: Office | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, office, role")
      .eq("id", userId)
      .maybeSingle();

    if (data && !error) {
      setProfile(data as Profile);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }

      setIsLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user || !data.session) {
      return false;
    }

    setUser(data.user);
    setSession(data.session);
    await loadProfile(data.user.id);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const currentOffice = profile?.office ?? null;
  const isAuthenticated = Boolean(session && user);
  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        currentOffice,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    return {
      user: null,
      session: null,
      profile: null,
      currentOffice: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      login: async () => false,
      logout: async () => {},
    };
  }

  return context;
}
