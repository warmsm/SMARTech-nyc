import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navigation } from "@/app/components/Navigation";
import { HomePage } from "@/app/pages/HomePage";
import { PubMatsPage } from "@/app/pages/PubMatsPage";
import { CaptionsPage } from "@/app/pages/CaptionsPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { PostsProvider } from "@/contexts/PostsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccountAccessPage } from "@/app/pages/AccountAccessPage";
import ForgotPasswordPage from "@/app/pages/ForgotPasswordPage";
import HandoffRequestPage from "@/app/pages/HandoffRequestPage";
import RequestApprovalPage from "@/app/pages/RequestApprovalPage";
import ResetPasswordPage from "@/app/pages/ResetPasswordPage";
import AdminPage from "@/app/pages/AdminPage";
import ReviewApprovedPostsPage from "@/app/pages/ReviewApprovedPostsPage";
import ReviewAppealsPage from "@/app/pages/ReviewAppealsPage";
import CreateAccountRequestPage from "@/app/pages/CreateAccountRequestPage";
import { AccessRequestsProvider } from "@/contexts/AccessRequestsContext";
import { HelpButton } from "@/app/components/HelpButton";
import { SmarTechLogo } from "@/app/components/SmarTechLogo";
import { useAuth } from "@/contexts/AuthContext";

function AppRoutes() {
  const { currentOffice } = useAuth();
  const isCentral = currentOffice === "Central NYC";

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/account-access"
        element={<AccountAccessPage />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/handoff-request"
        element={<HandoffRequestPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />
      <Route
        path="/create-account-request"
        element={<CreateAccountRequestPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <HomePage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pubmats"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <PubMatsPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/captions"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <CaptionsPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/request-approval"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <RequestApprovalPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <AdminPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/review-approved"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <ReviewApprovedPostsPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/review-appeals"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                <ReviewAppealsPage />
              </main>
              <HelpButton isCentral={isCentral} />
              <SmarTechLogo />
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <AccessRequestsProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AccessRequestsProvider>
      </PostsProvider>
    </AuthProvider>
  );
}