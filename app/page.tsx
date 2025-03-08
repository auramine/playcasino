import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Trophy, Gift, ArrowRight, Sparkles, Gamepad2, Zap } from "lucide-react"
import { GameCard } from "@/components/game-card"

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero Section with 3D Effect */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background z-0 animate-gradient-slow"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-[10%] w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-[15%] w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-40 right-[20%] w-16 h-16 bg-yellow-500/20 rounded-full blur-lg animate-float-fast"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Play with virtual currency - No real money involved
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              The Ultimate Casino Experience
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the thrill of casino games with our virtual currency system. Play, win, and climb the
              leaderboards without any financial risk.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                <Link href="/games">
                  Play Now
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
                <Link href="/how-to-play">How It Works</Link>
              </Button>
            </div>
          </div>

          {/* 3D Game Preview */}
          <div className="relative mx-auto max-w-4xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl transform perspective-1000 hover:rotate-y-3 transition-transform duration-700">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Casino Games Preview"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Multiple Games</h3>
                <p className="text-white/80">Try your luck with our variety of exciting casino games</p>
              </div>
            </div>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground">Games</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">1000+</p>
              <p className="text-sm text-muted-foreground">Players</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">5M+</p>
              <p className="text-sm text-muted-foreground">Coins Won</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 bg-gradient-to-b from-background to-background/90">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Popular Games</h2>
              <p className="text-muted-foreground mt-2">Try your luck with our most popular games</p>
            </div>
            <Button asChild variant="ghost" className="group">
              <Link href="/games" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <GameCard
              title="Plinko"
              description="Drop the ball and watch it bounce through pegs for big wins."
              image="/placeholder.svg?height=300&width=400"
              href="/games/plinko"
              badge="Popular"
              badgeColor="bg-yellow-500"
            />
            <GameCard
              title="Mines"
              description="Uncover gems while avoiding hidden mines in this thrilling game."
              image="/placeholder.svg?height=300&width=400"
              href="/games/mines"
              badge="New"
              badgeColor="bg-green-500"
            />
            <GameCard
              title="Coin Flip"
              description="Simple yet exciting. Bet on heads or tails and double your coins."
              image="/placeholder.svg?height=300&width=400"
              href="/games/coin-flip"
            />
            <GameCard
              title="Dice"
              description="Predict the outcome of the dice roll and win big rewards."
              image="/placeholder.svg?height=300&width=400"
              href="/games/dice"
              badge="Hot"
              badgeColor="bg-red-500"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Play With Us?</h2>
            <p className="text-muted-foreground">
              Experience the thrill of casino games without the financial risk. Our platform offers a safe and
              entertaining environment for all players.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Virtual Currency</h3>
                  <p className="text-muted-foreground">
                    Play with our in-game currency. No real money involved, just pure entertainment.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Leaderboards</h3>
                  <p className="text-muted-foreground">
                    Compete with other players and climb the ranks to show off your skills.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border border-primary/10 overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Daily Rewards</h3>
                  <p className="text-muted-foreground">
                    Log in daily to claim free coins and bonuses to boost your gameplay.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-purple-600 p-10 md:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Playing?</h2>
                <p className="text-white/80 text-lg max-w-xl">
                  Join thousands of players and experience the thrill of our casino games. Sign up now and get 1,000
                  free coins!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-primary font-semibold px-8">
                  <Link href="/login">Sign Up</Link>
                </Button>
                <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0 px-8">
                  <Link href="/games">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Play Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

