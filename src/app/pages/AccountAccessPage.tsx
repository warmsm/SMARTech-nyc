import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function AccountAccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#3391f7]/7 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#000033] border-[#000033] border-2">
          <CardContent className="py-12 px-8 text-center space-y-6">
            <h1 className="text-2xl font-bold text-white">
              Account Access Request
            </h1>

            <p className="text-white/70 text-sm">
              Choose how you would like to proceed
            </p>

            <div className="w-full flex flex-col gap-4 mt-4">
              <Button
                onClick={() => navigate("/create-account-request")}
                className="w-full h-12 bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black font-semibold rounded-lg"
              >
                Create New Account
              </Button>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/forgot-password")}
                  className="flex-1 h-12 bg-[#0099FF] hover:bg-[#0099FF]/90 text-white font-semibold rounded-lg"
                >
                  Forgot Password
                </Button>

                <Button
                  onClick={() => navigate("/handoff-request")}
                  className="flex-1 h-12 bg-[#0099FF] hover:bg-[#0099FF]/90 text-white font-semibold rounded-lg"
                >
                  Handoff Request
                </Button>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="text-sm text-white/60 hover:underline mt-2"
            >
              Back to Login
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}