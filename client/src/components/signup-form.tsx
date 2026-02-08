import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import reactLogo from '../assets/react.svg'
import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center p-6 md:p-10", className)} {...props}>
      <div className="w-full max-w-sm">
        <Card className="p-6">
          <CardContent className="p-0">
            <form className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                  Join Flow today
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} required />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
