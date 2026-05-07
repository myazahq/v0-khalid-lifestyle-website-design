export type TablePreference = "vip" | "general";
export type ReservationStatus = "confirmed" | "cancelled";
export type OccasionType =
	| "birthday"
	| "anniversary"
	| "business"
	| "date_night"
	| "celebration"
	| "other";

export interface TableReservation {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	date: string;
	time: string;
	numberOfGuests: number;
	tablePreference: TablePreference;
	occasion: OccasionType;
	specialRequests: string;
	dietaryNeeds: string;
	status: ReservationStatus;
	cancellationReason?: string;
	cancelToken: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTableReservationInput {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	date: string;
	time: string;
	numberOfGuests: number;
	tablePreference: TablePreference;
	occasion: OccasionType;
	specialRequests: string;
	dietaryNeeds: string;
}

export const OCCASION_LABELS: Record<OccasionType, string> = {
	birthday: "Birthday",
	anniversary: "Anniversary",
	business: "Business Dinner",
	date_night: "Date Night",
	celebration: "Celebration",
	other: "Other",
};

export const TIME_SLOTS = [
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
	"21:00",
	"21:30",
	"22:00",
	"22:30",
	"23:00",
];
