"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award } from "lucide-react"

// Mock data for leaderboard
const generateMockLeaderboardData = () => {
  const users = [
    { id: "1", name: "AlexGamer", avatar: "A" },
    { id: "2", name: "CasinoKing", avatar: "C" },
    { id: "3", name: "LuckyCharm", avatar: "L" },
    { id: "4", name: "BigWinner", avatar: "B" },
    { id: "5", name: "FortuneSeeker", avatar: "F" },
    { id: "6", name: "JackpotHunter", avatar: "J" },
    { id: "7", name: "RoyalFlush", avatar: "R" },
    { id: "8", name: "GoldenDice", avatar: "G" },
    { id: "9", name: "LuckyStreak", avatar: "L" },
    { id: "10", name: "HighRoller", avatar: "H" },
  ]

  return users.map((user, index) => ({
    ...user,
    rank: index + 1,
    winnings: Math.floor(100000 / (index + 1) + Math.random() * 10000),
    gamesPlayed: Math.floor(500 / (index + 1) + Math.random() * 100),
    winRate: Math.floor(90 - index * 5 + Math.random() * 10),
  }))
}

export default function LeaderboardPage() {
  const [dailyLeaderboard, setDailyLeaderboard] = useState<any[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<any[]>([])
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<any[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setDailyLeaderboard(generateMockLeaderboardData())
    setWeeklyLeaderboard(generateMockLeaderboardData().sort((a, b) => b.gamesPlayed - a.gamesPlayed))
    setAllTimeLeaderboard(generateMockLeaderboardData().sort((a, b) => b.winRate - a.winRate))
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-muted-foreground">{rank}</span>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who's winning big and climbing the ranks. Can you make it to the top?
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
          <CardDescription>Players ranked by their winnings, games played, and win rate</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="all-time">All Time</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <LeaderboardTable data={dailyLeaderboard} getRankIcon={getRankIcon} />
            </TabsContent>

            <TabsContent value="weekly">
              <LeaderboardTable data={weeklyLeaderboard} getRankIcon={getRankIcon} />
            </TabsContent>

            <TabsContent value="all-time">
              <LeaderboardTable data={allTimeLeaderboard} getRankIcon={getRankIcon} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Coins Won</CardTitle>
            <CardDescription>Players with the highest total winnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyLeaderboard.slice(0, 5).map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{player.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.gamesPlayed} games</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">{player.winnings.toLocaleString()} coins</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Games Played</CardTitle>
            <CardDescription>Our most active players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyLeaderboard.slice(0, 5).map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{player.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.winRate}% win rate</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">{player.gamesPlayed} games</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Win Rate</CardTitle>
            <CardDescription>Players with the best luck</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allTimeLeaderboard.slice(0, 5).map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{player.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.gamesPlayed} games</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">{player.winRate}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LeaderboardTable({ data, getRankIcon }: { data: any[]; getRankIcon: (rank: number) => React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Rank</th>
            <th className="text-left py-3 px-4">Player</th>
            <th className="text-right py-3 px-4">Winnings</th>
            <th className="text-right py-3 px-4">Games</th>
            <th className="text-right py-3 px-4">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player) => (
            <tr key={player.id} className="border-b last:border-0 hover:bg-secondary/30">
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center">{getRankIcon(player.rank)}</div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{player.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{player.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right font-medium">{player.winnings.toLocaleString()}</td>
              <td className="py-3 px-4 text-right">{player.gamesPlayed}</td>
              <td className="py-3 px-4 text-right">{player.winRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

