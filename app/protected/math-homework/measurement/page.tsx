"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Ruler, Loader2, Eye, Calculator } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MeasurementResponse {
  problem: string;
  answer: string;
  value: number;
  from_unit: string;
  to_unit: string;
}

const unitCategories = {
  length: {
    name: "Length",
    units: ["inches", "feet", "yards", "centimeters", "meters"],
  },
  weight: {
    name: "Weight",
    units: ["pounds", "ounces", "kilograms", "grams"],
  },
  volume: {
    name: "Volume",
    units: ["cups", "pints", "quarts", "gallons"],
  },
};

type UnitCategory = keyof typeof unitCategories;

export default function MeasurementPage() {
  const [data, setData] = useState<MeasurementResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("inches");
  const [toUnit, setToUnit] = useState<string>("feet");
  const [customValue, setCustomValue] = useState<string>("");
  const [useCustomValue, setUseCustomValue] = useState(false);

  const availableUnits = unitCategories[category].units;

  useEffect(() => {
    // Reset units when category changes
    setFromUnit(availableUnits[0]);
    setToUnit(availableUnits[1] || availableUnits[0]);
  }, [category, availableUnits]);

  const loadQuestion = async () => {
    if (!fromUnit || !toUnit) return;

    setLoading(true);
    setError(null);
    setIsRevealed(false);

    try {
      let url = `/api/measurement/convert?from_unit=${encodeURIComponent(fromUnit)}&to_unit=${encodeURIComponent(toUnit)}`;
      if (useCustomValue && customValue) {
        url += `&value=${encodeURIComponent(customValue)}`;
      }

      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "Unable to load a new question. Please try again.");
        return;
      }

      const questionData = (await response.json()) as MeasurementResponse;
      setData(questionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load a new question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQuestion = () => {
    loadQuestion();
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
            Measurement Conversion
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Ruler className="text-white" size={24} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-purple-600 dark:text-purple-300 font-semibold">
              Math
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Measurement Conversion
              </span>
            </h1>
            <p className="text-muted-foreground">
              Practice converting between different measurement units.
            </p>
          </div>
        </div>

        {/* Unit Selection */}
        <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-100">Select Units</CardTitle>
            <CardDescription>Choose the measurement category and units to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Category</Label>
              <Tabs value={category} onValueChange={(value) => setCategory(value as UnitCategory)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="length">Length</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-unit">From Unit</Label>
                <select
                  id="from-unit"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                >
                  {availableUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="to-unit">To Unit</Label>
                <select
                  id="to-unit"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                >
                  {availableUnits
                    .filter((unit) => unit !== fromUnit)
                    .map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="custom-value"
                checked={useCustomValue}
                onChange={(e) => setUseCustomValue(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="custom-value" className="cursor-pointer">
                Use custom value (leave unchecked for random value)
              </Label>
            </div>

            {useCustomValue && (
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Enter value"
                  className="mt-1"
                />
              </div>
            )}

            <Button
              onClick={handleLoadQuestion}
              disabled={loading || !fromUnit || !toUnit || (useCustomValue && !customValue)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Generate Question"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-red-700 dark:text-red-200">Could not load a question.</p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button onClick={handleLoadQuestion} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {data && (
          <Card className="border-2 bg-gradient-to-br from-purple-50/40 via-pink-50/30 to-transparent dark:from-purple-950/30 dark:via-pink-950/20 dark:to-transparent">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <Calculator className="text-white" size={22} />
                </div>
                <div>
                  <CardTitle className="text-purple-800 dark:text-purple-100">Question</CardTitle>
                  <CardDescription>Convert the measurement.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-background/70 p-6 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-semibold leading-8">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {data.problem}
                  </span>
                </h2>
              </div>

              {!isRevealed ? (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsRevealed(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Reveal Answer
                  </Button>
                </div>
              ) : (
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-transparent dark:from-purple-950/20 dark:via-pink-950/10">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-purple-800 dark:text-purple-100 text-lg mb-2">Answer</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                      <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        {data.answer}
                      </span>
                    </h2>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLoadQuestion}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

