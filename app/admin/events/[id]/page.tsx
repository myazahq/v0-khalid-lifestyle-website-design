"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { PastEvent } from "@/lib/events";
import { getEventById, deleteEvent } from "@/lib/firestore-services";
import { formatDateString } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

export default function EventDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [event, setEvent] = useState<PastEvent | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchEvent() {
			const eventId = params.id as string;
			const fetchedEvent = await getEventById(eventId);
			setEvent(fetchedEvent);
			setIsLoading(false);
		}

		fetchEvent();
	}, [params.id]);

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this event?")) return;

		const result = await deleteEvent(params.id as string);
		if (result.success) {
			router.push("/admin");
		} else {
			alert("Failed to delete event. Please try again.");
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen bg-background">
				<AdminSidebar />
				<main className="flex-1 flex items-center justify-center">
					<p className="text-muted-foreground">Loading...</p>
				</main>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="flex min-h-screen bg-background">
				<AdminSidebar />
				<main className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
						<Link href="/admin">
							<Button>Back to Dashboard</Button>
						</Link>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-background">
			<AdminSidebar />

			<main className="flex-1 p-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center gap-4 mb-8">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div className="flex-1">
							<h1 className="text-3xl font-serif font-bold">{event.title}</h1>
							<p className="text-muted-foreground mt-1">
								{formatDateString(String(event.date))} • {event.location}
							</p>
						</div>
						<Button variant="destructive" onClick={handleDelete}>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete Event
						</Button>
					</div>

					<div className="grid gap-6 md:grid-cols-3 mb-8">
						<Card>
							<CardHeader>
								<CardDescription>Total Media</CardDescription>
								<CardTitle className="text-4xl font-bold text-primary">
									{event.items.length}
								</CardTitle>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<CardDescription>Images</CardDescription>
								<CardTitle className="text-4xl font-bold text-primary">
									{event.items.filter((item) => item.type === "image").length}
								</CardTitle>
							</CardHeader>
						</Card>

						<Card>
							<CardHeader>
								<CardDescription>Videos</CardDescription>
								<CardTitle className="text-4xl font-bold text-primary">
									{event.items.filter((item) => item.type === "video").length}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Event Gallery</CardTitle>
									<CardDescription>
										Manage photos and videos from this event
									</CardDescription>
								</div>
								<Link href={`/admin/events/${event.id}/upload`}>
									<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
										<Plus className="mr-2 h-4 w-4" />
										Add Media
									</Button>
								</Link>
							</div>
						</CardHeader>
						<CardContent>
							{event.items.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-muted-foreground mb-4">
										No media added yet
									</p>
									<Link href={`/admin/events/${event.id}/upload`}>
										<Button variant="outline">
											Add Your First Photo or Video
										</Button>
									</Link>
								</div>
							) : (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{event.items.map((item, index) => (
										<div
											key={index}
											className="relative aspect-square rounded-lg overflow-hidden border border-border"
										>
											{item.type === "image" ? (
												<img
													src={item.src || "/placeholder.svg"}
													alt={`Media ${index + 1}`}
													className="w-full h-full object-cover"
												/>
											) : (
												<video
													src={item.src}
													className="w-full h-full object-cover"
													muted
													loop
												/>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Event Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Description
								</p>
								<p className="mt-1">{event.description}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Thumbnail
								</p>
								<img
									src={event.thumbnail || "/placeholder.svg"}
									alt={event.title}
									className="mt-2 w-48 h-32 object-cover rounded-lg"
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
