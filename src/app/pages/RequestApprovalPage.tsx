import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useAccessRequests } from "@/contexts/AccessRequestsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { api } from "@/utils/supabase/client";

export default function RequestApprovalPage() {
  const { requests, updateRequestStatus } = useAccessRequests();
  const { currentOffice } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(
    null,
  );

  const isCentral = currentOffice === "Central NYC";

  const handleApprove = async (req: any) => {
    if (req.type === "create-account") {
      const response = await api.post(
        `/access-requests/${req.id}/approve-create-account`,
        {},
      );

      await updateRequestStatus(req.id, "Approved", undefined, {
        requestedPassword: response.temporaryPassword,
      });

      alert(
        `Account created!\n\nEmail: ${response.email}\nTemporary Password: ${response.temporaryPassword}`,
      );

      return;
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await updateRequestStatus(
      req.id,
      "Approved",
      verificationCode,
    );
  };

  const handleCopyCode = async (code: string) => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        copied = true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      if (copied) {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } else {
        alert(`Copy failed. Verification code: ${code}`);
      }
    } catch (error) {
      console.error("Failed to copy verification code:", error);
      alert(`Copy failed. Verification code: ${code}`);
    }
  };

  if (!isCentral) {
    return (
      <div className="text-center text-muted-foreground py-10">
        You do not have access to this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Request Approval</h1>
        <p className="text-muted-foreground">
          Review and manage submitted account access requests.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No requests submitted yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="py-5 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold">
                      {req.type === "forgot-password"
                        ? "Change/Forgot Password"
                        : req.type === "handoff"
                          ? "Handoff Request"
                          : "Create Account Request"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {req.officeName}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {req.officeEmail}
                  </p>

                  <p>
                    <span className="font-medium">
                      Submitted:
                    </span>{" "}
                    {req.submittedAt}
                  </p>

                  {req.type === "create-account" && (
                    <p>
                      <span className="font-medium">
                        Office Name:
                      </span>{" "}
                      {req.officeName}
                    </p>
                  )}

                  {req.newAssignedPerson && (
                    <p>
                      <span className="font-medium">
                        {req.type === "create-account"
                          ? "Assigned Person"
                          : "New Assigned Person"}
                        :
                      </span>{" "}
                      {req.newAssignedPerson}
                    </p>
                  )}

                  {req.reason && (
                    <p>
                      <span className="font-medium">
                        Reason:
                      </span>{" "}
                      {req.reason}
                    </p>
                  )}
                </div>

                {req.status === "Pending" && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleApprove(req)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>

                    <Button
                      variant="outline"
                      onClick={async () => {
                        await updateRequestStatus(
                          req.id,
                          "Rejected",
                        );
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {req.status === "Approved" &&
                  req.type === "create-account" && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Account Credentials
                      </p>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">
                            Email:
                          </span>{" "}
                          {req.officeEmail}
                        </p>
                        <p>
                          <span className="font-medium">
                            Temporary Password:
                          </span>{" "}
                          {req.requestedPassword ||
                            "Not generated yet"}
                        </p>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Send the login credentials to the
                        assigned person so they can access their
                        new account.
                      </p>
                    </div>
                  )}

                {req.status === "Approved" &&
                  req.verificationCode &&
                  req.type !== "create-account" && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 mb-2">
                        Verification Code
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-green-300 rounded px-4 py-3">
                          <p className="text-2xl font-bold text-green-700 tracking-[0.3em] text-center">
                            {req.verificationCode}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCopyCode(
                              req.verificationCode!,
                            )
                          }
                          className="border-green-300 hover:bg-green-100"
                        >
                          {copiedCode ===
                          req.verificationCode ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-green-700">
                          Send this code to the requester so
                          they can reset their password.
                        </p>
                        <p className="text-xs text-red-600 font-semibold">
                          ⚠️ This code expires 15 minutes after
                          approval.
                        </p>
                        {req.verificationCodeExpiresAt && (
                          <p className="text-xs text-gray-600">
                            Expires at:{" "}
                            {new Date(
                              req.verificationCodeExpiresAt,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
