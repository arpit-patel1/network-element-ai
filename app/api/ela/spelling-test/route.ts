import { NextResponse } from "next/server";
import words from "an-array-of-english-words";

// Cache filtered word lists in memory
let easyWords: string[] | null = null;
let mediumWords: string[] | null = null;
let hardWords: string[] | null = null;

function getFilteredWords() {
  if (!easyWords || !mediumWords || !hardWords) {
    easyWords = words.filter((word) => word.length >= 3 && word.length <= 5);
    mediumWords = words.filter((word) => word.length >= 6 && word.length <= 8);
    hardWords = words.filter((word) => word.length >= 9);
  }
  return { easyWords, mediumWords, hardWords };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficultyParam = searchParams.get("difficulty");

    const { easyWords, mediumWords, hardWords } = getFilteredWords();

    let selectedWord: string;
    let difficulty: "easy" | "medium" | "hard";

    if (difficultyParam && ["easy", "medium", "hard"].includes(difficultyParam)) {
      // User requested specific difficulty
      difficulty = difficultyParam as "easy" | "medium" | "hard";
      const wordList =
        difficulty === "easy" ? easyWords : difficulty === "medium" ? mediumWords : hardWords;
      selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
      // Mixed difficulty - randomly select difficulty level
      const randomDifficulty = Math.random();
      if (randomDifficulty < 0.33) {
        difficulty = "easy";
        selectedWord = easyWords[Math.floor(Math.random() * easyWords.length)];
      } else if (randomDifficulty < 0.66) {
        difficulty = "medium";
        selectedWord = mediumWords[Math.floor(Math.random() * mediumWords.length)];
      } else {
        difficulty = "hard";
        selectedWord = hardWords[Math.floor(Math.random() * hardWords.length)];
      }
    }

    return NextResponse.json({
      word: selectedWord,
      difficulty,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch spelling word.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

