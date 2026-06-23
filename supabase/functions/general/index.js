import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "none" }, async (_req, ctx) => {
    // Accessible without any authentication headers (ideal for public APIs or health checks)
    return Response.json({
      status: "online",
      message: "Welcome to the Pariwartan Community Portal API",
      timestamp: new Date().toISOString(),
    })
  }),
}
