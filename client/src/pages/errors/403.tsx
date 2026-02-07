"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function ForbiddenPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">403</h1>
                <p className="text-lg text-muted-foreground">Access forbidden</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    Sorry, you don't have the right key for this register. Manager's permission required!
                </p>
                <Button onClick={() => navigate('/layout/dashboard')}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    )
}