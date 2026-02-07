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
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-[300px]" fill="none" stroke="currentColor">
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
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-[300px]" fill="none" stroke="currentColor">
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

        {/* Accent Lines - Vertical and Horizontal */}
        <div className="absolute left-[15%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-slate-400/30 to-transparent dark:via-slate-600/30" />
        <div className="absolute right-[15%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-slate-400/25 to-transparent dark:via-slate-600/25" />
        <div className="absolute top-[5%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400/25 to-transparent dark:via-slate-600/25" />
        <div className="absolute bottom-[5%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent dark:via-slate-600/30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6">
        <Card className="overflow-hidden p-0 shadow-2xl ring-1 ring-border/50">
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Forgot Password</h1>
                  <p className="text-muted-foreground text-balance">
                    Reset your Flow account
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <Button type="submit">
                  Send Reset Link
                </Button>
                <div className="text-center text-sm ">
                  <Link to="/login" className="underline underline-offset-4">
                    Back to login
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
                    Secure & Reliable.
                  </h2>
                  {/* <p className="text-base text-zinc-400 font-light leading-relaxed">
                    Protect your operation with enterprise-grade security and all-in-one business management tools.
                  </p> */}
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
