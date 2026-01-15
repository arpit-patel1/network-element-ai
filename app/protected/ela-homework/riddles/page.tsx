"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RiddleResponse {
  riddle: string;
  answer: string;
  difficulty?: string;
}

export default function RiddlesPage() {
  const [currentRiddle, setCurrentRiddle] = useState<RiddleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadRiddle = async () => {
    setLoading(true);
    setError(null);
    setShowAnswer(false);

    try {
      const response = await fetch("/api/ela/riddle", { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new riddle. Please try again.");
        return;
      }

      const data = (await response.json()) as RiddleResponse;
      setCurrentRiddle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new riddle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiddle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-purple-500";
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-purple-500";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    if (!difficulty) return "Mixed";
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 md:gap-8 items-center py-4 md:py-8 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-2 shrink-0">
            <Link href="/protected/ela-homework">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to ELA</span>
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow shrink-0">
            Riddles
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shrink-0">
            <HelpCircle className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              ELA Homework
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Riddles
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Read the riddle, think carefully, and reveal the answer when ready.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-red-700 dark:text-red-200">Could not load a riddle.</p>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-300 break-words">{error}</p>
              </div>
              <Button onClick={loadRiddle} variant="outline" size="sm" className="shrink-0">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Riddle Card */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <HelpCircle className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Brain Teaser</CardTitle>
                <CardDescription>Think carefully about the answer before revealing it.</CardDescription>
              </div>
            </div>
            {currentRiddle?.difficulty && (
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getDifficultyColor(currentRiddle.difficulty)} text-white border-0`}
                >
                  {getDifficultyLabel(currentRiddle.difficulty)}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-sm md:text-base text-muted-foreground">Loading riddle...</p>
              </div>
            ) : currentRiddle ? (
              <>
                {/* Riddle Display */}
                <div className="rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-950/20 dark:via-pink-950/10 p-6 md:p-8 shadow-lg">
                  <p className="text-center text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed break-words">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {currentRiddle.riddle}
                    </span>
                  </p>
                </div>

                {/* Answer Section */}
                <div className="space-y-3 md:space-y-4">
                  {!showAnswer ? (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAnswer(true)}
                        size="lg"
                        className="gap-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 text-sm md:text-base"
                      >
                        <Eye className="h-4 w-4" />
                        Show Answer
                      </Button>
                    </div>
                  ) : (
                    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base md:text-lg text-purple-800 dark:text-purple-100">
                            Answer
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAnswer(false)}
                            className="gap-2"
                          >
                            <EyeOff className="h-4 w-4" />
                            <span className="hidden sm:inline">Hide</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg md:text-xl font-bold text-center break-words">
                          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {currentRiddle.answer}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-2 md:pt-4">
                  <Button
                    size="lg"
                    onClick={loadRiddle}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 md:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md gap-2 text-sm md:text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Loading...</span>
                        <span className="sm:hidden">Loading</span>
                      </>
                    ) : (
                      <>
                        Next Riddle
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
