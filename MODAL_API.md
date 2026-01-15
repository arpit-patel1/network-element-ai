# Kids Words API Documentation

A comprehensive FastAPI service for educational content, providing endpoints for vocabulary, math, reading, science, geography, and more - designed for kids' homework and learning activities.

## Base URL

```
https://your-workspace--kids-words-api-fastapi-app.modal.run
```

## Authentication

Most endpoints require API key authentication. Include your API key in one of the following ways:

### Option 1: X-API-Key Header
```bash
X-API-Key: your_api_key_here
```

### Option 2: Authorization Header
```bash
Authorization: Bearer your_api_key_here
# OR
Authorization: your_api_key_here
```

### Endpoints Without Authentication
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /openapi.json` - OpenAPI schema

---

## Table of Contents

- [Word & Vocabulary Endpoints](#word--vocabulary-endpoints)
- [Math Endpoints](#math-endpoints)
- [Reading & Writing Endpoints](#reading--writing-endpoints)
- [Science Endpoints](#science-endpoints)
- [Geography Endpoints](#geography-endpoints)
- [Grammar Endpoints](#grammar-endpoints)
- [Puzzle & Games Endpoints](#puzzle--games-endpoints)
- [Study Tools Endpoints](#study-tools-endpoints)
- [History Endpoints](#history-endpoints)

---

## Word & Vocabulary Endpoints

### Get Random Word

Get a random English word.

**Endpoint:** `GET /word`

**Authentication:** Required

**Response:**
```json
{
  "word": "example"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word" \
  -H "X-API-Key: your_api_key"
```

---

### Get Word with Synonyms

Get a random word along with its synonyms.

**Endpoint:** `GET /word/synonyms`

**Authentication:** Required

**Response:**
```json
{
  "word": "happy",
  "synonyms": ["joyful", "cheerful", "glad", "pleased"]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/synonyms" \
  -H "X-API-Key: your_api_key"
```

---

### Get Word with Antonyms

Get a random word along with its antonyms.

**Endpoint:** `GET /word/antonyms`

**Authentication:** Required

**Response:**
```json
{
  "word": "happy",
  "antonyms": ["sad", "unhappy", "miserable"]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/antonyms" \
  -H "X-API-Key: your_api_key"
```

---

### Get Word Definition

Get a random word with its definition and part of speech.

**Endpoint:** `GET /word/definition`

**Authentication:** Required

**Response:**
```json
{
  "word": "happy",
  "definition": "feeling or showing pleasure or contentment",
  "part_of_speech": "adjective"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/definition" \
  -H "X-API-Key: your_api_key"
```

---

### Get Word for Spelling Practice

Get a word for spelling practice with hints.

**Endpoint:** `GET /word/spelling`

**Query Parameters:**
- `difficulty` (optional): `easy` | `medium` | `hard` (default: `easy`)

**Authentication:** Required

**Response:**
```json
{
  "word": "example",
  "length": 7,
  "difficulty": "easy",
  "hint": "Starts with 'e' and has 7 letters"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/spelling?difficulty=medium" \
  -H "X-API-Key: your_api_key"
```

---

### Get Rhyming Words

Find words that rhyme with a given word (or random word if not provided).

**Endpoint:** `GET /word/rhyme`

**Query Parameters:**
- `word` (optional): Word to find rhymes for (if not provided, uses random word)

**Authentication:** Required

**Response:**
```json
{
  "word": "cat",
  "rhymes": ["bat", "hat", "mat", "rat", "sat"]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/rhyme?word=cat" \
  -H "X-API-Key: your_api_key"
```

---

### Get Compound Word

Get a compound word broken into its parts.

**Endpoint:** `GET /word/compound`

**Authentication:** Required

**Response:**
```json
{
  "word": "butterfly",
  "parts": ["butter", "fly"]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/word/compound" \
  -H "X-API-Key: your_api_key"
```

---

## Math Endpoints

### Generate Math Problem

Generate math problems with different operations and difficulty levels.

**Endpoint:** `GET /math/problem`

**Query Parameters:**
- `type` (required): `addition` | `subtraction` | `multiplication` | `division`
- `level` (required): `easy` | `medium` | `hard`

**Authentication:** Required

**Response:**
```json
{
  "problem": "What is 5 + 3?",
  "answer": 8,
  "type": "addition",
  "level": "easy"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/problem?type=addition&level=easy" \
  -H "X-API-Key: your_api_key"
```

---

### Get Random Number List

Generate random number lists for practice.

**Endpoint:** `GET /math/numbers`

**Query Parameters:**
- `count` (optional): Number of numbers to generate (1-50, default: 5)
- `min` (optional): Minimum value (default: 1)
- `max` (optional): Maximum value (default: 100)

**Authentication:** Required

**Response:**
```json
{
  "numbers": [23, 45, 12, 78, 34],
  "count": 5,
  "range": {
    "min": 1,
    "max": 100
  }
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/numbers?count=10&min=1&max=50" \
  -H "X-API-Key: your_api_key"
```

---

### Get Multiplication Times Table

Get multiplication table for a specific number.

**Endpoint:** `GET /math/times-table`

**Query Parameters:**
- `number` (optional): Number for times table (1-12, default: 7)

**Authentication:** Required

**Response:**
```json
{
  "number": 7,
  "table": [
    {"problem": "7 × 1", "answer": 7},
    {"problem": "7 × 2", "answer": 14},
    {"problem": "7 × 3", "answer": 21},
    ...
  ]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/times-table?number=7" \
  -H "X-API-Key: your_api_key"
```

---

### Generate Fraction Problem

Generate fraction problems with different operations.

**Endpoint:** `GET /math/fractions`

**Query Parameters:**
- `operation` (optional): `add` | `subtract` | `multiply` | `divide` (default: `add`)

**Authentication:** Required

**Response:**
```json
{
  "problem": "What is 3/4 + 1/2?",
  "answer": "5/4",
  "answer_decimal": 1.25,
  "operation": "add"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/fractions?operation=add" \
  -H "X-API-Key: your_api_key"
```

---

### Generate Money Problem

Generate money counting and calculation problems.

**Endpoint:** `GET /math/money`

**Query Parameters:**
- `operation` (optional): `count` | `add` | `subtract` (default: `count`)

**Authentication:** Required

**Response (count):**
```json
{
  "problem": "Count the money: quarter, dime, nickel, penny",
  "items": ["quarter", "dime", "nickel", "penny"],
  "answer": "$0.41",
  "answer_cents": 41
}
```

**Response (add/subtract):**
```json
{
  "problem": "If you have $5.00 and earn $3.50, how much do you have?",
  "answer": "$8.50"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/money?operation=count" \
  -H "X-API-Key: your_api_key"
```

---

### Generate Time Problem

Generate time telling and calculation problems.

**Endpoint:** `GET /math/time`

**Query Parameters:**
- `type` (optional): `read` | `calculate` | `convert` (default: `read`)

**Authentication:** Required

**Response (read):**
```json
{
  "problem": "What time is 3:45 PM?",
  "answer": "3:45 PM",
  "hour": 3,
  "minute": 45,
  "period": "PM"
}
```

**Response (calculate):**
```json
{
  "problem": "If it's 2:30 and 2 hours 15 minutes pass, what time is it?",
  "answer": "4:45"
}
```

**Response (convert):**
```json
{
  "problem": "Convert 2 hours to minutes.",
  "answer": "120 minutes",
  "hours": 2,
  "minutes": 120
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/time?type=read" \
  -H "X-API-Key: your_api_key"
```

---

### Measurement Conversion

Convert between different measurement units.

**Endpoint:** `GET /measurement/convert`

**Query Parameters:**
- `from_unit` (required): Source unit
  - Length: `inches`, `feet`, `yards`, `centimeters`, `meters`
  - Weight: `pounds`, `ounces`, `kilograms`, `grams`
  - Volume: `cups`, `pints`, `quarts`, `gallons`
- `to_unit` (required): Target unit (same category as from_unit)
- `value` (optional): Value to convert (if not provided, generates random value)

**Authentication:** Required

**Response:**
```json
{
  "problem": "Convert 12 inches to feet.",
  "answer": "1.00 feet",
  "value": 12,
  "from_unit": "inches",
  "to_unit": "feet"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/measurement/convert?from=inches&to=feet&value=12" \
  -H "X-API-Key: your_api_key"
```

---

### Pattern Recognition

Generate pattern recognition problems.

**Endpoint:** `GET /math/pattern`

**Query Parameters:**
- `type` (optional): `number` | `shape` | `color` (default: `number`)

**Authentication:** Required

**Response:**
```json
{
  "pattern": [2, 5, 8, 11, "?"],
  "answer": 14,
  "type": "number",
  "hint": "Add 3 each time"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/math/pattern?type=number" \
  -H "X-API-Key: your_api_key"
```

---

## Reading & Writing Endpoints

### Get Story Prompt

Generate story writing prompts with character, setting, and situation.

**Endpoint:** `GET /story/prompt`

**Authentication:** Required

**Response:**
```json
{
  "character": "Emma",
  "setting": "New York",
  "object": "book",
  "time": "14:30:00",
  "situation": "discovered a secret"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/story/prompt" \
  -H "X-API-Key: your_api_key"
```

---

### Get Fill-in-the-Blank Sentence

Generate fill-in-the-blank sentences with multiple choice options.

**Endpoint:** `GET /sentence/fill-blank`

**Query Parameters:**
- `difficulty` (optional): `easy` | `medium` | `hard` (default: `easy`)

**Authentication:** Required

**Response:**
```json
{
  "sentence": "The _____ sat on the mat.",
  "options": ["cat", "dog", "bird", "fish"],
  "correct_answer": "cat",
  "difficulty": "easy"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/sentence/fill-blank?difficulty=medium" \
  -H "X-API-Key: your_api_key"
```

---

### Get Sentence Starter

Get sentence starters for kids to complete.

**Endpoint:** `GET /sentence/complete`

**Authentication:** Required

**Response:**
```json
{
  "starter": "Once upon a time,"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/sentence/complete" \
  -H "X-API-Key: your_api_key"
```

---

## Science Endpoints

### Get Science Fact

Get a random science fact from different topics.

**Endpoint:** `GET /science/fact`

**Query Parameters:**
- `topic` (optional): `animals` | `space` | `plants` | `weather` (default: `animals`)

**Authentication:** Required

**Response:**
```json
{
  "topic": "animals",
  "fact": "Dolphins are mammals, not fish, and they breathe air."
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/science/fact?topic=space" \
  -H "X-API-Key: your_api_key"
```

---

### Generate Science Quiz

Generate science quiz questions.

**Endpoint:** `GET /science/quiz`

**Query Parameters:**
- `topic` (optional): `animals` | `space` | `plants` | `weather` (default: `animals`)
- `count` (optional): Number of questions (1-10, default: 5)

**Authentication:** Required

**Response:**
```json
{
  "topic": "animals",
  "questions": [
    {
      "question": "True or False: Dolphins are mammals, not fish, and they breathe air.",
      "type": "true_false",
      "answer": "true",
      "explanation": "Dolphins are mammals, not fish, and they breathe air."
    },
    ...
  ]
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/science/quiz?topic=animals&count=5" \
  -H "X-API-Key: your_api_key"
```

---

## Geography Endpoints

### Get Country Information

Get random country information. Returns all data including a hint question asking for the country given the capital.

**Endpoint:** `GET /geography/country`

**Authentication:** Required

**Response:**
```json
{
  "name": "France",
  "capital": "Paris",
  "continent": "Europe",
  "hint": "What is the country for which capital is Paris?"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/geography/country" \
  -H "X-API-Key: your_api_key"
```

---

### Get Country-Capital Pair

Get country and capital pairs for practice. Returns all data including a hint question asking for the capital given the country.

**Endpoint:** `GET /geography/capital`

**Authentication:** Required

**Response:**
```json
{
  "country": "France",
  "capital": "Paris",
  "continent": "Europe",
  "hint": "What is the capital for country France?"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/geography/capital" \
  -H "X-API-Key: your_api_key"
```

---

### Get Country-Continent Pair

Get country and continent pairs for practice. Returns all data including a hint question asking for the continent given the country.

**Endpoint:** `GET /geography/continent`

**Authentication:** Required

**Response:**
```json
{
  "country": "France",
  "capital": "Paris",
  "continent": "Europe",
  "hint": "What is the continent for country France?"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/geography/continent" \
  -H "X-API-Key: your_api_key"
```

---

## Grammar Endpoints

### Get Parts of Speech

Get part of speech for a word (or random word if not provided).

**Endpoint:** `GET /grammar/parts-of-speech`

**Query Parameters:**
- `word` (optional): Word to analyze (if not provided, uses random word)

**Authentication:** Required

**Response:**
```json
{
  "word": "happy",
  "part_of_speech": "adjective",
  "definition": "feeling or showing pleasure or contentment"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/grammar/parts-of-speech?word=happy" \
  -H "X-API-Key: your_api_key"
```

---

## Puzzle & Games Endpoints

### Get Riddle

Get a riddle with answer.

**Endpoint:** `GET /puzzle/riddle`

**Query Parameters:**
- `difficulty` (optional): `easy` | `medium` | `hard` (default: `easy`)

**Authentication:** Required

**Response:**
```json
{
  "riddle": "What has hands but can't clap?",
  "answer": "a clock",
  "difficulty": "easy"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/puzzle/riddle?difficulty=medium" \
  -H "X-API-Key: your_api_key"
```

---

### Get Reading Passage

Get reading passages with comprehension questions.

**Endpoint:** `GET /reading/passage`

**Query Parameters:**
- `level` (optional): `easy` | `medium` | `hard` (default: `easy`)
- `length` (optional): `short` | `medium` | `long` (default: `short`)

**Authentication:** Required

**Response:**
```json
{
  "passage": "The cat sat on the mat. It was a sunny day. The cat was happy.",
  "questions": [
    {
      "question": "Where did the cat sit?",
      "answer": "on the mat"
    },
    {
      "question": "What was the weather like?",
      "answer": "sunny"
    }
  ],
  "level": "easy"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/reading/passage?level=medium" \
  -H "X-API-Key: your_api_key"
```

---

## Study Tools Endpoints

### Generate Flashcards

Generate flashcard content for different subjects.

**Endpoint:** `GET /flashcard`

**Query Parameters:**
- `subject` (optional): `math` | `vocabulary` | `science` | `geography` | `history` (default: `vocabulary`)
- `count` (optional): Number of flashcards (1-20, default: 5)

**Authentication:** Required

**Response:**
```json
{
  "subject": "vocabulary",
  "flashcards": [
    {
      "question": "What does 'happy' mean?",
      "answer": "feeling or showing pleasure or contentment"
    },
    ...
  ],
  "count": 5
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/flashcard?subject=math&count=10" \
  -H "X-API-Key: your_api_key"
```

---

## History Endpoints

### Get History Fact

Get a random history fact from different periods.

**Endpoint:** `GET /history/fact`

**Query Parameters:**
- `period` (optional): `ancient` | `medieval` | `modern` (default: `ancient`)

**Authentication:** Required

**Response:**
```json
{
  "fact": "The Great Pyramid of Giza was built around 2560 BCE.",
  "period": "ancient"
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/history/fact?period=modern" \
  -H "X-API-Key: your_api_key"
```

---

## Health Check

### Get Health Status

Check API health status (no authentication required).

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**
```json
{
  "status": "healthy",
  "words_loaded": 236736
}
```

**Example:**
```bash
curl -X GET "https://your-api-url.modal.run/health"
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "API key required. Provide via X-API-Key or Authorization header."
}
```

### 403 Forbidden
```json
{
  "error": "Invalid API key"
}
```

### 400 Bad Request
```json
{
  "error": "min must be less than max"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message here"
}
```

---

## Rate Limits

Currently, there are no rate limits enforced. However, please use the API responsibly.

---

## Support

For issues or questions, please refer to the Modal deployment logs or contact your API administrator.

---

## Version

**API Version:** 1.0.0

**Last Updated:** 2025

