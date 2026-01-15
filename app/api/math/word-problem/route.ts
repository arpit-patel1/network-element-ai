import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const wordProblemResponseSchema = z.object({
  word_problem: z.string().min(1, "Word problem is required"),
  solution: z.string().min(1, "Solution is required"),
  type: z.string().min(1, "Operation type is required"),
});

const webhookResponseSchema = z.union([
  wordProblemResponseSchema,
  z.object({ data: wordProblemResponseSchema }),
]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gradeParam = searchParams.get("grade");
  const difficulty = searchParams.get("difficulty") || "medium";

  // Validate grade parameter
  if (!gradeParam) {
    return NextResponse.json(
      { error: "Grade parameter is required." },
      { status: 400 },
    );
  }

  const grade = parseInt(gradeParam, 10);
  if (isNaN(grade) || grade < 1 || grade > 12) {
    return NextResponse.json(
      { error: "Grade must be a number between 1 and 12." },
      { status: 400 },
    );
  }

  // Validate difficulty parameter
  const validDifficulties = ["easy", "medium", "hard"];
  if (!validDifficulties.includes(difficulty)) {
    return NextResponse.json(
      { error: "Difficulty must be 'easy', 'medium', or 'hard'." },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.N8N_MATH_WORD_PROBLEM_WEBHOOK_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!webhookUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing N8N_MATH_WORD_PROBLEM_WEBHOOK_URL or N8N_API_KEY environment variables." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        grade,
        difficulty,
      }),
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
