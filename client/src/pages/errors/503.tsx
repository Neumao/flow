"use client"

import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">503</h1>
                <p className="text-lg text-muted-foreground">Service unavailable</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    We're giving the system a tune-up! Like servicing that old Flow machine, it'll be back better than ever.
                </p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        </div>
    )
}