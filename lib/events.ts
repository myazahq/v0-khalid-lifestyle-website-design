export interface GalleryItem {
	type: "image" | "video";
	src: string;
	aspect: "portrait" | "landscape" | "square";
}

export interface PastEvent {
	id: string;
	title: string;
	date: Date | null | string;
	location: string;
	thumbnail: string;
	description: string;
	items: GalleryItem[];
	featured?: boolean;
}

const pastEvents: PastEvent[] = [
	{
		id: "london-fashion-week-2025",
		title: "London Fashion Week Afterparty",
		date: null,
		location: "The Mayfair Club",
		thumbnail: "/luxury-fashion-party.jpg",
		description:
			"An exclusive gathering of the fashion elite during London's most prestigious week.",
		items: Array.from({ length: 24 }).map((_, i) => ({
			type: i % 8 === 0 ? "video" : "image",
			src:
				i % 8 === 0
					? "https://assets.mixkit.co/videos/preview/mixkit-party-crowd-dancing-under-flashing-lights-4240-large.mp4"
					: `/placeholder.svg?height=${
							i % 3 === 0 ? 1200 : 800
					  }&width=800&query=luxury+nightlife+event+${i}`,
			aspect: i % 3 === 0 ? "portrait" : i % 3 === 1 ? "landscape" : "square",
		})),
	},
	{
		id: "summer-solstice-vips",
		title: "Summer Solstice VIP Gala",
		date: null,
		location: "Saint-Tropez",
		thumbnail: "/luxury-champagne-sparklers.jpg",
		description: "A sun-drenched celebration of luxury on the French Riviera.",
		items: Array.from({ length: 20 }).map((_, i) => ({
			type: "image",
			src: `/gallery/summer-${i + 1}.jpg`,
			aspect: i % 2 === 0 ? "landscape" : "portrait",
		})),
	},
	{
		id: "midnight-in-dubai",
		title: "Midnight in Dubai",
		date: null,
		location: "Burj Khalifa District",
		thumbnail: "/exclusive-vip-booth.jpg",
		description:
			"Neon lights and desert luxury at the heart of Dubai's nightlife scene.",
		items: Array.from({ length: 30 }).map((_, i) => ({
			type: "image",
			src: `/gallery/dubai-${i + 1}.jpg`,
			aspect: "square",
		})),
	},
];

import { Timestamp } from "firebase/firestore";
import { getAllEventsFromFirestore } from "./firestore-services";

export async function getAllEvents(): Promise<PastEvent[]> {
	// Fetch from Firestore
	const firestoreEvents = await getAllEventsFromFirestore();

	// If no Firestore events, return demo events
	if (firestoreEvents.length === 0) {
		return pastEvents;
	}

	return firestoreEvents;
}

export async function getHeroMedia() {
	const allEvents = await getAllEvents();
	const allMedia: { type: "image" | "video"; src: string }[] = [];

	// Get first 3 images from each event
	allEvents.forEach((event) => {
		const images = event.items
			.filter((item) => item.type === "image")
			.slice(0, 3);
		images.forEach((img) => allMedia.push({ type: "image", src: img.src }));
	});

	// Get videos from each event
	allEvents.forEach((event) => {
		const videos = event.items.filter((item) => item.type === "video");
		videos.forEach((vid) => allMedia.push({ type: "video", src: vid.src }));
	});

	// Add default media if no custom media exists
	if (allMedia.length === 0) {
		return [
			{ type: "image", src: "/luxury-nightclub-interior.jpg" },
			{ type: "image", src: "/champagne-sparklers-vip.jpg" },
			{ type: "image", src: "/luxury-fashion-party.jpg" },
			{ type: "video", src: "https://v0.blob.com/nightlife-sample-video.mp4" },
		];
	}

	return allMedia;
}
