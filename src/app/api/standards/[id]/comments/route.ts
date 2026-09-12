import { NextRequest, NextResponse } from "next/server";
import { getCommentsForStandard, addDraftComment } from "@/lib/backend/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getCommentsForStandard(id);

    return NextResponse.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error: any) {
    console.error("Get Comments Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch standard comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.comment || !body.comment.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment text is required" },
        { status: 400 }
      );
    }

    const newComment = await addDraftComment({
      standardId: id,
      userName: body.userName || "Verified Stakeholder",
      organization: body.organization || "Industry Representative",
      comment: body.comment,
      section: body.section || "General Consultation"
    });

    return NextResponse.json({
      success: true,
      comment: newComment
    }, { status: 201 });
  } catch (error: any) {
    console.error("Post Comment Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
