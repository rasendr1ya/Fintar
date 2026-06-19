declare module "./.open-next/worker.js" {
  const handler: {
    fetch: (
      request: Request,
      env: Record<string, unknown>,
      ctx: ExecutionContext
    ) => Promise<Response>;
  };
  export default handler;
}

interface CloudflareEnv {
  ASSETS: Fetcher;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CRON_SECRET: string;
}
