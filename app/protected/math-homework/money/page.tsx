"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Coins, Loader2, Eye, Calculator } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MoneyCountResponse {
  problem: string;
  items: string[];
  answer: string;
  answer_cents: number;
}

interface MoneyCalcResponse {
  problem: string;
  answer: string;
}

type MoneyResponse = MoneyCountResponse | MoneyCalcResponse;
type OperationType = "count" | "add" | "subtract";

export default function MoneyPage() {
  const [data, setData] = useState<MoneyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [operation, setOperation] = useState<OperationType>("count");

  const loadQuestion = async (op: OperationType) => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);

    try {
      const response = await fetch(`/api/math/money?operation=${encodeURIComponent(op)}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as MoneyResponse;
      setData(questionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion(operation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const isCountOperation = operation === "count";
  const countData = isCountOperation ? (data as MoneyCountResponse | null) : null;
  const calcData = !isCountOperation ? (data as MoneyCalcResponse | null) : null;

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
            Money Problems
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Coins className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Math Homework
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Money Problems
              </span>
            </h1>
            <p className="text-muted-foreground">
              Practice counting money and solving money calculation problems.
            </p>
          </div>
        </div>

        {/* Operation Selector */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-100">Choose Operation Type</CardTitle>
            <CardDescription>Select the type of money problem you want to practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={operation} onValueChange={(value) => setOperation(value as OperationType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="count">Count</TabsTrigger>
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="subtract">Subtract</TabsTrigger>
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
              <Button onClick={() => loadQuestion(operation)} variant="outline">
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
                  {isCountOperation ? "Count the money items." : "Solve the money calculation problem."}
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
                {isCountOperation && countData ? (
                  <>
                    <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                      <h2 className="text-2xl md:text-3xl font-semibold leading-8 mb-4">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          {countData.problem}
                        </span>
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {countData.items.map((item, index) => (
                          <Badge
                            key={index}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : calcData ? (
                  <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                      <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        {calcData.problem}
                      </span>
                    </h2>
                  </div>
                ) : null}

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
                      <CardTitle className="text-purple-800 dark:text-purple-100 text-lg mb-2">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          {isCountOperation && countData ? countData.answer : calcData?.answer}
                        </span>
                      </h2>
                      {isCountOperation && countData && (
                        <p className="text-muted-foreground mt-2">
                          ({countData.answer_cents} cents)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => loadQuestion(operation)}
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

