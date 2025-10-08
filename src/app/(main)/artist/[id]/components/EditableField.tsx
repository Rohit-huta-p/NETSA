
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface EditableFieldProps {
    isEditing: boolean;
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    as?: 'input' | 'badge' | 'span';
}

export function EditableField({ isEditing, value, onSave, className, as = 'span' }: EditableFieldProps) {
    const [currentValue, setCurrentValue] = useState(value);
    
    if (!isEditing) {
        if (as === 'badge') {
             return <Badge className="bg-purple-600 text-white hover:bg-purple-700">{value}</Badge>;
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
                className={`h-8 ${className}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setCurrentValue(value);
                }}
            />
        </div>
    );
}

