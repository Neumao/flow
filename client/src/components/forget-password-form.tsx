import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center p-6 md:p-10", className)} {...props}>
      <div className="w-full max-w-sm">
        <Card className="p-6">
          <CardContent className="p-0">
            <form className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground text-sm">
                  Reset your Flow account
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
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
                <div className="text-center text-sm">
                  <Link to="/login" className="underline underline-offset-4">
                    Back to login
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
