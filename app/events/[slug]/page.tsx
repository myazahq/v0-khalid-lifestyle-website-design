"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { getEventBySlug } from "@/lib/firestore-services";
import { getConfirmedRsvpCount } from "@/lib/rsvp-services";
import { submitRsvpAction } from "@/lib/rsvp-actions";
import { formatDateString } from "@/lib/utils";
import type { PastEvent } from "@/lib/events";

type FormState = "idle" | "loading" | "success" | "error" | "full";

const INITIAL_FORM = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	numberOfGuests: 1,
	tablePreference: "general" as "vip" | "general",
	specialRequests: "",
	dietaryNeeds: "",
};

export default function RsvpPage() {
	const { slug } = useParams<{ slug: string }>();
	const [event, setEvent] = useState<PastEvent | null>(null);
	const [confirmedCount, setConfirmedCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [form, setForm] = useState(INITIAL_FORM);
	const [formState, setFormState] = useState<FormState>("idle");
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		async function load() {
			const ev = await getEventBySlug(slug);
			setEvent(ev);
			if (ev) {
				const count = await getConfirmedRsvpCount(ev.id);
				setConfirmedCount(count);
			}
			setIsLoading(false);
		}
		load();
	}, [slug]);

	const isFullyBooked =
		event?.tableLimit !== undefined && confirmedCount >= event.tableLimit;

	const spotsLeft =
		event?.tableLimit !== undefined
			? Math.max(0, event.tableLimit - confirmedCount)
			: null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isFullyBooked) return;
		setFormState("loading");
		setErrorMsg("");

		try {
			const result = await submitRsvpAction({
				eventId: event!.id,
				eventTitle: event!.title,
				eventSlug: slug,
				...form,
			});

			if (result.success) {
				setFormState("success");
			} else {
				setErrorMsg(result.error || "Something went wrong. Please try again.");
				setFormState("error");
			}
		} catch {
			setErrorMsg("Something went wrong. Please try again.");
			setFormState("error");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#050505] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!event) {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white">
				<h1 className="text-3xl font-serif">Event Not Found</h1>
				<Link href="/" className="text-gold text-sm uppercase tracking-widest hover:underline">
					Return Home
				</Link>
			</div>
		);
	}

	if (formState === "success") {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 text-white">
				<CheckCircle className="w-16 h-16 text-gold mb-6" />
				<h1 className="text-4xl font-serif mb-4">Reservation Confirmed</h1>
				<p className="text-white/60 text-center max-w-md mb-2">
					Thank you, <span className="text-white">{form.firstName}</span>. Your table has been reserved for{" "}
					<span className="text-gold">{event.title}</span>.
				</p>
				<p className="text-white/40 text-sm text-center mb-8">
					A confirmation email has been sent to {form.email} with a link to cancel if needed.
				</p>
				<Link href="/" className="text-[10px] uppercase tracking-[0.3em] border border-gold text-gold px-8 py-3 hover:bg-gold hover:text-black transition-colors">
					Back to Home
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white">
			<div className="relative h-[45vh] overflow-hidden">
				<Image
					src={event.thumbnail || "/placeholder.svg"}
					alt={event.title}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#050505]" />
				<div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
					<Link href="/" className="inline-flex items-center gap-2 text-white/50 text-xs uppercase tracking-widest mb-6 hover:text-white transition-colors">
						<ArrowLeft size={14} />
						KhalidLifestyle
					</Link>
					<span className="block text-gold text-xs uppercase tracking-[0.3em] mb-3">Reserve Your Table</span>
					<h1 className="text-4xl md:text-6xl font-serif">{event.title}</h1>
					<div className="flex flex-wrap gap-6 mt-4">
						{event.date && (
							<div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
								<Calendar size={14} className="text-gold" />
								{formatDateString(String(event.date))}
							</div>
						)}
						<div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
							<MapPin size={14} className="text-gold" />
							{event.location}
						</div>
						{spotsLeft !== null && (
							<div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
								<Users size={14} className="text-gold" />
								{isFullyBooked ? (
									<span className="text-red-400">Fully Booked</span>
								) : (
									<span>{spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining</span>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="max-w-2xl mx-auto px-6 py-16">
				{isFullyBooked ? (
					<div className="text-center py-16 border border-white/10">
						<AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
						<h2 className="text-2xl font-serif mb-3">Fully Booked</h2>
						<p className="text-white/50 text-sm">All tables for this event have been reserved.</p>
					</div>
				) : (
					<>
						<div className="mb-10">
							<span className="text-gold text-xs uppercase tracking-[0.3em] mb-3 block">The Details</span>
							<p className="text-white/60 leading-relaxed">{event.description}</p>
						</div>

						{formState === "error" && (
							<div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
								{errorMsg}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										First Name <span className="text-gold">*</span>
									</label>
									<input
										required
										value={form.firstName}
										onChange={e => setForm({ ...form, firstName: e.target.value })}
										className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
										placeholder="First name"
										disabled={formState === "loading"}
									/>
								</div>
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										Last Name <span className="text-gold">*</span>
									</label>
									<input
										required
										value={form.lastName}
										onChange={e => setForm({ ...form, lastName: e.target.value })}
										className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
										placeholder="Last name"
										disabled={formState === "loading"}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										Email Address <span className="text-gold">*</span>
									</label>
									<input
										required
										type="email"
										value={form.email}
										onChange={e => setForm({ ...form, email: e.target.value })}
										className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
										placeholder="your@email.com"
										disabled={formState === "loading"}
									/>
								</div>
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										Phone Number <span className="text-gold">*</span>
									</label>
									<input
										required
										type="tel"
										value={form.phone}
										onChange={e => setForm({ ...form, phone: e.target.value })}
										className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
										placeholder="+1 000 000 0000"
										disabled={formState === "loading"}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										Number of Guests <span className="text-gold">*</span>
									</label>
									<select
										value={form.numberOfGuests}
										onChange={e => setForm({ ...form, numberOfGuests: Number(e.target.value) })}
										className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
										disabled={formState === "loading"}
									>
										{Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
											<option key={n} value={n} className="bg-[#111]">
												{n} {n === 1 ? "Guest" : "Guests"}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
										Table Preference <span className="text-gold">*</span>
									</label>
									<div className="grid grid-cols-2 gap-3 pt-1">
										{(["general", "vip"] as const).map(pref => (
											<button
												key={pref}
												type="button"
												onClick={() => setForm({ ...form, tablePreference: pref })}
												className={`py-3 text-xs uppercase tracking-widest border transition-colors ${
													form.tablePreference === pref
														? "border-gold bg-gold/10 text-gold"
														: "border-white/10 text-white/40 hover:border-white/30"
												}`}
												disabled={formState === "loading"}
											>
												{pref === "vip" ? "VIP" : "General"}
											</button>
										))}
									</div>
								</div>
							</div>

							<div>
								<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
									Dietary Requirements
								</label>
								<input
									value={form.dietaryNeeds}
									onChange={e => setForm({ ...form, dietaryNeeds: e.target.value })}
									className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
									placeholder="e.g. Vegetarian, Gluten-free, Nut allergy"
									disabled={formState === "loading"}
								/>
							</div>

							<div>
								<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
									Special Requests
								</label>
								<textarea
									value={form.specialRequests}
									onChange={e => setForm({ ...form, specialRequests: e.target.value })}
									rows={3}
									className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
									placeholder="Any special arrangements or requests..."
									disabled={formState === "loading"}
								/>
							</div>

							<button
								type="submit"
								disabled={formState === "loading"}
								className="w-full py-4 bg-gold text-black text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{formState === "loading" ? "Reserving..." : "Reserve My Table"}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
