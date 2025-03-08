import { GameCard } from "@/components/game-card"

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">All Games</h1>
        <p className="text-muted-foreground">
          Browse our collection of casino games. All games use virtual currency only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GameCard
          title="Plinko"
          description="Drop the ball and watch it bounce through pegs for big wins."
          image="/placeholder.svg?height=200&width=300"
          href="/games/plinko"
        />
        <GameCard
          title="Mines"
          description="Uncover gems while avoiding hidden mines in this thrilling game."
          image="/placeholder.svg?height=200&width=300"
          href="/games/mines"
        />
        <GameCard
          title="Coin Flip"
          description="Simple yet exciting. Bet on heads or tails and double your coins."
          image="/placeholder.svg?height=200&width=300"
          href="/games/coin-flip"
        />
        <GameCard
          title="Dice"
          description="Predict the outcome of the dice roll and win big rewards."
          image="/placeholder.svg?height=200&width=300"
          href="/games/dice"
        />
        <GameCard
          title="Slots"
          description="Spin the reels and match symbols to win prizes."
          image="/placeholder.svg?height=200&width=300"
          href="/games/slots"
        />
        <GameCard
          title="Roulette"
          description="Place your bets on numbers or colors and watch the wheel spin."
          image="/placeholder.svg?height=200&width=300"
          href="/games/roulette"
        />
        <GameCard
          title="Blackjack"
          description="Beat the dealer by getting cards that total closer to 21."
          image="/placeholder.svg?height=200&width=300"
          href="/games/blackjack"
        />
        <GameCard
          title="Crash"
          description="Watch the multiplier rise and cash out before it crashes."
          image="/placeholder.svg?height=200&width=300"
          href="/games/crash"
        />
      </div>
    </div>
  )
}

