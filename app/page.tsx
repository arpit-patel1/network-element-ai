import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, Calculator, Code2, Home as HomeIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10">
          <div className="w-full max-w-5xl flex justify-between items-center p-4 px-4 md:px-6 gap-4">
            <div className="flex gap-2 md:gap-4 items-center">
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href={"/"}>
                  <HomeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href={"/blog"}>
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Blog</span>
                </Link>
              </Button>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense fallback={<div className="h-8 w-20 bg-muted animate-pulse rounded" />}>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-16 max-w-5xl p-5 w-full">
          {/* Hero Section */}
          <div className="flex flex-col gap-8 items-center text-center py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-sm font-medium backdrop-blur-sm">
              <Code2 size={16} />
              Personal Projects Playground
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Welcome to the Playground
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A collection of projects built with{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Next.js</span>,{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Supabase</span>, and modern web technologies.
              Experimenting, learning, and building in public.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog">
              <Card className="hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 h-full bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-purple-700 dark:text-purple-300">Blog</CardTitle>
                  </div>
                  <CardDescription>
                    Thoughts, tutorials, and learnings about web development, programming, and technology.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    ✨ Full CRUD operations • 🔒 Row Level Security • 📝 Draft support
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/protected/math-homework">
              <Card className="hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 h-full bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Calculator className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-blue-700 dark:text-blue-300">Math Homework</CardTitle>
                  </div>
                  <CardDescription>
                    Interactive math practice with addition, subtraction, multiplication, and division. Multiple difficulty levels with instant feedback!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    ➕ ➖ ✖️ ➗ Four operations • 🎚️ 3 difficulty levels • 📊 Progress tracking
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-col gap-6 items-center py-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Built With</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { name: "Next.js 16", colors: "bg-gradient-to-r from-slate-900 to-slate-700 text-white" },
                { name: "React 19", colors: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" },
                { name: "TypeScript", colors: "bg-gradient-to-r from-blue-600 to-blue-700 text-white" },
                { name: "Supabase", colors: "bg-gradient-to-r from-emerald-500 to-green-600 text-white" },
                { name: "Tailwind CSS", colors: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white" },
                { name: "shadcn/ui", colors: "bg-gradient-to-r from-purple-600 to-pink-600 text-white" }
              ].map((tech) => (
                <div
                  key={tech.name}
                  className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 ${tech.colors}`}
                >
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p className="text-muted-foreground">
            Built with ❤️ by Daddy
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
