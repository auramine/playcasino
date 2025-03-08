"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Trophy, Award, Coins, Calendar, Zap, Lock } from "lucide-react"

export default function BadgesPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // Will redirect in useEffect
  }

  // Helper function to get the appropriate icon for a badge
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy":
        return <Trophy className="h-6 w-6" />
      case "Award":
        return <Award className="h-6 w-6" />
      case "Coins":
        return <Coins className="h-6 w-6" />
      case "Calendar":
        return <Calendar className="h-6 w-6" />
      case "Zap":
        return <Zap className="h-6 w-6" />
      default:
        return <Trophy className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Badges</h1>
        <p className="text-muted-foreground">Collect badges by playing games and completing achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unlocked Badges</CardTitle>
            <CardDescription>Badges you've earned through your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.badges
                .filter((badge) => badge.unlocked)
                .map((badge) => (
                  <Card key={badge.id} className="overflow-hidden border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-primary/10 mt-1">{getBadgeIcon(badge.icon)}</div>
                        <div>
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                          {badge.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {user.badges.filter((badge) => badge.unlocked).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <h3 className="font-medium text-lg mb-1">No Badges Unlocked Yet</h3>
                  <p className="text-sm text-muted-foreground">Play games and complete achievements to earn badges</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locked Badges</CardTitle>
            <CardDescription>Badges you can still earn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.badges
                .filter((badge) => !badge.unlocked)
                .map((badge) => (
                  <Card key={badge.id} className="overflow-hidden opacity-70">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-secondary mt-1">
                          <Lock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                          <BadgeComponent variant="outline" className="mt-2">
                            Locked
                          </BadgeComponent>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {user.badges.filter((badge) => !badge.unlocked).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-1">All Badges Unlocked!</h3>
                  <p className="text-sm text-muted-foreground">
                    Congratulations! You've unlocked all available badges.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge Showcase</CardTitle>
          <CardDescription>Your most prestigious achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {user.badges
              .filter((badge) => badge.unlocked)
              .slice(0, 5)
              .map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="p-4 rounded-full bg-primary/10 mx-auto mb-2">{getBadgeIcon(badge.icon)}</div>
                  <p className="text-sm font-medium">{badge.name}</p>
                </div>
              ))}

            {user.badges.filter((badge) => badge.unlocked).length === 0 && (
              <div className="text-center py-8 w-full">
                <p className="text-sm text-muted-foreground">Unlock badges to showcase them here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

