"use server";

import {
	createTableReservation,
	cancelTableReservation,
	getReservationByToken,
	getReservationById,
} from "./reservation-services";
import {
	sendReservationConfirmation,
	sendReservationCancellation,
	sendAdminReservationNotification,
	sendAdminReservationCancellationNotification,
} from "./email";
import type { CreateTableReservationInput } from "./reservation-types";
import { OCCASION_LABELS } from "./reservation-types";

export async function submitReservationAction(input: CreateTableReservationInput) {
	const result = await createTableReservation(input);
	if (!result.success || !result.id) {
		return { success: false, error: result.error };
	}

	const reservation = await getReservationById(result.id);
	if (reservation) {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const cancelLink = `${baseUrl}/reservations/cancel/${reservation.cancelToken}`;

		await Promise.allSettled([
			sendReservationConfirmation({
				to: input.email,
				firstName: input.firstName,
				date: input.date,
				time: input.time,
				numberOfGuests: input.numberOfGuests,
				tablePreference: input.tablePreference,
				occasion: OCCASION_LABELS[input.occasion] ?? input.occasion,
				cancelLink,
			}),
			sendAdminReservationNotification({ reservation, cancelLink }),
		]);
	}

	return { success: true, id: result.id };
}

export async function cancelReservationAction(token: string, reason: string) {
	const reservation = await getReservationByToken(token);
	if (!reservation) {
		return { success: false, error: "Reservation not found" };
	}
	if (reservation.status === "cancelled") {
		return { success: false, error: "This reservation is already cancelled" };
	}

	const result = await cancelTableReservation(reservation.id, reason);
	if (!result.success) {
		return { success: false, error: result.error };
	}

	await Promise.allSettled([
		sendReservationCancellation({
			to: reservation.email,
			firstName: reservation.firstName,
			date: reservation.date,
			reason,
		}),
		sendAdminReservationCancellationNotification({ reservation, reason }),
	]);

	return { success: true };
}
