
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
    isEditing: boolean;
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    as?: 'heading' | 'badge' | 'span';
}

export function EditableField({ isEditing, value, onSave, className, as = 'span' }: EditableFieldProps) {
    const [currentValue, setCurrentValue] = useState(value);
    
    if (!isEditing) {
        if (as === 'badge') {
             return <Badge className={cn("bg-purple-600 text-white hover:bg-purple-700", className)}>{value}</Badge>;
        }
        return <span className={className}>{value}</span>;
    }

    const handleSave = () => {
        onSave(currentValue);
    }
    
    return (
        <div className="flex items-center gap-2">
            <Input 
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={cn(
                    "h-auto p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                    className,
                    as === 'heading' && "!text-3xl !font-bold text-gray-900 dark:text-gray-50 w-[50%]",
                    as === 'span' && "text-gray-900 dark:text-gray-50",
                    as === 'badge' && "bg-purple-600 text-white hover:bg-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit"
                )}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setCurrentValue(value);
                }}
                 onBlur={handleSave} // Save when focus is lost
                 autoFocus
            />
        </div>
    );
}

    