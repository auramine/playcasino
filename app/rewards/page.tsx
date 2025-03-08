"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Gift, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

export default function RewardsPage() {
  const { user, addBalance } = useAuth()
  const { toast } = useToast()
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false)
  const [nextRewardTime, setNextRewardTime] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [streakDays, setStreakDays] = useState(0)
  const [weeklyProgress, setWeeklyProgress] = useState(0)

  // Load reward state from localStorage on initial render
  useEffect(() => {
    const lastClaimTime = localStorage.getItem("lastRewardClaim")
    const streak = localStorage.getItem("streakDays")
    const weekly = localStorage.getItem("weeklyProgress")

    if (streak) {
      setStreakDays(Number.parseInt(streak))
    }

    if (weekly) {
      setWeeklyProgress(Number.parseInt(weekly))
    }

    if (lastClaimTime) {
      const lastClaim = new Date(lastClaimTime)
      const now = new Date()

      // Check if the last claim was today
      if (
        lastClaim.getDate() === now.getDate() &&
        lastClaim.getMonth() === now.getMonth() &&
        lastClaim.getFullYear() === now.getFullYear()
      ) {
        setDailyRewardClaimed(true)
      }

      // Set next reward time to midnight
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      setNextRewardTime(tomorrow)
    }
  }, [])

  // Update time remaining countdown
  useEffect(() => {
    if (!nextRewardTime) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = nextRewardTime.getTime() - now.getTime()

      if (diff <= 0) {
        setDailyRewardClaimed(false)
        clearInterval(interval)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [nextRewardTime])

  const claimDailyReward = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to claim your daily reward.",
        variant: "destructive",
      })
      return
    }

    if (dailyRewardClaimed) return

    // Calculate reward based on streak
    const baseReward = 100
    const streakBonus = Math.min(streakDays * 10, 100) // Cap streak bonus at 100%
    const totalReward = baseReward + (baseReward * streakBonus) / 100

    // Add reward to balance
    addBalance(totalReward)

    // Update streak
    const newStreak = streakDays + 1
    setStreakDays(newStreak)
    localStorage.setItem("streakDays", newStreak.toString())

    // Update weekly progress
    const newWeeklyProgress = Math.min(weeklyProgress + 1, 7)
    setWeeklyProgress(newWeeklyProgress)
    localStorage.setItem("weeklyProgress", newWeeklyProgress.toString())

    // Mark as claimed
    setDailyRewardClaimed(true)
    const now = new Date()
    localStorage.setItem("lastRewardClaim", now.toString())

    // Set next reward time to midnight
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    setNextRewardTime(tomorrow)

    toast({
      title: "Daily Reward Claimed!",
      description: `You received ${totalReward.toFixed(0)} coins. Current streak: ${newStreak} days.`,
    })

    // Check if weekly reward is complete
    if (newWeeklyProgress === 7) {
      // Give weekly bonus
      const weeklyBonus = 1000
      addBalance(weeklyBonus)

      toast({
        title: "Weekly Reward Completed!",
        description: `You received an additional ${weeklyBonus} coins for completing 7 days!`,
      })

      // Reset weekly progress
      setWeeklyProgress(0)
      localStorage.setItem("weeklyProgress", "0")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Daily Rewards</h1>
        <p className="text-muted-foreground">
          Log in daily to claim free coins and build your streak for bigger rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Daily Reward
            </CardTitle>
            <CardDescription>Claim your daily reward to earn free coins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  Current Streak: <strong>{streakDays} days</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{dailyRewardClaimed ? `Next reward in: ${timeRemaining}` : "Ready to claim!"}</span>
              </div>
            </div>

            <div className="p-6 bg-secondary/30 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">{100 + Math.min(streakDays * 10, 100)}</div>
              <div className="text-sm text-muted-foreground">coins available today</div>
              <div className="text-xs text-muted-foreground mt-1">
                (Base: 100 + Streak Bonus: {Math.min(streakDays * 10, 100)}%)
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={claimDailyReward} disabled={dailyRewardClaimed || !user}>
              {dailyRewardClaimed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Claimed Today
                </span>
              ) : (
                "Claim Daily Reward"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Log in for 7 days to earn a big bonus reward</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Progress: {weeklyProgress}/7 days</span>
                <span>{Math.round((weeklyProgress / 7) * 100)}%</span>
              </div>
              <Progress value={(weeklyProgress / 7) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md flex items-center justify-center ${
                    index < weeklyProgress ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {index < weeklyProgress ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                </div>
              ))}
            </div>

            <div className="p-6 bg-secondary/30 rounded-lg text-center">
              <div className="text-4xl font-bold mb-2">1,000</div>
              <div className="text-sm text-muted-foreground">bonus coins for completing 7 days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Calendar</CardTitle>
          <CardDescription>Special rewards and events throughout the month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const today = new Date().getDate()
              const isFuture = index + 1 > today
              const isPast = index + 1 < today
              const isToday = index + 1 === today

              return (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${
                    isToday
                      ? "bg-primary/20 border-primary"
                      : isFuture
                        ? "bg-secondary/30 border-secondary"
                        : "bg-muted border-muted"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">{index + 1}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {isPast ? (
                        <XCircle className="h-4 w-4 mx-auto text-muted-foreground" />
                      ) : isToday ? (
                        dailyRewardClaimed ? (
                          <CheckCircle className="h-4 w-4 mx-auto text-primary" />
                        ) : (
                          <span className="text-primary">Claim!</span>
                        )
                      ) : (
                        <span>+{100 + Math.min((streakDays + (index + 1 - today)) * 10, 100)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

