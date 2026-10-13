import { NextResponse } from "next/server";
import { createClient } from "@/Lib/supabase/server";

type ModerationAction = "suspend" | "ban" | "restore";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check that someone is signed in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // 2. Check that the signed-in user is an admin
    const { data: adminProfile, error: adminError } =
      await supabase
        .from("user_profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();

    if (adminError || !adminProfile) {
      return NextResponse.json(
        { error: "Admin profile not found." },
        { status: 403 }
      );
    }

    if (adminProfile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    if (adminProfile.status !== "active") {
      return NextResponse.json(
        { error: "Your admin account is not active." },
        { status: 403 }
      );
    }

    // 3. Read request
    const body = await request.json();

    const targetUserId =
      typeof body?.userId === "string"
        ? body.userId
        : "";

    const action =
      typeof body?.action === "string"
        ? body.action
        : "";

    const moderationNote =
      typeof body?.moderationNote === "string"
        ? body.moderationNote.trim()
        : "";

    // 4. Validate user ID
    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // 5. Validate action
    if (
      action !== "suspend" &&
      action !== "ban" &&
      action !== "restore"
    ) {
      return NextResponse.json(
        { error: "Invalid moderation action." },
        { status: 400 }
      );
    }

    // 6. Prevent self-moderation
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: "You cannot moderate your own account." },
        { status: 400 }
      );
    }

    // 7. Convert action to database status
    const nextStatus =
      action === "suspend"
        ? "suspended"
        : action === "ban"
          ? "banned"
          : "active";

    // 8. Make sure the target profile exists
    const { data: targetProfile, error: targetError } =
      await supabase
        .from("user_profiles")
        .select("id, role, status")
        .eq("id", targetUserId)
        .single();

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    // 9. Prevent changing another admin through this basic system
    if (targetProfile.role === "admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot be moderated here." },
        { status: 403 }
      );
    }

    // 10. Update the user's moderation status
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        status: nextStatus,
        moderation_note: moderationNote || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (updateError) {
      console.error("User moderation update error:", updateError);

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: nextStatus,
    });
  } catch (error) {
    console.error("User moderation error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while processing moderation.",
      },
      { status: 500 }
    );
  }
}