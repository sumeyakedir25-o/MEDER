import { redirect } from "next/navigation";
import { createClient } from "@/Lib/supabase/server";
import UserList from "./UserList";

type UserProfile = {
  id: string;
  display_name: string | null;
  status: "active" | "suspended" | "banned";
  moderation_note: string | null;
  created_at: string;
  updated_at: string;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  const { data: profiles, error } = await supabase
    .from("user_profiles")
    .select(
      "id, display_name, status, moderation_note, created_at, updated_at"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold">
            Unable to load users
          </h1>

          <p className="mt-3 text-sm text-white/50">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <UserList
      initialUsers={(profiles ?? []) as UserProfile[]}
    />
  );
}