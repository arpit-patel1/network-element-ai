"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2, Sparkles, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ReviewResponse {
  feedback: string;
}

export default function ParagraphReviewPage() {
  const [paragraph, setParagraph] = useState("");
  const [feedback, setFeedback] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!paragraph.trim()) {
      setError("Please write a paragraph or story before reviewing.");
      return;
    }

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/ela/paragraph-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paragraph: paragraph.trim() }),
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to review your paragraph. Please try again.");
        return;
      }

      const data = (await response.json()) as ReviewResponse;
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review your paragraph. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParagraph("");
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 md:gap-8 items-center py-4 md:py-8 px-4">
      <div className="w-full max-w-3xl flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-2 shrink-0">
            <Link href="/protected/ela-homework">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to ELA</span>
            </Link>
          </Button>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow shrink-0">
            Paragraph Review
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shrink-0">
            <FileText className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              ELA Homework
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Paragraph Review
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Write a paragraph or story, then get encouraging feedback and suggestions for improvement.
            </p>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base text-red-700 dark:text-red-200">Could not review your paragraph.</p>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-300 break-words">{error}</p>
              </div>
              <Button onClick={handleReview} variant="outline" size="sm" className="shrink-0" disabled={loading}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Writing Card */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <FileText className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Your Paragraph or Story</CardTitle>
                <CardDescription>Write your paragraph or story in the text area below.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <Textarea
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              placeholder="Write your paragraph or story here..."
              className="min-h-[200px] md:min-h-[250px] text-sm md:text-base resize-y"
              disabled={loading}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleReview}
                disabled={loading || !paragraph.trim()}
                className="w-full sm:w-auto px-6 md:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md gap-2 text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Reviewing...</span>
                    <span className="sm:hidden">Reviewing</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Review
                  </>
                )}
              </Button>
              {(paragraph || feedback) && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleClear}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 md:px-8 gap-2 text-sm md:text-base"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        {feedback && (
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg text-purple-800 dark:text-purple-100">
                  Review Feedback
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeedback(null)}
                  className="h-8 w-8 p-0 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="rounded-lg border bg-background/70 p-4 shadow-sm">
                <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {feedback.feedback}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

