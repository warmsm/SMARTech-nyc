import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "@/utils/supabase/client";

export type RequestType =
  | "forgot-password"
  | "handoff"
  | "create-account";
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
    verificationCode?: string,
    extraFields?: Partial<AccessRequest>,
  ) => Promise<void>;
  getRequestByCode: (
    code: string,
  ) => Promise<AccessRequest | null>;
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
      } catch (error: any) {
        console.log(
          "⚠️ Server unavailable - starting with empty access requests",
        );
        console.log(
          "Note: Deploy the Supabase Edge Function to enable server sync",
        );
        setRequests([]);
      }
    };

    fetchRequests();
  }, []);

  const addRequest = async (
    request: AccessRequest,
  ): Promise<void> => {
    try {
      await api.post("/access-requests", request);
    } catch (error) {
      console.log(
        "⚠️ Server unavailable - request saved locally only",
      );
    }

    // Always update local state
    setRequests((prev) => [request, ...prev]);
  };

  const updateRequestStatus = async (
    id: string,
    status: RequestStatus,
    verificationCode?: string,
    extraFields?: Partial<AccessRequest>,
  ): Promise<void> => {
    try {
      await api.put(`/access-requests/${id}`, {
        status,
        verificationCode,
      });
    } catch (error) {
      console.log(
        "⚠️ Server unavailable - request status updated locally only",
      );
    }

    // Always update local state
    let verificationCodeExpiresAt: string | undefined;

    if (verificationCode) {
      const expirationDate = new Date();
      expirationDate.setMinutes(
        expirationDate.getMinutes() + 15,
      );
      verificationCodeExpiresAt = expirationDate.toISOString();
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              verificationCode,
              verificationCodeExpiresAt,
              ...extraFields,
            }
          : req,
      ),
    );
  };

  const getRequestByCode = async (
    code: string,
  ): Promise<AccessRequest | null> => {
    try {
      const response = await api.get(
        `/access-requests/verify/${code}`,
      );
      return response.request || null;
    } catch (error) {
      console.log(
        "⚠️ Server unavailable - checking local requests",
      );
    }

    // Fallback: search in local state
    const request = requests.find(
      (req) =>
        req.verificationCode === code &&
        req.status === "Approved",
    );

    if (!request) {
      return null;
    }

    // Check if verification code has expired (15 minutes)
    if (request.verificationCodeExpiresAt) {
      const expirationTime = new Date(
        request.verificationCodeExpiresAt,
      );
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        throw new Error(
          "Verification code has expired. Please request a new password reset.",
        );
      }
    }

    return request;
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
      "useAccessRequests must be used within an AccessRequestsProvider",
    );
  }

  return context;
}