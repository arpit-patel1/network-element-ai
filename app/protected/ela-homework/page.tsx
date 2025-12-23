import Link from "next/link";
import { BookOpenCheck, Sparkles, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ELAHomeworkPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center py-10">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <BookOpenCheck className="text-white" size={28} />
          </div>
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
              ELA Homework
            </Badge>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Reading Comprehension
                </span>
              </h1>
              <p className="text-muted-foreground">
                Practice understanding passages, answering questions, and getting instant feedback.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Sparkles className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-700 dark:text-purple-200">Reading Comprehension Practice</CardTitle>
                <CardDescription>Get a passage, choose the best answer, and see how you did.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Fresh passages and questions pulled from the n8n workflow.</li>
              <li>• Four answer choices with immediate feedback.</li>
              <li>• New question button to keep practicing.</li>
            </ul>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
              size="lg"
            >
              <Link href="/protected/ela-homework/reading-comprehension" className="flex items-center gap-2">
                Start practicing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

