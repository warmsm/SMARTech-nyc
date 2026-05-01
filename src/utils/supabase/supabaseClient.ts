import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bsoxrepklddhxmpskbyk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb3hyZXBrbGRkaHhtcHNrYnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODk0OTQsImV4cCI6MjA5MjI2NTQ5NH0.F90mf-17RRbW4cNwc51sGlCwAe2EAVROPmkFovs_WVc",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "smartech-figma-auth",
    },
  },
);