"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle2, XCircle, Plus, Minus, X, Divide, Coins, Clock, Ruler, Shapes, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

type FeedbackState = "none" | "correct" | "incorrect";
type OperationType = "multiplication" | "addition" | "subtraction" | "division" | null;
type DifficultyLevel = "easy" | "medium" | "hard";

export default function MathHomeworkPage() {
  const [selectedOperation, setSelectedOperation] = useState<OperationType>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [stats, setStats] = useState({ attempted: 0, correct: 0 });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Generate a random question based on operation type and difficulty
  const generateQuestion = (operation: OperationType, currentDifficulty: DifficultyLevel) => {
    if (!operation) return;

    let num1: number, num2: number, correctAnswer: number;

    switch (operation) {
      case "multiplication":
        if (currentDifficulty === "easy") {
          num1 = Math.floor(Math.random() * 4) + 2; // 2-5
          num2 = Math.floor(Math.random() * 4) + 2; // 2-5
        } else if (currentDifficulty === "medium") {
          num1 = Math.floor(Math.random() * 7) + 5; // 5-11
          num2 = Math.floor(Math.random() * 7) + 5; // 5-11
        } else {
          num1 = Math.floor(Math.random() * 11) + 10; // 10-20
          num2 = Math.floor(Math.random() * 11) + 10; // 10-20
        }
        correctAnswer = num1 * num2;
        break;
      case "addition":
        if (currentDifficulty === "easy") {
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99 (2-digit)
          num2 = Math.floor(Math.random() * 90) + 10; // 10-99 (2-digit)
        } else if (currentDifficulty === "medium") {
          num1 = Math.floor(Math.random() * 900) + 100; // 100-999 (3-digit)
          num2 = Math.floor(Math.random() * 900) + 100; // 100-999 (3-digit)
        } else {
          num1 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999 (4-digit)
          num2 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999 (4-digit)
        }
        correctAnswer = num1 + num2;
        break;
      case "subtraction":
        if (currentDifficulty === "easy") {
          // 2-digit subtraction without borrowing (no regrouping)
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99
          const num1Tens = Math.floor(num1 / 10);
          const num1Ones = num1 % 10;
          // Generate num2 where tens <= num1Tens and ones <= num1Ones (when tens are equal)
          const num2Tens = Math.floor(Math.random() * (num1Tens + 1)); // 0 to num1Tens
          const num2Ones = num2Tens === num1Tens 
            ? Math.floor(Math.random() * num1Ones) // 0 to num1Ones-1 if same tens (ensures num2 < num1)
            : Math.floor(Math.random() * 10); // 0-9 if different tens
          num2 = num2Tens * 10 + num2Ones;
          // Final check: ensure num2 < num1 and no borrowing needed
          if (num2 >= num1 || (num2Tens === num1Tens && num2Ones > num1Ones)) {
            // Regenerate num2 if needed
            num2 = Math.max(0, num1 - Math.floor(Math.random() * 10) - 1);
            const num2TensNew = Math.floor(num2 / 10);
            const num2OnesNew = num2 % 10;
            if (num2TensNew === num1Tens && num2OnesNew > num1Ones) {
              num2 = num2TensNew * 10 + num1Ones - 1;
            }
          }
        } else if (currentDifficulty === "medium") {
          // 2-digit subtraction with or without borrowing
          num1 = Math.floor(Math.random() * 90) + 10; // 10-99
          num2 = Math.floor(Math.random() * num1); // 0 to num1-1
        } else {
          // 3-digit subtraction with or without borrowing
          num1 = Math.floor(Math.random() * 900) + 100; // 100-999
          num2 = Math.floor(Math.random() * num1); // 0 to num1-1
        }
        correctAnswer = num1 - num2;
        break;
      case "division":
        // Generate exact divisions only
        if (currentDifficulty === "easy") {
          num2 = Math.floor(Math.random() * 4) + 2; // 2-5
          correctAnswer = Math.floor(Math.random() * 4) + 2; // 2-5
        } else if (currentDifficulty === "medium") {
          num2 = Math.floor(Math.random() * 7) + 5; // 5-11
          correctAnswer = Math.floor(Math.random() * 7) + 5; // 5-11
        } else {
          num2 = Math.floor(Math.random() * 11) + 10; // 10-20
          correctAnswer = Math.floor(Math.random() * 11) + 10; // 10-20
        }
        num1 = num2 * correctAnswer; // Ensure exact division
        break;
      default:
        return;
    }

    // Generate 3 incorrect but plausible answers
    const incorrectAnswers = new Set<number>();
    while (incorrectAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 20) - 10; // -10 to +10
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

  // Initialize with first question when operation is selected or difficulty changes
  useEffect(() => {
    if (selectedOperation) {
      generateQuestion(selectedOperation, difficulty);
    }
  }, [selectedOperation, difficulty]);

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
    generateQuestion(selectedOperation, difficulty);
  };

  const handleBackToMenu = () => {
    setSelectedOperation(null);
    setQuestion(null);
    setStats({ attempted: 0, correct: 0 });
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    setStats({ attempted: 0, correct: 0 });
  };

  const getOperationSymbol = () => {
    switch (selectedOperation) {
      case "multiplication":
        return "×";
      case "addition":
        return "+";
      case "subtraction":
        return "−";
      case "division":
        return "÷";
      default:
        return "";
    }
  };

  const getOperationName = () => {
    switch (selectedOperation) {
      case "multiplication":
        return "multiplication";
      case "addition":
        return "addition";
      case "subtraction":
        return "subtraction";
      case "division":
        return "division";
      default:
        return "";
    }
  };

  // Show operation selection menu
  if (!selectedOperation) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Math
                </span>
              </h1>
              <p className="text-muted-foreground">Choose a type of practice</p>
            </div>
          </div>

          {/* Operation Selection Cards */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-muted-foreground">Basic Operations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                        <Plus className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-blue-700 dark:text-blue-300">Addition</CardTitle>
                    <CardDescription className="text-xs">Practice adding numbers</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      onClick={() => setSelectedOperation("addition")}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md"
                      size="sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/30 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/30 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md">
                        <Minus className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-orange-700 dark:text-orange-300">Subtraction</CardTitle>
                    <CardDescription className="text-xs">Practice subtracting numbers</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      onClick={() => setSelectedOperation("subtraction")}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-md"
                      size="sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/30 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                        <X className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-purple-700 dark:text-purple-300">Multiplication</CardTitle>
                    <CardDescription className="text-xs">Practice multiplication tables</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      onClick={() => setSelectedOperation("multiplication")}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                      size="sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md">
                        <Divide className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-emerald-700 dark:text-emerald-300">Division</CardTitle>
                    <CardDescription className="text-xs">Practice division problems</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      onClick={() => setSelectedOperation("division")}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                      size="sm"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* More Math Practice */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-muted-foreground">More Math Practice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/30 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                        <Coins className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-purple-700 dark:text-purple-200">Money Problems</CardTitle>
                    <CardDescription className="text-xs">Count and calculate with money</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                      size="sm"
                    >
                      <Link href="/protected/math-homework/money" className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-blue-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/30 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-transparent dark:from-blue-950/30 dark:via-purple-950/20 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
                        <Clock className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-blue-700 dark:text-blue-200">Time Problems</CardTitle>
                    <CardDescription className="text-xs">Read clocks and calculate time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                      size="sm"
                    >
                      <Link href="/protected/math-homework/time" className="flex items-center justify-center gap-2">
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
                        <Ruler className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-purple-700 dark:text-purple-200">Measurement</CardTitle>
                    <CardDescription className="text-xs">Convert between units</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                      size="sm"
                    >
                      <Link href="/protected/math-homework/measurement" className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-pink-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-pink-500/30 bg-gradient-to-br from-pink-50/40 via-blue-50/30 to-transparent dark:from-pink-950/30 dark:via-blue-950/20 dark:to-transparent flex flex-col h-full">
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg shadow-md">
                        <Shapes className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-base text-pink-700 dark:text-pink-200">Patterns</CardTitle>
                    <CardDescription className="text-xs">Recognize number and shape patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 shadow-md"
                      size="sm"
                    >
                      <Link href="/protected/math-homework/pattern" className="flex items-center justify-center gap-2">
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
                    <CardTitle className="text-base text-purple-700 dark:text-purple-200">Word Problems</CardTitle>
                    <CardDescription className="text-xs">Practice multiplication and division word problems</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                      size="sm"
                    >
                      <Link href="/protected/math-homework/word-problem" className="flex items-center justify-center gap-2">
                        Start
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!question) {
    return <div>Loading...</div>;
  }

  const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

  // Show question interface
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Math
                </span>
              </h1>
              <p className="text-muted-foreground">Practice your {getOperationName()}!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 border-purple-300 dark:border-purple-700">
              Score: {stats.correct}/{stats.attempted}
            </Badge>
            {stats.attempted > 0 && (
              <Badge variant="outline" className="px-4 py-2 border-blue-300 dark:border-blue-700">
                {accuracy}% Correct
              </Badge>
            )}
          </div>
        </div>

        {/* Back Button and Difficulty Selector */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button variant="outline" onClick={handleBackToMenu} className="w-fit">
            ← Back to Menu
          </Button>
          <div className="flex flex-wrap gap-2 items-center">
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
        </div>

        {/* Question Card */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-cyan-50/30 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-center text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {question.num1} {getOperationSymbol()} {question.num2} = ?
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
                        {question.num1} {getOperationSymbol()} {question.num2} = {question.correctAnswer}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} className="text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-bold">Not quite right. Keep practicing! 💪</p>
                      <p className="text-sm">
                        The correct answer is: {question.num1} {getOperationSymbol()} {question.num2} ={" "}
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

