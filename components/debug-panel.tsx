"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Database, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export function DebugPanel() {
  const { users } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const clearLocalStorage = () => {
    localStorage.clear()
    toast({
      title: "Local Storage Cleared",
      description: "All stored data has been removed. Please refresh the page.",
      variant: "destructive",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-80">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-background/80 backdrop-blur-sm">
            <Database className="h-4 w-4" />
            Debug Panel
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex justify-between items-center">
                <span>Local Storage Data</span>
                <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={clearLocalStorage}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Data
                </Button>
              </CardTitle>
              <CardDescription className="text-xs">Registered accounts: {users.length}</CardDescription>
            </CardHeader>
            <CardContent className="py-2 max-h-60 overflow-y-auto">
              <div className="space-y-2 text-xs">
                {users.map((user) => (
                  <div key={user.id} className="p-2 border rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.username}</span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-1">{user.email}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

