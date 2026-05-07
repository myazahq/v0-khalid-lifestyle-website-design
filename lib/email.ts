import { Resend } from "resend";
import type { Rsvp } from "./rsvp-types";
import type { TableReservation } from "./reservation-types";
import { OCCASION_LABELS } from "./reservation-types";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@khalidlifestyle.com";
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || "";

function tableLabel(pref: string) {
	return pref === "vip" ? "VIP Table" : "General Table";
}

export async function sendRsvpConfirmation({
	to,
	firstName,
	eventTitle,
	eventSlug,
	numberOfGuests,
	tablePreference,
	cancelLink,
}: {
	to: string;
	firstName: string;
	eventTitle: string;
	eventSlug: string;
	numberOfGuests: number;
	tablePreference: string;
	cancelLink: string;
}) {
	if (!process.env.RESEND_API_KEY) {
		console.warn("[email] RESEND_API_KEY not set — skipping confirmation email");
		return;
	}

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to,
		subject: `RSVP Confirmed — ${eventTitle}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 28px; color: #c9a84c; margin-bottom: 8px;">KhalidLifestyle</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 32px;" />
				<h2 style="font-size: 22px; margin-bottom: 16px;">Your RSVP is Confirmed</h2>
				<p>Dear ${firstName},</p>
				<p>We are delighted to confirm your reservation for <strong>${eventTitle}</strong>.</p>
				<table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Guests</td>
						<td style="padding: 10px; border: 1px solid #333;">${numberOfGuests}</td>
					</tr>
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Table</td>
						<td style="padding: 10px; border: 1px solid #333;">${tableLabel(tablePreference)}</td>
					</tr>
				</table>
				<p style="color: #999; font-size: 13px;">
					Need to cancel? <a href="${cancelLink}" style="color: #c9a84c;">Click here to cancel your reservation</a>.
				</p>
				<hr style="border-color: #222; margin-top: 40px;" />
				<p style="color: #555; font-size: 12px;">© KhalidLifestyle. All rights reserved.</p>
			</div>
		`,
	});
	if (error) console.error("[email] Confirmation send failed:", error);
}

export async function sendRsvpCancellation({
	to,
	firstName,
	eventTitle,
	reason,
}: {
	to: string;
	firstName: string;
	eventTitle: string;
	reason: string;
}) {
	if (!process.env.RESEND_API_KEY) return;

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to,
		subject: `RSVP Cancelled — ${eventTitle}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 28px; color: #c9a84c; margin-bottom: 8px;">KhalidLifestyle</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 32px;" />
				<h2 style="font-size: 22px; margin-bottom: 16px;">RSVP Cancelled</h2>
				<p>Dear ${firstName},</p>
				<p>Your reservation for <strong>${eventTitle}</strong> has been cancelled.</p>
				${reason ? `<p style="color: #999;">Reason: ${reason}</p>` : ""}
				<p>We hope to see you at a future event.</p>
				<hr style="border-color: #222; margin-top: 40px;" />
				<p style="color: #555; font-size: 12px;">© KhalidLifestyle. All rights reserved.</p>
			</div>
		`,
	});
	if (error) console.error("[email] Cancellation send failed:", error);
}

export async function sendAdminRsvpNotification({
	rsvp,
	cancelLink,
}: {
	rsvp: Rsvp;
	cancelLink: string;
}) {
	if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to: ADMIN_EMAIL,
		subject: `New RSVP — ${rsvp.eventTitle}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 24px; color: #c9a84c; margin-bottom: 8px;">New RSVP Received</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 24px;" />
				<p><strong>Event:</strong> ${rsvp.eventTitle}</p>
				<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Name</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.firstName} ${rsvp.lastName}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Email</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.email}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Phone</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.phone}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Guests</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.numberOfGuests}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Table</td><td style="padding: 8px; border: 1px solid #333;">${tableLabel(rsvp.tablePreference)}</td></tr>
					${rsvp.dietaryNeeds ? `<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Dietary</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.dietaryNeeds}</td></tr>` : ""}
					${rsvp.specialRequests ? `<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Special Requests</td><td style="padding: 8px; border: 1px solid #333;">${rsvp.specialRequests}</td></tr>` : ""}
				</table>
			</div>
		`,
	});
	if (error) console.error("[email] Admin RSVP notification failed:", error);
}

