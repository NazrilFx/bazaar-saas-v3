import { CalendarDays } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface EventPerformance {
  id: string
  name: string
  date: string
  revenue: number
  vendorCount: number
  storeCount: number
}

const events: EventPerformance[] = [
  {
    id: "e1",
    name: "Summer Food Festival",
    date: "Jun 15-18, 2023",
    revenue: 45250.75,
    vendorCount: 65,
    storeCount: 72,
  },
  {
    id: "e2",
    name: "Artisan Market",
    date: "Jul 8-10, 2023",
    revenue: 32180.5,
    vendorCount: 50,
    storeCount: 58,
  },
  {
    id: "e3",
    name: "Spring Flower Show",
    date: "Apr 5-9, 2023",
    revenue: 28975.25,
    vendorCount: 40,
    storeCount: 45,
  },
  {
    id: "e4",
    name: "Local Farmers Market",
    date: "May 12-14, 2023",
    revenue: 18650.0,
    vendorCount: 35,
    storeCount: 38,
  },
]

export function AdminEventPerformance() {
  const maxRevenue = Math.max(...events.map((event) => event.revenue))

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{event.name}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                <span>{event.date}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${event.revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {event.vendorCount} vendors, {event.storeCount} stores
              </p>
            </div>
          </div>
          <Progress value={(event.revenue / maxRevenue) * 100} className="h-2" />
        </div>
      ))}
    </div>
  )
}

