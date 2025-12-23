"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle2, XCircle } from "lucide-react";

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

type FeedbackState = "none" | "correct" | "incorrect";
type DifficultyLevel = "easy" | "medium" | "hard";

export default function DivisionHomeworkPage() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [stats, setStats] = useState({ attempted: 0, correct: 0 });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Generate a random division question based on difficulty (only exact divisions)
  const generateQuestion = (currentDifficulty: DifficultyLevel) => {
    let num2: number, correctAnswer: number, num1: number;
    
    if (currentDifficulty === "easy") {
      num2 = Math.floor(Math.random() * 9) + 2; // 2-10
      correctAnswer = Math.floor(Math.random() * 9) + 2; // 2-10
    } else if (currentDifficulty === "medium") {
      num2 = Math.floor(Math.random() * 9) + 2; // 2-10
      correctAnswer = Math.floor(Math.random() * 10) + 2; // 2-11
    } else {
      num2 = Math.floor(Math.random() * 11) + 2; // 2-12
      correctAnswer = Math.floor(Math.random() * 11) + 2; // 2-12
    }
    
    num1 = num2 * correctAnswer; // Ensure exact division

    // Generate 3 incorrect but plausible answers
    const incorrectAnswers = new Set<number>();
    while (incorrectAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
        incorrectAnswers.add(wrongAnswer);
      }
    }

    // Combine and shuffle options
    const options = [correctAnswer, ...Array.from(incorrectAnswers)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setQuestion({ num1, num2, correctAnswer, options });
    setSelectedAnswer(null);
    setFeedback("none");
    setHasSubmitted(false);
  };

  // Initialize with first question when difficulty changes
  useEffect(() => {
    generateQuestion(difficulty);
  }, [difficulty]);

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;

    setHasSubmitted(true);
    const isCorrect = selectedAnswer === question.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
  };

  const handleNextQuestion = () => {
    generateQuestion(difficulty);
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setStats({ attempted: 0, correct: 0 });
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                  Math Homework
                </span>
              </h1>
              <p className="text-muted-foreground">Practice your division!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-300 dark:border-emerald-700">
              Score: {stats.correct}/{stats.attempted}
            </Badge>
            {stats.attempted > 0 && (
              <Badge variant="outline" className="px-4 py-2 border-green-300 dark:border-green-700">
                {accuracy}% Correct
              </Badge>
            )}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
          <Button
            variant={difficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("easy")}
          >
            Easy
          </Button>
          <Button
            variant={difficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("medium")}
          >
            Medium
          </Button>
          <Button
            variant={difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDifficultyChange("hard")}
          >
            Hard
          </Button>
        </div>

        {/* Question Card */}
        <Card className="border-2 bg-gradient-to-br from-emerald-50/40 to-green-50/40 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="text-center text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {question.num1} ÷ {question.num2} = ?
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              Choose the correct answer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.correctAnswer;
                const showCorrect = hasSubmitted && isCorrect;
                const showIncorrect = hasSubmitted && isSelected && !isCorrect;

                return (
                  <Button
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    className={`h-20 text-2xl font-bold transition-all ${
                      showCorrect
                        ? "bg-green-500 hover:bg-green-600 text-white border-green-600"
                        : showIncorrect
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-600"
                        : ""
                    }`}
                    onClick={() => !hasSubmitted && setSelectedAnswer(option)}
                    disabled={hasSubmitted}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {feedback !== "none" && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  feedback === "correct"
                    ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
                    : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
                }`}
              >
                {feedback === "correct" ? (
                  <>
                    <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-bold">Correct! Well done! 🎉</p>
                      <p className="text-sm">
                        {question.num1} ÷ {question.num2} = {question.correctAnswer}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} className="text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-bold">Not quite right. Keep practicing! 💪</p>
                      <p className="text-sm">
                        The correct answer is: {question.num1} ÷ {question.num2} ={" "}
                        {question.correctAnswer}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              {!hasSubmitted ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="px-8"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button size="lg" onClick={handleNextQuestion} className="px-8">
                  Next Question →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Encouragement Message */}
        {stats.attempted > 0 && (
          <div className="text-center text-muted-foreground">
            <p>
              {accuracy >= 80
                ? "🌟 Excellent work! You're a math star!"
                : accuracy >= 60
                ? "👍 Good job! Keep practicing!"
                : "💪 Keep going! Practice makes perfect!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

