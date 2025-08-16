import React, { useState } from "react"
import { nhost } from "../nhost"
import { MessageSquare, Eye, EyeOff, AlertCircle } from "lucide-react"

interface AuthPageProps {
  onAuthSuccess: () => void
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tab, setTab] = useState<"signin" | "signup">("signin")
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await nhost.auth.signIn({ email, password })
      if (res.session) {
        onAuthSuccess()
      } else if (res.error) {
        setError(res.error.message)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await nhost.auth.signUp({ email, password })
      if (res.session) {
        onAuthSuccess()
      } else if (res.error) {
        setError(res.error.message)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ChatBot</h1>
          <p className="text-gray-600 text-sm">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 mb-4">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div>
          <div className="grid grid-cols-2 mb-6 border rounded-lg overflow-hidden">
            <button
              onClick={() => setTab("signin")}
              className={`py-2 text-sm font-medium ${
                tab === "signin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`py-2 text-sm font-medium ${
                tab === "signup"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
