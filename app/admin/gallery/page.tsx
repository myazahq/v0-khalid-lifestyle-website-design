"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Video, ExternalLink } from "lucide-react";
import { getAllEventsFromFirestore } from "@/lib/firestore-services";
import type { PastEvent, GalleryItem } from "@/lib/events";
import { withCloudinaryAutoFormat } from "@/lib/utils";

export default function AdminGalleryPage() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  useEffect(() => {
    getAllEventsFromFirestore().then((data) => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  const allItems: Array<{ item: GalleryItem; event: PastEvent }> = events.flatMap(
    (event) =>
      event.items.map((item) => ({ item, event }))
  );

  const filtered = allItems.filter(
    ({ item }) => filter === "all" || item.type === filter
  );

  const totalImages = allItems.filter(({ item }) => item.type === "image").length;
  const totalVideos = allItems.filter(({ item }) => item.type === "video").length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Gallery</h1>
            <p className="text-muted-foreground mt-1">
              All media across your events
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Media</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary">
                {allItems.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Images</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary flex items-center gap-2">
                <ImageIcon className="h-6 w-6" />
                {totalImages}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Videos</CardDescription>
              <CardTitle className="text-4xl font-bold text-primary flex items-center gap-2">
                <Video className="h-6 w-6" />
                {totalVideos}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>{filtered.length} items</CardDescription>
              </div>
              <div className="flex gap-2">
                {(["all", "image", "video"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
                      filter === f
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <ImageIcon className="h-10 w-10 opacity-30" />
                <p>No media found.</p>
                <Link href="/admin/events/new">
                  <Button variant="outline" size="sm">
                    Create an event to add media
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map(({ item, event }, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded border border-border bg-muted">
                    {item.type === "image" ? (
                      <img
                        src={withCloudinaryAutoFormat(item.src) || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white text-xs text-center font-medium leading-tight truncate w-full text-center">
                        {event.title}
                      </p>
                      <Link href={`/admin/events/${event.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-white/50 text-white hover:bg-white/20">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