export async function sendAdminCancellationNotification({
	rsvp,
	reason,
}: {
	rsvp: Rsvp;
	reason: string;
}) {
	if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to: ADMIN_EMAIL,
		subject: `RSVP Cancelled — ${rsvp.eventTitle}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 24px; color: #c9a84c; margin-bottom: 8px;">RSVP Cancellation</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 24px;" />
				<p><strong>Event:</strong> ${rsvp.eventTitle}</p>
				<p><strong>Guest:</strong> ${rsvp.firstName} ${rsvp.lastName} (${rsvp.email})</p>
				<p><strong>Reason:</strong> ${reason || "No reason provided"}</p>
			</div>
		`,
	});
	if (error) console.error("[email] Admin cancellation notification failed:", error);
}

export async function sendReservationConfirmation({
	to,
	firstName,
	date,
	time,
	numberOfGuests,
	tablePreference,
	occasion,
	cancelLink,
}: {
	to: string;
	firstName: string;
	date: string;
	time: string;
	numberOfGuests: number;
	tablePreference: string;
	occasion: string;
	cancelLink: string;
}) {
	if (!process.env.RESEND_API_KEY) {
		console.warn("[email] RESEND_API_KEY not set — skipping reservation confirmation email");
		return;
	}

	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to,
		subject: `Table Reservation Confirmed — ${formattedDate}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 28px; color: #c9a84c; margin-bottom: 8px;">KhalidLifestyle</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 32px;" />
				<h2 style="font-size: 22px; margin-bottom: 16px;">Your Reservation is Confirmed</h2>
				<p>Dear ${firstName},</p>
				<p>We look forward to welcoming you. Your table reservation has been confirmed.</p>
				<table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Date</td>
						<td style="padding: 10px; border: 1px solid #333;">${formattedDate}</td>
					</tr>
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Time</td>
						<td style="padding: 10px; border: 1px solid #333;">${time}</td>
					</tr>
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Guests</td>
						<td style="padding: 10px; border: 1px solid #333;">${numberOfGuests}</td>
					</tr>
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Table</td>
						<td style="padding: 10px; border: 1px solid #333;">${tableLabel(tablePreference)}</td>
					</tr>
					<tr>
						<td style="padding: 10px; border: 1px solid #333; color: #999;">Occasion</td>
						<td style="padding: 10px; border: 1px solid #333;">${occasion}</td>
					</tr>
				</table>
				<p style="color: #999; font-size: 13px;">
					Need to cancel? <a href="${cancelLink}" style="color: #c9a84c;">Click here to cancel your reservation</a>.
				</p>
				<hr style="border-color: #222; margin-top: 40px;" />
				<p style="color: #555; font-size: 12px;">© KhalidLifestyle. All rights reserved.</p>
			</div>
		`,
	});
	if (error) console.error("[email] Reservation confirmation send failed:", error);
}

export async function sendReservationCancellation({
	to,
	firstName,
	date,
	reason,
}: {
	to: string;
	firstName: string;
	date: string;
	reason: string;
}) {
	if (!process.env.RESEND_API_KEY) return;

	const formattedDate = new Date(date).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to,
		subject: `Reservation Cancelled — ${formattedDate}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 28px; color: #c9a84c; margin-bottom: 8px;">KhalidLifestyle</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 32px;" />
				<h2 style="font-size: 22px; margin-bottom: 16px;">Reservation Cancelled</h2>
				<p>Dear ${firstName},</p>
				<p>Your table reservation for <strong>${formattedDate}</strong> has been cancelled.</p>
				${reason ? `<p style="color: #999;">Reason: ${reason}</p>` : ""}
				<p>We hope to welcome you on another occasion.</p>
				<hr style="border-color: #222; margin-top: 40px;" />
				<p style="color: #555; font-size: 12px;">© KhalidLifestyle. All rights reserved.</p>
			</div>
		`,
	});
	if (error) console.error("[email] Reservation cancellation send failed:", error);
}

