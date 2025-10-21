
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TextShimmer } from "@/components/core/TextShimmer";

interface EditableFieldProps {
  isOwnProfile: boolean;
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
  isOwnProfile,
  value,
  onSave,
  className,
  as = "span",
  placeholder,
  isLink = false,
  linkPrefix = "",
  isLoading = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

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

  const handleWrapperClick = () => {
    if (isOwnProfile) {
      setIsEditing(true);
    }
  };

  // DISPLAY (not editing)
  if (!isEditing || !isOwnProfile) {
    const Wrapper =
      as === "heading" ? "div" : as === "badge" ? "div" : as === "textarea" ? "p" : "div";

    const displayValue = value || placeholder || "";

    if (isLoading) {
        return (
            <div className={cn(className)}>
                <TextShimmer duration={1.5}>{displayValue}</TextShimmer>
            </div>
        )
    }

    return (
      <Wrapper className={cn("transition-colors rounded-sm", isOwnProfile && "hover:bg-muted/70 -m-1 p-1 cursor-pointer")} onClick={handleWrapperClick}>
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
            <span className={cn(className, !value && "text-muted-foreground/70")}>{displayValue}</span>
          ) : (
            <Link
              href={`${linkPrefix}${displayValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("hover:underline", className)}
              onClick={(e) => e.stopPropagation()} // Prevent wrapper click from triggering edit
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
      if (e.key === "Escape") setIsEditing(false);
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
          "h-auto bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
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
        style={as === "heading" || as === "badge" || as === "span" ? { width: calculatedWidth, minWidth: '10ch' } : undefined}
        className={cn(
          "h-auto p-0 border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
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
