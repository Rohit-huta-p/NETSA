
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
    canEdit: boolean;
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    as?: 'heading' | 'badge' | 'span';
}

export function EditableField({ canEdit, value, onSave, className, as = 'span' }: EditableFieldProps) {
    const [currentValue, setCurrentValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    
    if (!canEdit) {
        if (as === 'badge') {
             return <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>{value}</Badge>;
        }
        return <span className={className}>{value}</span>;
    }

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    }

    if (!isEditing) {
        const hoverClasses = "hover:bg-muted/70 rounded-md cursor-text";
        const Wrapper = as === 'badge' ? 'div' : 'span';
        return (
            <Wrapper 
                onClick={() => setIsEditing(true)} 
                className={cn("transition-colors", hoverClasses, as === 'span' && 'px-2 py-1 -mx-2 -my-1')}
            >
                {as === 'badge' ? (
                     <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>{value}</Badge>
                ) : (
                    <span className={className}>{value}</span>
                )}
            </Wrapper>
        );
    }
    
    const calculatedWidth = `${Math.max(currentValue.length, 0) + 2}ch`;

    return (
        <div className="flex items-center">
            <Input 
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                style={as === 'heading' || as === 'badge' ? { width: calculatedWidth } : undefined} 
                className={cn(
                    "h-auto p-0 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 rounded-sm",
                    className,
                    as === 'heading' && "!text-3xl !font-bold text-gray-900 dark:text-gray-50 ",
                    as === 'span' && "text-gray-900 dark:text-gray-50 px-2",
                    as === 'badge' && "bg-purple-600 text-white hover:bg-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                )}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                        setCurrentValue(value);
                        setIsEditing(false);
                    }
                }}
                 onBlur={handleSave}
                 autoFocus
            />
        </div>
    );
}

    