import { useMemo, useState } from "react";
import { usePosts } from "@/contexts/PostsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { AuditPost } from "@/data/mockData";
import { getPostingDate } from "@/utils/postDates";

export default function ReviewAppealsPage() {
  const { posts, reviewAppeal } = usePosts();
  const { currentOffice } = useAuth();
  const [selectedImage, setSelectedImage] = useState<
    string | null
  >(null);
  const [expandedCaption, setExpandedCaption] = useState<
    string | null
  >(null);

  const isCentral = currentOffice === "Central NYC";

  const getPostingTime = (post: AuditPost) =>
    new Date(getPostingDate(post)).getTime();

  const startOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  const appealedPosts = useMemo(() => {
    const today = startOfToday();

    return posts
      .filter((post) => post.appealStatus === "Appealed")
      .sort((a, b) => {
        const aTime = getPostingTime(a);
        const bTime = getPostingTime(b);

        const aIsPast = aTime < today;
        const bIsPast = bTime < today;

        if (aIsPast !== bIsPast) {
          return aIsPast ? 1 : -1;
        }

        return aTime - bTime;
      });
  }, [posts]);

  if (!isCentral) {
    return (
      <div className="text-center text-muted-foreground py-10">
        You do not have access to this page. Only Central NYC
        can review appeals.
      </div>
    );
  }

  const handleApproveAppeal = async (postId: string) => {
    const comment = prompt(
      "Optional: Add a comment for approval:",
    );
    try {
      await reviewAppeal(postId, true, comment || undefined);
      alert("Appeal approved! Post is now Good for Posting.");
    } catch (error) {
      console.error("Error approving appeal:", error);
      alert("Failed to approve appeal. Please try again.");
    }
  };

  const handleRejectAppeal = async (postId: string) => {
    const comment = prompt(
      "Please provide a reason for rejecting the appeal:",
    );
    if (!comment) return;

    try {
      await reviewAppeal(postId, false, comment);
      alert("Appeal rejected. Post remains For Revision.");
    } catch (error) {
      console.error("Error rejecting appeal:", error);
      alert("Failed to reject appeal. Please try again.");
    }
  };

  const formatPlatforms = (platform: string | string[]) => {
    if (Array.isArray(platform)) {
      return platform.join(", ");
    }
    return platform;
  };

  const getAppealStatusBadge = (post: AuditPost) => {
    if (post.appealStatus === "Appeal Approved") {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
          Appeal Approved
        </span>
      );
    }

    if (post.appealStatus === "Appeal Rejected") {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
          Appeal Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
        Pending Review
      </span>
    );
  };

  return (
    <>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged pubmat"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {expandedCaption && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedCaption(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              Full Caption
            </h3>
            <p className="text-sm whitespace-pre-wrap">
              {expandedCaption}
            </p>
            <button
              onClick={() => setExpandedCaption(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Review Appeals
          </h1>
          <p className="text-muted-foreground">
            Review appeals from rejected posts submitted by
            regional offices
          </p>
        </div>

        {appealedPosts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 bg-card rounded-lg border">
            No appeals to review
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Original Status</TableHead>
                  <TableHead>Appeal Reason</TableHead>
                  <TableHead>Appeal Date</TableHead>
                  <TableHead>Posting Date</TableHead>
                  <TableHead>Appeal Status</TableHead>
                  <TableHead>Central Comment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {appealedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {post.id}
                    </TableCell>
                    <TableCell className="text-sm">
                      {post.office}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatPlatforms(post.platform)}
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {post.auditFocus}
                    </TableCell>

                    <TableCell>
                      <div className="max-w-md">
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt={post.id}
                            className="h-16 w-16 rounded object-cover mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              setSelectedImage(post.thumbnail!)
                            }
                          />
                        )}
                        {post.caption && (
                          <div className="text-sm text-muted-foreground">
                            <div className="line-clamp-2">
                              {post.caption}
                            </div>
                            {post.caption.length > 150 && (
                              <button
                                onClick={() =>
                                  setExpandedCaption(
                                    post.caption || "",
                                  )
                                }
                                className="text-primary hover:underline text-xs mt-1"
                              >
                                See more
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                        {post.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm max-w-xs">
                        {post.appealComment}
                      </p>
                    </TableCell>

                    <TableCell className="text-sm">
                      {post.appealDate}
                    </TableCell>

                    <TableCell className="text-sm">
                      {getPostingDate(post)}
                    </TableCell>

                    <TableCell>
                      {getAppealStatusBadge(post)}
                    </TableCell>

                    <TableCell>
                      {post.centralReviewComment && (
                        <p className="text-sm text-muted-foreground max-w-xs">
                          {post.centralReviewComment}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      {post.appealStatus === "Appealed" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleApproveAppeal(post.id)
                            }
                            className="border-green-500 text-green-700 hover:bg-green-50"
                            title="Approve appeal"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRejectAppeal(post.id)
                            }
                            className="border-red-500 text-red-700 hover:bg-red-50"
                            title="Reject appeal"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Reviewed
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
