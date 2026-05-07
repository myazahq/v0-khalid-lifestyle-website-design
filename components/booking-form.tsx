"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Mail, CheckCircle, Loader2 } from "lucide-react";
import { submitReservationAction } from "@/lib/reservation-actions";
import type { CreateTableReservationInput, TablePreference, OccasionType } from "@/lib/reservation-types";
import { OCCASION_LABELS, TIME_SLOTS } from "@/lib/reservation-types";

const OCCASIONS = Object.entries(OCCASION_LABELS) as [OccasionType, string][];

export function BookingForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<CreateTableReservationInput>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		date: "",
		time: "",
		numberOfGuests: 2,
		tablePreference: "general",
		occasion: "other",
		specialRequests: "",
		dietaryNeeds: "",
	});

	function set<K extends keyof CreateTableReservationInput>(
		key: K,
		value: CreateTableReservationInput[K]
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	const today = new Date().toISOString().split("T")[0];

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!form.date || !form.time) {
			setError("Please select a date and time.");
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await submitReservationAction(form);
			if (result.success) {
				setSubmitted(true);
			} else {
				setError(result.error || "Something went wrong. Please try again.");
			}
		} catch {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section id="booking" className="py-24 px-6 md:px-12 bg-[#080808]">
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
				<div>
					<span className="text-gold text-xs uppercase tracking-[0.3em] mb-6 block">
						Reserve Your Experience
					</span>
					<h2 className="text-4xl md:text-7xl font-serif mb-8 leading-tight">
						Book the <br /> <span className="italic">Lifestyle</span>
					</h2>
					<p className="text-muted-foreground mb-12 max-w-md leading-relaxed">
						Reserve your table for any evening — no event required. Choose your
						date, time, and preference. We handle the rest.
					</p>

					<div className="space-y-8">
						<div className="flex items-center gap-6 group">
							<div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-gold transition-colors">
								<Instagram size={18} />
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
									Follow Us
								</p>
								<p className="text-sm tracking-widest group-hover:text-gold transition-colors">
									@KhalidLifestyle
								</p>
							</div>
						</div>
						<div className="flex items-center gap-6 group">
							<div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-gold transition-colors">
								<Mail size={18} />
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
									Email
								</p>
								<p className="text-sm tracking-widest group-hover:text-gold transition-colors">
									events@khalidlifestyle.com
								</p>
							</div>
						</div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					className="bg-white/5 p-8 md:p-12 border border-white/5"
				>
					{submitted ? (
						<div className="flex flex-col items-center justify-center h-full py-16 text-center">
							<CheckCircle className="text-gold mb-6" size={48} />
							<h3 className="text-2xl font-serif mb-3">Reservation Confirmed</h3>
							<p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
								We&apos;ve sent a confirmation to{" "}
								<span className="text-white">{form.email}</span>. We look forward
								to welcoming you.
							</p>
							<button
								onClick={() => {
									setSubmitted(false);
									setForm({
										firstName: "",
										lastName: "",
										email: "",
										phone: "",
										date: "",
										time: "",
										numberOfGuests: 2,
										tablePreference: "general",
										occasion: "other",
										specialRequests: "",
										dietaryNeeds: "",
									});
								}}
								className="mt-8 text-xs uppercase tracking-[0.3em] text-gold hover:underline"
							>
								Make another reservation
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										First Name
									</label>
									<Input
										required
										value={form.firstName}
										onChange={(e) => set("firstName", e.target.value)}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
										placeholder="First"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Last Name
									</label>
									<Input
										required
										value={form.lastName}
										onChange={(e) => set("lastName", e.target.value)}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
										placeholder="Last"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Email
									</label>
									<Input
										required
										type="email"
										value={form.email}
										onChange={(e) => set("email", e.target.value)}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
										placeholder="your@email.com"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Phone
									</label>
									<Input
										required
										type="tel"
										value={form.phone}
										onChange={(e) => set("phone", e.target.value)}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
										placeholder="+1 (000) 000-0000"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Date
									</label>
									<Input
										required
										type="date"
										min={today}
										value={form.date}
										onChange={(e) => set("date", e.target.value)}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Time
									</label>
									<select
										required
										value={form.time}
										onChange={(e) => set("time", e.target.value)}
										className="w-full h-12 bg-transparent border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
									>
										<option value="" disabled className="bg-[#0a0a0a]">
											Select a time
										</option>
										{TIME_SLOTS.map((slot) => (
											<option key={slot} value={slot} className="bg-[#0a0a0a]">
												{slot}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Guests
									</label>
									<Input
										required
										type="number"
										min={1}
										max={20}
										value={form.numberOfGuests}
										onChange={(e) => set("numberOfGuests", Number(e.target.value))}
										className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
										Table Preference
									</label>
									<select
										value={form.tablePreference}
										onChange={(e) =>
											set("tablePreference", e.target.value as TablePreference)
										}
										className="w-full h-12 bg-transparent border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
									>
										<option value="general" className="bg-[#0a0a0a]">
											General Table
										</option>
										<option value="vip" className="bg-[#0a0a0a]">
											VIP Table
										</option>
									</select>
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
									Occasion
								</label>
								<select
									value={form.occasion}
									onChange={(e) => set("occasion", e.target.value as OccasionType)}
									className="w-full h-12 bg-transparent border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
								>
									{OCCASIONS.map(([key, label]) => (
										<option key={key} value={key} className="bg-[#0a0a0a]">
											{label}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
									Special Requests
								</label>
								<Textarea
									value={form.specialRequests}
									onChange={(e) => set("specialRequests", e.target.value)}
									className="bg-transparent border-white/10 rounded-none min-h-[100px] focus-visible:ring-gold"
									placeholder="Flowers, special setup, etc."
								/>
							</div>

							<div className="space-y-2">
								<label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
									Dietary Needs
								</label>
								<Input
									value={form.dietaryNeeds}
									onChange={(e) => set("dietaryNeeds", e.target.value)}
									className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
									placeholder="Vegetarian, gluten-free, allergies..."
								/>
							</div>

							{error && (
								<p className="text-red-400 text-xs text-center">{error}</p>
							)}

							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-gold text-black rounded-none h-14 uppercase tracking-[0.3em] text-xs font-bold hover:bg-gold/80 transition-all disabled:opacity-60"
							>
								{isSubmitting ? (
									<span className="flex items-center gap-2">
										<Loader2 size={16} className="animate-spin" />
										Reserving...
									</span>
								) : (
									"Reserve My Table"
								)}
							</Button>
						</form>
					)}
				</motion.div>
			</div>
		</section>
	);
}
