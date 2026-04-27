import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuditPost } from "@/data/mockData";
import { api } from "@/utils/supabase/client";

interface PostsContextType {
  posts: AuditPost[];
  addPost: (post: AuditPost) => Promise<void>;
  updatePost: (postId: string, updatedPost: AuditPost) => Promise<void>;
  centralReviewPost: (postId: string, status: string, comment?: string) => Promise<void>;
  appealPost: (postId: string, comment: string) => Promise<void>;
  reviewAppeal: (postId: string, approved: boolean, comment?: string) => Promise<void>;
  isLoading: boolean;
}

const PostsContext = createContext<
  PostsContextType | undefined
>(undefined);

export function PostsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<AuditPost[]>([]);

  // Fetch posts from server on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/posts");
        setPosts(response.posts || []);
      } catch (error) {
        console.error("Error loading posts from server:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (post: AuditPost): Promise<void> => {
    try {
      await api.post("/posts", post);
      setPosts((prevPosts) => [post, ...prevPosts]);
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  };

  const updatePost = async (
    postId: string,
    updatedPost: AuditPost,
  ): Promise<void> => {
    try {
      await api.put(`/posts/${postId}`, updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post,
        ),
      );
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const centralReviewPost = async (
    postId: string,
    status: string,
    comment?: string,
  ): Promise<void> => {
    try {
      await api.post(`/posts/${postId}/central-review`, {
        centralReviewStatus: status,
        centralReviewComment: comment,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                centralReviewStatus: status as any,
                centralReviewComment: comment,
                centralReviewDate: new Date().toISOString().split("T")[0],
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error reviewing post:", error);
      throw error;
    }
  };

  const appealPost = async (
    postId: string,
    comment: string,
  ): Promise<void> => {
    try {
      await api.post(`/posts/${postId}/appeal`, {
        appealComment: comment,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                appealStatus: "Appealed",
                appealComment: comment,
                appealDate: new Date().toISOString().split("T")[0],
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error appealing post:", error);
      throw error;
    }
  };

  const reviewAppeal = async (
    postId: string,
    approved: boolean,
    comment?: string,
  ): Promise<void> => {
    try {
      await api.post(`/posts/${postId}/review-appeal`, {
        approved,
        centralReviewComment: comment,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                appealStatus: approved ? "Appeal Approved" : "Appeal Rejected",
                centralReviewStatus: approved ? "Good for Posting" : "For Revision",
                centralReviewComment: comment,
                centralReviewDate: new Date().toISOString().split("T")[0],
              }
            : post,
        ),
      );
    } catch (error) {
      console.error("Error reviewing appeal:", error);
      throw error;
    }
  };

  return (
    <PostsContext.Provider
      value={{ posts, addPost, updatePost, centralReviewPost, appealPost, reviewAppeal, isLoading }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error(
      "usePosts must be used within a PostsProvider",
    );
  }
  return context;
}