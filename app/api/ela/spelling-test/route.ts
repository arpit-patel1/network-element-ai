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

// Determine difficulty based on word length
function determineWordDifficulty(word: string): "easy" | "medium" | "hard" {
  if (word.length <= 5) return "easy";
  if (word.length <= 8) return "medium";
  return "hard";
}

// Get a word from the local array with optional difficulty filter
function getLocalWord(requestedDifficulty?: string | null): { word: string; difficulty: "easy" | "medium" | "hard" } {
  const { easyWords, mediumWords, hardWords } = getFilteredWords();

  let selectedWord: string;
  let difficulty: "easy" | "medium" | "hard";

  if (requestedDifficulty && ["easy", "medium", "hard"].includes(requestedDifficulty)) {
    // User requested specific difficulty
    difficulty = requestedDifficulty as "easy" | "medium" | "hard";
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

  return { word: selectedWord, difficulty };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficultyParam = searchParams.get("difficulty");

    // Try Random Word API first
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word", {
        cache: "no-store",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const word = Array.isArray(data) ? data[0] : data;
        
        if (word && typeof word === "string") {
          const determinedDifficulty = determineWordDifficulty(word);

          // If user requested specific difficulty and word doesn't match, use local fallback
          if (difficultyParam && determinedDifficulty !== difficultyParam) {
            const localResult = getLocalWord(difficultyParam);
            return NextResponse.json(localResult);
          }

          return NextResponse.json({
            word,
            difficulty: determinedDifficulty,
          });
        }
      }
    } catch (error) {
      // API failed, fall through to local array
      console.log("Random Word API failed, using local fallback:", error);
    }

    // Use local array as fallback
    const localResult = getLocalWord(difficultyParam);
    return NextResponse.json(localResult);
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

