import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/utils/supabase/client";

export type RequestType = "forgot-password" | "handoff" | "create-account";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface AccessRequest {
  id: string;
  type: RequestType;
  officeEmail: string;
  officeName: string;
  status: RequestStatus;
  submittedAt: string;
  reason?: string;
  newAssignedPerson?: string;
  verificationCode?: string;
  verificationCodeExpiresAt?: string; // ISO timestamp for expiration (15 minutes from approval)
  // For create-account requests
  requestedPassword?: string;
}

interface AccessRequestsContextType {
  requests: AccessRequest[];
  addRequest: (request: AccessRequest) => Promise<void>;
  updateRequestStatus: (
    id: string,
    status: RequestStatus,
    verificationCode?: string
  ) => Promise<void>;
  getRequestByCode: (code: string) => Promise<AccessRequest | null>;
}

const AccessRequestsContext = createContext<
  AccessRequestsContextType | undefined
>(undefined);

export function AccessRequestsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  // Fetch access requests from server on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/access-requests");
        setRequests(response.requests || []);
      } catch (error) {
        console.error("Error loading access requests from server:", error);
        setRequests([]);
      }
    };

    fetchRequests();
  }, []);

  const addRequest = async (request: AccessRequest): Promise<void> => {
    try {
      await api.post("/access-requests", request);
      setRequests((prev) => [request, ...prev]);
    } catch (error) {
      console.error("Error adding access request:", error);
      throw error;
    }
  };

  const updateRequestStatus = async (
    id: string,
    status: RequestStatus,
    verificationCode?: string
  ): Promise<void> => {
    try {
      await api.put(`/access-requests/${id}`, { status, verificationCode });

      // Calculate expiration time (15 minutes from now) if verification code is provided
      let verificationCodeExpiresAt;
      if (verificationCode) {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 15);
        verificationCodeExpiresAt = expirationDate.toISOString();
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status, verificationCode, verificationCodeExpiresAt } : req
        )
      );
    } catch (error) {
      console.error("Error updating access request:", error);
      throw error;
    }
  };

  const getRequestByCode = async (code: string): Promise<AccessRequest | null> => {
    try {
      const response = await api.get(`/access-requests/verify/${code}`);
      return response.request || null;
    } catch (error) {
      console.error("Error verifying code:", error);
      return null;
    }
  };

  return (
    <AccessRequestsContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        getRequestByCode,
      }}
    >
      {children}
    </AccessRequestsContext.Provider>
  );
}

export function useAccessRequests() {
  const context = useContext(AccessRequestsContext);

  if (!context) {
    throw new Error(
      "useAccessRequests must be used within an AccessRequestsProvider"
    );
  }

  return context;
}