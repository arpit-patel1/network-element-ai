"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Plus, Minus, X, Divide, Trophy, Play } from "lucide-react";

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

type FeedbackState = "none" | "correct" | "incorrect";
type OperationType = "multiplication" | "addition" | "subtraction" | "division";
type DifficultyLevel = "easy" | "medium" | "hard";
type CharacterType = "mario" | "luigi";
type GameState = "setup" | "playing" | "victory";

export default function MarioMathRacePage() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [playerPosition, setPlayerPosition] = useState<number>(0); // 0-100%
  const [stats, setStats] = useState({ attempted: 0, correct: 0 });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const CORRECT_ANSWERS_TO_WIN = 12;
  const POSITION_INCREMENT = 100 / CORRECT_ANSWERS_TO_WIN; // ~8.33% per correct answer

  // Generate a random question based on operation type and difficulty
  const generateQuestion = (operation: OperationType, currentDifficulty: DifficultyLevel) => {
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

  // Initialize with first question when game starts
  useEffect(() => {
    if (gameState === "playing" && selectedOperation) {
      generateQuestion(selectedOperation, difficulty);
    }
  }, [gameState, selectedOperation, difficulty]);

  const handleStartGame = () => {
    if (selectedCharacter && selectedOperation) {
      setGameState("playing");
      setPlayerPosition(0);
      setStats({ attempted: 0, correct: 0 });
    }
  };

  const handleAnswerSelect = (answer: number) => {
    if (hasSubmitted || !question) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;

    setHasSubmitted(true);
    const isCorrect = selectedAnswer === question.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");
    
    const newCorrectCount = isCorrect ? stats.correct + 1 : stats.correct;
    
    setStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));

    if (isCorrect) {
      const newPosition = Math.min(100, playerPosition + POSITION_INCREMENT);
      setPlayerPosition(newPosition);
      
      // Check win condition
      if (newPosition >= 100 || newCorrectCount >= CORRECT_ANSWERS_TO_WIN) {
        setTimeout(() => {
          setGameState("victory");
        }, 1000);
        return;
      }
    }

    // Auto-advance to next question after feedback
    setTimeout(() => {
      if (selectedOperation && gameState === "playing") {
        generateQuestion(selectedOperation, difficulty);
      }
    }, 1500);
  };

  const handlePlayAgain = () => {
    setGameState("setup");
    setPlayerPosition(0);
    setStats({ attempted: 0, correct: 0 });
    setQuestion(null);
    setSelectedAnswer(null);
    setFeedback("none");
    setHasSubmitted(false);
  };

  const handleResetSettings = () => {
    setSelectedCharacter(null);
    setSelectedOperation(null);
    setDifficulty("medium");
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

  const getCharacterColors = () => {
    if (selectedCharacter === "mario") {
      return {
        gradient: "from-red-500 to-orange-500",
        gradientText: "from-red-600 to-orange-600",
        bg: "from-red-50/30 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/20",
        border: "border-red-300 dark:border-red-700",
        badge: "from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 border-red-300 dark:border-red-700",
      };
    } else {
      return {
        gradient: "from-green-500 to-blue-500",
        gradientText: "from-green-600 to-blue-600",
        bg: "from-green-50/30 to-blue-50/30 dark:from-green-950/20 dark:to-blue-950/20",
        border: "border-green-300 dark:border-green-700",
        badge: "from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950 border-green-300 dark:border-green-700",
      };
    }
  };

  const colors = selectedCharacter ? getCharacterColors() : {
    gradient: "from-purple-500 to-blue-500",
    gradientText: "from-purple-600 to-blue-600",
    bg: "from-purple-50/30 to-blue-50/30 dark:from-purple-950/20 dark:to-blue-950/20",
    border: "border-purple-300 dark:border-purple-700",
    badge: "from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 border-purple-300 dark:border-purple-700",
  };

  // Setup Screen
  if (gameState === "setup") {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-lg shadow-lg`}>
              <Trophy className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Mario Math Race
                </span>
              </h1>
              <p className="text-muted-foreground text-center">Race to the finish line by solving math problems!</p>
            </div>
          </div>

          {/* Character Selection */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Choose Your Character</CardTitle>
              <CardDescription>Select Mario or Luigi to race</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedCharacter === "mario"
                      ? "border-red-500 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/30 dark:to-orange-950/30"
                      : "hover:border-red-500/50"
                  }`}
                  onClick={() => setSelectedCharacter("mario")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src="/assets/images/mario.png"
                          alt="Mario"
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-red-700 dark:text-red-300">Mario</CardTitle>
                  </CardContent>
                </Card>
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedCharacter === "luigi"
                      ? "border-green-500 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/30 dark:to-blue-950/30"
                      : "hover:border-green-500/50"
                  }`}
                  onClick={() => setSelectedCharacter("luigi")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src="/assets/images/luigi.png"
                          alt="Luigi"
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-green-700 dark:text-green-300">Luigi</CardTitle>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Operation Selection */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Choose Math Operation</CardTitle>
              <CardDescription>Select the type of math problems you want to practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOperation === "addition"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent"
                      : "hover:border-blue-500/50"
                  }`}
                  onClick={() => setSelectedOperation("addition")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md mb-2 mx-auto w-fit">
                      <Plus className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-sm text-blue-700 dark:text-blue-300">Addition</CardTitle>
                  </CardContent>
                </Card>
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOperation === "subtraction"
                      ? "border-orange-500 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/30 dark:to-transparent"
                      : "hover:border-orange-500/50"
                  }`}
                  onClick={() => setSelectedOperation("subtraction")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md mb-2 mx-auto w-fit">
                      <Minus className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-sm text-orange-700 dark:text-orange-300">Subtraction</CardTitle>
                  </CardContent>
                </Card>
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOperation === "multiplication"
                      ? "border-purple-500 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent"
                      : "hover:border-purple-500/50"
                  }`}
                  onClick={() => setSelectedOperation("multiplication")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md mb-2 mx-auto w-fit">
                      <X className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-sm text-purple-700 dark:text-purple-300">Multiplication</CardTitle>
                  </CardContent>
                </Card>
                <Card
                  className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOperation === "division"
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent"
                      : "hover:border-emerald-500/50"
                  }`}
                  onClick={() => setSelectedOperation("division")}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-md mb-2 mx-auto w-fit">
                      <Divide className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">Division</CardTitle>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Selection */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Choose Difficulty</CardTitle>
              <CardDescription>Select how challenging you want the problems to be</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={difficulty === "easy" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setDifficulty("easy")}
                >
                  Easy
                </Button>
                <Button
                  variant={difficulty === "medium" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setDifficulty("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={difficulty === "hard" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setDifficulty("hard")}
                >
                  Hard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleStartGame}
              disabled={!selectedCharacter || !selectedOperation}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              <Play className="mr-2" size={20} />
              Start Race!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState === "victory") {
    const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
    return (
      <div className="flex-1 w-full flex flex-col gap-8 items-center justify-center py-8">
        <div className="w-full max-w-2xl flex flex-col gap-6 items-center">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            <span className={`bg-gradient-to-r ${colors.gradientText} bg-clip-text text-transparent`}>
              You Won!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground text-center">
            {selectedCharacter === "mario" ? "Mario" : "Luigi"} reached the finish line!
          </p>
          
          <Card className="border-2 w-full">
            <CardHeader>
              <CardTitle className="text-center">Final Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Correct Answers:</span>
                <Badge variant="secondary" className={`px-4 py-2 bg-gradient-to-r ${colors.badge}`}>
                  {stats.correct} / {stats.attempted}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy:</span>
                <Badge variant="outline" className="px-4 py-2">
                  {accuracy}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button size="lg" onClick={handlePlayAgain} className="px-8">
              Play Again
            </Button>
            <Button size="lg" variant="outline" onClick={handleResetSettings} className="px-8">
              Change Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (!question) {
    return <div className="flex-1 w-full flex items-center justify-center">Loading...</div>;
  }

  const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center py-8">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-lg shadow-lg`}>
              <Trophy className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className={`bg-gradient-to-r ${colors.gradientText} bg-clip-text text-transparent`}>
                  {selectedCharacter === "mario" ? "Mario" : "Luigi"} Math Race
                </span>
              </h1>
              <p className="text-muted-foreground">Race to the finish!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className={`px-4 py-2 bg-gradient-to-r ${colors.badge}`}>
              Score: {stats.correct}/{stats.attempted}
            </Badge>
            {stats.attempted > 0 && (
              <Badge variant="outline" className="px-4 py-2">
                {accuracy}% Correct
              </Badge>
            )}
          </div>
        </div>

        {/* Race Track */}
        <Card className={`border-2 bg-gradient-to-br ${colors.bg} ${colors.border}`}>
          <CardContent className="pt-6">
            <div className="relative w-full h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
              {/* Start Line */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-500 z-10" />
              <div className="absolute left-2 top-2 text-xs font-bold text-green-700 dark:text-green-300">START</div>
              
              {/* Finish Line */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-yellow-400 z-10" />
              <div className="absolute right-2 top-2 text-xs font-bold text-yellow-700 dark:text-yellow-300">FINISH</div>
              
              {/* Checkered pattern for finish */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-black/10 to-black/20" />
              
              {/* Character */}
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20"
                style={{ left: `calc(${playerPosition}% - 3rem)` }}
              >
                <div className={`relative w-12 h-12 md:w-16 md:h-16 ${playerPosition >= 100 ? "animate-bounce" : ""}`}>
                  <Image
                    src={selectedCharacter === "mario" ? "/assets/images/mario.png" : "/assets/images/luigi.png"}
                    alt={selectedCharacter === "mario" ? "Mario" : "Luigi"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 48px, 64px"
                  />
                </div>
              </div>

              {/* Progress Bar Background */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-700" />
              <div
                className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${colors.gradient} transition-all duration-500 ease-out`}
                style={{ width: `${playerPosition}%` }}
              />
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Progress: {Math.round(playerPosition)}%
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className={`border-2 bg-gradient-to-br ${colors.bg}`}>
          <CardHeader>
            <CardTitle className="text-center text-3xl md:text-4xl font-bold">
              <span className={`bg-gradient-to-r ${colors.gradientText} bg-clip-text text-transparent`}>
                {question.num1} {getOperationSymbol()} {question.num2} = ?
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              Choose the correct answer to move forward
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
                        ? "bg-green-500 hover:bg-green-600 text-white border-green-600 animate-pulse"
                        : showIncorrect
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-600"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(option)}
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
                className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                  feedback === "correct"
                    ? "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100 animate-pulse"
                    : "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
                }`}
              >
                {feedback === "correct" ? (
                  <>
                    <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-bold">Correct! Keep going! 🎉</p>
                      <p className="text-sm">
                        {question.num1} {getOperationSymbol()} {question.num2} = {question.correctAnswer}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} className="text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-bold">Not quite right. Try again! 💪</p>
                      <p className="text-sm">
                        The correct answer is: {question.num1} {getOperationSymbol()} {question.num2} ={" "}
                        {question.correctAnswer}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Submit Button */}
            {!hasSubmitted && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`px-8 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Encouragement Message */}
        {stats.attempted > 0 && (
          <div className="text-center text-muted-foreground">
            <p>
              {accuracy >= 80
                ? "🌟 Excellent work! You're racing ahead!"
                : accuracy >= 60
                ? "👍 Good job! Keep it up!"
                : "💪 Keep going! You've got this!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

