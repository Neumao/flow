"use client"

import * as React from "react"
import { Check, ChevronDown, Plus } from "lucide-react"
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

export interface SearchableSelectOption {
    value: string
    label: string
    description?: string
}

interface SearchableSelectProps {
    options: SearchableSelectOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    emptyText?: string
    className?: string
    popOverClassName?: string
    disabled?: boolean
    addNewPath?: string
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select item...",
    emptyText = "No items found.",
    className,
    popOverClassName,
    disabled = false,
    addNewPath,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    const selectedOption = options.find((option) => option.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", className)}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("p-0", popOverClassName)} align="start">
                <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
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
                            ))}
                        </CommandGroup>
                        {addNewPath && (
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        navigate(addNewPath)
                                        setOpen(false)
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add new item
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover >
    )
}