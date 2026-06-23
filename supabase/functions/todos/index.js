import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase is authenticated as the user and respects RLS policies
    const { data, error } = await ctx.supabase.from("todos").select()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ data })
  }),
}
