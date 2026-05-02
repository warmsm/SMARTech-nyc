import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ROUTES } from "@/constants/routes";

// ADD 'default' HERE
export default function AccountAccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#3391f7]/7 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#000033] border-[#000033] border-2">
          <CardContent className="py-12 px-8 text-center space-y-6">
            <h1 className="text-2xl font-bold text-white">
              Account Access
            </h1>

            <div className="w-full flex flex-col gap-4 mt-6">
              <div className="space-y-3">
                <p className="text-white text-sm font-medium">
                  Account access request
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() =>
                      navigate(ROUTES.CREATE_ACCOUNT_REQUEST)
                    }
                    className="flex-1 h-12 bg-[#0099FF] hover:bg-[#0099FF]/90 text-white font-semibold rounded-lg"
                  >
                    Create New Account
                  </Button>

                  <Button
                    onClick={() =>
                      navigate(ROUTES.HANDOFF_REQUEST)
                    }
                    className="flex-1 h-12 bg-[#0099FF] hover:bg-[#0099FF]/90 text-white font-semibold rounded-lg"
                  >
                    Handoff Request
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <p className="text-white text-sm font-medium">
                  Password reset
                </p>
                <Button
                  onClick={() =>
                    navigate(ROUTES.FORGOT_PASSWORD)
                  }
                  className="w-full h-12 bg-[#FFFF00] hover:bg-[#FFFF00]/90 text-black font-semibold rounded-lg"
                >
                  Change/Forgot Password
                </Button>
              </div>
            </div>

            <button
              onClick={() => navigate(ROUTES.LOGIN)}
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