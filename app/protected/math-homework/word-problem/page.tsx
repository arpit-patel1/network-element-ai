"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Loader2, Eye, Calculator } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WordProblemResponse {
  word_problem: string;
  solution: string;
  type: string;
}

type DifficultyLevel = "easy" | "medium" | "hard";
type GradeLevel = 2 | 3 | 4 | 5;

export default function WordProblemPage() {
  const [data, setData] = useState<WordProblemResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [grade, setGrade] = useState<GradeLevel>(3);

  const loadQuestion = async (currentGrade: GradeLevel, currentDifficulty: DifficultyLevel) => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);

    try {
      const response = await fetch(
        `/api/math/word-problem?grade=${encodeURIComponent(currentGrade)}&difficulty=${encodeURIComponent(currentDifficulty)}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as WordProblemResponse;
      setData(questionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion(grade, difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, difficulty]);

  const getOperationColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("multiplication") || lowerType.includes("multiply")) {
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    } else if (lowerType.includes("division") || lowerType.includes("divide")) {
      return "bg-gradient-to-r from-emerald-500 to-green-600";
    } else if (lowerType.includes("addition") || lowerType.includes("add")) {
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    } else if (lowerType.includes("subtraction") || lowerType.includes("subtract")) {
      return "bg-gradient-to-r from-orange-500 to-red-500";
    }
    return "bg-gradient-to-r from-purple-500 to-pink-500";
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
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow">
            Word Problems
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Math
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Word Problems
              </span>
            </h1>
            <p className="text-muted-foreground">
              Practice solving multiplication and division word problems.
            </p>
          </div>
        </div>

        {/* Grade Selector */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-100">Choose Grade Level</CardTitle>
            <CardDescription>Select the grade level for the word problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {([2, 3, 4, 5] as GradeLevel[]).map((gradeLevel) => (
                <Button
                  key={gradeLevel}
                  variant={grade === gradeLevel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGrade(gradeLevel)}
                  className={
                    grade === gradeLevel
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : ""
                  }
                >
                  Grade {gradeLevel}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selector */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-100">Choose Difficulty</CardTitle>
            <CardDescription>Select how challenging you want the problems to be</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(["easy", "medium", "hard"] as DifficultyLevel[]).map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(level)}
                  className={
                    difficulty === level
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : ""
                  }
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a question.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={() => loadQuestion(grade, difficulty)} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Calculator className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Question</CardTitle>
                <CardDescription>
                  Read the problem carefully and solve it in your notebook before revealing the answer.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-muted-foreground">Loading question...</p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                    {data.word_problem}
                  </h2>
                </div>

                {!isRevealed ? (
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setIsRevealed(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Reveal Answer
                    </Button>
                  </div>
                ) : (
                  <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-950/20 dark:via-pink-950/10">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center items-center gap-3 mb-2">
                        <CardTitle className="text-purple-800 dark:text-purple-100 text-lg">Answer</CardTitle>
                        <Badge className={`${getOperationColor(data.type)} text-white border-0`}>
                          {data.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-6">
                      <div className="rounded-lg bg-background/80 p-6">
                        <p className="text-lg md:text-xl leading-relaxed">
                          {data.solution}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => loadQuestion(grade, difficulty)}
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
