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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Code2 size={16} />
              Personal Projects Playground
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to My Playground
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A collection of projects built with Next.js, Supabase, and modern web technologies.
              Experimenting, learning, and building in public.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog">
              <Card className="hover:border-primary/50 transition-all hover:shadow-md h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="text-primary" size={24} />
                    </div>
                    <CardTitle>Blog</CardTitle>
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
              <Card className="hover:border-primary/50 transition-all hover:shadow-md h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calculator className="text-primary" size={24} />
                    </div>
                    <CardTitle>Math Homework</CardTitle>
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
            <h2 className="text-2xl font-semibold">Built With</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {["Next.js 16", "React 19", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"].map((tech) => (
                <div
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-accent text-sm font-medium"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p className="text-muted-foreground">
            Built with ❤️ using modern web technologies
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
