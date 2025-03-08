"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Trophy, Calendar, Clock, UserIcon, Mail, CalendarIcon, Edit, CheckCircle, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [joinDate, setJoinDate] = useState<string>("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Format join date
    if (user.createdAt) {
      const date = new Date(user.createdAt)
      setJoinDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    }
  }, [user, router])

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Get unlocked badges
  const unlockedBadges = user.badges.filter((badge) => badge.unlocked)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile/settings">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      {/* Profile Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
        {user.profileBanner ? (
          <Image
            src={user.profileBanner || "/placeholder.svg"}
            alt="Profile Banner"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40"></div>
        )}

        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-end gap-4">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background">
            <AvatarImage src={user.avatar.startsWith("http") ? user.avatar : undefined} />
            <AvatarFallback className="text-3xl">
              {user.avatar.length === 1 ? user.avatar : user.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold">{user.username}</h2>
              {user.role === "admin" && <CheckCircle className="h-5 w-5 text-primary fill-primary" />}
              {user.role === "owner" && <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {user.role !== "user" && (
                <Badge variant="outline" className={`${user.role === "owner" ? "bg-yellow-500/10" : "bg-primary/10"}`}>
                  {user.role === "owner" ? "Owner" : "Admin"}
                </Badge>
              )}
              <Badge variant="outline" className="bg-secondary/50">
                <Coins className="mr-1 h-3 w-3 text-yellow-500" />
                {user.balance.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>{user.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <span>Joined {joinDate}</span>
              </div>

              {user.bio && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">About Me</h3>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
              )}

              {user.favoriteGame && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Favorite Game</h3>
                  <p className="text-sm text-muted-foreground">{user.favoriteGame}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Player Stats</CardTitle>
            <CardDescription>Your gaming statistics and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="badges">
              <TabsList className="mb-6">
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="history">Game History</TabsTrigger>
              </TabsList>

              <TabsContent value="badges">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {unlockedBadges.length > 0 ? (
                    unlockedBadges.map((badge) => (
                      <Card key={badge.id} className="overflow-hidden">
                        <CardContent className="p-4 text-center">
                          <div className="flex justify-center mb-2">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                          {badge.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                      <h3 className="font-medium text-lg mb-1">No Badges Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Play games and complete achievements to earn badges
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link href="/profile/badges">View All Badges</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Games Played</p>
                          <p className="text-2xl font-bold">42</p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="text-2xl font-bold">58%</p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Trophy className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Winnings</p>
                          <p className="text-2xl font-bold">12,450</p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Coins className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Time Played</p>
                          <p className="text-2xl font-bold">8h 24m</p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Plinko</h3>
                        <p className="text-sm text-muted-foreground">Yesterday at 8:45 PM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-500 font-medium">+240 coins</p>
                        <p className="text-xs text-muted-foreground">Bet: 100 coins</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Mines</h3>
                        <p className="text-sm text-muted-foreground">Yesterday at 7:30 PM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-destructive font-medium">-50 coins</p>
                        <p className="text-xs text-muted-foreground">Bet: 50 coins</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Coin Flip</h3>
                        <p className="text-sm text-muted-foreground">2 days ago at 3:15 PM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-500 font-medium">+198 coins</p>
                        <p className="text-xs text-muted-foreground">Bet: 100 coins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

