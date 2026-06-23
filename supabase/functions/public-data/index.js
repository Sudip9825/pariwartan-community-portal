import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "publishable" }, async (_req, ctx) => {
    // ctx.supabase is initialized with the publishable/anon key
    // Accessible without user authentication JWT, but enforces public RLS policies
    const { data, error } = await ctx.supabase
      .from("news")
      .select("id, title, excerpt, published_at")
      .limit(10)

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ news: data })
  }),
}
