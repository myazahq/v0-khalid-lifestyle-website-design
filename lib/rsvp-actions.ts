"use server";

import {
	createRsvp,
	cancelRsvp,
	getRsvpByToken,
	getRsvpById,
} from "./rsvp-services";
import {
	sendRsvpConfirmation,
	sendRsvpCancellation,
	sendAdminRsvpNotification,
	sendAdminCancellationNotification,
} from "./email";
import type { CreateRsvpInput } from "./rsvp-types";

export async function submitRsvpAction(input: CreateRsvpInput) {
	const result = await createRsvp(input);
	if (!result.success || !result.id) {
		return { success: false, error: result.error };
	}

	const rsvpRecord = await getRsvpById(result.id);
	if (rsvpRecord) {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const cancelLink = `${baseUrl}/events/${input.eventSlug}/cancel/${rsvpRecord.cancelToken}`;

		await Promise.allSettled([
			sendRsvpConfirmation({
				to: input.email,
				firstName: input.firstName,
				eventTitle: input.eventTitle,
				eventSlug: input.eventSlug,
				numberOfGuests: input.numberOfGuests,
				tablePreference: input.tablePreference,
				cancelLink,
			}),
			sendAdminRsvpNotification({
				rsvp: rsvpRecord,
				cancelLink,
			}),
		]);
	}

	return { success: true, id: result.id };
}

export async function cancelRsvpAction(token: string, reason: string) {
	const rsvp = await getRsvpByToken(token);
	if (!rsvp) {
		return { success: false, error: "RSVP not found" };
	}
	if (rsvp.status === "cancelled") {
		return { success: false, error: "This RSVP is already cancelled" };
	}

	const result = await cancelRsvp(rsvp.id, reason);
	if (!result.success) {
		return { success: false, error: result.error };
	}

	await Promise.allSettled([
		sendRsvpCancellation({
			to: rsvp.email,
			firstName: rsvp.firstName,
			eventTitle: rsvp.eventTitle,
			reason,
		}),
		sendAdminCancellationNotification({ rsvp, reason }),
	]);

	return { success: true };
}
