export type AuditStatus =
  | "Accepted"
  | "For Revision"
  | "Rejected";
export type Platform = "Facebook" | "Instagram" | "X";
export type AuditFocus = "caption" | "pubmat" | "both";
export type CentralReviewStatus = "Pending Review" | "Good for Posting" | "For Revision";
export type AppealStatus = "Not Appealed" | "Appealed" | "Appeal Approved" | "Appeal Rejected";

export interface AuditPost {
  id: string;
  platform: Platform | Platform[]; // Can be single platform or array of platforms
  caption: string;
  thumbnail?: string;
  score: number;
  captionScore?: number;
  pubmatScore?: number;
  status: AuditStatus;
  recommendation: string;
  date: string;
  reviewer?: string;
  submissionDate?: string;
  lastUpdated?: string;
  auditFocus?: AuditFocus;
  pubmatType?: string;
  hasBeenRevised?: boolean; // Track if submission has been edited and re-audited
  office?: string; // Office that submitted the post

  // Central Office Review fields
  centralReviewStatus?: CentralReviewStatus;
  centralReviewComment?: string;
  centralReviewDate?: string;

  // Appeal fields
  appealStatus?: AppealStatus;
  appealComment?: string;
  appealDate?: string;
}

// Generate mock data
const platforms: Platform[] = ["Facebook", "Instagram", "X"];
const statuses: AuditStatus[] = [
  "Accepted",
  "For Revision",
  "Rejected",
];
const recommendations = [
  "Great content, approved for publishing",
  "Minor adjustments needed in tone",
  "Revise image resolution for better quality",
  "Caption needs to be more engaging",
  "Hashtags should be platform-specific",
  "Content does not meet brand guidelines",
  "Excellent alignment with campaign goals",
  "Needs fact-checking before approval",
];

const reviewers = [
  "Central NYC",
  "Youth Organization Registration Program (YORP)",
  "Central NYC",
  "Youth Organization Registration Program (YORP)",
  "NYC Sangguniang Kabataan",
  "NYC NCR and MIMAROPA",
  "NYC CAR and Region 1",
  "NYC Regions 2 and 3",
  "NYC CALABARZON",
  "NYC Region 5",
  "NYC Region 6",
  "NYC Regions 7 and 8",
  "NYC Regions 9 and 12",
  "NYC Region 10 and CARAGA",
  "NYC Region 11 and BARMM",
];

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(
    date.getDate() - Math.floor(Math.random() * daysAgo),
  );
  return date.toISOString().split("T")[0];
}

function generateMockPosts(
  type: "caption" | "pubmat" | "both",
  count: number,
): AuditPost[] {
  const posts: AuditPost[] = [];

  for (let i = 1; i <= count; i++) {
    const score = Math.floor(Math.random() * 41) + 60; // 60-100
    const status: AuditStatus =
      score >= 85
        ? "Accepted"
        : score >= 70
          ? "For Revision"
          : "Rejected";

    const submissionDate = generateRandomDate(90);
    const lastUpdatedDaysAfter = Math.floor(Math.random() * 5);
    const lastUpdated = new Date(submissionDate);
    lastUpdated.setDate(
      lastUpdated.getDate() + lastUpdatedDaysAfter,
    );

    const platform =
      platforms[Math.floor(Math.random() * platforms.length)];

    posts.push({
      id: `POST-${i.toString().padStart(3, "0")}`,
      platform,
      caption: `Sample ${platform} caption for post ${i}. This is a ${status.toLowerCase()} post about our amazing product. #marketing #socialmedia`,
      thumbnail: `https://picsum.photos/seed/${i}/200/200`,
      score,
      captionScore: Math.floor(Math.random() * 41) + 60, // 60-100
      pubmatScore: Math.floor(Math.random() * 41) + 60, // 60-100
      status,
      recommendation:
        recommendations[
          Math.floor(Math.random() * recommendations.length)
        ],
      date: generateRandomDate(90),
      reviewer:
        reviewers[Math.floor(Math.random() * reviewers.length)],
      submissionDate,
      lastUpdated: lastUpdated.toISOString().split("T")[0],
      auditFocus: type,
      pubmatType: ["image", "video", "carousel"][
        Math.floor(Math.random() * 3)
      ],
      hasBeenRevised: Math.random() > 0.5, // Randomly set to true or false
    });
  }

  return posts;
}

// Generate posts with different audit focuses
export const allPostsData = generateMockPosts("both", 30); // All posts have both caption and pubmat
export const pubmatsData = allPostsData; // Same posts, viewed through pubmat lens
export const captionsData = allPostsData; // Same posts, viewed through caption lens

// Calculate summary stats
export function calculateStats(posts: AuditPost[]) {
  const total = posts.length;
  const accepted = posts.filter(
    (p) => p.status === "Accepted",
  ).length;
  const revised = posts.filter((p) => p.hasBeenRevised).length;
  const rejected = posts.filter(
    (p) => p.status === "Rejected",
  ).length;
  const avgScore =
    total > 0
      ? posts.reduce((sum, p) => sum + p.score, 0) / total
      : 0;

  return {
    total,
    accepted,
    revised,
    rejected,
    avgScore: Math.round(avgScore * 10) / 10,
  };
}

// Calculate stats for PubMats page (uses pubmatScore)
export function calculatePubmatStats(posts: AuditPost[]) {
  const total = posts.length;
  const accepted = posts.filter(
    (p) => p.status === "Accepted",
  ).length;
  const revised = posts.filter((p) => p.hasBeenRevised).length;
  const rejected = posts.filter(
    (p) => p.status === "Rejected",
  ).length;
  const avgScore =
    total > 0
      ? posts.reduce(
          (sum, p) => sum + (p.pubmatScore || p.score),
          0,
        ) / total
      : 0;

  return {
    total,
    accepted,
    revised,
    rejected,
    avgScore: Math.round(avgScore * 10) / 10,
  };
}

// Calculate stats for Captions page (uses captionScore)
export function calculateCaptionStats(posts: AuditPost[]) {
  const total = posts.length;
  const accepted = posts.filter(
    (p) => p.status === "Accepted",
  ).length;
  const revised = posts.filter((p) => p.hasBeenRevised).length;
  const rejected = posts.filter(
    (p) => p.status === "Rejected",
  ).length;
  const avgScore =
    total > 0
      ? posts.reduce(
          (sum, p) => sum + (p.captionScore || p.score),
          0,
        ) / total
      : 0;

  return {
    total,
    accepted,
    revised,
    rejected,
    avgScore: Math.round(avgScore * 10) / 10,
  };
}