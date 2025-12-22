"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState, useRef } from "react";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Store reference to the form when the trigger is clicked
    const form = (e.target as HTMLButtonElement).closest("form");
    if (form) {
      formRef.current = form;
    }
  };

  const handleConfirm = () => {
    setIsDeleting(true);
    // Submit the stored form reference
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          type="button"
          variant={variant}
          size={size}
          className="gap-2"
          disabled={isDeleting}
          onClick={handleTriggerClick}
        >
          <Trash2 size={size === "sm" ? 14 : 16} />
          {showLabel && (isDeleting ? "Deleting..." : "Delete")}
          {!showLabel && size === "sm" && !isDeleting && "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

