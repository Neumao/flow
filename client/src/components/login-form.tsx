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
    <div className={cn("relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 md:p-10", className)} {...props}>
      {/* Premium Enterprise Background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Subtle Mesh Gradient - Enterprise Blue */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] h-[70%] w-[70%] rounded-full bg-gradient-to-bl from-blue-500/20 via-indigo-500/15 to-transparent blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-gradient-to-tr from-slate-400/25 via-blue-400/15 to-transparent blur-[100px]" />
        </div>

        {/* Sophisticated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(100 116 139 / 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(100 116 139 / 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Flow Grid Text - Split Left and Right */}
        {/* Left Side - FAT */}
        <div className="absolute left-0 top-0 bottom-0 w-[25%] flex items-center justify-center overflow-hidden opacity-[0.15] dark:opacity-[0.10]">
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-[300px] text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor">
            {/* F */}
            <path d="M20 20 L20 100" strokeWidth="5" />
            <path d="M20 20 L55 20" strokeWidth="5" />
            <path d="M20 55 L45 55" strokeWidth="5" />

            {/* A */}
            <path d="M70 100 L90 20 L110 100" strokeWidth="5" />
            <path d="M78 65 L102 65" strokeWidth="5" />

            {/* T */}
            <path d="M125 20 L175 20" strokeWidth="5" />
            <path d="M150 20 L150 100" strokeWidth="5" />
          </svg>
        </div>

        {/* Right Side - RAA */}
        <div className="absolute right-0 top-0 bottom-0 w-[25%] flex items-center justify-center overflow-hidden opacity-[0.15] dark:opacity-[0.10]">
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-[300px] text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor">
            {/* R */}
            <path d="M20 20 L20 100" strokeWidth="5" />
            <path d="M20 20 L50 20 Q70 20 70 40 Q70 60 50 60 L20 60" strokeWidth="5" />
            <path d="M45 60 L70 100" strokeWidth="5" />

            {/* A */}
            <path d="M90 100 L110 20 L130 100" strokeWidth="5" />
            <path d="M98 65 L122 65" strokeWidth="5" />

            {/* A */}
            <path d="M150 100 L170 20 L190 100" strokeWidth="5" />
            <path d="M158 65 L182 65" strokeWidth="5" />
          </svg>
        </div>

        {/* Subtle Diagonal Lines */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              rgb(100 116 139 / 0.5) 100px,
              rgb(100 116 139 / 0.5) 101px
            )`
          }}
        />

        {/* Vertical Accent Line */}
        {/* Accent Lines - Vertical and Horizontal */}
        {/* Vertical Lines */}
        <div className="absolute left-[15%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-slate-400/30 to-transparent dark:via-slate-600/30" />
        <div className="absolute right-[15%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-slate-400/25 to-transparent dark:via-slate-600/25" />

        {/* Horizontal Lines */}
        <div className="absolute top-[5%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400/25 to-transparent dark:via-slate-600/25" />
        <div className="absolute bottom-[5%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent dark:via-slate-600/30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6">
        <Card className="overflow-hidden p-0 shadow-2xl ring-1 ring-border/50">
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Flow account
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forget-password"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Apple</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Meta</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden md:flex flex-col items-center justify-center bg-zinc-950 p-12 overflow-hidden border-l border-white/5">
              {/* Ambient & Spot Lighting */}
              <div className="absolute inset-0 bg-zinc-950">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent blur-3xl opacity-40" />
                <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-blue-900/10 to-transparent blur-3xl opacity-20" />
              </div>

              {/* Subtle Noise Texture */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

              {/* Glowing Center Area */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-sm">
                <div className="relative transform hover:scale-105 transition-transform duration-700 ease-out">
                  {/* Subtle backing glow for logo */}
                  <div className="absolute -inset-10 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-50" />

                  <img
                    src="/logo/logo_white.png"
                    alt="Flow Logo"
                    className="w-60 h-auto object-contain drop-shadow-2xl relative z-10"
                  />
                </div>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                  <h2 className="text-1xl font-semibold tracking-tight text-white">
                    Run Your Entire Business. From One Powerful Platform.
                  </h2>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
