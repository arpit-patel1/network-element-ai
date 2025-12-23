"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Image,
  Video,
  MessageSquare,
  List,
  ListOrdered,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModernEditorProps {
  titleName: string;
  subtitleName: string;
  contentName: string;
  tagsName?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultContent?: string;
  defaultTags?: string[];
}

function SubmitButton({ onClick }: { onClick?: () => boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit"
      size="sm"
      disabled={pending}
      onClick={(e) => {
        if (onClick && !onClick()) {
          e.preventDefault();
        }
      }}
      className="flex-1 md:flex-none"
    >
      {pending ? "Publishing..." : "Publish"}
    </Button>
  );
}

export function ModernEditor({
  titleName,
  subtitleName,
  contentName,
  tagsName = "tags",
  defaultTitle = "",
  defaultSubtitle = "",
  defaultContent = "",
  defaultTags = [],
}: ModernEditorProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [content, setContent] = useState(defaultContent);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string>("");

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!content.trim()) {
      setError("Content is required");
      return false;
    }
    setError("");
    return true;
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(contentName) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertMarkdown("~~", "~~"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertMarkdown("[", "](url)"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertMarkdown("![alt](", ")"),
    },
    {
      icon: Video,
      label: "Video",
      action: () => insertMarkdown("[Video](", ")"),
    },
    {
      icon: MessageSquare,
      label: "Blockquote",
      action: () => insertMarkdown("> "),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("- "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. "),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden inputs for form submission */}
      <input type="hidden" name={titleName} value={title} required />
      <input type="hidden" name={subtitleName} value={subtitle} />
      <input type="hidden" name={contentName} value={content} required />
      <input type="hidden" name={tagsName} value={JSON.stringify(tags)} />

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-6 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
            {/* Style Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 shrink-0">
                  Style
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => insertMarkdown("# ")}>
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("## ")}>
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("### ")}>
                  Heading 3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("")}>
                  Normal Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border shrink-0" />

            {/* Formatting Buttons - Show only key ones on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              type="button"
              onClick={() => insertMarkdown("**", "**")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              type="button"
              onClick={() => insertMarkdown("*", "*")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              type="button"
              onClick={() => insertMarkdown("[", "](url)")}
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
            
            {/* Rest of formatting buttons - hidden on mobile, shown on larger screens */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 hidden md:inline-flex"
              type="button"
              onClick={() => insertMarkdown("~~", "~~")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 hidden md:inline-flex"
              type="button"
              onClick={() => insertMarkdown("`", "`")}
              title="Code"
            >
              <Code className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border shrink-0 hidden md:block" />

            {/* More Tools Dropdown - contains less common formatting */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 shrink-0">
                  More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={toolbarButtons[5].action}>
                  <Image className="h-4 w-4 mr-2" />
                  {toolbarButtons[5].label}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toolbarButtons[6].action}>
                  <Video className="h-4 w-4 mr-2" />
                  {toolbarButtons[6].label}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toolbarButtons[7].action}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {toolbarButtons[7].label}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toolbarButtons[8].action}>
                  <List className="h-4 w-4 mr-2" />
                  {toolbarButtons[8].label}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toolbarButtons[9].action}>
                  <ListOrdered className="h-4 w-4 mr-2" />
                  {toolbarButtons[9].label}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("[Button Text](", ")")}>
                  <Link className="h-4 w-4 mr-2" />
                  Add Button Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("```\n", "\n```")}>
                  <Code className="h-4 w-4 mr-2" />
                  Code Block
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown("---\n")}>
                  Horizontal Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 md:flex-none"
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <SubmitButton onClick={validateForm} />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      {showPreview ? (
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Preview Mode */}
          <article className="flex flex-col gap-6">
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-5xl font-bold">
                {title || "Untitled"}
              </h1>
              
              {subtitle && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  {subtitle}
                </p>
              )}

              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <Card className="p-8">
              {content ? (
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No content yet. Switch to Edit mode to start writing.
                </p>
              )}
            </Card>
          </article>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Edit Mode */}
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-3xl md:text-5xl font-bold border-0 px-0 focus-visible:ring-0 mb-4 h-auto"
            required
          />

          {/* Subtitle */}
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add a subtitle..."
            className="text-lg md:text-xl text-muted-foreground border-0 px-0 focus-visible:ring-0 mb-8 h-auto"
          />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-sm gap-1 pr-1"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-transparent"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            
            {showTagInput ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                    if (e.key === "Escape") {
                      setShowTagInput(false);
                      setNewTag("");
                    }
                  }}
                  placeholder="Tag name"
                  className="h-7 w-32 text-sm"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setShowTagInput(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content Editor */}
          <Textarea
            id={contentName}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="min-h-[500px] text-lg border-0 px-0 focus-visible:ring-0 resize-none"
            required
          />
        </div>
      )}
    </div>
  );
}

