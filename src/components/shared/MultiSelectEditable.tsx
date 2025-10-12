
"use client";

import * as React from "react";
import { X, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";


interface MultiSelectEditableProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  isOwnProfile: boolean;
}

export function MultiSelectEditable({
  label,
  placeholder,
  options,
  value,
  onChange,
  isOwnProfile
}: MultiSelectEditableProps) {

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const isMobile = useIsMobile();

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          const newSelected = [...value];
          newSelected.pop();
          onChange(newSelected);
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const selectables = options.filter((option) => !value.includes(option.value));

  const handleSelect = (newValue: string) => {
    if (newValue && !value.includes(newValue)) {
        onChange([...value, newValue]);
    }
    setInputValue("");
  };


  if (!isOwnProfile) {
    return (
        <div>
            <h3 className="font-semibold text-sm mb-2">{label}</h3>
             <div className="flex flex-wrap gap-2">
                {value.length > 0 ? value.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-purple-100 text-purple-700">{item}</Badge>
                )) : <p className="text-sm text-muted-foreground">No {label.toLowerCase()} specified.</p>}
            </div>
        </div>
    );
  }

  return (
    <div className={cn("group/container relative rounded-md p-2 -m-2 transition-colors", !isMobile && "hover:bg-muted/70")}>
        <h3 className="font-semibold text-sm mb-2">{label}</h3>
        <Popover open={open} onOpenChange={setOpen}>
            <div className="flex flex-wrap gap-1 items-center">
                {value.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-purple-100 text-purple-700 relative group/badge pr-6">
                        {item}
                        <button 
                            onClick={() => handleUnselect(item)} 
                            className="absolute top-1/2 right-0.5 -translate-y-1/2 rounded-full hover:bg-black/10 opacity-0 group-hover/badge:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
                 <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("h-6 w-6 transition-opacity", isMobile ? "opacity-100" : "opacity-0 group-hover/container:opacity-100")}>
                        <PlusCircle className="w-4 h-4 text-muted-foreground"/>
                    </Button>
                </PopoverTrigger>
            </div>
        
            <PopoverContent className="w-[200px] p-0" align="start">
                 <Command onKeyDown={handleKeyDown}>
                    <CommandList>
                        <div className="p-1">
                             <CommandPrimitive.Input
                                ref={inputRef}
                                value={inputValue}
                                onValueChange={setInputValue}
                                onBlur={() => setOpen(false)}
                                onFocus={() => setOpen(true)}
                                placeholder={placeholder}
                                className="w-full bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                   
                        <CommandGroup>
                        {selectables.map((option) => {
                            return (
                            <CommandItem
                                key={option.value}
                                onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                }}
                                onSelect={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </CommandItem>
                            );
                        })}
                        {inputValue && !options.some(o => o.value.toLowerCase() === inputValue.toLowerCase()) && (
                             <CommandItem
                                onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                }}
                                onSelect={() => handleSelect(inputValue)}
                                className="font-semibold"
                            >
                                Create "{inputValue}"
                            </CommandItem>
                        )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    </div>
  );
}

    