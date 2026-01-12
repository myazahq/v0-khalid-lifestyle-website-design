import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { PastEvent } from "@/lib/events";
import { formatDateString } from "@/lib/utils";

export const UpcomingEvents: React.FC<{ eventsData: PastEvent[] }> = ({
	eventsData,
}) => {
	const upcomingEvents = eventsData.filter((event) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const eventDate = new Date(String(event.date));
		return eventDate >= today;
	});

	return (
		<section id="events" className="py-24 px-6 md:px-12 bg-[#050505]">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
					<div>
						<span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">
							Schedule
						</span>
						<h2 className="text-4xl md:text-6xl font-serif">Upcoming Events</h2>
					</div>
					<p className="max-w-md text-muted-foreground text-sm uppercase tracking-wider leading-relaxed">
						Curating the world's most exclusive parties. Secure your entry to
						the next KhalidLifestyle production.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
					{upcomingEvents.length === 0 ? (
						<p className="col-span-full text-center text-muted-foreground">
							No upcoming events at this time. Check back soon!
						</p>
					) : (
						upcomingEvents.map((event, i) => (
							<div
								key={i}
								className={event.featured ? "md:col-span-8" : "md:col-span-4"}
							>
								<Card className="bg-transparent border-white/5 overflow-hidden group py-0">
									<CardContent className="p-0 relative aspect-4/3 md:aspect-auto md:h-150">
										<Image
											src={event.thumbnail || "/placeholder.svg"}
											alt={event.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30 p-8 flex flex-col justify-end">
											{event.featured && (
												<Badge className="w-fit bg-gold text-black mb-4 rounded-none uppercase tracking-widest text-[10px]">
													Featured Event
												</Badge>
											)}
											<h3 className="text-2xl md:text-3xl font-serif mb-4">
												{event.title}
											</h3>
											<div className="flex flex-wrap gap-4 mb-6">
												<div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
													<Calendar size={14} className="text-gold" />
													{formatDateString(String(event.date))}
												</div>
												<div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
													<MapPin size={14} className="text-gold" />
													{event.location}
												</div>
											</div>
											<button className="w-fit px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold transition-colors">
												RSVP NOW
											</button>
										</div>
									</CardContent>
								</Card>
							</div>
						))
					)}
				</div>
			</div>
		</section>
	);
};
