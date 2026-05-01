// Supabase Edge Functions URL
const serverUrl =
  "https://bsoxrepklddhxmpskbyk.supabase.co/functions/v1/make-server-e75a6481";
const publicAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb3hyZXBrbGRkaHhtcHNrYnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODk0OTQsImV4cCI6MjA5MjI2NTQ5NH0.F90mf-17RRbW4cNwc51sGlCwAe2EAVROPmkFovs_WVc";

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${errorText}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // If not JSON, use the text as is
      }

      throw new Error(errorMessage);
    }

    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  },
};