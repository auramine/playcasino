import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2 } from "lucide-react"

interface GameCardProps {
  title: string
  description: string
  image: string
  href: string
  badge?: string
  badgeColor?: string
}

export function GameCard({ title, description, image, href, badge, badgeColor }: GameCardProps) {
  return (
    <Card className="overflow-hidden game-card border border-primary/10 bg-background/50 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`${badgeColor || "bg-primary"}`}>{badge}</Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full group">
          <Link href={href} className="flex items-center justify-center">
            <Gamepad2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
            Play Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

