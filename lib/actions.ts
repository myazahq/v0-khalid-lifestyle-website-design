"use server";

import { revalidateTag } from "next/cache";
import {
	createEvent,
	updateEvent,
	deleteEvent,
	addMediaToEvent,
	removeMediaFromEvent,
} from "./firestore-services";
import type { PastEvent, GalleryItem } from "./events";

/**
 * Create an event and revalidate the cache
 */
export async function createEventAction(
	eventData: Omit<PastEvent, "id" | "items">
) {
	const result = await createEvent(eventData);
	if (result.success) {
		revalidateTag("events", {});
	}
	return result;
}

/**
 * Update an event and revalidate the cache
 */
export async function updateEventAction(
	eventId: string,
	updates: Partial<PastEvent>
) {
	const result = await updateEvent(eventId, updates);
	if (result.success) {
		revalidateTag("events", {});
	}
	return result;
}

/**
 * Delete an event and revalidate the cache
 */
export async function deleteEventAction(eventId: string) {
	const result = await deleteEvent(eventId);
	if (result.success) {
		revalidateTag("events", {});
	}
	return result;
}

/**
 * Add media items to an event and revalidate the cache
 */
export async function addMediaToEventAction(
	eventId: string,
	mediaItems: GalleryItem[]
) {
	const result = await addMediaToEvent(eventId, mediaItems);
	if (result.success) {
		revalidateTag("events", {});
	}
	return result;
}

/**
 * Remove a media item from an event and revalidate the cache
 */
export async function removeMediaFromEventAction(
	eventId: string,
	mediaIndex: number
) {
	const result = await removeMediaFromEvent(eventId, mediaIndex);
	if (result.success) {
		revalidateTag("events", {});
	}
	return result;
}
