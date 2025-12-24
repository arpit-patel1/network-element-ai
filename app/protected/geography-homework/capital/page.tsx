"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe, Loader2, Eye } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CapitalResponse {
  country: string;
  capital: string;
  continent: string;
  hint: string;
}

export default function CapitalPage() {
  const [data, setData] = useState<CapitalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);

    try {
      const response = await fetch("/api/geography/capital", { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as CapitalResponse;
      setData(questionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/protected/geography-homework">
              <ArrowLeft className="h-4 w-4" />
              Back to Geography
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow">
            Country-Capital Pair
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
            <Globe className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-600 dark:text-emerald-300 font-semibold">
              Geography Homework
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                Country-Capital Pair
              </span>
            </h1>
            <p className="text-muted-foreground">
              Read the hint question and reveal the answer when ready.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a question.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={loadQuestion} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-transparent dark:from-emerald-950/30 dark:via-green-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                <Globe className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-emerald-800 dark:text-emerald-100">Question</CardTitle>
                <CardDescription>Read the hint and think about your answer.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-muted-foreground">Loading question...</p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                    <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {data.hint}
                    </span>
                  </h2>
                </div>

                {!isRevealed ? (
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setIsRevealed(true)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Reveal Answer
                    </Button>
                  </div>
                ) : (
                  <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-transparent dark:from-emerald-950/20 dark:via-green-950/10">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-emerald-800 dark:text-emerald-100 text-lg mb-2">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                          {data.capital}
                        </span>
                      </h2>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={loadQuestion}
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
                        New Question
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

