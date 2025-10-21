
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";


interface EditableFieldProps {
  value: string;
  className?: string;
  as?: "heading" | "badge" | "span" | "textarea";
  placeholder?: string;
  isLink?: boolean;
  linkPrefix?: string;
}

export function EditableField({
  value,
  className,
  as = "span",
  placeholder,
  isLink = false,
  linkPrefix = "",
}: EditableFieldProps) {
  
  const Wrapper =
      as === "heading" ? "div" : as === "badge" ? "div" : as === "textarea" ? "p" : "div";

    const displayValue = value || placeholder || "";

  return (
      <Wrapper className={cn("-m-1 p-1")}>
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

    