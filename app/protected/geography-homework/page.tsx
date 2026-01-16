import Link from "next/link";
import { Globe, ArrowRight, MapPin, Building2, Map } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GeographyHomeworkPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center py-8">
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-lg">
            <Globe className="text-white" size={28} />
          </div>
          <div className="space-y-2">
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-md">
              Geography
            </Badge>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Geography
                </span>
              </h1>
              <p className="text-muted-foreground">
                Practice geography knowledge with countries, capitals, and continents.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-2 hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-transparent dark:from-emerald-950/30 dark:via-green-950/20 dark:to-transparent flex flex-col h-full">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                  <MapPin className="text-white" size={24} />
                </div>
              </div>
              <CardTitle className="text-base text-emerald-700 dark:text-emerald-200">Country Information</CardTitle>
              <CardDescription className="text-xs">Guess the country from its capital</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                size="sm"
              >
                <Link href="/protected/geography-homework/country" className="flex items-center justify-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-transparent dark:from-emerald-950/30 dark:via-green-950/20 dark:to-transparent flex flex-col h-full">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                  <Building2 className="text-white" size={24} />
                </div>
              </div>
              <CardTitle className="text-base text-emerald-700 dark:text-emerald-200">Country-Capital Pair</CardTitle>
              <CardDescription className="text-xs">Guess the capital from the country</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                size="sm"
              >
                <Link href="/protected/geography-homework/capital" className="flex items-center justify-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-transparent dark:from-emerald-950/30 dark:via-green-950/20 dark:to-transparent flex flex-col h-full">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg shadow-md">
                  <Map className="text-white" size={24} />
                </div>
              </div>
              <CardTitle className="text-base text-emerald-700 dark:text-emerald-200">Country-Continent Pair</CardTitle>
              <CardDescription className="text-xs">Guess the continent from the country</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md"
                size="sm"
              >
                <Link href="/protected/geography-homework/continent" className="flex items-center justify-center gap-2">
                  Start
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

