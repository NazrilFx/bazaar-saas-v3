import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ObjectId } from "mongodb"
import dayjs from "dayjs";

// const activities: Activity[] = [
//   {
//     id: "act1",
//     user: {
//       name: "Sarah Chen",
//       avatar: "/placeholder.svg?height=32&width=32&text=SC",
//     },
//     action: "approved",
//     target: "Vendor application for 'Artisan Crafts'",
//     timestamp: "2 minutes ago",
//     status: "success",
//   },
//   {
//     id: "act2",
//     user: {
//       name: "Michael Rodriguez",
//       avatar: "/placeholder.svg?height=32&width=32&text=MR",
//     },
//     action: "created",
//     target: "New bazaar event 'Summer Food Festival'",
//     timestamp: "1 hour ago",
//   },
//   {
//     id: "act3",
//     user: {
//       name: "Jessica Taylor",
//       avatar: "/placeholder.svg?height=32&width=32&text=JT",
//     },
//     action: "rejected",
//     target: "Product listing 'Prohibited Item XYZ'",
//     timestamp: "3 hours ago",
//     status: "error",
//   },
//   {
//     id: "act4",
//     user: {
//       name: "David Kim",
//       avatar: "/placeholder.svg?height=32&width=32&text=DK",
//     },
//     action: "updated",
//     target: "System settings for payment processing",
//     timestamp: "5 hours ago",
//   },
//   {
//     id: "act5",
//     user: {
//       name: "System",
//       avatar: "/placeholder.svg?height=32&width=32&text=SYS",
//     },
//     action: "flagged",
//     target: "Unusual transaction pattern detected",
//     timestamp: "1 day ago",
//     status: "warning",
//   },
// ]


interface Activity {
  _id: ObjectId
  user_name: string,
  action: string
  created_at: Date
}

export function AdminRecentActivity({ activities }: { activities: Activity[] | null }) {

  if (!activities || activities.length === 0) {
    return <p className="text-sm text-muted-foreground">Tidak ada activity terbaru.</p>;
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada activity terbaru.</p>
      ) : (
        activities.map((activity) => (
          <div key={activity._id.toString()} className="flex items-start gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{activity.user_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user_name}</span>{" "}
                <span>{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">{dayjs(activity.created_at).fromNow()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
  }

