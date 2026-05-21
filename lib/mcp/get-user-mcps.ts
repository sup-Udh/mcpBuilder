import { createClient } from "../vector/client";
export async function getUserMcps() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } =
    await supabase
      .from("mcp_servers")
      .select("*")
      .order("created_at", {
        ascending: false,
      })

  if (error) {
    console.error(error)

    return []
  }

  return data
}