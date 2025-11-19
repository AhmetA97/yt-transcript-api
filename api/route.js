import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return NextResponse.json({ transcript });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
