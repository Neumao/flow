"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function UnauthorizedPage() {
    const navigate = useNavigate()

    const handleLogin = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary">401</h1>
                <p className="text-lg text-muted-foreground">Unauthorized</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    You need to clock in first! This area is for authorized personnel only.
                </p>
                <div className="space-x-2">
                    <Button onClick={handleLogin}>
                        Sign In
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    )
}