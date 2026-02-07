"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagsInputProps {
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    className?: string
}

export function TagsInput({
    value = [],
    onChange,
    placeholder = "Add tag...",
    className,
}: TagsInputProps) {
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = inputValue.trim()
            if (newTag && !value.includes(newTag)) {
                onChange([...value, newTag])
                setInputValue("")
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div className={cn("flex flex-wrap gap-1.5 p-1 border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs py-0.5 px-1.5 h-6">
                    {tag}
                    <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => removeTag(tag)}
                    >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        <span className="sr-only">Remove {tag}</span>
                    </button>
                </Badge>
            ))}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 h-6 text-sm min-w-[120px]"
            />
        </div>
    )
}
