import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/supabase/client";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminPage() {
  const { currentOffice } = useAuth();
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isCentral = currentOffice === "Central NYC";

  if (!isCentral) {
    return (
      <div className="text-center text-muted-foreground py-10">
        You do not have access to this page. Only Central NYC can access admin functions.
      </div>
    );
  }

  const handleClear = async (endpoint: string, confirmMessage: string, successMessage: string) => {
    if (!confirm(confirmMessage)) return;

    setIsClearing(true);
    setMessage(null);

    try {
      await api.delete(endpoint);
      setMessage({ type: "success", text: successMessage });

      // Refresh the page after a short delay to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error clearing data:", error);
      setMessage({ type: "error", text: "Failed to clear data. Please try again." });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage and clear test data from the system
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Clear Posts */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Clear All Posts
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Delete all pubmat and caption submissions from the database
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  handleClear(
                    "/admin/clear-posts",
                    "Are you sure you want to delete ALL posts? This action cannot be undone.",
                    "All posts have been cleared successfully!"
                  )
                }
                disabled={isClearing}
                className="w-full"
              >
                {isClearing ? "Clearing..." : "Clear All Posts"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear Access Requests */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Clear Access Requests
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Delete all password reset and handoff requests
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  handleClear(
                    "/admin/clear-requests",
                    "Are you sure you want to delete ALL access requests? This action cannot be undone.",
                    "All access requests have been cleared successfully!"
                  )
                }
                disabled={isClearing}
                className="w-full"
              >
                {isClearing ? "Clearing..." : "Clear All Requests"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear Custom Passwords */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Reset Custom Passwords
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Remove all custom passwords and reset to defaults
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  handleClear(
                    "/admin/clear-passwords",
                    "Are you sure you want to reset ALL custom passwords to defaults? This action cannot be undone.",
                    "All custom passwords have been reset successfully!"
                  )
                }
                disabled={isClearing}
                className="w-full"
              >
                {isClearing ? "Resetting..." : "Reset All Passwords"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear Everything */}
        <Card className="border-red-300 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Clear All Data
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  <strong>DANGER:</strong> Delete everything - posts, requests, and passwords
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  handleClear(
                    "/admin/clear-all",
                    "⚠️ FINAL WARNING ⚠️\n\nThis will DELETE EVERYTHING:\n• All posts\n• All access requests\n• All custom passwords\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?",
                    "All data has been cleared from the system!"
                  )
                }
                disabled={isClearing}
                className="w-full bg-red-700 hover:bg-red-800"
              >
                {isClearing ? "Clearing..." : "⚠️ Clear Everything ⚠️"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All delete operations are permanent and cannot be undone</li>
                <li>The page will automatically refresh after clearing data</li>
                <li>Only Central NYC office has access to these admin functions</li>
                <li>Use these functions to clear test data before going live</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
