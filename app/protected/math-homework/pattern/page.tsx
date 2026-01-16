"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Shapes, Loader2, Eye, Calculator, Lightbulb } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface PatternResponse {
  pattern: (string | number)[];
  answer: string | number;
  type: string;
  hint?: string;
}

type PatternType = "number" | "shape" | "color";

export default function PatternPage() {
  const [data, setData] = useState<PatternResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHintRevealed, setIsHintRevealed] = useState(false);
  const [type, setType] = useState<PatternType>("number");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const loadQuestion = async (patternType: PatternType) => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);
    setIsHintRevealed(false);
    setUserAnswer("");
    setFeedback(null);

    try {
      const response = await fetch(`/api/math/pattern?type=${encodeURIComponent(patternType)}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as PatternResponse;
      setData(questionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleCheckAnswer = () => {
    if (!data || !userAnswer) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = String(data.answer).toLowerCase();

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (data && userAnswer) {
      handleCheckAnswer();
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/protected/math-homework">
              <ArrowLeft className="h-4 w-4" />
              Back to Math
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0 shadow">
            Pattern Recognition
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl shadow-lg">
            <Shapes className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-pink-600 dark:text-pink-300 font-semibold">
              Math
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-pink-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                Pattern Recognition
              </span>
            </h1>
            <p className="text-muted-foreground">
              Identify the pattern and find the missing element.
            </p>
          </div>
        </div>

        {/* Type Selector */}
        <Card className="border-2 bg-gradient-to-br from-pink-50/40 via-blue-50/30 to-transparent dark:from-pink-950/30 dark:via-blue-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-pink-800 dark:text-pink-100">Choose Pattern Type</CardTitle>
            <CardDescription>Select the type of pattern you want to practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={type} onValueChange={(value) => setType(value as PatternType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="number">Number</TabsTrigger>
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="color">Color</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a question.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={() => loadQuestion(type)} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 bg-gradient-to-br from-pink-50/40 via-blue-50/30 to-transparent dark:from-pink-950/30 dark:via-blue-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg shadow-md">
                <Calculator className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-pink-800 dark:text-pink-100">Question</CardTitle>
                <CardDescription>Find the missing element in the pattern.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
                <p className="text-muted-foreground">Loading question...</p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <div className="flex flex-wrap gap-3 items-center justify-center mb-4">
                    {data.pattern.map((item, index) => (
                      <div
                        key={index}
                        className="text-3xl font-bold px-4 py-2 rounded-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 border border-pink-300 dark:border-pink-700"
                      >
                        {item === "?" ? (
                          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                            ?
                          </span>
                        ) : (
                          <span className="bg-gradient-to-r from-pink-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                            {item}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {data.hint && (
                    <div className="mt-4">
                      {!isHintRevealed ? (
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsHintRevealed(true)}
                            className="gap-2"
                          >
                            <Lightbulb className="w-4 h-4" />
                            Show Hint
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Hint: {data.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {!isRevealed ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Answer</label>
                      <Input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer"
                        className="text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && userAnswer) {
                            handleCheckAnswer();
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        size="lg"
                        onClick={handleCheckAnswer}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 shadow-md"
                      >
                        Check Answer
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleReveal}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Reveal Answer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50/50 via-blue-50/30 to-transparent dark:from-pink-950/20 dark:via-blue-950/10">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-pink-800 dark:text-pink-100 text-lg mb-2">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-pink-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                          {data.answer}
                        </span>
                      </h2>
                    </CardContent>
                  </Card>
                )}

                {feedback && !isRevealed && (
                  <div
                    className={`p-4 rounded-lg border ${
                      feedback === "correct"
                        ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-100 dark:border-green-800"
                        : "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-100 dark:border-red-800"
                    }`}
                  >
                    <p className="font-semibold text-center">
                      {feedback === "correct" ? "✓ Correct! Well done! 🎉" : "✗ Incorrect. Try again!"}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => loadQuestion(type)}
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

