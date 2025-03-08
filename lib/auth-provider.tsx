"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export type User = {
  id: string
  username: string
  email: string
  password: string
  avatar: string
  profileBanner?: string
  balance: number
  role: "user" | "admin" | "owner"
  createdAt: Date
  badges: Badge[]
  bio?: string
  favoriteGame?: string
  customTheme?: string
}

type AuthContextType = {
  user: User | null
  users: User[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  addBalance: (amount: number) => void
  subtractBalance: (amount: number) => boolean
  updateProfile: (data: Partial<User>) => void
  unlockBadge: (badgeId: string) => void
  deleteUser: (userId: string) => void
  updateUser: (userId: string, data: Partial<User>) => void
}

const defaultBadges: Badge[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Joined PlayCasino",
    icon: "Trophy",
    unlocked: true,
    unlockedAt: new Date(),
  },
  {
    id: "first_win",
    name: "First Win",
    description: "Won your first game",
    icon: "Award",
    unlocked: false,
  },
  {
    id: "high_roller",
    name: "High Roller",
    description: "Bet 1,000 coins in a single game",
    icon: "Coins",
    unlocked: false,
  },
  {
    id: "streak_3",
    name: "Streak Master",
    description: "Logged in for 3 days in a row",
    icon: "Calendar",
    unlocked: false,
  },
  {
    id: "big_winner",
    name: "Big Winner",
    description: "Won 5,000 coins in a single game",
    icon: "Zap",
    unlocked: false,
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    const storedCurrentUser = localStorage.getItem("currentUser")

    // Initialize users if not exists
    if (!storedUsers) {
      // Create owner user
      const ownerUser: User = {
        id: "owner_" + Math.random().toString(36).substring(2, 9),
        username: "Owner",
        email: "owner@playcasino.com",
        password: "owner123", // In a real app, this would be hashed
        avatar: "O",
        profileBanner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop",
        balance: 100000,
        role: "owner",
        createdAt: new Date(),
        badges: [...defaultBadges],
      }

      // Create admin user
      const adminUser: User = {
        id: "admin_" + Math.random().toString(36).substring(2, 9),
        username: "Admin",
        email: "admin@playcasino.com",
        password: "admin123", // In a real app, this would be hashed
        avatar: "A",
        profileBanner: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52a?q=80&w=2070&auto=format&fit=crop",
        balance: 10000,
        role: "admin",
        createdAt: new Date(),
        badges: [...defaultBadges],
      }

      localStorage.setItem("users", JSON.stringify([ownerUser, adminUser]))
      setUsers([ownerUser, adminUser])
    } else {
      try {
        // Parse the stored users and ensure dates are properly handled
        const parsedUsers = JSON.parse(storedUsers)

        // Convert string dates back to Date objects
        const processedUsers = parsedUsers.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          badges: user.badges.map((badge: any) => ({
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
          })),
        }))

        setUsers(processedUsers)
      } catch (error) {
        console.error("Error parsing stored users:", error)
        // If there's an error, initialize with default users
        localStorage.removeItem("users")
        // This will trigger the !storedUsers condition on next render
      }
    }

    if (storedCurrentUser) {
      try {
        const parsedUser = JSON.parse(storedCurrentUser)

        // Convert string dates back to Date objects
        const processedUser = {
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
          badges: parsedUser.badges.map((badge: any) => ({
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
          })),
        }

        setUser(processedUser)
      } catch (error) {
        console.error("Error parsing current user:", error)
        localStorage.removeItem("currentUser")
      }
    }

    setIsLoading(false)
  }, [])

  // Save users data to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Also update this user in the users array
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Attempting login with:", email)
    console.log(
      "Available users:",
      users.map((u) => ({ email: u.email, password: u.password })),
    )

    // Case-insensitive email comparison
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      // Create a copy to avoid reference issues
      const userToLogin = { ...foundUser }

      setUser(userToLogin)
      // Save to localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(userToLogin))

      toast({
        title: "Welcome back!",
        description: `You've been logged in as ${foundUser.username}.`,
      })
      setIsLoading(false)
      return true
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Case-insensitive email comparison for checking existing users
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Registration failed",
        description: "Email already in use.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      username,
      email,
      password, // In a real app, this would be hashed
      avatar: username.charAt(0).toUpperCase(),
      balance: 1000,
      role: "user",
      createdAt: new Date(),
      badges: [...defaultBadges],
    }

    console.log("Creating new user:", { email: newUser.email, password: newUser.password })

    // Add to users array and immediately save to localStorage
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Log in the new user and save to localStorage
    setUser(newUser)
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    toast({
      title: "Registration successful",
      description: `Welcome to PlayCasino, ${username}!`,
    })

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    // Remove from localStorage
    localStorage.removeItem("currentUser")

    router.push("/")
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    })
  }

  const addBalance = (amount: number) => {
    if (!user) return

    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        balance: prev.balance + amount,
      }
    })

    toast({
      title: "Balance updated",
      description: `${amount} coins added to your balance.`,
    })
  }

  const subtractBalance = (amount: number) => {
    if (!user) return false

    if (user.balance >= amount) {
      setUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          balance: prev.balance - amount,
        }
      })
      return true
    } else {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough coins for this bet.",
        variant: "destructive",
      })
      return false
    }
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return

    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        ...data,
      }
    })

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const unlockBadge = (badgeId: string) => {
    if (!user) return

    // Check if badge exists and is not already unlocked
    const badgeIndex = user.badges.findIndex((b) => b.id === badgeId)

    if (badgeIndex === -1 || user.badges[badgeIndex].unlocked) return

    // Update badge
    const updatedBadges = [...user.badges]
    updatedBadges[badgeIndex] = {
      ...updatedBadges[badgeIndex],
      unlocked: true,
      unlockedAt: new Date(),
    }

    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        badges: updatedBadges,
      }
    })

    toast({
      title: "Badge Unlocked!",
      description: `You've earned the ${user.badges[badgeIndex].name} badge!`,
    })
  }

  const deleteUser = (userId: string) => {
    // Admin function to delete a user
    setUsers((prev) => prev.filter((u) => u.id !== userId))

    toast({
      title: "User deleted",
      description: "The user has been deleted successfully.",
    })
  }

  const updateUser = (userId: string, data: Partial<User>) => {
    // Admin function to update a user
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data } : u)))

    toast({
      title: "User updated",
      description: "The user has been updated successfully.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isLoading,
        login,
        register,
        logout,
        addBalance,
        subtractBalance,
        updateProfile,
        unlockBadge,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

