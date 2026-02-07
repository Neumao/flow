"use client"

import { Button } from "@/components/ui/button"

export default function InternalServerErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">500</h1>
                <p className="text-lg text-muted-foreground">Internal server error</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    Our server is having a bad day. It's probably just needs a reboot, like that old cash register in the back.
                </p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        </div>
    )
}