"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical, Loader2, CheckCircle2, XCircle, BookOpen } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  question: string;
  topic: string;
  type: string;
  answer: string;
  explanation: string;
}

export default function ScienceQuizPage() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setHasSubmitted(false);

    try {
      const response = await fetch("/api/science/quiz", { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as QuizQuestion;
      setQuestion(questionData);
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

  const handleAnswer = (answer: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!question || selectedAnswer === null || hasSubmitted) return;
    setHasSubmitted(true);
    setFeedback(selectedAnswer.toLowerCase() === question.answer.toLowerCase() ? "correct" : "incorrect");
  };

  const handleNext = () => {
    loadQuestion();
  };

  const feedbackBanner =
    feedback &&
    question &&
    hasSubmitted && (
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
        <div className="space-y-1 flex-1">
          <p className="font-semibold">{feedback === "correct" ? "Correct! 🎉" : "Incorrect"}</p>
          <p className="text-sm">{question.explanation}</p>
        </div>
      </div>
    );

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
            Science Quiz
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <FlaskConical className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Science
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Science Quiz
              </span>
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge with true/false questions. Topics are selected at random.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a quiz.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={() => loadQuestion()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <BookOpen className="text-white" size={22} />
                </div>
                <div>
                  <CardTitle className="text-purple-800 dark:text-purple-100">Question</CardTitle>
                  <CardDescription>Answer true or false.</CardDescription>
                </div>
              </div>
              {question && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {question.topic.charAt(0).toUpperCase() + question.topic.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-muted-foreground">Loading question...</p>
              </div>
            ) : question ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {question.question}
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    variant={selectedAnswer === "true" ? "default" : "outline"}
                    disabled={loading || hasSubmitted}
                    onClick={() => handleAnswer("true")}
                    className={`h-20 text-lg font-semibold ${
                      selectedAnswer === "true"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : ""
                    }`}
                  >
                    True
                  </Button>
                  <Button
                    size="lg"
                    variant={selectedAnswer === "false" ? "default" : "outline"}
                    disabled={loading || hasSubmitted}
                    onClick={() => handleAnswer("false")}
                    className={`h-20 text-lg font-semibold ${
                      selectedAnswer === "false"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : ""
                    }`}
                  >
                    False
                  </Button>
                </div>

                {feedbackBanner}

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading || selectedAnswer === null || hasSubmitted}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                  >
                    {hasSubmitted ? "Submitted" : "Submit answer"}
                  </Button>
                  {hasSubmitted && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleNext}
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
                          Next Question
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

