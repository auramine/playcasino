"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, ImageIcon } from "lucide-react"

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [profileBanner, setProfileBanner] = useState("")
  const [bio, setBio] = useState("")
  const [favoriteGame, setFavoriteGame] = useState("")
  const [customTheme, setCustomTheme] = useState("")

  // Load user data
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setUsername(user.username || "")
    setAvatar(user.avatar || "")
    setProfileBanner(user.profileBanner || "")
    setBio(user.bio || "")
    setFavoriteGame(user.favoriteGame || "")
    setCustomTheme(user.customTheme || "")
  }, [user, router])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateProfile({
      username,
      avatar,
      profileBanner,
      bio,
      favoriteGame,
      customTheme,
    })

    setIsLoading(false)

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Customize your profile and account settings</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and public details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Banner */}
              <div className="space-y-2">
                <Label>Profile Banner</Label>
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  {profileBanner ? (
                    <div className="w-full h-full relative">
                      <img
                        src={profileBanner || "/placeholder.svg"}
                        alt="Profile Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Enter banner image URL"
                  value={profileBanner}
                  onChange={(e) => setProfileBanner(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for your profile banner image (recommended size: 1200x300)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar.startsWith("http") ? avatar : undefined} />
                  <AvatarFallback className="text-2xl">
                    {avatar.length === 1 ? avatar : username.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    placeholder="Enter a single letter or image URL"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Enter a single letter or paste an image URL</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="favorite-game">Favorite Game</Label>
                <Select value={favoriteGame} onValueChange={setFavoriteGame}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your favorite game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Plinko">Plinko</SelectItem>
                    <SelectItem value="Mines">Mines</SelectItem>
                    <SelectItem value="Coin Flip">Coin Flip</SelectItem>
                    <SelectItem value="Dice">Dice</SelectItem>
                    <SelectItem value="Slots">Slots</SelectItem>
                    <SelectItem value="Roulette">Roulette</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how PlayCasino looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Color</Label>
                <Select value={customTheme} onValueChange={setCustomTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Purple)</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This will change the accent color of the site for you</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input id="password" type="password" value="••••••••" disabled />
                  <Button variant="outline">Change</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

