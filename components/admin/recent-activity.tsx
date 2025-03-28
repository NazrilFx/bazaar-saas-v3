import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  status?: "success" | "warning" | "error"
}

const activities: Activity[] = [
  {
    id: "act1",
    user: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=32&width=32&text=SC",
    },
    action: "approved",
    target: "Vendor application for 'Artisan Crafts'",
    timestamp: "2 minutes ago",
    status: "success",
  },
  {
    id: "act2",
    user: {
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32&text=MR",
    },
    action: "created",
    target: "New bazaar event 'Summer Food Festival'",
    timestamp: "1 hour ago",
  },
  {
    id: "act3",
    user: {
      name: "Jessica Taylor",
      avatar: "/placeholder.svg?height=32&width=32&text=JT",
    },
    action: "rejected",
    target: "Product listing 'Prohibited Item XYZ'",
    timestamp: "3 hours ago",
    status: "error",
  },
  {
    id: "act4",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32&text=DK",
    },
    action: "updated",
    target: "System settings for payment processing",
    timestamp: "5 hours ago",
  },
  {
    id: "act5",
    user: {
      name: "System",
      avatar: "/placeholder.svg?height=32&width=32&text=SYS",
    },
    action: "flagged",
    target: "Unusual transaction pattern detected",
    timestamp: "1 day ago",
    status: "warning",
  },
]

export function AdminRecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span
                className={cn(
                  "font-medium",
                  activity.status === "success" && "text-green-500",
                  activity.status === "warning" && "text-amber-500",
                  activity.status === "error" && "text-red-500",
                )}
              >
                {activity.action}
              </span>{" "}
              {activity.target}
            </p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

