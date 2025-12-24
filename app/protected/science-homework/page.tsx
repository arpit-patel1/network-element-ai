import Link from "next/link";
import { FlaskConical, ArrowRight, Lightbulb, BookOpen } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ScienceHomeworkPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <FlaskConical className="text-white" size={28} />
          </div>
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
              Science Homework
            </Badge>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Science Homework
                </span>
              </h1>
              <p className="text-muted-foreground">
                Learn science facts and test your knowledge with quizzes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-2 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/30 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent flex flex-col h-full">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <Lightbulb className="text-white" size={24} />
                </div>
              </div>
              <CardTitle className="text-base text-purple-700 dark:text-purple-200">Science Facts</CardTitle>
              <CardDescription className="text-xs">Learn interesting science facts by topic</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                size="sm"
              >
                <Link href="/protected/science-homework/fact" className="flex items-center justify-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/30 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent flex flex-col h-full">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <BookOpen className="text-white" size={24} />
                </div>
              </div>
              <CardTitle className="text-base text-purple-700 dark:text-purple-200">Science Quiz</CardTitle>
              <CardDescription className="text-xs">Test your knowledge with true/false questions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                size="sm"
              >
                <Link href="/protected/science-homework/quiz" className="flex items-center justify-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

