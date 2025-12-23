import { NextResponse } from "next/server";
import { z } from "zod";

const choiceSchema = z.object({
  ChoiceA: z.string().min(1, "ChoiceA is required"),
  ChoiceB: z.string().min(1, "ChoiceB is required"),
  ChoiceC: z.string().min(1, "ChoiceC is required"),
  ChoiceD: z.string().min(1, "ChoiceD is required"),
});

const questionSchema = z.object({
  id: z.string().min(1).optional(),
  paragraph: z.string().min(1, "Passage text is required"),
  question: z.string().min(1, "Question is required"),
  choices: choiceSchema,
  correctAnswer: z.enum(["ChoiceA", "ChoiceB", "ChoiceC", "ChoiceD"], {
    errorMap: () => ({ message: "correctAnswer must be one of ChoiceA/ChoiceB/ChoiceC/ChoiceD" }),
  }),
});

const webhookResponseSchema = z.union([
  questionSchema,
  z.object({ data: questionSchema }),
]);

export async function GET() {
  const webhookUrl = process.env.N8N_READING_WEBHOOK_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!webhookUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing N8N_READING_WEBHOOK_URL or N8N_API_KEY environment variables." },
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

    const normalized = "data" in parsed.data ? parsed.data.data : parsed.data;

    const { choices, correctAnswer, ...rest } = normalized;
    const flatChoices = [
      choices.ChoiceA,
      choices.ChoiceB,
      choices.ChoiceC,
      choices.ChoiceD,
    ];
    const correctAnswerText = choices[correctAnswer];

    return NextResponse.json({
      ...rest,
      choices: flatChoices,
      correctAnswer: correctAnswerText,
      correctAnswerKey: correctAnswer,
    });
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

