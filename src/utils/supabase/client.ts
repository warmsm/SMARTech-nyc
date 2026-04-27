/// <reference types="vite/client" />

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e75a6481`;

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${serverUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
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
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
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
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
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
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  },
};