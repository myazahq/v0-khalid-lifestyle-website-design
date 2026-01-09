import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	orderBy,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PastEvent, GalleryItem } from "./events";

const EVENTS_COLLECTION = "events";

// Convert Firestore timestamp to date string
function timestampToDateString(timestamp: Timestamp): string {
	const date = timestamp.toDate();
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Create a new event
export async function createEvent(eventData: Omit<PastEvent, "id" | "items">) {
	try {
		const eventsRef = collection(db, EVENTS_COLLECTION);
		const docRef = await addDoc(eventsRef, {
			...eventData,
			items: [],
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});
		return { success: true, id: docRef.id };
	} catch (error) {
		console.error("[v0] Error creating event:", error);
		return { success: false, error };
	}
}

// Get all events
export async function getAllEventsFromFirestore(): Promise<PastEvent[]> {
	try {
		const eventsRef = collection(db, EVENTS_COLLECTION);
		const q = query(eventsRef, orderBy("createdAt", "desc"));
		const querySnapshot = await getDocs(q);

		const events: PastEvent[] = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			events.push({
				id: doc.id,
				title: data.title,
				date: data.date,
				location: data.location,
				thumbnail: data.thumbnail,
				description: data.description,
				items: data.items || [],
			});
		});

		return events;
	} catch (error) {
		console.error("[v0] Error fetching events:", error);
		return [];
	}
}

// Get a single event by ID
export async function getEventById(eventId: string): Promise<PastEvent | null> {
	try {
		const eventRef = doc(db, EVENTS_COLLECTION, eventId);
		const eventDoc = await getDoc(eventRef);

		if (!eventDoc.exists()) {
			return null;
		}

		const data = eventDoc.data();
		return {
			id: eventDoc.id,
			title: data.title,
			date: data.date,
			location: data.location,
			thumbnail: data.thumbnail,
			description: data.description,
			items: data.items || [],
		};
	} catch (error) {
		console.error("[v0] Error fetching event:", error);
		return null;
	}
}

// Update an event
export async function updateEvent(
	eventId: string,
	updates: Partial<PastEvent>
) {
	try {
		const eventRef = doc(db, EVENTS_COLLECTION, eventId);
		await updateDoc(eventRef, {
			...updates,
			updatedAt: Timestamp.now(),
		});
		return { success: true };
	} catch (error) {
		console.error("[v0] Error updating event:", error);
		return { success: false, error };
	}
}

// Delete an event
export async function deleteEvent(eventId: string) {
	try {
		const eventRef = doc(db, EVENTS_COLLECTION, eventId);
		await deleteDoc(eventRef);
		return { success: true };
	} catch (error) {
		console.error("[v0] Error deleting event:", error);
		return { success: false, error };
	}
}

// Add media items to an event
export async function addMediaToEvent(
	eventId: string,
	mediaItems: GalleryItem[]
) {
	try {
		const event = await getEventById(eventId);
		if (!event) {
			return { success: false, error: "Event not found" };
		}

		const updatedItems = [...event.items, ...mediaItems];
		await updateEvent(eventId, { items: updatedItems });
		return { success: true };
	} catch (error) {
		console.error("[v0] Error adding media to event:", error);
		return { success: false, error };
	}
}

// Remove media item from an event
export async function removeMediaFromEvent(
	eventId: string,
	mediaIndex: number
) {
	try {
		const event = await getEventById(eventId);
		if (!event) {
			return { success: false, error: "Event not found" };
		}

		const updatedItems = event.items.filter((_, index) => index !== mediaIndex);
		await updateEvent(eventId, { items: updatedItems });
		return { success: true };
	} catch (error) {
		console.error("[v0] Error removing media from event:", error);
		return { success: false, error };
	}
}
