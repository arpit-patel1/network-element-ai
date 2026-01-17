"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Square, Loader2, Eye, Calculator } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AreaSquares } from "@/components/area-squares";

interface AreaQuestion {
  arrangement: "single" | "grid" | "custom";
  singleSize?: number;
  gridRows?: number;
  gridCols?: number;
  gridSquareSize?: number;
  customSquares?: Array<{ x: number; y: number; size: number }>;
  correctAnswer: number;
  description: string;
}

type DifficultyLevel = "easy" | "medium" | "hard";
type UnitType = "cm" | "feet" | "inches" | "meters";

export default function AreaPage() {
  const [question, setQuestion] = useState<AreaQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [unit, setUnit] = useState<UnitType>("cm");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const getUnitLabel = (unitType: UnitType): string => {
    switch (unitType) {
      case "cm":
        return "cm";
      case "feet":
        return "ft";
      case "inches":
        return "in";
      case "meters":
        return "m";
    }
  };

  const getUnitFullName = (unitType: UnitType): string => {
    switch (unitType) {
      case "cm":
        return "centimeters";
      case "feet":
        return "feet";
      case "inches":
        return "inches";
      case "meters":
        return "meters";
    }
  };

  const generateQuestion = (currentDifficulty: DifficultyLevel, currentUnit: UnitType): AreaQuestion => {
    const arrangementType = Math.random();
    let question: AreaQuestion;

    if (arrangementType < 0.4) {
      // Single square (40% chance)
      let size: number;
      if (currentDifficulty === "easy") {
        size = Math.floor(Math.random() * 4) + 2; // 2-5
      } else if (currentDifficulty === "medium") {
        size = Math.floor(Math.random() * 5) + 6; // 6-10
      } else {
        size = Math.floor(Math.random() * 5) + 11; // 11-15
      }
        question = {
          arrangement: "single",
          singleSize: size,
          correctAnswer: size * size,
          description: `Count all the small squares. This is a ${size} ${getUnitLabel(currentUnit)} by ${size} ${getUnitLabel(currentUnit)} square.`,
        };
    } else if (arrangementType < 0.8) {
      // Grid of squares (40% chance)
      let rows: number, cols: number, squareSize: number;
      if (currentDifficulty === "easy") {
        rows = Math.floor(Math.random() * 2) + 2; // 2-3
        cols = Math.floor(Math.random() * 2) + 2; // 2-3
        squareSize = 2; // 2x2 squares
      } else if (currentDifficulty === "medium") {
        rows = Math.floor(Math.random() * 2) + 2; // 2-3
        cols = Math.floor(Math.random() * 2) + 3; // 3-4
        squareSize = Math.floor(Math.random() * 2) + 2; // 2-3
      } else {
        rows = Math.floor(Math.random() * 2) + 3; // 3-4
        cols = Math.floor(Math.random() * 2) + 3; // 3-4
        squareSize = Math.floor(Math.random() * 2) + 3; // 3-4
      }
      const totalArea = rows * cols * squareSize * squareSize;
      question = {
        arrangement: "grid",
        gridRows: rows,
        gridCols: cols,
        gridSquareSize: squareSize,
        correctAnswer: totalArea,
        description: `Count all the small squares. There are ${rows} rows and ${cols} columns of larger squares, and each larger square is ${squareSize} ${getUnitLabel(currentUnit)} by ${squareSize} ${getUnitLabel(currentUnit)} (${squareSize * squareSize} small squares).`,
      };
    } else {
      // Custom arrangement (20% chance) - L-shape or irregular
      if (currentDifficulty === "easy") {
        // Simple L-shape
        const baseSize = Math.floor(Math.random() * 2) + 3; // 3-4
        const customSquares = [
          { x: 0, y: 0, size: baseSize },
          { x: baseSize, y: 0, size: baseSize - 1 },
        ];
        const totalArea = baseSize * baseSize + (baseSize - 1) * (baseSize - 1);
        question = {
          arrangement: "custom",
          customSquares,
          correctAnswer: totalArea,
          description: `Count all the small squares in this L-shaped arrangement. Each small square is 1 ${getUnitLabel(currentUnit)} by 1 ${getUnitLabel(currentUnit)}.`,
        };
      } else if (currentDifficulty === "medium") {
        // More complex L-shape
        const baseSize = Math.floor(Math.random() * 2) + 4; // 4-5
        const customSquares = [
          { x: 0, y: 0, size: baseSize },
          { x: baseSize, y: 0, size: baseSize - 1 },
          { x: 0, y: baseSize, size: baseSize - 2 },
        ];
        const totalArea = baseSize * baseSize + (baseSize - 1) * (baseSize - 1) + (baseSize - 2) * (baseSize - 2);
        question = {
          arrangement: "custom",
          customSquares,
          correctAnswer: totalArea,
          description: `Count all the small squares in this shape. Each small square is 1 ${getUnitLabel(currentUnit)} by 1 ${getUnitLabel(currentUnit)}.`,
        };
      } else {
        // Complex arrangement
        const size1 = Math.floor(Math.random() * 2) + 4; // 4-5
        const size2 = Math.floor(Math.random() * 2) + 3; // 3-4
        const size3 = Math.floor(Math.random() * 2) + 2; // 2-3
        const customSquares = [
          { x: 0, y: 0, size: size1 },
          { x: size1, y: 0, size: size2 },
          { x: 0, y: size1, size: size3 },
          { x: size3, y: size1, size: size2 },
        ];
        const totalArea = size1 * size1 + size2 * size2 + size3 * size3 + size2 * size2;
        question = {
          arrangement: "custom",
          customSquares,
          correctAnswer: totalArea,
          description: `Count all the small squares in this complex shape. Each small square is 1 ${getUnitLabel(currentUnit)} by 1 ${getUnitLabel(currentUnit)}.`,
        };
      }
    }

    return question;
  };

  const loadQuestion = (currentDifficulty: DifficultyLevel, currentUnit: UnitType) => {
    setLoading(true);
    setIsRevealed(false);
    setUserAnswer("");
    setFeedback(null);

    // Simulate slight delay for better UX
    setTimeout(() => {
      const newQuestion = generateQuestion(currentDifficulty, currentUnit);
      setQuestion(newQuestion);
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    loadQuestion(difficulty, unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, unit]);

  const handleCheckAnswer = () => {
    if (!question || !userAnswer) return;

    const userAnswerNum = parseInt(userAnswer.trim(), 10);
    if (isNaN(userAnswerNum)) {
      setFeedback("incorrect");
      return;
    }

    if (userAnswerNum === question.correctAnswer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (question && userAnswer) {
      handleCheckAnswer();
    }
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
            Area Calculation
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Square className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Math
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Area Calculation
              </span>
            </h1>
            <p className="text-muted-foreground">
              Count each small square to find the total area. Each small square = 1 square unit (cm², ft², in², or m²).
            </p>
          </div>
        </div>

        {/* Difficulty and Unit Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
            <CardHeader>
              <CardTitle className="text-purple-800 dark:text-purple-100">Choose Unit</CardTitle>
              <CardDescription>Select the unit of measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(["cm", "feet", "inches", "meters"] as UnitType[]).map((unitType) => (
                  <Button
                    key={unitType}
                    variant={unit === unitType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUnit(unitType)}
                    className={
                      unit === unitType
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : ""
                    }
                  >
                    {unitType === "cm" ? "cm" : unitType === "feet" ? "ft" : unitType === "inches" ? "in" : "m"}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Calculator className="text-white" size={22} />
              </div>
              <div>
                <CardTitle className="text-purple-800 dark:text-purple-100">Question</CardTitle>
                <CardDescription>
                  Count all the small squares you see. Each small square equals 1 square {getUnitLabel(unit)} (1 {getUnitLabel(unit)} × 1 {getUnitLabel(unit)} = 1 {getUnitLabel(unit)}²).
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
            ) : question ? (
              <>
                <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                  <div className="flex flex-col items-center gap-4">
                    <AreaSquares
                      arrangement={question.arrangement}
                      singleSize={question.singleSize}
                      gridRows={question.gridRows}
                      gridCols={question.gridCols}
                      gridSquareSize={question.gridSquareSize}
                      customSquares={question.customSquares}
                      squareSize={30}
                      spacing={2}
                    />
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100 text-center mb-1">
                        💡 Remember: Each small square = 1 square {getUnitLabel(unit)} (1 {getUnitLabel(unit)}²)
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        {question.description}
                      </p>
                    </div>
                  </div>
                </div>

                {!isRevealed ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        What is the total area? 
                        <span className="text-muted-foreground font-normal ml-1">(in square {getUnitLabel(unit)} - {getUnitLabel(unit)}²)</span>
                      </label>
                      <Input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer"
                        className="text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && userAnswer) {
                            handleCheckAnswer();
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        size="lg"
                        onClick={handleCheckAnswer}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
                      >
                        Check Answer
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleReveal}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Reveal Answer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-950/20 dark:via-pink-950/10">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-purple-800 dark:text-purple-100 text-lg mb-2">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          {question.correctAnswer}
                        </span>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">square {getUnitLabel(unit)} ({getUnitLabel(unit)}²)</p>
                    </CardContent>
                  </Card>
                )}

                {feedback && !isRevealed && (
                  <div
                    className={`p-4 rounded-lg border ${
                      feedback === "correct"
                        ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-100 dark:border-green-800"
                        : "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-100 dark:border-red-800"
                    }`}
                  >
                    <p className="font-semibold text-center">
                      {feedback === "correct" ? "✓ Correct! Well done! 🎉" : "✗ Incorrect. Try again!"}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => loadQuestion(difficulty, unit)}
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
