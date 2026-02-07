"use client"

import * as React from "react"
import { Check, ChevronDown, X, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
    value: string
    label: string
    description?: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    emptyText?: string
    className?: string
    popOverClassName?: string
    disabled?: boolean
    addNewPath?: string
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select items...",
    emptyText = "No items found.",
    className,
    popOverClassName,
    disabled = false,
    addNewPath,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const navigate = useNavigate()

    const selectedOptions = options.filter((option) =>
        value.includes(option.value)
    )

    const handleSelect = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue]
        onChange(newValue)
    }

    const handleRemove = (optionValue: string) => {
        onChange(value.filter((v) => v !== optionValue))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : selectedOptions.length <= 2 ? (
                            selectedOptions.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {option.label}
                                    <button
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleRemove(option.value)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={() => handleRemove(option.value)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm">
                                {selectedOptions.length} selected
                            </span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={popOverClassName} align="start">
                <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                        <CommandEmpty>
                            <p className="text-sm text-muted-foreground">{emptyText}</p>
                            {addNewPath && (
                                <Button
                                    size="sm"
                                    className=" text-xs"
                                    onClick={() => navigate(addNewPath)}
                                >
                                    <Plus className=" h-4 w-4" />
                                    Create new
                                </Button>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = value.includes(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{option.label}</span>
                                            {option.description && (
                                                <span className="text-xs text-muted-foreground">
                                                    {option.description}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}