"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export function MarkdownEditor({ 
  name, 
  defaultValue = "", 
  required,
  placeholder = "Write your content in Markdown..."
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="w-full">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid !w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="mt-2">
          <Textarea
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="min-h-[400px] font-mono text-sm"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Supports Markdown formatting: **bold**, *italic*, [links](url), # headings, etc.
          </p>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-2">
          <Card className="min-h-[400px] p-6">
            {value ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview yet. Start writing in the &quot;Write&quot; tab.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

