import { NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  topic: z.string().min(1, "Topic is required"),
  type: z.string().min(1, "Type is required"),
  answer: z.union([z.string(), z.boolean()]).transform((val) => String(val)),
  explanation: z.string().min(1, "Explanation is required"),
});

const webhookResponseSchema = z.union([
  questionSchema,
  z.array(questionSchema),
  z.object({ data: questionSchema }),
]);

export async function GET() {
  const webhookUrl = process.env.N8N_SCIENCE_QUIZ_WEBHOOK_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!webhookUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing N8N_SCIENCE_QUIZ_WEBHOOK_URL or N8N_API_KEY environment variables." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
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

    // Normalize the response
    let normalized;
    if (Array.isArray(parsed.data)) {
      // If array, take the first item
      normalized = parsed.data[0];
    } else if ("data" in parsed.data) {
      // If wrapped in data object
      normalized = parsed.data.data;
    } else {
      // Direct object
      normalized = parsed.data;
    }

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

