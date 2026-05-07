"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle, Copy, Check } from "lucide-react";
import { getAllEventsFromFirestore } from "@/lib/firestore-services";
import type { PastEvent } from "@/lib/events";
import {
	formatDateString,
	Timestamp,
	withCloudinaryAutoFormat,
} from "@/lib/utils";

export default function AdminDashboard() {
	const [events, setEvents] = useState<PastEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const copyRsvpLink = (e: React.MouseEvent, event: PastEvent) => {
		e.preventDefault();
		if (!event.slug) return;
		const url = `${window.location.origin}/events/${event.slug}`;
		navigator.clipboard.writeText(url).then(() => {
			setCopiedId(event.id);
			setTimeout(() => setCopiedId(null), 2000);
		});
	};

	useEffect(() => {
		async function fetchEvents() {
			const fetchedEvents = await getAllEventsFromFirestore();
			setEvents(fetchedEvents);
			setIsLoading(false);
		}

		fetchEvents();
	}, []);

	const totalEvents = events.length;
	const totalPhotos = events.reduce(
		(sum, event) => sum + event.items.length,
		0,
	);

	return (
		<div className="flex-1 p-8">
			<div className="max-w-7xl mx-auto">
						<div className="flex items-center justify-between mb-8">
							<div>
								<h2 className="text-3xl font-serif font-bold">Dashboard</h2>
								<p className="text-muted-foreground mt-1">
									Manage your events and media
								</p>
							</div>
							<Link href="/admin/events/new">
								<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
									<PlusCircle className="mr-2 h-4 w-4" />
									Create Event
								</Button>
							</Link>
						</div>

						{/* Stats Cards */}
						<div className="grid gap-6 md:grid-cols-3 mb-8">
							<Card>
								<CardHeader>
									<CardDescription>Total Events</CardDescription>
									<CardTitle className="text-4xl font-bold text-primary">
										{totalEvents}
									</CardTitle>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<CardDescription>Total Media</CardDescription>
									<CardTitle className="text-4xl font-bold text-primary">
										{totalPhotos}
									</CardTitle>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<CardDescription>Recent Activity</CardDescription>
									<CardTitle className="text-4xl font-bold text-primary">
										24h
									</CardTitle>
								</CardHeader>
							</Card>
						</div>

						{/* Recent Events */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Events</CardTitle>
								<CardDescription>Your latest event experiences</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									<p className="text-center text-muted-foreground py-8">
										Loading events...
									</p>
								) : events.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-muted-foreground mb-4">
											No events created yet
										</p>
										<Link href="/admin/events/new">
											<Button variant="outline">Create Your First Event</Button>
										</Link>
									</div>
								) : (
									<div className="space-y-4">
										{events.slice(0, 5).map((event) => (
											<Link key={event.id} href={`/admin/events/${event.id}`}>
												<div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
													<img
														src={
															withCloudinaryAutoFormat(event.thumbnail) ||
															"/placeholder.svg"
														}
														alt={event.title}
														className="w-16 h-16 rounded object-cover"
													/>
													<div className="flex-1">
														<h3 className="font-semibold">{event.title}</h3>
														<p className="text-sm text-muted-foreground">
															{formatDateString(String(event.date))} •{" "}
															{event.location}
														</p>
													</div>
													<div className="flex items-center gap-3">
														{event.slug && (
															<button
																onClick={(e) => copyRsvpLink(e, event)}
																className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 border border-border hover:border-primary/50 rounded"
																title="Copy RSVP link"
															>
																{copiedId === event.id ? (
																	<><Check className="h-3.5 w-3.5 text-green-500" /><span className="text-green-500">Copied</span></>
																) : (
																	<><Copy className="h-3.5 w-3.5" /><span>Copy link</span></>
																)}
															</button>
														)}
														<div className="text-sm text-muted-foreground">
															{event.items.length} media
														</div>
													</div>
												</div>
											</Link>
										))}
									</div>
								)}
							</CardContent>
						</Card>
				</div>
		</div>
	);
}
