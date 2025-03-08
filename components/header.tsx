"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coins, Menu, User, LogOut, Settings, Trophy, ShieldAlert, Crown, CheckCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">
                  Home
                </Link>
                <Link href="/games" className="text-lg font-semibold">
                  Games
                </Link>
                <Link href="/leaderboard" className="text-lg font-semibold">
                  Leaderboard
                </Link>
                <Link href="/rewards" className="text-lg font-semibold">
                  Daily Rewards
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">PlayCasino</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/games" className="text-sm font-medium transition-colors hover:text-primary">
              Games
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
              Leaderboard
            </Link>
            <Link href="/rewards" className="text-sm font-medium transition-colors hover:text-primary">
              Daily Rewards
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 mr-2 bg-secondary/50 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{user.balance.toLocaleString()}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar.startsWith("http") ? user.avatar : undefined} />
                      <AvatarFallback>
                        {user.avatar.length === 1 ? user.avatar : user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{user.username}</span>
                        {user.role === "admin" && <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary" />}
                        {user.role === "owner" && <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    {user.role !== "user" && (
                      <Badge
                        variant="outline"
                        className={`ml-2 ${user.role === "owner" ? "bg-yellow-500/10" : "bg-primary/10"}`}
                      >
                        {user.role === "owner" ? "Owner" : "Admin"}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/badges" className="cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      Badges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" || user.role === "owner" ? (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

