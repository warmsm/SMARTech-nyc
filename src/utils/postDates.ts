import { AuditPost } from "@/data/mockData";

const parseDate = (value?: string) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getPostingDate = (post: Pick<AuditPost, "date" | "submissionDate">) => {
  const date = parseDate(post.date);
  const submissionDate = parseDate(post.submissionDate);

  if (date && submissionDate) {
    return date >= submissionDate ? post.date : post.submissionDate!;
  }

  return post.date || post.submissionDate || "";
};
