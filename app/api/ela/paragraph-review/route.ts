import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  feedback: z.string().min(1, "Feedback is required"),
});

const webhookResponseSchema = z.union([
  feedbackSchema,
  z.object({ data: feedbackSchema }),
]);

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_PARAGRAPH_REVIEW_WEBHOOK_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!webhookUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing N8N_PARAGRAPH_REVIEW_WEBHOOK_URL or N8N_API_KEY environment variables." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { paragraph } = body;

    if (!paragraph || typeof paragraph !== "string" || paragraph.trim().length === 0) {
      return NextResponse.json(
        { error: "Paragraph parameter is required and cannot be empty." },
        { status: 400 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paragraph: paragraph.trim() }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        {
          error: "n8n webhook responded with an error.",
          status: response.status,
          body,
        },
        { status: response.status || 502 },
      );
    }

    const payload = await response.json();
    const parsed = webhookResponseSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload received from n8n.",
          issues: parsed.error.flatten(),
        },
        { status: 502 },
      );
    }

    const normalized = "data" in parsed.data ? parsed.data.data : parsed.data;

    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach n8n webhook.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

