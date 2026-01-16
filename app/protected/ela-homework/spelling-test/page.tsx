"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, SpellCheck, Loader2, BookOpen, ArrowRight, Info, X } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WordResponse {
  word: string;
  difficulty: "easy" | "medium" | "hard";
}

interface WordExplanation {
  explanation: string;
  example?: string;
  usage?: string;
}

export default function SpellingTestPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [currentWord, setCurrentWord] = useState<WordResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const loadWord = async (difficulty: "easy" | "medium" | "hard") => {
    setLoading(true);
    setError(null);
    setExplanation(null);
    setExplanationError(null);

    try {
      const response = await fetch(`/api/ela/spelling-test?difficulty=${difficulty}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new word. Please try again.");
        return;
      }

      const data = (await response.json()) as WordResponse;
      setCurrentWord(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new word. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadExplanation = async () => {
    if (!currentWord) return;

    setExplanationLoading(true);
    setExplanationError(null);

    try {
      const response = await fetch("/api/ela/spelling-annotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: currentWord.word }),
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setExplanationError(body?.error || "Unable to load explanation. Please try again.");
        return;
      }

      const data = (await response.json()) as WordExplanation;
      setExplanation(data);
    } catch (err) {
      setExplanationError(err instanceof Error ? err.message : "Unable to load explanation. Please try again.");
    } finally {
      setExplanationLoading(false);
    }
  };

  useEffect(() => {
    loadWord(selectedDifficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDifficulty]);

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
            Spelling Test
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shrink-0">
            <BookOpen className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              ELA Homework
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Spelling Test
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Display words for students to spell. Students write answers on their notepad.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-red-700 dark:text-red-200">Could not load a word.</p>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-300 break-words">{error}</p>
              </div>
              <Button onClick={() => loadWord(selectedDifficulty)} variant="outline" size="sm" className="shrink-0">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Word Card */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <SpellCheck className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Word to Spell</CardTitle>
                <CardDescription>Read this word aloud for students to write on their notepad.</CardDescription>
              </div>
            </div>
            
            {/* Difficulty Selector */}
            <Tabs value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as "easy" | "medium" | "hard")}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="easy" className="text-sm md:text-base">
                  Easy
                </TabsTrigger>
                <TabsTrigger value="medium" className="text-sm md:text-base">
                  Medium
                </TabsTrigger>
                <TabsTrigger value="hard" className="text-sm md:text-base">
                  Hard
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-sm md:text-base text-muted-foreground">Loading word...</p>
              </div>
            ) : currentWord ? (
              <>
                {/* Word Display - Large and clear for teacher to read */}
                <div className="rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-950/20 dark:via-pink-950/10 p-6 md:p-8 lg:p-12 shadow-lg">
                  <p className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 md:mb-4 break-words hyphens-auto">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {currentWord.word}
                    </span>
                  </p>
                  <p className="text-center text-sm md:text-base lg:text-lg text-muted-foreground">
                    Read this word for students to spell
                  </p>
                </div>

                {/* Explanation Button and Display */}
                <div className="space-y-3 md:space-y-4">
                  {!explanation ? (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={loadExplanation}
                        disabled={explanationLoading}
                        size="sm"
                        className="gap-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 text-xs md:text-sm"
                      >
                        {explanationLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                            <span className="hidden sm:inline">Loading explanation...</span>
                            <span className="sm:hidden">Loading...</span>
                          </>
                        ) : (
                          <>
                            <Info className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="hidden sm:inline">Get Explanation</span>
                            <span className="sm:hidden">Explanation</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base md:text-lg text-purple-800 dark:text-purple-100">
                            Word Explanation
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExplanation(null)}
                            className="h-8 w-8 p-0 shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 md:space-y-4">
                        <div>
                          <p className="text-xs md:text-sm font-semibold text-foreground mb-1 md:mb-2">Explanation:</p>
                          <p className="text-xs md:text-sm text-foreground leading-relaxed break-words">{explanation.explanation}</p>
                        </div>
                        {explanation.example && (
                          <div>
                            <p className="text-xs md:text-sm font-semibold text-foreground mb-1 md:mb-2">Example:</p>
                            <p className="text-xs md:text-sm text-foreground leading-relaxed italic break-words">
                              {explanation.example}
                            </p>
                          </div>
                        )}
                        {explanation.usage && (
                          <div>
                            <p className="text-xs md:text-sm font-semibold text-foreground mb-1 md:mb-2">Usage:</p>
                            <p className="text-xs md:text-sm text-foreground leading-relaxed break-words">{explanation.usage}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {explanationError && (
                    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30 p-3">
                      <p className="text-xs md:text-sm text-red-700 dark:text-red-300 break-words">{explanationError}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-2 md:pt-4">
                  <Button
                    size="lg"
                    onClick={() => loadWord(selectedDifficulty)}
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
                        Next Word
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