export async function sendAdminReservationNotification({
	reservation,
	cancelLink,
}: {
	reservation: TableReservation;
	cancelLink: string;
}) {
	if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;

	const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to: ADMIN_EMAIL,
		subject: `New Table Reservation — ${formattedDate} at ${reservation.time}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 24px; color: #c9a84c; margin-bottom: 8px;">New Table Reservation</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 24px;" />
				<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Name</td><td style="padding: 8px; border: 1px solid #333;">${reservation.firstName} ${reservation.lastName}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Email</td><td style="padding: 8px; border: 1px solid #333;">${reservation.email}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Phone</td><td style="padding: 8px; border: 1px solid #333;">${reservation.phone}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Date</td><td style="padding: 8px; border: 1px solid #333;">${formattedDate}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Time</td><td style="padding: 8px; border: 1px solid #333;">${reservation.time}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Guests</td><td style="padding: 8px; border: 1px solid #333;">${reservation.numberOfGuests}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Table</td><td style="padding: 8px; border: 1px solid #333;">${tableLabel(reservation.tablePreference)}</td></tr>
					<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Occasion</td><td style="padding: 8px; border: 1px solid #333;">${OCCASION_LABELS[reservation.occasion] ?? reservation.occasion}</td></tr>
					${reservation.dietaryNeeds ? `<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Dietary</td><td style="padding: 8px; border: 1px solid #333;">${reservation.dietaryNeeds}</td></tr>` : ""}
					${reservation.specialRequests ? `<tr><td style="padding: 8px; border: 1px solid #333; color: #999;">Special Requests</td><td style="padding: 8px; border: 1px solid #333;">${reservation.specialRequests}</td></tr>` : ""}
				</table>
			</div>
		`,
	});
	if (error) console.error("[email] Admin reservation notification failed:", error);
}

export async function sendBulkEmail({
	recipients,
	subject,
	body,
}: {
	recipients: { email: string; firstName: string }[];
	subject: string;
	body: string;
}): Promise<{ sent: number; failed: number }> {
	if (!process.env.RESEND_API_KEY) {
		console.warn("[email] RESEND_API_KEY not set — skipping bulk email");
		return { sent: 0, failed: recipients.length };
	}

	const htmlBody = body.replace(/\n/g, "<br />");
	const results = await Promise.allSettled(
		recipients.map(({ email, firstName }) =>
			resend.emails.send({
				from: FROM_EMAIL,
				to: email,
				subject,
				html: `
					<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
						<h1 style="font-size: 28px; color: #c9a84c; margin-bottom: 8px;">KhalidLifestyle</h1>
						<hr style="border-color: #c9a84c; margin-bottom: 32px;" />
						<p>Dear ${firstName},</p>
						<div style="line-height: 1.7;">${htmlBody}</div>
						<hr style="border-color: #222; margin-top: 40px;" />
						<p style="color: #555; font-size: 12px;">© KhalidLifestyle. All rights reserved.</p>
					</div>
				`,
			})
		)
	);

	const sent = results.filter((r) => r.status === "fulfilled").length;
	const failed = results.filter((r) => r.status === "rejected").length;
	if (failed > 0) console.error(`[email] Bulk send: ${failed} failed out of ${recipients.length}`);
	return { sent, failed };
}

export async function sendAdminReservationCancellationNotification({
	reservation,
	reason,
}: {
	reservation: TableReservation;
	reason: string;
}) {
	if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;

	const { error } = await resend.emails.send({
		from: FROM_EMAIL,
		to: ADMIN_EMAIL,
		subject: `Reservation Cancelled — ${reservation.firstName} ${reservation.lastName}`,
		html: `
			<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px;">
				<h1 style="font-size: 24px; color: #c9a84c; margin-bottom: 8px;">Reservation Cancellation</h1>
				<hr style="border-color: #c9a84c; margin-bottom: 24px;" />
				<p><strong>Guest:</strong> ${reservation.firstName} ${reservation.lastName} (${reservation.email})</p>
				<p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}</p>
				<p><strong>Reason:</strong> ${reason || "No reason provided"}</p>
			</div>
		`,
	});
	if (error) console.error("[email] Admin reservation cancellation notification failed:", error);
}
