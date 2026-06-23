import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "secret" }, async (req, ctx) => {
    // ctx.supabaseAdmin is initialized using the secret key (service_role) and bypasses RLS
    let body = {}
    try {
      if (req.method === "POST") {
        body = await req.json()
      }
    } catch (e) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const action = body.action || "unspecified_admin_action"

    // Perform a bypass-RLS operation
    const { data, error } = await ctx.supabaseAdmin
      .from("system_logs")
      .insert({ action, triggered_by: "edge_function_admin" })
      .select()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, message: "Administrative task completed", data })
  }),
}
