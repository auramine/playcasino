"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Bomb, Diamond, RefreshCw } from "lucide-react"

export default function MinesGame() {
  const { user, balance, addBalance, subtractBalance } = useAuth()
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(10)
  const [mineCount, setMineCount] = useState(5)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [revealedCells, setRevealedCells] = useState<number[]>([])
  const [mines, setMines] = useState<number[]>([])
  const [gameHistory, setGameHistory] = useState<Array<{ amount: number; multiplier: number; win: number }>>([])

  const gridSize = 25 // 5x5 grid

  const startGame = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to play the game.",
        variant: "destructive",
      })
      return
    }

    if (!subtractBalance(betAmount)) return

    // Generate random mine positions
    const newMines: number[] = []
    while (newMines.length < mineCount) {
      const mine = Math.floor(Math.random() * gridSize)
      if (!newMines.includes(mine)) {
        newMines.push(mine)
      }
    }

    setMines(newMines)
    setGameActive(true)
    setGameOver(false)
    setRevealedCells([])
    setCurrentMultiplier(1)
  }

  const calculateMultiplier = (revealed: number) => {
    // Calculate the probability-based multiplier
    const safeSquares = gridSize - mineCount
    let multi = 1

    for (let i = 0; i < revealed; i++) {
      multi *= (safeSquares - i) / (gridSize - i)
    }

    // Inverse of probability with a house edge
    return (0.97 / multi).toFixed(2)
  }

  const handleCellClick = (index: number) => {
    if (!gameActive || gameOver || revealedCells.includes(index)) return

    if (mines.includes(index)) {
      // Hit a mine, game over
      setGameOver(true)
      setGameActive(false)

      // Update game history
      setGameHistory((prev) => [
        {
          amount: betAmount,
          multiplier: 0,
          win: 0,
        },
        ...prev.slice(0, 9),
      ])

      toast({
        title: "Boom! You hit a mine",
        description: `You lost your bet of ${betAmount} coins.`,
        variant: "destructive",
      })
    } else {
      // Safe cell, update revealed cells
      const newRevealed = [...revealedCells, index]
      setRevealedCells(newRevealed)

      // Calculate new multiplier
      const newMultiplier = Number.parseFloat(calculateMultiplier(newRevealed.length))
      setCurrentMultiplier(newMultiplier)

      // Check if all safe cells are revealed
      if (newRevealed.length === gridSize - mineCount) {
        // Player cleared all safe cells, max win
        const winAmount = betAmount * newMultiplier
        addBalance(winAmount)

        setGameOver(true)
        setGameActive(false)

        // Update game history
        setGameHistory((prev) => [
          {
            amount: betAmount,
            multiplier: newMultiplier,
            win: winAmount,
          },
          ...prev.slice(0, 9),
        ])

        toast({
          title: "Amazing! Perfect game!",
          description: `You won ${winAmount.toFixed(2)} coins by clearing all safe cells!`,
        })
      }
    }
  }

  const cashOut = () => {
    if (!gameActive || gameOver || revealedCells.length === 0) return

    const winAmount = betAmount * currentMultiplier
    addBalance(winAmount)

    setGameOver(true)
    setGameActive(false)

    // Update game history
    setGameHistory((prev) => [
      {
        amount: betAmount,
        multiplier: currentMultiplier,
        win: winAmount,
      },
      ...prev.slice(0, 9),
    ])

    toast({
      title: "Cashed Out Successfully",
      description: `You won ${winAmount.toFixed(2)} coins with a ${currentMultiplier}x multiplier!`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mines</h1>
        <p className="text-muted-foreground">
          Uncover gems while avoiding hidden mines. The fewer mines you select, the lower your potential rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mines Game</CardTitle>
              <CardDescription>Click on cells to reveal gems. Avoid the mines!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mines-grid">
                {Array.from({ length: gridSize }).map((_, index) => (
                  <Button
                    key={index}
                    variant={revealedCells.includes(index) ? "default" : "outline"}
                    className={`mine-cell ${revealedCells.includes(index) || (gameOver && mines.includes(index)) ? "revealed" : ""}`}
                    onClick={() => handleCellClick(index)}
                    disabled={!gameActive || gameOver}
                  >
                    {revealedCells.includes(index) ? (
                      <Diamond className="h-6 w-6 text-primary" />
                    ) : gameOver && mines.includes(index) ? (
                      <Bomb className="h-6 w-6 text-destructive" />
                    ) : null}
                  </Button>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Multiplier</p>
                  <p className="text-2xl font-bold">{currentMultiplier}x</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Potential Win</p>
                  <p className="text-2xl font-bold">{(betAmount * currentMultiplier).toFixed(2)}</p>
                </div>

                <Button
                  onClick={cashOut}
                  disabled={!gameActive || gameOver || revealedCells.length === 0}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Cash Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
              <CardDescription>Adjust your bet and mine count</CardDescription>
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
                    disabled={gameActive}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setBetAmount(Math.max(1, betAmount / 2))}
                    disabled={gameActive}
                  >
                    ½
                  </Button>
                  <Button variant="outline" onClick={() => setBetAmount(betAmount * 2)} disabled={gameActive}>
                    2×
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Mine Count: {mineCount}</label>
                  <span className="text-sm text-muted-foreground">More mines = higher risk & reward</span>
                </div>
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  value={[mineCount]}
                  onValueChange={(value) => setMineCount(value[0])}
                  disabled={gameActive}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>8</span>
                  <span>15</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={gameActive ? () => {} : startGame}
                disabled={gameActive || !user}
              >
                {gameActive ? (
                  <span className="flex items-center">
                    Game in Progress <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  "Start Game"
                )}
              </Button>

              {!user && <p className="text-sm text-muted-foreground text-center">Please login to play</p>}
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
                      <span>×{game.multiplier}</span>
                      <span className={game.win > 0 ? "text-green-500" : "text-destructive"}>
                        {game.win > 0 ? `+${game.win.toFixed(2)}` : game.win.toFixed(2)}
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

