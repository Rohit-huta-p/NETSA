
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { TextShimmer } from "@/components/core/TextShimmer";

interface EditableFieldProps {
  canEdit: boolean;
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  as?: "heading" | "badge" | "span" | "textarea";
  placeholder?: string;
  isLink?: boolean;
  linkPrefix?: string;
  isLoading?: boolean;
}

export function EditableField({
  canEdit,
  value,
  onSave,
  className,
  as = "span",
  placeholder,
  isLink = false,
  linkPrefix = "",
  isLoading = false,
}: EditableFieldProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  // Keep internal value in sync with external changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    if (currentValue !== value) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const isCurrentlyEditing = isMobile ? canEdit : isEditing;

  // DISPLAY (not editing)
  if (!isCurrentlyEditing) {
    const hoverClasses =
      canEdit && !isMobile
        ? "hover:bg-gray-100/10 dark:hover:bg-white/10 rounded-md cursor-text"
        : "";
    const Wrapper =
      as === "heading" ? "div" : as === "badge" ? "div" : as === "textarea" ? "p" : "span";

    const displayValue = value || placeholder || "";

    if (isLoading) {
        return (
            <div className={cn(className, "px-2 py-1 -mx-2 -my-1")}>
                <TextShimmer duration={1.5}>{displayValue}</TextShimmer>
            </div>
        )
    }

    return (
      <Wrapper
        onClick={() => canEdit && !isMobile && setIsEditing(true)}
        className={cn(
          "transition-colors",
          hoverClasses,
          (as === "span" || as === "textarea") && "px-2 py-1 -mx-2 -my-1",
          as === "heading" && "px-2 -mx-2 rounded-lg"
        )}
      >
        {as === "badge" ? (
          <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>
            {displayValue}
          </Badge>
        ) : as === "textarea" ? (
          <p className={cn("whitespace-pre-line", className, !value && "text-muted-foreground/70")}>
            {displayValue}
          </p>
        ) : isLink ? (
          displayValue.includes("No ") ? (
            <span className={className}>{displayValue}</span>
          ) : (
            <Link
              href={`${linkPrefix}${displayValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("hover:underline", className)}
            >
              {displayValue}
            </Link>
          )
        ) : (
          <span className={cn(className, !value && "text-muted-foreground/70")}>
            {displayValue}
          </span>
        )}
      </Wrapper>
    );
  }

  // EDITING
  const calculatedWidth = `${Math.max(currentValue?.length || 0, placeholder?.length || 0, 1) + 1.5}ch`;

  const commonInputProps = {
    value: currentValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCurrentValue(e.target.value),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && as !== "textarea") handleSave();
      if (e.key === "Escape") {
        setCurrentValue(value);
        setIsEditing(false);
      }
    },
    onBlur: handleSave,
    autoFocus: true,
    placeholder,
  };

  if (as === "textarea") {
    return (
      <Textarea
        {...commonInputProps}
        className={cn(
          "h-auto bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
          className
        )}
        rows={3}
      />
    );
  }

  return (
    <div className="flex items-center">
      <Input
        {...commonInputProps}
        style={as === "heading" || as === "badge" || as === "span" ? { width: calculatedWidth } : undefined}
        className={cn(
          "h-auto p-0 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
          className,
          as === "heading" && "!text-3xl !font-bold text-gray-900 dark:text-gray-50 px-2",
          as === "span" && "text-gray-900 dark:text-gray-50 px-2",
          as === "badge" &&
            "bg-purple-600 text-white hover:bg-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold"
        )}
      />
    </div>
  );
}
