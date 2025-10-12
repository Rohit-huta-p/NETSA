
"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import * as React from 'react';

interface EditableFieldProps {
    canEdit: boolean;
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    as?: 'heading' | 'badge' | 'span' | 'textarea';
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
    as = 'span', 
    placeholder,
    isLink = false,
    linkPrefix = '',
    isLoading = false
}: EditableFieldProps) {
    const [currentValue, setCurrentValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const isMobile = useIsMobile();
    const wasLoading = useRef(false);

    useEffect(() => {
      // When loading completes (wasLoading=true, isLoading=false), trigger animation
      if (wasLoading.current && !isLoading) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 550); // Animation duration
        return () => clearTimeout(timer);
      }
      // Update our ref to track the loading state for the next render
      wasLoading.current = isLoading;
    }, [isLoading]);
    
    // Sync internal state if the prop value changes from outside
    useEffect(() => {
        setCurrentValue(value);
    }, [value]);
    

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    }
    
    const isCurrentlyEditing = isMobile ? canEdit : isEditing;

    const textShimmerClasses = 
        "animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-gray-300/50 via-gray-50 to-gray-300/50 dark:from-gray-700/50 dark:via-gray-100 dark:to-gray-700/50 bg-[length:400%_100%]";

    // DISPLAY STATE: Not editing, show text
    if (!isCurrentlyEditing) {
        const hoverClasses = canEdit && !isMobile ? "hover:bg-gray-100/10 dark:hover:bg-white/10 rounded-md cursor-text" : "";
        const Wrapper = as === 'heading' ? 'div' : (as === 'badge' ? 'div' : (as === 'textarea' ? 'p' : 'span'));
        
        const displayValue = value || placeholder || '';

        const typewriterClasses = isAnimating 
            ? 'animate-typewriter overflow-hidden whitespace-nowrap border-r-2 border-r-primary/50' 
            : '';
        
        const calculatedTextWidth = `${displayValue.length}ch`;

        return (
            <Wrapper 
                onClick={() => canEdit && !isMobile && setIsEditing(true)} 
                className={cn(
                    "transition-colors", 
                    hoverClasses, 
                    (as === 'span' || as === 'textarea') && 'px-2 py-1 -mx-2 -my-1',
                    as === 'heading' && 'px-2 -mx-2 rounded-lg'
                )}
            >
                {as === 'badge' ? (
                     <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>{displayValue}</Badge>
                ) : as === 'textarea' ? (
                     <p className={cn("whitespace-pre-line", className, !value && "text-muted-foreground/70")}>{displayValue}</p>
                ) : isLink ? (
                     value.includes('No ') ? <span className={className}>{value}</span> : <Link href={`${linkPrefix}${value}`} target="_blank" rel="noopener noreferrer" className={cn("hover:underline", className)}>{value}</Link>
                ) : (
                    <span 
                        className={cn(
                            className, 
                            !value && "text-muted-foreground/70", 
                            isLoading ? textShimmerClasses : typewriterClasses,
                        )}
                        style={isAnimating ? { width: calculatedTextWidth, display: 'inline-block' } : {display: 'inline-block'}} 
                    >
                        {isLoading ? (value || 'Loading...').replace(/./g, ' ') : displayValue}
                        {!isLoading && displayValue}
                    </span>
                )}
            </Wrapper>
        );
    }
    
    // EDITING STATE: Show Input/Textarea
    const calculatedWidth = `${Math.max(currentValue?.length || 0, placeholder?.length || 0, 1) + 1.5}ch`;

    const commonInputProps = {
        value: currentValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && as !== 'textarea') handleSave();
            if (e.key === 'Escape') {
                setCurrentValue(value);
                setIsEditing(false);
            }
        },
        onBlur: handleSave,
        autoFocus: true,
        placeholder,
    };

    if (as === 'textarea') {
         return (
             <Textarea
                {...commonInputProps}
                className={cn("h-auto bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm", className)}
                rows={3}
            />
         )
    }

    return (
        <div className="flex items-center">
            <Input 
                {...commonInputProps}
                style={(as === 'heading' || as === 'badge' || as === 'span') ? { width: calculatedWidth } : undefined} 
                className={cn(
                    "h-auto p-0 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
                    className,
                    as === 'heading' && "!text-3xl !font-bold text-gray-900 dark:text-gray-50 px-2",
                    as === 'span' && "text-gray-900 dark:text-gray-50 px-2",
                    as === 'badge' && "bg-purple-600 text-white hover:bg-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                )}
            />
        </div>
    );
}
