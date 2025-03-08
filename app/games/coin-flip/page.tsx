"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Coins } from "lucide-react"

export default function CoinFlipGame() {
  const { user, balance, addBalance, subtractBalance } = useAuth()
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(10)
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{ amount: number; choice: string; result: string; win: number }>
  >([])

  const flipCoin = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to play the game.",
        variant: "destructive",
      })
      return
    }

    if (!selectedSide) {
      toast({
        title: "Select a Side",
        description: "Please select heads or tails before flipping.",
        variant: "destructive",
      })
      return
    }

    if (!subtractBalance(betAmount)) return

    setIsFlipping(true)

    // Get the coin element
    const coin = document.querySelector(".coin") as HTMLElement
    if (coin) {
      coin.classList.add("flip")
    }

    // Determine the result (50/50 chance)
    const flipResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails"

    // Wait for animation to complete
    setTimeout(() => {
      setResult(flipResult)
      setIsFlipping(false)

      // Determine if player won
      const won = selectedSide === flipResult

      // Update balance if won
      if (won) {
        const winAmount = betAmount * 1.98 // 1.98x multiplier (accounting for house edge)
        addBalance(winAmount)

        toast({
          title: "You Won!",
          description: `Congratulations! You won ${winAmount.toFixed(2)} coins.`,
        })
      } else {
        toast({
          title: "You Lost",
          description: `Better luck next time!`,
          variant: "destructive",
        })
      }

      // Update game history
      setGameHistory((prev) => [
        {
          amount: betAmount,
          choice: selectedSide,
          result: flipResult,
          win: won ? betAmount * 1.98 : 0,
        },
        ...prev.slice(0, 9),
      ])

      // Reset coin animation after a delay
      setTimeout(() => {
        if (coin) {
          coin.classList.remove("flip")
        }
      }, 1000)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Coin Flip</h1>
        <p className="text-muted-foreground">
          A simple game of chance. Choose heads or tails, flip the coin, and win if your prediction is correct.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Coin Flip Game</CardTitle>
              <CardDescription>Choose heads or tails and flip the coin</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="coin-flip mb-8">
                <div className="coin">
                  <div className="coin-side coin-heads">H</div>
                  <div className="coin-side coin-tails">T</div>
                </div>
              </div>

              {result && !isFlipping && (
                <div className="mb-6 text-center">
                  <p className="text-lg font-medium mb-2">
                    Result: <span className="font-bold">{result.toUpperCase()}</span>
                  </p>
                  <p className="text-2xl font-bold">
                    {selectedSide === result ? (
                      <span className="text-green-500">You won {(betAmount * 1.98).toFixed(2)} coins!</span>
                    ) : (
                      <span className="text-destructive">Better luck next time!</span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mb-6">
                <Button
                  size="lg"
                  variant={selectedSide === "heads" ? "default" : "outline"}
                  onClick={() => setSelectedSide("heads")}
                  disabled={isFlipping}
                  className={selectedSide === "heads" ? "bg-primary" : ""}
                >
                  Heads
                </Button>
                <Button
                  size="lg"
                  variant={selectedSide === "tails" ? "default" : "outline"}
                  onClick={() => setSelectedSide("tails")}
                  disabled={isFlipping}
                  className={selectedSide === "tails" ? "bg-primary" : ""}
                >
                  Tails
                </Button>
              </div>

              <Button
                className="w-full max-w-xs"
                size="lg"
                onClick={flipCoin}
                disabled={isFlipping || !selectedSide || !user}
              >
                {isFlipping ? "Flipping..." : "Flip Coin"}
              </Button>

              {!user && <p className="text-sm text-muted-foreground text-center mt-4">Please login to play</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
              <CardDescription>Adjust your bet amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bet Amount</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, Number.parseInt(e.target.value) || 0))}
                    disabled={isFlipping}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount(Math.max(1, betAmount / 2))}
                    disabled={isFlipping}
                  >
                    ½
                  </Button>
                  <Button variant="outline" onClick={() => setBetAmount(betAmount * 2)} disabled={isFlipping}>
                    2×
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-medium mb-2">Game Info</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span>Win Multiplier: 1.98x</span>
                  </li>
                  <li>House Edge: 1%</li>
                  <li>Win Chance: 50%</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              {gameHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No games played yet</p>
              ) : (
                <div className="space-y-2">
                  {gameHistory.map((game, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 rounded bg-secondary/30">
                      <span>Bet: {game.amount}</span>
                      <span>
                        {game.choice.toUpperCase()} → {game.result.toUpperCase()}
                      </span>
                      <span className={game.win > 0 ? "text-green-500" : "text-destructive"}>
                        {game.win > 0 ? `+${game.win.toFixed(2)}` : `-${game.amount.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

