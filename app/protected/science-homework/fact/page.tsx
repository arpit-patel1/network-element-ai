"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical, Loader2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FactResponse {
  topic: string;
  fact: string;
}

const topics: Array<"animals" | "space" | "plants" | "weather"> = ["animals", "space", "plants", "weather"];

const getRandomTopic = (): string => {
  return topics[Math.floor(Math.random() * topics.length)];
};

export default function ScienceFactPage() {
  const [data, setData] = useState<FactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFact = async (topic?: string) => {
    setLoading(true);
    setError(null);

    const selectedTopic = topic || getRandomTopic();

    try {
      const response = await fetch(`/api/science/fact?topic=${encodeURIComponent(selectedTopic)}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new fact. Please try again.");
        return;
      }

      const factData = (await response.json()) as FactResponse;
      setData(factData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new fact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/protected/science-homework">
              <ArrowLeft className="h-4 w-4" />
              Back to Science
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow">
            Science Facts
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <FlaskConical className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Science Homework
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Science Facts
              </span>
            </h1>
            <p className="text-muted-foreground">
              Learn interesting science facts. Topics are selected at random.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a fact.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={() => loadFact()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <FlaskConical className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Fact</CardTitle>
                <CardDescription>Read the fact and learn something new.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-muted-foreground">Loading fact...</p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <div className="mb-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {data.topic.charAt(0).toUpperCase() + data.topic.slice(1)}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {data.fact}
                    </span>
                  </h2>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => loadFact()}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        New Fact
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

