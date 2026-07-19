import { useAuthStore } from '@/store/authStore';
import { env } from '@/lib/env';
import type { Job } from '@/types';

const API_BASE_URL = env.VITE_API_URL;

// ─── Mock data (remove when backend is ready) ─────────────────────────────────

const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    type: 'rubiks-cube',
    status: 'succeeded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'job-002',
    type: 'rubiks-cube',
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'job-003',
    type: 'rubiks-cube',
    status: 'failed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    errorMessage: 'Could not determine cube state from the provided images.',
  },
];

const MOCK_JOB_MAP: Record<string, Job> = Object.fromEntries(
  MOCK_JOBS.map((j) => [j.id, j])
);

// ─── API functions ─────────────────────────────────────────────────────────────

export const jobApi = {
  getJobs: async (): Promise<Job[]> => {
    // TODO: replace with real API call
    // const fetchWithAuth = useAuthStore.getState().fetchWithAuth;
    // const res = await fetchWithAuth(`${API_BASE_URL}/jobs`);
    // if (!res.ok) throw new Error('Failed to fetch jobs');
    // const body = await res.json();
    // return body.data;
    return MOCK_JOBS;
  },

  getJob: async (jobId: string): Promise<Job | null> => {
    // TODO: replace with real API call
    // const fetchWithAuth = useAuthStore.getState().fetchWithAuth;
    // const res = await fetchWithAuth(`${API_BASE_URL}/jobs/${jobId}`);
    // if (res.status === 404) return null;
    // if (!res.ok) throw new Error('Failed to fetch job');
    // const body = await res.json();
    // return body.data;
    return MOCK_JOB_MAP[jobId] ?? null;
  },

  createJob: async (contentTypes: Record<string, string>) => {
    const fetchWithAuth = useAuthStore.getState().fetchWithAuth;
    const res = await fetchWithAuth(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify({ contentTypes }),
    });
    if (!res.ok) throw new Error('Failed to create job');
    const body = await res.json();
    return body.data as { jobId: string; presignedUrls: Record<string, string> };
  },

  uploadFaceImage: async (presignedUrl: string, file: File): Promise<void> => {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    if (!res.ok) throw new Error(`Failed to upload image: ${res.status}`);
  },
};

// Suppress unused import warning until real API calls are wired up
void API_BASE_URL;
