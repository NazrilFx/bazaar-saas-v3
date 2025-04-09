import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin } from "lucide-react"
import { EventWithStoreThisEvent } from "@/app/vendor/page"
import dayjs from "dayjs"

// const events: BazaarEvent[] = [
//   {
//     id: "event1",
//     name: "Summer Food Festival",
//     date: "Jun 15-18, 2023",
//     location: "Central Park, New York",
//     status: "active",
//     storeCount: 1,
//   },
//   {
//     id: "event2",
//     name: "Artisan Market",
//     date: "Jul 8-10, 2023",
//     location: "Waterfront Plaza, Seattle",
//     status: "upcoming",
//     storeCount: 1,
//   },
//   {
//     id: "event3",
//     name: "Autumn Craft Fair",
//     date: "Sep 22-24, 2023",
//     location: "Community Center, Boston",
//     status: "upcoming",
//     storeCount: 1,
//   },
// ]

interface VendorEventListProps {
  events: EventWithStoreThisEvent[];
}

export function VendorEventsList({ events }: VendorEventListProps) {


  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event._id.toString()} className="p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{event.name}</h3>
            <Badge
              variant="outline"
              className={
                event.isActive?
                  "bg-green-50 text-green-700 border-green-200"
                  : 
                     "bg-blue-50 text-blue-700 border-blue-200"
              }
            >
              {event.isActive? "active" : "upcoming"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            {dayjs(event.start_date).format("dddd, DD MMMM YYYY")}
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {event.location}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            You have {event.storeThisEvent} {event.storeThisEvent === 1 ? "store" : "stores"} at this event
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Manage Participation
          </Button>
        </div>
      ))}
    </div>
  )
}

