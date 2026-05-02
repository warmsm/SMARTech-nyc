import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
// Import your providers so the app doesn't crash on 'useAuth' or 'usePosts'
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";

// Import the page you want to show as the landing page
import { PubMatsPage } from "./app/pages/PubMatsPage"; 

import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PostsProvider>
        {/* Rendering PubMatsPage directly since App.tsx is missing */}
        <PubMatsPage />
      </PostsProvider>
    </AuthProvider>
  </StrictMode>
);