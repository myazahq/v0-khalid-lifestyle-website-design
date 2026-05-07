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
	orderBy,
	Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { TableReservation, CreateTableReservationInput } from "./reservation-types";

const RESERVATIONS_COLLECTION = "table_reservations";

function generateCancelToken(): string {
	return crypto.randomUUID();
}

function convertTimestamp(ts: Timestamp | string): string {
	if (ts instanceof Timestamp) return ts.toDate().toISOString();
	return ts;
}

function docToReservation(id: string, d: ReturnType<typeof Object.assign>): TableReservation {
	return {
		id,
		firstName: d.firstName,
		lastName: d.lastName,
		email: d.email,
		phone: d.phone,
		date: d.date,
		time: d.time,
		numberOfGuests: d.numberOfGuests,
		tablePreference: d.tablePreference,
		occasion: d.occasion,
		specialRequests: d.specialRequests,
		dietaryNeeds: d.dietaryNeeds,
		status: d.status,
		cancellationReason: d.cancellationReason,
		cancelToken: d.cancelToken,
		createdAt: convertTimestamp(d.createdAt),
		updatedAt: convertTimestamp(d.updatedAt),
	};
}

export async function createTableReservation(
	input: CreateTableReservationInput
): Promise<{ success: boolean; id?: string; error?: string }> {
	try {
		const cancelToken = generateCancelToken();
		const ref = collection(db, RESERVATIONS_COLLECTION);
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
		console.error("[reservation] Error creating reservation:", error);
		return { success: false, error: "Failed to create reservation" };
	}
}

export async function getReservationById(reservationId: string): Promise<TableReservation | null> {
	try {
		const ref = doc(db, RESERVATIONS_COLLECTION, reservationId);
		const snap = await getDoc(ref);
		if (!snap.exists()) return null;
		return docToReservation(snap.id, snap.data());
	} catch (error) {
		console.error("[reservation] Error fetching reservation:", error);
		return null;
	}
}

export async function getReservationByToken(token: string): Promise<TableReservation | null> {
	try {
		const ref = collection(db, RESERVATIONS_COLLECTION);
		const q = query(ref, where("cancelToken", "==", token));
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const docSnap = snap.docs[0];
		return docToReservation(docSnap.id, docSnap.data());
	} catch (error) {
		console.error("[reservation] Error fetching reservation by token:", error);
		return null;
	}
}

export async function cancelTableReservation(
	reservationId: string,
	reason: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const ref = doc(db, RESERVATIONS_COLLECTION, reservationId);
		await updateDoc(ref, {
			status: "cancelled",
			cancellationReason: reason,
			updatedAt: Timestamp.now(),
		});
		return { success: true };
	} catch (error) {
		console.error("[reservation] Error cancelling reservation:", error);
		return { success: false, error: "Failed to cancel reservation" };
	}
}

export async function getAllReservations(): Promise<TableReservation[]> {
	try {
		const ref = collection(db, RESERVATIONS_COLLECTION);
		const snap = await getDocs(ref);
		const results = snap.docs.map((docSnap) => docToReservation(docSnap.id, docSnap.data()));
		return results.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	} catch (error) {
		console.error("[reservation] Error fetching all reservations:", error);
		return [];
	}
}
