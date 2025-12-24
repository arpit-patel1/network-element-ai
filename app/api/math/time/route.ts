import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const timeReadResponseSchema = z.object({
  problem: z.string().min(1, "Problem is required"),
  answer: z.string().min(1, "Answer is required"),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  period: z.string().min(1, "Period is required"),
});

const timeCalculateResponseSchema = z.object({
  problem: z.string().min(1, "Problem is required"),
  answer: z.string().min(1, "Answer is required"),
});

const timeConvertResponseSchema = z.object({
  problem: z.string().min(1, "Problem is required"),
  answer: z.string().min(1, "Answer is required"),
  hours: z.number().optional(),
  minutes: z.number().optional(),
});

const timeResponseSchema = z.union([
  timeReadResponseSchema,
  timeCalculateResponseSchema,
  timeConvertResponseSchema,
]);

const webhookResponseSchema = z.union([
  timeResponseSchema,
  z.object({ data: timeResponseSchema }),
]);

export async function GET(request: NextRequest) {
  const baseUrl = process.env.MODAL_BASE_URL?.trim();
  const apiKey = process.env.MODAL_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { error: "Missing MODAL_BASE_URL or MODAL_API_KEY environment variables." },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "read";

  try {
    // Ensure baseUrl doesn't have trailing slash
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    
    // Manual redirect handling to ensure headers are preserved
    let url = `${cleanBaseUrl}/math/time?type=${encodeURIComponent(type)}`;
    let response: Response;
    let redirectCount = 0;
    const maxRedirects = 20;
    
    const headers = {
      "X-API-Key": apiKey,
      "Accept": "application/json,text/html,application/xhtml+xml,application/xml,text/*;q=0.9,image/*;q=0.8,*/*;q=0.7",
    };
    
    do {
      response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
        redirect: "manual",
      });
      
      if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
        const location = response.headers.get("location")!;
        url = location.startsWith("http") ? location : `${cleanBaseUrl}${location}`;
        redirectCount++;
        if (redirectCount > maxRedirects) {
          return NextResponse.json(
            { error: "Too many redirects" },
            { status: 500 },
          );
        }
      } else {
        break;
      }
    } while (true);

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        {
          error: "Modal API responded with an error.",
          status: response.status,
          statusText: response.statusText,
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
          error: "Invalid payload received from Modal API.",
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
        error: "Failed to reach Modal API.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

