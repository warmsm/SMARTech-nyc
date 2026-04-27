import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { AuditPost } from "@/data/mockData";
import { Button } from "@/app/components/ui/button";
import { MessageSquare, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/contexts/PostsContext";
import { useState, useMemo } from "react";

interface CaptionTableProps {
  posts: AuditPost[];
}

type SortColumn = "id" | "platform" | "status" | "reviewStatus" | "appealStatus" | "date" | "actions";
type SortDirection = "asc" | "desc";

export function CaptionTable({ posts }: CaptionTableProps) {
  const { currentOffice } = useAuth();
  const { appealPost } = usePosts();
  const [appealingPostId, setAppealingPostId] = useState<
    string | null
  >(null);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedCaption, setExpandedCaption] = useState<string | null>(null);
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [expandedRemarks, setExpandedRemarks] = useState<string | null>(null);

  const isCentral = currentOffice === "Central NYC";

  const formatPlatforms = (platform: string | string[]) => {
    if (Array.isArray(platform)) {
      return platform.join(", ");
    }
    return platform;
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedPosts = useMemo(() => {
    if (!sortColumn) return posts;

    return [...posts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "platform":
          aValue = formatPlatforms(a.platform);
          bValue = formatPlatforms(b.platform);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "reviewStatus":
          aValue = a.centralReviewStatus || "Pending Review";
          bValue = b.centralReviewStatus || "Pending Review";
          break;
        case "appealStatus":
          aValue = a.appealStatus || "Not Appealed";
          bValue = b.appealStatus || "Not Appealed";
          break;
        case "date":
          aValue = new Date(a.submissionDate || a.date);
          bValue = new Date(b.submissionDate || b.date);
          break;
        case "actions":
          // Sort by whether action is available (rejected & not appealed = 1, others = 0)
          aValue = (a.status === "Rejected" && (!a.appealStatus || a.appealStatus === "Not Appealed")) ? 1 : 0;
          bValue = (b.status === "Rejected" && (!b.appealStatus || b.appealStatus === "Not Appealed")) ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [posts, sortColumn, sortDirection]);

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 inline" />
    );
  };

  const handleAppeal = async (postId: string) => {
    const reason = prompt(
      "Please provide a reason for appealing this rejection:",
    );
    if (!reason) return;

    try {
      setAppealingPostId(postId);
      await appealPost(postId, reason);
      alert(
        "Appeal submitted successfully! Central office will review your appeal.",
      );
    } catch (error) {
      console.error("Error submitting appeal:", error);
      alert("Failed to submit appeal. Please try again.");
    } finally {
      setAppealingPostId(null);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-primary text-primary-foreground";
      case "Rejected":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-primary";
    return "text-secondary";
  };

  const getCaptionId = (postId: string) => {
    return postId.replace("POST-", "CAPTION-");
  };

  const getReviewStatusBadge = (post: AuditPost) => {
    if (
      !post.centralReviewStatus ||
      post.centralReviewStatus === "Pending Review"
    ) {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
          Pending Review
        </span>
      );
    }

    if (post.centralReviewStatus === "Good for Posting") {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
          Good for Posting
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
        For Revision
      </span>
    );
  };

  const getAppealStatusBadge = (post: AuditPost) => {
    if (
      !post.appealStatus ||
      post.appealStatus === "Not Appealed"
    ) {
      return <span className="text-xs text-gray-500">-</span>;
    }

    if (post.appealStatus === "Appealed") {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
          Appeal Pending
        </span>
      );
    }

    if (post.appealStatus === "Appeal Approved") {
      return (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
          Appeal Approved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
        Appeal Rejected
      </span>
    );
  };

  return (
    <>
      {expandedCaption && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedCaption(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Full Caption</h3>
            <p className="text-sm whitespace-pre-wrap">{expandedCaption}</p>
            <button
              onClick={() => setExpandedCaption(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {expandedReason && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedReason(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Rejection Reason</h3>
            <p className="text-sm whitespace-pre-wrap">{expandedReason}</p>
            <button
              onClick={() => setExpandedReason(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {expandedRemarks && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedRemarks(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Full Remarks</h3>
            <p className="text-sm whitespace-pre-wrap">{expandedRemarks}</p>
            <button
              onClick={() => setExpandedRemarks(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full p-2 w-8 h-8 flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("id")}
              >
                Caption ID
                <SortIcon column="id" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("platform")}
              >
                Platform
                <SortIcon column="platform" />
              </TableHead>
              <TableHead>Caption</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon column="status" />
              </TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grammar</TableHead>
              <TableHead>Inclusivity</TableHead>
              <TableHead>Tone</TableHead>
              <TableHead>Remarks</TableHead>
              {!isCentral && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("reviewStatus")}
                >
                  Review Status
                  <SortIcon column="reviewStatus" />
                </TableHead>
              )}
              {!isCentral && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("appealStatus")}
                >
                  Appeal Status
                  <SortIcon column="appealStatus" />
                </TableHead>
              )}
              {!isCentral && <TableHead>Rejection Reason</TableHead>}
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("date")}
              >
                Date Submitted
                <SortIcon column="date" />
              </TableHead>
              {!isCentral && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("actions")}
                >
                  Actions
                  <SortIcon column="actions" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  {getCaptionId(post.id)}
                </TableCell>

                <TableCell>
                  {formatPlatforms(post.platform)}
                </TableCell>

                <TableCell>
                  <div className="max-w-md text-sm text-muted-foreground">
                    <div className="line-clamp-3">
                      {post.caption}
                    </div>
                    {post.caption && post.caption.length > 150 && (
                      <button
                        onClick={() => setExpandedCaption(post.caption || "")}
                        className="text-primary hover:underline text-xs mt-1"
                      >
                        See more
                      </button>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                      post.status,
                    )}`}
                  >
                    {post.status}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`font-semibold ${getScoreColor(
                      post.score,
                    )}`}
                  >
                    {post.score}
                  </span>
                </TableCell>

                <TableCell>{post.grammar ?? "-"}</TableCell>
                <TableCell>{post.inclusivity ?? "-"}</TableCell>
                <TableCell>{post.tone ?? "-"}</TableCell>

                <TableCell>
                  <div className="max-w-md text-sm text-muted-foreground">
                    <div className="line-clamp-2">
                      {post.remarks || post.recommendation}
                    </div>
                    {(post.remarks || post.recommendation) && (post.remarks || post.recommendation)!.length > 100 && (
                      <button
                        onClick={() => setExpandedRemarks(post.remarks || post.recommendation || "")}
                        className="text-primary hover:underline text-xs mt-1"
                      >
                        See more
                      </button>
                    )}
                  </div>
                </TableCell>

                {!isCentral && (
                  <TableCell>
                    {getReviewStatusBadge(post)}
                  </TableCell>
                )}

                {!isCentral && (
                  <TableCell>
                    {getAppealStatusBadge(post)}
                  </TableCell>
                )}

                {!isCentral && (
                  <TableCell>
                    {post.centralReviewComment ? (
                      <div className="max-w-md text-sm text-muted-foreground">
                        <div className="line-clamp-2">
                          {post.centralReviewComment}
                        </div>
                        {post.centralReviewComment.length > 100 && (
                          <button
                            onClick={() => setExpandedReason(post.centralReviewComment || "")}
                            className="text-primary hover:underline text-xs mt-1"
                          >
                            See more
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </TableCell>
                )}

                <TableCell className="text-sm">
                  {post.submissionDate || post.date}
                </TableCell>

                {!isCentral && (
                  <TableCell>
                    {post.status === "Rejected" &&
                      (!post.appealStatus ||
                        post.appealStatus === "Not Appealed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAppeal(post.id)}
                          disabled={appealingPostId === post.id}
                          className="text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {appealingPostId === post.id
                            ? "Submitting..."
                            : "Appeal"}
                        </Button>
                      )}
                    {post.appealStatus === "Appealed" && (
                      <span className="text-xs text-yellow-600">
                        Appeal Pending
                      </span>
                    )}
                    {post.appealStatus === "Appeal Approved" && (
                      <span className="text-xs text-green-600">
                        Appeal Approved
                      </span>
                    )}
                    {post.appealStatus === "Appeal Rejected" && (
                      <span className="text-xs text-red-600">
                        Appeal Rejected
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
