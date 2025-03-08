"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ShieldAlert,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  Coins,
  BarChart,
  Save,
  Crown,
  CheckCircle,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AdminPage() {
  const router = useRouter()
  const { user, users, deleteUser, updateUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddCoinsDialogOpen, setIsAddCoinsDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [coinsToAdd, setCoinsToAdd] = useState(100)

  // Form state for editing user
  const [editUsername, setEditUsername] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState<"user" | "admin" | "owner">("user")

  useEffect(() => {
    // Check if user is admin or owner
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      router.push("/")
      return
    }
  }, [user, router])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.username.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.id.toLowerCase().includes(term),
        ),
      )
    }
  }, [searchTerm, users])

  const handleEditUser = () => {
    if (!selectedUser) return

    updateUser(selectedUser.id, {
      username: editUsername,
      email: editEmail,
    })

    setIsEditDialogOpen(false)
    // Reset selected user to prevent stale state
    setSelectedUser(null)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    deleteUser(selectedUser.id)
    setIsDeleteDialogOpen(false)
    // Reset selected user to prevent stale state
    setSelectedUser(null)
  }

  const handleAddCoins = () => {
    if (!selectedUser) return

    updateUser(selectedUser.id, {
      balance: selectedUser.balance + coinsToAdd,
    })

    setIsAddCoinsDialogOpen(false)
    // Reset selected user to prevent stale state
    setSelectedUser(null)
  }

  const handleChangeRole = () => {
    if (!selectedUser) return

    // Only owner can assign owner role
    if (editRole === "owner" && user?.role !== "owner") {
      return
    }

    updateUser(selectedUser.id, {
      role: editRole,
    })

    setIsRoleDialogOpen(false)
    // Reset selected user to prevent stale state
    setSelectedUser(null)
  }

  const openEditDialog = (user: any) => {
    setSelectedUser({ ...user })
    setEditUsername(user.username)
    setEditEmail(user.email)
    setEditRole(user.role)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: any) => {
    setSelectedUser({ ...user })
    setIsDeleteDialogOpen(true)
  }

  const openAddCoinsDialog = (user: any) => {
    setSelectedUser({ ...user })
    setCoinsToAdd(100)
    setIsAddCoinsDialogOpen(true)
  }

  const openRoleDialog = (user: any) => {
    setSelectedUser({ ...user })
    setEditRole(user.role)
    setIsRoleDialogOpen(true)
  }

  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, games, and platform settings</p>
        </div>
        <Badge variant="outline" className={user.role === "owner" ? "bg-yellow-500/10" : "bg-primary/10"}>
          {user.role === "owner" ? (
            <div className="flex items-center">
              <Crown className="mr-1 h-4 w-4 text-yellow-500" />
              Owner Access
            </div>
          ) : (
            <div className="flex items-center">
              <ShieldAlert className="mr-1 h-4 w-4 text-primary" />
              Admin Access
            </div>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Coins</p>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.balance, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Coins className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Games</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="ml-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar.startsWith("http") ? user.avatar : undefined} />
                              <AvatarFallback>
                                {user.avatar.length === 1 ? user.avatar : user.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium">{user.username}</p>
                                {user.role === "admin" && (
                                  <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary" />
                                )}
                                {user.role === "owner" && (
                                  <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "user" ? "outline" : "default"}
                            className={user.role === "owner" ? "bg-yellow-500 hover:bg-yellow-500/80" : ""}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.balance.toLocaleString()}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                {user.role === "owner" ? (
                                  <Crown className="mr-2 h-4 w-4" />
                                ) : user.role === "admin" ? (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                ) : (
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                )}
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openAddCoinsDialog(user)}>
                                <Coins className="mr-2 h-4 w-4" />
                                Add Coins
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(user)}
                                className="text-destructive"
                                disabled={user.role === "owner" && user.id !== selectedUser?.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">No users found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle>Game Management</CardTitle>
              <CardDescription>Configure and manage games on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plinko</CardTitle>
                    <CardDescription>Configure Plinko game settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Status</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>House Edge</span>
                        <span>1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Min Bet</span>
                        <span>10 coins</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Max Bet</span>
                        <span>1,000 coins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mines</CardTitle>
                    <CardDescription>Configure Mines game settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Status</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>House Edge</span>
                        <span>3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Min Bet</span>
                        <span>10 coins</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Max Bet</span>
                        <span>500 coins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Coin Flip</CardTitle>
                    <CardDescription>Configure Coin Flip game settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Status</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>House Edge</span>
                        <span>1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Min Bet</span>
                        <span>5 coins</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Max Bet</span>
                        <span>2,000 coins</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add New Game</CardTitle>
                    <CardDescription>Configure and deploy a new game</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-8">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Game
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="PlayCasino" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Input id="default-currency" defaultValue="Coins" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-user-balance">New User Starting Balance</Label>
                    <Input id="new-user-balance" type="number" defaultValue="1000" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daily-reward">Daily Reward Amount</Label>
                    <Input id="daily-reward" type="number" defaultValue="100" />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Make changes to the user's account details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input id="edit-username" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          setIsRoleDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>Update the user's role and permissions.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar.startsWith("http") ? selectedUser.avatar : undefined} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Role</Label>
                <RadioGroup
                  value={editRole}
                  onValueChange={(value) => setEditRole(value as "user" | "admin" | "owner")}
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="user" id="role-user" />
                    <Label htmlFor="role-user" className="flex-1 cursor-pointer">
                      <div className="font-medium">User</div>
                      <div className="text-xs text-muted-foreground">Regular user with standard permissions</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="admin" id="role-admin" />
                    <Label htmlFor="role-admin" className="flex-1 cursor-pointer">
                      <div className="font-medium flex items-center gap-1">
                        Admin
                        <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary" />
                      </div>
                      <div className="text-xs text-muted-foreground">Can manage users and platform settings</div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-3 ${user?.role !== "owner" ? "opacity-50" : ""}`}
                  >
                    <RadioGroupItem value="owner" id="role-owner" disabled={user?.role !== "owner"} />
                    <Label
                      htmlFor="role-owner"
                      className={`flex-1 ${user?.role !== "owner" ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="font-medium flex items-center gap-1">
                        Owner
                        <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">Full control over the platform</div>
                    </Label>
                  </div>
                </RadioGroup>

                {user?.role !== "owner" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Only owners can assign the owner role to other users.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar.startsWith("http") ? selectedUser.avatar : undefined} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{selectedUser.username}</p>
                    {selectedUser.role === "admin" && <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary" />}
                    {selectedUser.role === "owner" && <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <p className="text-sm text-destructive">
                This will permanently delete the user's account and all associated data.
              </p>

              {selectedUser.role === "owner" && (
                <p className="text-sm font-medium mt-2 text-yellow-500">
                  Warning: You are about to delete an owner account. This may affect platform administration.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Coins Dialog */}
      <Dialog
        open={isAddCoinsDialogOpen}
        onOpenChange={(open) => {
          setIsAddCoinsDialogOpen(open)
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Coins</DialogTitle>
            <DialogDescription>Add coins to the user's balance.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar.startsWith("http") ? selectedUser.avatar : undefined} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Current Balance: {selectedUser.balance.toLocaleString()} coins
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coins-amount">Amount to Add</Label>
                <Input
                  id="coins-amount"
                  type="number"
                  min="1"
                  value={coinsToAdd}
                  onChange={(e) => setCoinsToAdd(Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(100)}>
                  +100
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(500)}>
                  +500
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(1000)}>
                  +1,000
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCoinsToAdd(5000)}>
                  +5,000
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddCoinsDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCoins}>Add Coins</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

