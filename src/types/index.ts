/**
 * src/types/index.ts
 *
 * Shared TypeScript types for rubiks-cube-solver-web.
 * Centralising types here keeps them easy to find and ensures consistency
 * across all components, pages, and API calls.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents the currently authenticated user.
 * Populated from Cognito JWT claims once the auth service is integrated.
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Jobs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All possible states a job can be in throughout its lifecycle.
 *
 * State transition:
 *   pending → uploaded → processing → succeeded
 *                                   → failed
 */
export type JobStatus =
  | "pending"     // Job record created, pre-signed S3 URLs issued; awaiting upload
  | "uploaded"    // Files uploaded to S3; worker will pick up soon
  | "processing"  // Worker is running the solver
  | "succeeded"   // Solver finished; results are available
  | "failed";     // Something went wrong — see errorMessage

/**
 * The type of tool that created the job.
 * New tools will be added here as the platform grows.
 */
export type JobType = "rubiks-cube";

/**
 * A job record as returned from the API.
 */
export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
  imageUrls?: string[];  // S3 URLs for the 6 uploaded face images
  resultUrl?: string;    // S3 URL for the result JSON (only when succeeded)
  errorMessage?: string; // Human-readable error detail (only when failed)
}

/**
 * The solving result returned once a Rubik's cube job succeeds.
 * Contains the sequence of moves in standard WCA notation.
 */
export interface RubiksCubeResult {
  moves: string[];   // e.g. ["U", "R", "F2", "B'", "L"]
  moveCount: number;
  notation: string;  // Full solution as a single string, e.g. "U R F2 B' L"
  cubeState?: string; // 54-char kociemba string — U(9) R(9) F(9) D(9) L(9) B(9)
}
