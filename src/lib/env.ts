const REQUIRED_ENV_VARS = ['VITE_AUTH_SERVICE_URL', 'VITE_API_URL'] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

export function assertRequiredEnvVars(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Set them in your .env file (see .env.example) before starting the app.'
    );
  }
}

export const env: Record<RequiredEnvVar, string> = {
  VITE_AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
};
