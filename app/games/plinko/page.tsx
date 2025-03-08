"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"

export default function PlinkoGame() {
  const { user, balance, addBalance, subtractBalance } = useAuth()
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(10)
  const [risk, setRisk] = useState(1) // 1: Low, 2: Medium, 3: High
  const [isDropping, setIsDropping] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [gameHistory, setGameHistory] = useState<Array<{ amount: number; multiplier: number; win: number }>>([])
  const boardRef = useRef<HTMLDivElement>(null)

  const riskMultipliers = {
    1: [0.2, 0.4, 1, 1.5, 3, 1.5, 1, 0.4, 0.2], // Low risk
    2: [0.1, 0.3, 0.5, 2, 5, 2, 0.5, 0.3, 0.1], // Medium risk
    3: [0, 0.2, 0.4, 1, 10, 1, 0.4, 0.2, 0], // High risk
  }

  const riskLabels = {
    1: "Low",
    2: "Medium",
    3: "High",
  }

  // Generate pegs for the Plinko board
  const generatePegs = () => {
    const pegs = []
    const rows = 8
    const spacing = 40

    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 1
      for (let i = 0; i < pegsInRow; i++) {
        const x = i * spacing + (boardRef.current?.clientWidth || 400) / 2 - ((pegsInRow - 1) * spacing) / 2
        const y = row * spacing + 50
        pegs.push({ x, y })
      }
    }

    return pegs
  }

  const dropBall = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to play the game.",
        variant: "destructive",
      })
      return
    }

    if (isDropping) return

    if (!subtractBalance(betAmount)) return

    setIsDropping(true)
    setResult(null)

    const boardWidth = boardRef.current?.clientWidth || 400
    const startX = boardWidth / 2
    const startY = 0

    const ball = document.createElement("div")
    ball.className = "plinko-ball"
    ball.style.left = `${startX - 8}px`
    ball.style.top = `${startY}px`
    boardRef.current?.appendChild(ball)

    let currentX = startX
    let currentY = startY
    const velocity = { x: 0, y: 0 }
    const gravity = 0.5
    const bounceFactor = 0.7

    const pegs = generatePegs()
    const pegRadius = 5
    const ballRadius = 8

    const animate = () => {
      // Apply gravity
      velocity.y += gravity

      // Update position
      currentX += velocity.x
      currentY += velocity.y

      // Check for collisions with pegs
      for (const peg of pegs) {
        const dx = currentX - peg.x
        const dy = currentY - peg.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < pegRadius + ballRadius) {
          // Collision detected, calculate bounce
          const angle = Math.atan2(dy, dx)
          const bounceX = Math.cos(angle) * (pegRadius + ballRadius)
          const bounceY = Math.sin(angle) * (pegRadius + ballRadius)

          currentX = peg.x + bounceX
          currentY = peg.y + bounceY

          // Add some randomness to the bounce
          const randomFactor = Math.random() * 0.4 - 0.2
          velocity.x = Math.cos(angle) * 4 + randomFactor
          velocity.y = Math.sin(angle) * 4 * bounceFactor
        }
      }

      // Check for wall collisions
      if (currentX < ballRadius) {
        currentX = ballRadius
        velocity.x *= -bounceFactor
      } else if (currentX > boardWidth - ballRadius) {
        currentX = boardWidth - ballRadius
        velocity.x *= -bounceFactor
      }

      // Update ball position
      ball.style.left = `${currentX - ballRadius}px`
      ball.style.top = `${currentY - ballRadius}px`

      // Check if ball reached bottom
      if (currentY > 380) {
        // Determine which bucket the ball landed in
        const bucketWidth = boardWidth / 9
        const bucketIndex = Math.min(Math.floor(currentX / bucketWidth), 8)

        // Get multiplier based on risk level and bucket
        const multiplier = riskMultipliers[risk as keyof typeof riskMultipliers][bucketIndex]
        const winAmount = betAmount * multiplier

        // Add winnings to balance
        if (winAmount > 0) {
          addBalance(winAmount)
        }

        // Update game history
        setGameHistory((prev) => [
          {
            amount: betAmount,
            multiplier: multiplier,
            win: winAmount,
          },
          ...prev.slice(0, 9),
        ])

        // Show result
        setResult(winAmount)

        // Clean up
        setTimeout(() => {
          boardRef.current?.removeChild(ball)
          setIsDropping(false)
        }, 1000)

        return
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Plinko</h1>
        <p className="text-muted-foreground">
          Drop the ball and watch it bounce through pegs. The ball will land in one of the buckets at the bottom, each
          with a different multiplier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Plinko Board</CardTitle>
              <CardDescription>Watch the ball bounce through the pegs and land in a bucket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="plinko-board h-[400px] bg-secondary/30 rounded-lg relative" ref={boardRef}>
                {/* Pegs will be generated dynamically */}
                {generatePegs().map((peg, index) => (
                  <div key={index} className="plinko-peg" style={{ left: `${peg.x - 5}px`, top: `${peg.y - 5}px` }} />
                ))}

                {/* Buckets at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between h-[50px]">
                  {riskMultipliers[risk as keyof typeof riskMultipliers].map((multiplier, index) => (
                    <div
                      key={index}
                      className="flex-1 flex items-center justify-center border-t border-primary/30"
                      style={{
                        backgroundColor: multiplier > 1 ? "rgba(var(--primary), 0.2)" : "transparent",
                        opacity: multiplier === 0 ? 0.3 : 1,
                      }}
                    >
                      <span className="text-sm font-medium">{multiplier}x</span>
                    </div>
                  ))}
                </div>
              </div>

              {result !== null && (
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold">
                    {result > 0 ? (
                      <span className="text-green-500">You won {result.toFixed(2)} coins!</span>
                    ) : (
                      <span className="text-destructive">Better luck next time!</span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
              <CardDescription>Adjust your bet and risk level</CardDescription>
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
                  />
                  <Button variant="outline" onClick={() => setBetAmount(Math.max(1, betAmount / 2))}>
                    ½
                  </Button>
                  <Button variant="outline" onClick={() => setBetAmount(betAmount * 2)}>
                    2×
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level: {riskLabels[risk as keyof typeof riskLabels]}</label>
                <Slider min={1} max={3} step={1} value={[risk]} onValueChange={(value) => setRisk(value[0])} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Risk</span>
                  <span>Medium Risk</span>
                  <span>High Risk</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={dropBall} disabled={isDropping || !user}>
                {isDropping ? "Ball Dropping..." : "Drop Ball"}
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

