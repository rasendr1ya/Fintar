import { default as handler } from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,
  async scheduled(event, env, ctx) {
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
