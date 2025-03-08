import Link from "next/link"
import { Coins } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PlayCasino</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A simulated gambling platform with virtual currency. No real money involved.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Games</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/games/plinko"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Plinko
                </Link>
              </li>
              <li>
                <Link
                  href="/games/mines"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mines
                </Link>
              </li>
              <li>
                <Link
                  href="/games/coin-flip"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Coin Flip
                </Link>
              </li>
              <li>
                <Link
                  href="/games/dice"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-to-play"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <p className="text-sm text-muted-foreground">
              This is a simulated gambling platform for entertainment purposes only. No real money is involved.
            </p>
            <p className="text-sm text-muted-foreground mt-2">All games are designed for users 18 years and older.</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PlayCasino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

