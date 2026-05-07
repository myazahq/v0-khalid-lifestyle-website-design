export type TablePreference = "vip" | "general";
export type RsvpStatus = "confirmed" | "cancelled";

export interface Rsvp {
	id: string;
	eventId: string;
	eventTitle: string;
	eventSlug: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	numberOfGuests: number;
	tablePreference: TablePreference;
	specialRequests: string;
	dietaryNeeds: string;
	status: RsvpStatus;
	cancellationReason?: string;
	cancelToken: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateRsvpInput {
	eventId: string;
	eventTitle: string;
	eventSlug: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	numberOfGuests: number;
	tablePreference: TablePreference;
	specialRequests: string;
	dietaryNeeds: string;
}
