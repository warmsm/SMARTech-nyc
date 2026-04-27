import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/utils/supabase/client";

export type Email =
  | "central.office@smartech.ph"
  | "youth.organization@smartech.ph"
  | "sangguniang.kabataan@smartech.ph"
  | "ncr.ivb@smartech.ph"
  | "car.i@smartech.ph"
  | "ii.iii@smartech.ph"
  | "iv-a@smartech.ph"
  | "v@smartech.ph"
  | "vi@smartech.ph"
  | "vii.viii@smartech.ph"
  | "ix.xii@smartech.ph"
  | "x.caraga@smartech.ph"
  | "xi.barmm@smartech.ph";

export type Office =
  | "Central NYC"
  | "Youth Organization Registration Program (YORP)"
  | "NYC Sangguniang Kabataan"
  | "NYC NCR and MIMAROPA"
  | "NYC CAR and Region 1"
  | "NYC Regions 2 and 3"
  | "NYC CALABARZON"
  | "NYC Region 5"
  | "NYC Region 6"
  | "NYC Regions 7 and 8"
  | "NYC Regions 9 and 12"
  | "NYC Region 10 and CARAGA"
  | "NYC Region 11 and BARMM";

interface AuthContextType {
  currentOffice: Office | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const USER_CREDENTIALS: Record<
  Email,
  { password: string; office: Office }
> = {
  "central.office@smartech.ph": {
    password: "centraloffice",
    office: "Central NYC",
  },
  "youth.organization@smartech.ph": {
    password: "youthorganization",
    office: "Youth Organization Registration Program (YORP)",
  },
  "sangguniang.kabataan@smartech.ph": {
    password: "sangguniangkabataan",
    office: "NYC Sangguniang Kabataan",
  },
  "ncr.ivb@smartech.ph": {
    password: "ncrmimaropa",
    office: "NYC NCR and MIMAROPA",
  },
  "car.i@smartech.ph": {
    password: "carilocos",
    office: "NYC CAR and Region 1",
  },
  "ii.iii@smartech.ph": {
    password: "cagayancentral",
    office: "NYC Regions 2 and 3",
  },
  "iv-a@smartech.ph": {
    password: "calabarzon",
    office: "NYC CALABARZON",
  },
  "v@smartech.ph": {
    password: "bicol",
    office: "NYC Region 5",
  },
  "vi@smartech.ph": {
    password: "westvis",
    office: "NYC Region 6",
  },
  "vii.viii@smartech.ph": {
    password: "centeasvis",
    office: "NYC Regions 7 and 8",
  },
  "ix.xii@smartech.ph": {
    password: "zambsocc",
    office: "NYC Regions 9 and 12",
  },
  "x.caraga@smartech.ph": {
    password: "northcaraga",
    office: "NYC Region 10 and CARAGA",
  },
  "xi.barmm@smartech.ph": {
    password: "davaobrmm",
    office: "NYC Region 11 and BARMM",
  },
};

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentOffice, setCurrentOffice] =
    useState<Office | null>(null);
  const [customPasswords, setCustomPasswords] = useState<
    Record<string, string>
  >({});

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const savedOffice = localStorage.getItem("currentOffice");
    if (savedOffice) {
      setCurrentOffice(savedOffice as Office);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = USER_CREDENTIALS[email as Email];

    if (!user) return false;

    try {
      // Fetch custom password from server
      const response = await api.get(`/auth/password/${encodeURIComponent(email)}`);
      const customPassword = response.customPassword;

      // Check if there's a custom password set for this email
      const actualPassword = customPassword || user.password;

      if (actualPassword !== password) return false;

      setCurrentOffice(user.office);
      localStorage.setItem("currentOffice", user.office);

      return true;
    } catch (error) {
      console.error("Error during login:", error);
      // Fallback to default password if server fails
      if (user.password !== password) return false;

      setCurrentOffice(user.office);
      localStorage.setItem("currentOffice", user.office);
      return true;
    }
  };

  const logout = () => {
    setCurrentOffice(null);
    localStorage.removeItem("currentOffice");
  };

  const updatePassword = async (email: string, newPassword: string) => {
    try {
      await api.post("/auth/update-password", { email, newPassword });
      setCustomPasswords((prev) => ({
        ...prev,
        [email]: newPassword,
      }));
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const isAuthenticated = currentOffice !== null;

  return (
    <AuthContext.Provider
      value={{ currentOffice, login, logout, isAuthenticated, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
}