import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Edit,
  MapPin,
  MoreHorizontal,
  Store,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { EventWithStatus } from "@/app/admin/events/page";

// const events: Record<string, BazaarEvent[]> = {
//   upcoming: [
//     {
//       id: "e1",
//       name: "Autumn Craft Fair",
//       startDate: "2023-09-22",
//       endDate: "2023-09-24",
//       location: "Community Center, Boston",
//       vendorCount: 45,
//       storeCount: 52,
//       status: "upcoming",
//     },
//     {
//       id: "e2",
//       name: "Winter Holiday Market",
//       startDate: "2023-12-10",
//       endDate: "2023-12-23",
//       location: "Downtown Plaza, Chicago",
//       vendorCount: 78,
//       storeCount: 85,
//       status: "upcoming",
//     },
//     {
//       id: "e3",
//       name: "Tech Expo 2023",
//       startDate: "2023-10-15",
//       endDate: "2023-10-17",
//       location: "Convention Center, San Francisco",
//       vendorCount: 32,
//       storeCount: 40,
//       status: "upcoming",
//     },
//   ],
//   active: [
//     {
//       id: "e4",
//       name: "Summer Food Festival",
//       startDate: "2023-06-15",
//       endDate: "2023-06-18",
//       location: "Central Park, New York",
//       vendorCount: 65,
//       storeCount: 72,
//       status: "active",
//     },
//     {
//       id: "e5",
//       name: "Artisan Market",
//       startDate: "2023-07-08",
//       endDate: "2023-07-10",
//       location: "Waterfront Plaza, Seattle",
//       vendorCount: 50,
//       storeCount: 58,
//       status: "active",
//     },
//   ],
//   past: [
//     {
//       id: "e6",
//       name: "Spring Flower Show",
//       startDate: "2023-04-05",
//       endDate: "2023-04-09",
//       location: "Botanical Gardens, Portland",
//       vendorCount: 40,
//       storeCount: 45,
//       status: "past",
//     },
//     {
//       id: "e7",
//       name: "Local Farmers Market",
//       startDate: "2023-05-12",
//       endDate: "2023-05-14",
//       location: "City Square, Austin",
//       vendorCount: 35,
//       storeCount: 38,
//       status: "past",
//     },
//   ],
// }

interface AdminEventsListProps {
  status: "upcoming" | "active" | "past";
  events: EventWithStatus[] | null;
}

export function AdminEventsList({ status, events }: AdminEventsListProps) {
  const router = useRouter();
  const eventsList = (events ?? []).filter((event) => event.status === status);

  if (eventsList.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No {status} events</h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          {status === "upcoming"
            ? "There are no upcoming events scheduled at the moment."
            : status === "active"
            ? "There are no active events at the moment."
            : "There are no past events to display."}
        </p>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Vendors</TableHead>
          <TableHead>Stores</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventsList.map((event) => (
          <TableRow key={event._id.toString()}>
            <TableCell>
              <div className="font-medium">{event.name}</div>
              <div className="text-xs text-muted-foreground">
                ID: {event._id.toString()}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {dayjs(event.start_date).format("dddd, DD MMMM YYYY")}
                </span>
                {event.end_date !== event.start_date && (
                  <span>
                    {" "}
                    - {dayjs(event.end_date).format("dddd, DD MMMM YYYY")}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Store className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{event.vendorsId?.length}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{event.storesId?.length}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  event.status === "active"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : event.status === "upcoming"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {event.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  onClick={() => {
                    router.push(`events/edit/${event._id}`);
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Vendors</DropdownMenuItem>
                    <DropdownMenuItem>Edit Event</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {event.status === "upcoming" && (
                      <DropdownMenuItem className="text-red-600">
                        Cancel Event
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// function formatDate(dateString: string): string {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   };
//   return new Date(dateString).toLocaleDateString("en-US", options);
// }
