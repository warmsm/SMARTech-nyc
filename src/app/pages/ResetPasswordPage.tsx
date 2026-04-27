import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { useAccessRequests } from "@/contexts/AccessRequestsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { getRequestByCode } = useAccessRequests();
  const { updatePassword } = useAuth();

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"code" | "password" | "done">("code");
  const [error, setError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      const request = await getRequestByCode(verificationCode);

      if (!request) {
        setError("Invalid or expired verification code. Verification codes expire after 15 minutes.");
        return;
      }

      setVerifiedEmail(request.officeEmail);
      setStep("password");
    } catch (error: any) {
      console.error("Error verifying code:", error);
      // Check if the error is due to expiration (HTTP 410)
      if (error.message && error.message.includes("expired")) {
        setError("Verification code has expired. Codes are valid for 15 minutes. Please request a new password reset.");
      } else {
        setError("Invalid or expired verification code. Please check and try again.");
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updatePassword(verifiedEmail, newPassword);
      setStep("done");
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#3391f7]/7 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#000033] border-[#000033] border-2">
          <CardContent className="py-12 px-8 space-y-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Reset Password
            </h1>

            {step === "code" && (
              <>
                <p className="text-white/70 text-sm">
                  Enter the verification code provided by NYC Central Office.
                </p>

                <form
                  onSubmit={handleCodeSubmit}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-2">
                    <Label className="text-white">
                      Verification Code
                    </Label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="bg-[#0099FF] border-[#0099FF] text-black placeholder:text-black/80 text-center tracking-[0.3em]"
                      maxLength={6}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black font-semibold"
                  >
                    Verify Code
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-white/70 hover:text-white hover:underline"
                >
                  Back to Login
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <p className="text-white/70 text-sm">
                  Code verified! Enter your new password below.
                </p>

                <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-left">
                  <p className="text-xs text-white/60">Email</p>
                  <p className="text-sm text-white font-medium">
                    {verifiedEmail}
                  </p>
                </div>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-2">
                    <Label className="text-white">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-[#0099FF] border-[#0099FF] text-black placeholder:text-black/80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-[#0099FF] border-[#0099FF] text-black placeholder:text-black/80"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black font-semibold"
                  >
                    Reset Password
                  </Button>
                </form>
              </>
            )}

            {step === "done" && (
              <>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <p className="text-green-400 text-sm">
                    Password successfully reset!
                  </p>

                  <p className="text-white/70 text-sm">
                    You can now log in with your new password.
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black font-semibold"
                >
                  Go to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
