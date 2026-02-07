"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">404</h1>
                <p className="text-lg text-muted-foreground">Page not found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    Looks like this page went on a coffee break. Maybe it's hiding in the inventory?
                </p>
                <Button onClick={() => navigate('/layout/workitems')}>
                    Go to Work Items
                </Button>
            </div>
        </div>
    )
}