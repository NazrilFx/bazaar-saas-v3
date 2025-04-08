"use client";

import { useState, useEffect } from "react";
import { ObjectId } from "mongodb";
import { IEvent } from "@/models/Event";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminEventsList } from "@/components/admin/events-list";
import { Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export type EventWithStatus = IEvent & {
  _id: ObjectId;
  status: "upcoming" | "active" | "past";
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventWithStatus[] | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<EventWithStatus[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/events"); // Fetch dari API Next.js
      const data = await res.json();

      if (res.ok) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      } else {
        setEvents(null);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = (query: string) => {
    if (!events) return;

    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredEvents(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bazaar Events</h2>
          <p className="text-muted-foreground">
            Manage bazaar events and vendor participation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              router.push("events/create");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                View and manage all bazaar events
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  type="search"
                  placeholder="Search events..."
                  className="pl-8 w-[200px] md:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <AdminEventsList status="upcoming" events={filteredEvents} />
            </TabsContent>
            <TabsContent value="active">
              <AdminEventsList status="active" events={filteredEvents} />
            </TabsContent>
            <TabsContent value="past">
              <AdminEventsList status="past" events={filteredEvents} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
