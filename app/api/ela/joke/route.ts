import { NextResponse } from "next/server";
import { z } from "zod";

const chuckNorrisResponseSchema = z.object({
  value: z.string().min(1, "Joke value is required"),
});

const dadJokeResponseSchema = z.object({
  joke: z.string().min(1, "Joke is required"),
  status: z.number().optional(),
});

const randomJokeResponseSchema = z.object({
  type: z.string().optional(),
  setup: z.string().min(1, "Setup is required"),
  punchline: z.string().min(1, "Punchline is required"),
  id: z.number().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "chuck-norris";

  try {
    let response: Response;
    let jokeText: string;
    let jokeSetup: string | undefined;
    let jokePunchline: string | undefined;

    if (type === "chuck-norris") {
      response = await fetch("https://api.chucknorris.io/jokes/random", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Chuck Norris API responded with an error.",
            status: response.status,
            statusText: response.statusText,
          },
          { status: response.status || 502 },
        );
      }

      const payload = await response.json();
      const parsed = chuckNorrisResponseSchema.safeParse(payload);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Invalid payload received from Chuck Norris API.",
            issues: parsed.error.flatten(),
          },
          { status: 502 },
        );
      }

      jokeText = parsed.data.value;
    } else if (type === "dad-joke") {
      response = await fetch("https://icanhazdadjoke.com/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Dad Jokes API responded with an error.",
            status: response.status,
            statusText: response.statusText,
          },
          { status: response.status || 502 },
        );
      }

      const payload = await response.json();
      const parsed = dadJokeResponseSchema.safeParse(payload);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Invalid payload received from Dad Jokes API.",
            issues: parsed.error.flatten(),
          },
          { status: 502 },
        );
      }

      jokeText = parsed.data.joke;
    } else if (type === "random-joke") {
      response = await fetch("https://official-joke-api.appspot.com/random_joke", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Random Joke API responded with an error.",
            status: response.status,
            statusText: response.statusText,
          },
          { status: response.status || 502 },
        );
      }

      const payload = await response.json();
      const parsed = randomJokeResponseSchema.safeParse(payload);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Invalid payload received from Random Joke API.",
            issues: parsed.error.flatten(),
          },
          { status: 502 },
        );
      }

      jokeSetup = parsed.data.setup;
      jokePunchline = parsed.data.punchline;
      jokeText = `${parsed.data.setup} ${parsed.data.punchline}`;
    } else {
      return NextResponse.json(
        { error: "Invalid joke type. Must be 'chuck-norris', 'dad-joke', or 'random-joke'." },
        { status: 400 },
      );
    }

    const typeLabel =
      type === "chuck-norris" ? "Chuck Norris" : type === "dad-joke" ? "Dad Joke" : "Random Joke";

    return NextResponse.json({
      joke: jokeText,
      setup: jokeSetup,
      punchline: jokePunchline,
      type: typeLabel,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch joke.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
