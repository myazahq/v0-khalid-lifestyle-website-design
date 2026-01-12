"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getEventById } from "@/lib/firestore-services";
import type { PastEvent } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { formatDateString } from "@/lib/utils";

export default function EventGalleryPage() {
	const params = useParams();
	const router = useRouter();
	const [event, setEvent] = useState<PastEvent | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchEvent() {
			if (!params.event) return;
			const eventId = params.event as string;
			const foundEvent = await getEventById(eventId);
			setEvent(foundEvent);
			setIsLoading(false);
		}
		fetchEvent();
	}, [params.event]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<p className="text-gold uppercase tracking-widest text-xs">
					Loading experience...
				</p>
			</div>
		);
	}

	if (!event) return null;

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12">
				<div className="max-w-7xl mx-auto">
					<Button
						variant="ghost"
						onClick={() => router.push("/#gallery")}
						className="mb-12 text-white/40 hover:text-gold hover:bg-transparent p-0 flex items-center gap-2 uppercase tracking-widest text-[10px]"
					>
						<ArrowLeft size={16} /> Back to Experiences
					</Button>

					<div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
						<div className="max-w-3xl">
							<span className="text-gold text-xs uppercase tracking-[0.5em] mb-4 block">
								{formatDateString(String(event.date))}
							</span>
							<h1 className="text-5xl md:text-7xl font-serif mb-6">
								{event.title}
							</h1>
							<p className="text-white/60 text-lg font-light leading-relaxed italic">
								{event.location}
							</p>
						</div>
						<p className="text-white/40 max-w-sm text-sm font-light leading-relaxed">
							{event.description}
						</p>
					</div>

					<div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
						{event.items.map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.05 }}
								className="break-inside-avoid relative group overflow-hidden bg-white/5"
							>
								{item.type === "image" ? (
									<Image
										src={item.src || "/placeholder.svg"}
										alt={`${event.title} photo ${i}`}
										width={800}
										height={
											item.aspect === "portrait"
												? 1200
												: item.aspect === "landscape"
												? 450
												: 800
										}
										className="w-full object-cover transition-all duration-700 group-hover:scale-110"
										unoptimized={
											item.src.startsWith("http") ||
											item.src.includes("placeholder")
										}
									/>
								) : (
									<video
										className="w-full object-cover group-hover:scale-110 transition-all duration-700"
										autoPlay
										muted
										loop
										playsInline
									>
										<source src={item.src} type="video/mp4" />
									</video>
								)}
								<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</motion.div>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
