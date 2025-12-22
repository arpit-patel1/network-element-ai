"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeletePostButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function DeletePostButton({ 
  variant = "destructive", 
  size = "default",
  showLabel = true 
}: DeletePostButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    
    if (!confirmed) {
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <Button 
      type="submit" 
      variant={variant}
      size={size}
      className="gap-2"
      onClick={handleClick}
      disabled={isConfirming}
    >
      <Trash2 size={size === "sm" ? 14 : 16} />
      {showLabel && (isConfirming ? "Deleting..." : "Delete")}
      {!showLabel && size === "sm" && !isConfirming && "Delete"}
    </Button>
  );
}

