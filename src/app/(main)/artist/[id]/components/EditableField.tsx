
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

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
    const isMobile = useIsMobile();

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);
    
    if (isLoading) {
        if (as === 'heading') return <Skeleton className="h-10 w-48" />;
        if (as === 'badge') return <Skeleton className="h-6 w-20 rounded-full" />;
        if (as === 'textarea') return <Skeleton className="h-20 w-full" />;
        return <Skeleton className="h-5 w-32" />;
    }

    // If we can't edit at all, just show the value.
    if (!canEdit) {
        if (as === 'badge') {
             return <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>{value || placeholder}</Badge>;
        }
        if (as === 'textarea') {
            return <p className={cn("whitespace-pre-line", className)}>{value || placeholder}</p>;
        }
        if (isLink) {
            return value.includes('No ') ? <span className={className}>{value}</span> : <Link href={`${linkPrefix}${value}`} target="_blank" rel="noopener noreferrer" className={cn("hover:underline", className)}>{value}</Link>
        }
        return <span className={className}>{value || placeholder}</span>;
    }

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    }
    
    const isCurrentlyEditing = isMobile ? canEdit : isEditing;

    if (!isCurrentlyEditing) {
        const hoverClasses = !isMobile ? "hover:bg-gray-100/10 rounded-md cursor-text" : "";
        const Wrapper = as === 'heading' ? 'div' : (as === 'badge' ? 'div' : (as === 'textarea' ? 'p' : 'span'));
        
        const displayValue = value || placeholder;

        return (
            <Wrapper 
                onClick={() => !isMobile && setIsEditing(true)} 
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
                    <span className={cn(className, !value && "text-muted-foreground/70")}>{displayValue}</span>
                )}
            </Wrapper>
        );
    }
    
    const calculatedWidth = `${Math.max(currentValue?.length || 0, placeholder?.length || 0) + 4}ch`;
    
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
                style={(as === 'heading' || as === 'badge') ? { width: calculatedWidth } : undefined} 
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
    
