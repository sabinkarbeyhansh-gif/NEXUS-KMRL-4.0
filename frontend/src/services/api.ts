/**
 * KMRL NEXUS - API Service Layer
 * Communicates with FastAPI Backend (/api) with graceful local-mode fallback
 */

const BASE_URL = '/api';

export interface BackendHealth {
  status: string;
  version?: string;
  ai_provider?: string;
}

export interface CopilotChatResponse {
  answer: string;
  citations: string[];
  suggested_actions?: string[];
  confidence?: number;
}

export const api = {
  // Health & AI status
  checkHealth: async (): Promise<BackendHealth | null> => {
    try {
      const res = await fetch(`${BASE_URL}/health`, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  getAIStatus: async () => {
    try {
      const res = await fetch(`${BASE_URL}/ai/status`, { method: 'GET' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Copilot Chat
  askCopilot: async (query: string, language: string = 'en'): Promise<CopilotChatResponse | null> => {
    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Documents
  getDocuments: async (department?: string, priority?: string, station?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (department && department !== 'ALL') queryParams.append('department', department);
      if (priority && priority !== 'ALL') queryParams.append('priority', priority);
      if (station && station !== 'ALL') queryParams.append('station', station);

      const res = await fetch(`${BASE_URL}/documents?${queryParams.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  getDocumentById: async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/documents/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  uploadDocument: async (formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  overridePriority: async (docId: string, payload: { human_priority: string; reason: string; user: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/documents/${docId}/override-priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Tasks
  getTasks: async (department?: string, status?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (department && department !== 'ALL') queryParams.append('department', department);
      if (status && status !== 'ALL') queryParams.append('status', status);

      const res = await fetch(`${BASE_URL}/tasks?${queryParams.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateTaskStatus: async (taskId: string, payload: { status: string; evidence_file?: string; notes?: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Risks
  getRisks: async (severity?: string, status?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (severity && severity !== 'ALL') queryParams.append('severity', severity);
      if (status && status !== 'ALL') queryParams.append('status', status);

      const res = await fetch(`${BASE_URL}/risks?${queryParams.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Conflicts
  getConflicts: async () => {
    try {
      const res = await fetch(`${BASE_URL}/conflicts`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Analytics
  getAnalytics: async (timeRange?: string, year?: number, day?: string) => {
    try {
      const params = new URLSearchParams();
      if (timeRange) params.append('time_range', timeRange);
      if (year) params.append('year', year.toString());
      if (day) params.append('day', day);
      const res = await fetch(`${BASE_URL}/analytics?${params.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Notifications
  getNotifications: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
