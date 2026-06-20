import { default as handler } from "./.open-next/worker.js";

export default {
  fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    // Inject Cloudflare secrets ke process.env
    // Cloudflare Workers runtime tidak otomatis expose secrets ke process.env
    process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.CRON_SECRET = env.CRON_SECRET;

    return handler.fetch(request, env, ctx);
  },
  async scheduled(event: ScheduledEvent, env: CloudflareEnv, ctx: ExecutionContext) {
    const response = await fetch(
      "https://fintar.app/api/cron/refill-hearts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
        },
      }
    );
    if (!response.ok) {
      console.error("Refill hearts cron gagal:", await response.text());
    }
  },
} satisfies ExportedHandler<CloudflareEnv>;
