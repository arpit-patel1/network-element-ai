"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Loader2, Eye, Calculator } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeReadResponse {
  problem: string;
  answer: string;
  hour: number;
  minute: number;
  period: string;
}

interface TimeCalculateResponse {
  problem: string;
  answer: string;
}

interface TimeConvertResponse {
  problem: string;
  answer: string;
  hours?: number;
  minutes?: number;
}

type TimeResponse = TimeReadResponse | TimeCalculateResponse | TimeConvertResponse;
type TimeType = "read" | "calculate" | "convert";

export default function TimePage() {
  const [data, setData] = useState<TimeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [type, setType] = useState<TimeType>("read");

  const loadQuestion = async (timeType: TimeType) => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);

    try {
      const response = await fetch(`/api/math/time?type=${encodeURIComponent(timeType)}`, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as TimeResponse;
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

  const readData = type === "read" ? (data as TimeReadResponse | null) : null;
  const calcData = type === "calculate" ? (data as TimeCalculateResponse | null) : null;
  const convertData = type === "convert" ? (data as TimeConvertResponse | null) : null;

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
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow">
            Time Problems
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Clock className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300 font-semibold">
              Math Homework
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Time Problems
              </span>
            </h1>
            <p className="text-muted-foreground">
              Practice reading clocks, calculating time, and converting time units.
            </p>
          </div>
        </div>

        {/* Type Selector */}
        <Card className="border-2 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-transparent dark:from-blue-950/30 dark:via-purple-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-100">Choose Problem Type</CardTitle>
            <CardDescription>Select the type of time problem you want to practice</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={type} onValueChange={(value) => setType(value as TimeType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="read">Read</TabsTrigger>
                <TabsTrigger value="calculate">Calculate</TabsTrigger>
                <TabsTrigger value="convert">Convert</TabsTrigger>
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

        <Card className="border-2 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-transparent dark:from-blue-950/30 dark:via-purple-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
                <Calculator className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-blue-800 dark:text-blue-100">Question</CardTitle>
                <CardDescription>
                  {type === "read" && "Read the time from the clock."}
                  {type === "calculate" && "Calculate the time."}
                  {type === "convert" && "Convert the time units."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-muted-foreground">Loading question...</p>
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      {data.problem}
                    </span>
                  </h2>
                  {readData && (
                    <div className="mt-4 flex gap-2 items-center">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        {readData.hour}:{readData.minute.toString().padStart(2, "0")} {readData.period}
                      </Badge>
                    </div>
                  )}
                </div>

                {!isRevealed ? (
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={() => setIsRevealed(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Reveal Answer
                    </Button>
                  </div>
                ) : (
                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-blue-800 dark:text-blue-100 text-lg mb-2">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                          {data.answer}
                        </span>
                      </h2>
                    </CardContent>
                  </Card>
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

