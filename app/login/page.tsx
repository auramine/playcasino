"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [registerStatus, setRegisterStatus] = useState<{ success: boolean; message: string } | null>(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  // Form errors
  const [errors, setErrors] = useState<{
    loginEmail?: string
    loginPassword?: string
    registerUsername?: string
    registerEmail?: string
    registerPassword?: string
    registerConfirmPassword?: string
  }>({})

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginStatus(null)

    // Validate form
    const newErrors: typeof errors = {}

    if (!loginEmail) {
      newErrors.loginEmail = "Email is required"
    }

    if (!loginPassword) {
      newErrors.loginPassword = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    // Attempt login
    try {
      console.log("Login attempt with:", loginEmail, loginPassword)
      const success = await login(loginEmail, loginPassword)

      if (success) {
        setLoginStatus({
          success: true,
          message: "Login successful! Redirecting...",
        })
        router.push("/")
      } else {
        setLoginStatus({
          success: false,
          message: "Invalid email or password. Please try again.",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginStatus({
        success: false,
        message: "An error occurred during login. Please try again.",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterStatus(null)

    // Validate form
    const newErrors: typeof errors = {}

    if (!registerUsername) {
      newErrors.registerUsername = "Username is required"
    } else if (registerUsername.length < 3) {
      newErrors.registerUsername = "Username must be at least 3 characters"
    }

    if (!registerEmail) {
      newErrors.registerEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      newErrors.registerEmail = "Email is invalid"
    }

    if (!registerPassword) {
      newErrors.registerPassword = "Password is required"
    } else if (registerPassword.length < 6) {
      newErrors.registerPassword = "Password must be at least 6 characters"
    }

    if (!registerConfirmPassword) {
      newErrors.registerConfirmPassword = "Please confirm your password"
    } else if (registerPassword !== registerConfirmPassword) {
      newErrors.registerConfirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})

    // Attempt registration
    try {
      console.log("Register attempt with:", registerEmail, registerPassword)
      const success = await register(registerUsername, registerEmail, registerPassword)

      if (success) {
        setRegisterStatus({
          success: true,
          message: "Registration successful! Redirecting...",
        })
        router.push("/")
      } else {
        setRegisterStatus({
          success: false,
          message: "Registration failed. This email may already be in use.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setRegisterStatus({
        success: false,
        message: "An error occurred during registration. Please try again.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Coins className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to PlayCasino</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {loginStatus && (
                <Alert
                  className={`mb-4 ${loginStatus.success ? "bg-green-500/10 text-green-500 border-green-500/50" : "bg-destructive/10 text-destructive border-destructive/50"}`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginStatus.message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  {errors.loginEmail && <p className="text-sm text-destructive">{errors.loginEmail}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  {errors.loginPassword && <p className="text-sm text-destructive">{errors.loginPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              {registerStatus && (
                <Alert
                  className={`mb-4 ${registerStatus.success ? "bg-green-500/10 text-green-500 border-green-500/50" : "bg-destructive/10 text-destructive border-destructive/50"}`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registerStatus.message}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                  />
                  {errors.registerUsername && <p className="text-sm text-destructive">{errors.registerUsername}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  {errors.registerEmail && <p className="text-sm text-destructive">{errors.registerEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  {errors.registerPassword && <p className="text-sm text-destructive">{errors.registerPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                  {errors.registerConfirmPassword && (
                    <p className="text-sm text-destructive">{errors.registerConfirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <button onClick={() => setActiveTab("register")} className="text-primary hover:underline">
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                  Login
                </button>
              </p>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

