"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ComprehensionQuestion = {
  id?: string;
  paragraph: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  correctAnswerKey?: "ChoiceA" | "ChoiceB" | "ChoiceC" | "ChoiceD";
};

type FeedbackState = "correct" | "incorrect" | null;

function MarioLuigiQuizContent() {
  const searchParams = useSearchParams();
  const characters = searchParams.get("characters") || "Mario,Luigi";
  
  const [question, setQuestion] = useState<ComprehensionQuestion | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedChoice(null);
    setFeedback(null);
    setHasSubmitted(false);

    try {
      const response = await fetch(`/api/mario-luigi-quiz?characters=${encodeURIComponent(characters)}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new passage. Please try again.");
        return;
      }

      const data = (await response.json()) as ComprehensionQuestion;
      setQuestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new passage. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters]);

  const handleSubmit = () => {
    if (!question || selectedChoice === null) return;
    setHasSubmitted(true);
    setFeedback(selectedChoice === question.correctAnswer ? "correct" : "incorrect");
  };

  const feedbackBanner =
    feedback &&
    question && (
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border ${
          feedback === "correct"
            ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-100 dark:border-green-800"
            : "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-100 dark:border-red-800"
        }`}
      >
        {feedback === "correct" ? (
          <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="h-5 w-5 mt-0.5 text-red-600 dark:text-red-400" />
        )}
        <div className="space-y-1">
          <p className="font-semibold">{feedback === "correct" ? "Great job! 🎉" : "Not quite. Keep reading!"}</p>
          <p className="text-sm text-muted-foreground">
            Correct answer:{" "}
            <span className="font-semibold text-foreground">
              {question.correctAnswer} {question.correctAnswerKey ? `(${question.correctAnswerKey})` : ""}
            </span>
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/protected/ela-homework">
              <ArrowLeft className="h-4 w-4" />
              Back to ELA
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow">
            Mario & Luigi Quiz
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-green-600 dark:text-green-300 font-semibold">
              ELA Homework
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 bg-clip-text text-transparent">
                Mario & Luigi Quiz
              </span>
            </h1>
            <p className="text-muted-foreground">
              Read the passage, pick the best answer, and get instant feedback.
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

        <Card className="border-2 bg-gradient-to-br from-green-50/40 via-emerald-50/30 to-transparent dark:from-green-950/30 dark:via-emerald-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-md">
                <Sparkles className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-green-800 dark:text-green-100">Passage & Question</CardTitle>
                <CardDescription>Read carefully, then choose the best answer.</CardDescription>
              </div>
            </div>
            {question?.id && (
              <p className="text-xs text-muted-foreground">Question ID: {question.id}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-background/70 p-4 shadow-sm">
              <p className="text-sm leading-7 text-foreground">{question?.paragraph ?? "Loading passage..."}</p>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">{question?.question ?? "Loading question..."}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(question?.choices ?? Array(4).fill(""))?.map((choice, idx) => {
                  const isSelected = selectedChoice === choice;
                  const isCorrect = feedback && question && choice === question.correctAnswer;
                  const isIncorrect = feedback === "incorrect" && isSelected && !isCorrect;

                  return (
                    <Button
                      key={`${choice}-${idx}`}
                      variant={isSelected ? "default" : "outline"}
                      disabled={loading || (hasSubmitted && feedback === "correct")}
                      onClick={() => {
                        if (hasSubmitted) return;
                        setSelectedChoice(choice);
                      }}
                      className={`w-full justify-start items-start h-auto min-h-12 py-4 px-4 text-left font-medium transition-all whitespace-normal break-words ${
                        isCorrect
                          ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                          : isIncorrect
                          ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                          : isSelected
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                          : ""
                      }`}
                    >
                      <span className="mr-2 text-sm text-muted-foreground leading-snug">
                        ({String.fromCharCode(65 + idx)})
                      </span>
                      <span className="flex-1 text-left whitespace-normal break-words leading-snug">
                        {choice || <span className="text-muted-foreground">Loading...</span>}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {feedbackBanner}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || selectedChoice === null || hasSubmitted}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                >
                  {hasSubmitted ? "Submitted" : "Submit answer"}
                </Button>
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
                      New passage
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {hasSubmitted && feedback && (
                <p className="text-sm text-muted-foreground">
                  Want to try another? Tap <span className="font-semibold text-foreground">New passage</span>.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MarioLuigiQuizPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        </div>
      </div>
    }>
      <MarioLuigiQuizContent />
    </Suspense>
  );
}

