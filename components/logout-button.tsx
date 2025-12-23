"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export function LogoutButton({ 
  variant = "default", 
  size = "sm",
  showIcon = false,
  className = "" 
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout} variant={variant} size={size} className={`gap-2 ${className}`}>
      {showIcon && <LogOut className="h-4 w-4" />}
      Logout
    </Button>
  );
}
