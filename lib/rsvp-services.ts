"use server";

import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	query,
	where,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Rsvp, CreateRsvpInput } from "./rsvp-types";

const RSVPS_COLLECTION = "rsvps";

function generateCancelToken(): string {
	return crypto.randomUUID();
}

function convertTimestamp(ts: Timestamp | string): string {
	if (ts instanceof Timestamp) return ts.toDate().toISOString();
	return ts;
}

export async function createRsvp(
	input: CreateRsvpInput
): Promise<{ success: boolean; id?: string; error?: string }> {
	try {
		const cancelToken = generateCancelToken();
		const ref = collection(db, RSVPS_COLLECTION);
		const docRef = await addDoc(ref, {
			...input,
			status: "confirmed",
			cancellationReason: "",
			cancelToken,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});
		return { success: true, id: docRef.id };
	} catch (error) {
		console.error("[rsvp] Error creating RSVP:", error);
		return { success: false, error: "Failed to create RSVP" };
	}
}

export async function getRsvpById(rsvpId: string): Promise<Rsvp | null> {
	try {
		const ref = doc(db, RSVPS_COLLECTION, rsvpId);
		const snap = await getDoc(ref);
		if (!snap.exists()) return null;
		const d = snap.data();
		return {
			id: snap.id,
			eventId: d.eventId,
			eventTitle: d.eventTitle,
			eventSlug: d.eventSlug,
			firstName: d.firstName,
			lastName: d.lastName,
			email: d.email,
			phone: d.phone,
			numberOfGuests: d.numberOfGuests,
			tablePreference: d.tablePreference,
			specialRequests: d.specialRequests,
			dietaryNeeds: d.dietaryNeeds,
			status: d.status,
			cancellationReason: d.cancellationReason,
			cancelToken: d.cancelToken,
			createdAt: convertTimestamp(d.createdAt),
			updatedAt: convertTimestamp(d.updatedAt),
		};
	} catch (error) {
		console.error("[rsvp] Error fetching RSVP:", error);
		return null;
	}
}

export async function getRsvpByToken(token: string): Promise<Rsvp | null> {
	try {
		const ref = collection(db, RSVPS_COLLECTION);
		const q = query(ref, where("cancelToken", "==", token));
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const docSnap = snap.docs[0];
		const d = docSnap.data();
		return {
			id: docSnap.id,
			eventId: d.eventId,
			eventTitle: d.eventTitle,
			eventSlug: d.eventSlug,
			firstName: d.firstName,
			lastName: d.lastName,
			email: d.email,
			phone: d.phone,
			numberOfGuests: d.numberOfGuests,
			tablePreference: d.tablePreference,
			specialRequests: d.specialRequests,
			dietaryNeeds: d.dietaryNeeds,
			status: d.status,
			cancellationReason: d.cancellationReason,
			cancelToken: d.cancelToken,
			createdAt: convertTimestamp(d.createdAt),
			updatedAt: convertTimestamp(d.updatedAt),
		};
	} catch (error) {
		console.error("[rsvp] Error fetching RSVP by token:", error);
		return null;
	}
}

export async function cancelRsvp(
	rsvpId: string,
	reason: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const ref = doc(db, RSVPS_COLLECTION, rsvpId);
		await updateDoc(ref, {
			status: "cancelled",
			cancellationReason: reason,
			updatedAt: Timestamp.now(),
		});
		return { success: true };
	} catch (error) {
		console.error("[rsvp] Error cancelling RSVP:", error);
		return { success: false, error: "Failed to cancel RSVP" };
	}
}

export async function getRsvpsByEvent(eventId: string): Promise<Rsvp[]> {
	try {
		const ref = collection(db, RSVPS_COLLECTION);
		// Single-field filter only — avoids composite index requirement
		const q = query(ref, where("eventId", "==", eventId));
		const snap = await getDocs(q);
		const results = snap.docs.map((docSnap) => {
			const d = docSnap.data();
			return {
				id: docSnap.id,
				eventId: d.eventId,
				eventTitle: d.eventTitle,
				eventSlug: d.eventSlug,
				firstName: d.firstName,
				lastName: d.lastName,
				email: d.email,
				phone: d.phone,
				numberOfGuests: d.numberOfGuests,
				tablePreference: d.tablePreference,
				specialRequests: d.specialRequests,
				dietaryNeeds: d.dietaryNeeds,
				status: d.status,
				cancellationReason: d.cancellationReason,
				cancelToken: d.cancelToken,
				createdAt: convertTimestamp(d.createdAt),
				updatedAt: convertTimestamp(d.updatedAt),
			};
		});
		// Sort newest first in JS — avoids composite index requirement
		return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	} catch (error) {
		console.error("[rsvp] Error fetching RSVPs:", error);
		return [];
	}
}

export async function getAllRsvps(): Promise<Rsvp[]> {
	try {
		const ref = collection(db, RSVPS_COLLECTION);
		const snap = await getDocs(ref);
		const results = snap.docs.map((docSnap) => {
			const d = docSnap.data();
			return {
				id: docSnap.id,
				eventId: d.eventId,
				eventTitle: d.eventTitle,
				eventSlug: d.eventSlug,
				firstName: d.firstName,
				lastName: d.lastName,
				email: d.email,
				phone: d.phone,
				numberOfGuests: d.numberOfGuests,
				tablePreference: d.tablePreference,
				specialRequests: d.specialRequests,
				dietaryNeeds: d.dietaryNeeds,
				status: d.status,
				cancellationReason: d.cancellationReason,
				cancelToken: d.cancelToken,
				createdAt: convertTimestamp(d.createdAt),
				updatedAt: convertTimestamp(d.updatedAt),
			};
		});
		return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	} catch (error) {
		console.error("[rsvp] Error fetching all RSVPs:", error);
		return [];
	}
}

export async function getConfirmedRsvpCount(eventId: string): Promise<number> {
	try {
		const ref = collection(db, RSVPS_COLLECTION);
		// Single-field filter to avoid composite index; filter status in JS
		const q = query(ref, where("eventId", "==", eventId));
		const snap = await getDocs(q);
		return snap.docs.filter((d) => d.data().status === "confirmed").length;
	} catch (error) {
		console.error("[rsvp] Error counting RSVPs:", error);
		return 0;
	}
}
