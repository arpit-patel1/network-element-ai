import { NextResponse } from "next/server";
import { z } from "zod";

const annotationSchema = z.object({
  explanation: z.string().min(1, "Explanation is required"),
  example: z.string().optional(),
  usage: z.string().optional(),
});

const webhookResponseSchema = z.union([
  annotationSchema,
  z.object({ data: annotationSchema }),
]);

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_ANNOTATION_WEBHOOK_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!webhookUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing N8N_ANNOTATION_WEBHOOK_URL or N8N_API_KEY environment variables." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { word } = body;

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "Word parameter is required." },
        { status: 400 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
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

