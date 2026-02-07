"use client"

import { useTheme } from "@/hooks/useTheme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Palette, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/themes"

export function ThemeSwitcher() {
    const { theme: currentTheme, setTheme, mode, setMode, themes } = useTheme()

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Customization
                </CardTitle>
                <CardDescription>
                    Customize the appearance of the application. Choose a theme and color mode.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Light/Dark Mode Toggle */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Appearance Mode</Label>
                    <Tabs value={mode} onValueChange={(value) => setMode(value as "light" | "dark")}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="light" className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light
                            </TabsTrigger>
                            <TabsTrigger value="dark" className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Theme Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Color Theme</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {themes.map((theme: Theme) => {
                            const isActive = currentTheme === theme.name

                            return (
                                <button
                                    key={theme.name}
                                    className={cn(
                                        "relative h-24 rounded-lg flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group",
                                        "hover:scale-105",
                                        isActive && "scale-105"
                                    )}
                                    style={{ backgroundColor: theme.color }}
                                    onClick={() => setTheme(theme.name)}
                                >
                                    {/* Check Icon */}
                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-card rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-gray-900" />
                                        </div>
                                    )}

                                    {/* Theme Name */}
                                    <span className="text-sm font-medium text-white drop-shadow-lg">
                                        {theme.label.replace(' (Default)', '')}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Current Theme Info */}
                <div className="rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Current Theme</p>
                            <p className="text-xs text-muted-foreground">
                                {themes.find((t: Theme) => t.name === currentTheme)?.label} • {mode === "light" ? "Light" : "Dark"} Mode
                            </p>
                        </div>
                        <div
                            className="h-12 w-12 rounded-lg"
                            style={{
                                backgroundColor: themes.find((t: Theme) => t.name === currentTheme)?.color,
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
