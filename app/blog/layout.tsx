import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { Home as HomeIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <Button asChild variant="default" size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
        <div className="flex-1 flex flex-col w-full max-w-5xl p-5">
          <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center">Loading...</div>}>
            {children}
          </Suspense>
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

