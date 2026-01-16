import { NextResponse } from "next/server";
import words from "an-array-of-english-words";

// Length ranges for each difficulty level
const LENGTH_RANGES = {
  easy: [3, 4, 5],
  medium: [6, 7, 8],
  hard: [9, 10, 11, 12],
};

// Get a random length from the difficulty range
function getRandomLength(difficulty: "easy" | "medium" | "hard"): number {
  const range = LENGTH_RANGES[difficulty];
  return range[Math.floor(Math.random() * range.length)];
}

// Get a word from the local array with specific length
function getLocalWord(difficulty: "easy" | "medium" | "hard", targetLength?: number): { word: string; difficulty: "easy" | "medium" | "hard" } {
  const length = targetLength || getRandomLength(difficulty);
  
  // Filter words by exact length
  const filteredWords = words.filter((word) => word.length === length);
  
  if (filteredWords.length === 0) {
    // Fallback to any word in the difficulty range if no exact match
    const range = LENGTH_RANGES[difficulty];
    const fallbackWords = words.filter((word) => word.length >= range[0] && word.length <= range[range.length - 1]);
    const selectedWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    return { word: selectedWord, difficulty };
  }
  
  const selectedWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  return { word: selectedWord, difficulty };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficultyParam = searchParams.get("difficulty");
    
    // Default to medium if no difficulty specified
    const difficulty = (difficultyParam && ["easy", "medium", "hard"].includes(difficultyParam) 
      ? difficultyParam 
      : "medium") as "easy" | "medium" | "hard";

    // Get a random length for this difficulty
    const randomLength = getRandomLength(difficulty);

    // Try Random Word API first with length parameter
    try {
      const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${randomLength}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const word = Array.isArray(data) ? data[0] : data;
        
        if (word && typeof word === "string") {
          return NextResponse.json({
            word,
            difficulty,
          });
        }
      }
    } catch (error) {
      // API failed, fall through to local array
      console.log("Random Word API failed, using local fallback:", error);
    }

    // Use local array as fallback
    const localResult = getLocalWord(difficulty, randomLength);
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

