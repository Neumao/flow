import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useMutation } from '@apollo/client/react'
import { LOGIN_MUTATION, LoginInput, LoginResponse } from '../graphql/mutations/auth'
import { useAuth } from "../hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // GraphQL login mutation
  const [loginMutation, { loading: isLoading }] = useMutation<LoginResponse, { input: LoginInput }>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.status) {
        // Update user state in auth context
        const userData = {
          id: data.login.data.id,
          email: data.login.data.email,
          name: data.login.data.firstName || data.login.data.userName || '',
          role: data.login.data.role,
        };

        setUserFromToken(userData, data.login.data.authToken);

        // Navigate to Work Items
        navigate("/layout/workitems");
      } else {
        setError(data.login.message || 'Login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await loginMutation({
        variables: {
          input: { email, password }
        }
      });
    } catch (err) {
      // Error handled by onError callback
      console.error('Login submission error:', err);
    }
  };
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center p-6 md:p-10", className)} {...props}>
      <div className="w-full max-w-sm">
        <Card className="p-6">
          <CardContent className="p-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                  Login to your Flow account
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forget-password"
                      className="text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
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
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
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
