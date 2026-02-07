"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PastEvent } from "@/lib/events";
import { formatDateString, withCloudinaryAutoFormat } from "@/lib/utils";

export const Gallery: React.FC<{ eventsData: PastEvent[] }> = ({
	eventsData,
}) => {
	const [events, setEvents] = useState<PastEvent[]>([]);

	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const pastEvents = eventsData.filter((event) => {
			const eventDate = event.date ? new Date(event.date) : new Date(0);
			return eventDate < today;
		});

		setEvents(pastEvents);
	}, []);
	return (
		<section id="gallery" className="py-24 px-6 md:px-12 bg-black">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-20">
					<span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
						The Lifestyle
					</span>
					<h2 className="text-4xl md:text-6xl font-serif mb-8">
						Past Experiences
					</h2>
					<p className="text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
						Relive the most exclusive moments from our curated world of luxury
						events and nightlife.
					</p>
					<div className="w-24 h-px bg-white/20 mx-auto mt-12" />
				</div>

				{events.length === 0 ? (
					<p className="text-center text-white/60">No events available yet</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
						{events.map((event) => (
							<Link
								key={event.id}
								href={`/gallery/${event.id}`}
								className="group block"
							>
								<div className="relative aspect-4/5 overflow-hidden border border-white/5 bg-white/5 mb-6">
									<Image
										src={
											withCloudinaryAutoFormat(event.thumbnail) ||
											"/placeholder.svg"
										}
										alt={event.title}
										fill
										className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
									<div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
										<p className="text-gold text-[14px] uppercase tracking-[0.3em] mb-2 font-semibold">
											{formatDateString(String(event.date))}
										</p>
										<h3 className="text-2xl font-serif text-white mb-2 font-bold">
											{event.title}
										</h3>
										{event.items.length > 0 && (
											<p className="text-white/40 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">
												Explore Gallery — {event.items.length} Photos
											</p>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
};
