"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Download, Users, CheckCircle, XCircle, CalendarDays, Mail, X, Send } from "lucide-react";
import { getAllReservations } from "@/lib/reservation-services";
import { sendBulkEmailAction } from "@/lib/bulk-email-actions";
import type { TableReservation } from "@/lib/reservation-types";
import { OCCASION_LABELS } from "@/lib/reservation-types";

export default function AdminReservationsPage() {
	const [reservations, setReservations] = useState<TableReservation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled">("all");

	const [showEmailModal, setShowEmailModal] = useState(false);
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [emailResult, setEmailResult] = useState<{ sent: number; failed: number } | null>(null);

	useEffect(() => {
		getAllReservations().then((data) => {
			setReservations(data);
			setIsLoading(false);
		});
	}, []);

	const filtered = reservations.filter(
		(r) => filter === "all" || r.status === filter
	);
	const confirmed = reservations.filter((r) => r.status === "confirmed");
	const cancelled = reservations.filter((r) => r.status === "cancelled");
	const totalGuests = confirmed.reduce((sum, r) => sum + r.numberOfGuests, 0);

	const uniqueRecipients = Array.from(
		new Map(filtered.map((r) => [r.email, { email: r.email, firstName: r.firstName }])).values()
	);

	const handleSendBulkEmail = async () => {
		setIsSending(true);
		setEmailResult(null);
		const result = await sendBulkEmailAction({
			recipients: uniqueRecipients,
			subject: emailSubject,
			body: emailBody,
		});
		setIsSending(false);
		if (result.success) {
			setEmailResult({ sent: result.sent, failed: result.failed });
			setEmailSubject("");
			setEmailBody("");
		}
	};

	const closeModal = () => {
		setShowEmailModal(false);
		setEmailSubject("");
		setEmailBody("");
		setEmailResult(null);
	};

	const exportCsv = () => {
		const rows = [
			[
				"First Name",
				"Last Name",
				"Email",
				"Phone",
				"Date",
				"Time",
				"Guests",
				"Table",
				"Occasion",
				"Dietary Needs",
				"Special Requests",
				"Status",
				"Cancellation Reason",
				"Booked On",
			],
			...filtered.map((r) => [
				r.firstName,
				r.lastName,
				r.email,
				r.phone,
				r.date,
				r.time,
				String(r.numberOfGuests),
				r.tablePreference === "vip" ? "VIP" : "General",
				OCCASION_LABELS[r.occasion] ?? r.occasion,
				r.dietaryNeeds,
				r.specialRequests,
				r.status,
				r.cancellationReason || "",
				new Date(r.createdAt).toLocaleDateString(),
			]),
		];
		const csv = rows
			.map((row) =>
				row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
			)
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `table-reservations-${filter}-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	if (isLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<p className="text-muted-foreground">Loading reservations...</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex-1 p-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h1 className="text-3xl font-serif font-bold">Table Reservations</h1>
							<p className="text-muted-foreground mt-1">
								General bookings — not tied to a specific event
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								onClick={() => setShowEmailModal(true)}
								disabled={filtered.length === 0}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Mail className="mr-2 h-4 w-4" />
								Email All ({uniqueRecipients.length})
							</Button>
							<Button
								onClick={exportCsv}
								variant="outline"
								disabled={filtered.length === 0}
							>
								<Download className="mr-2 h-4 w-4" />
								Export CSV
							</Button>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-4 mb-8">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Total Reservations</CardDescription>
								<CardTitle className="text-4xl font-bold text-primary">
									{reservations.length}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Confirmed</CardDescription>
								<CardTitle className="text-4xl font-bold text-green-500">
									{confirmed.length}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Cancelled</CardDescription>
								<CardTitle className="text-4xl font-bold text-red-400">
									{cancelled.length}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Total Guests</CardDescription>
								<CardTitle className="text-4xl font-bold text-primary flex items-center gap-2">
									<Users className="h-6 w-6" />
									{totalGuests}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Reservations</CardTitle>
									<CardDescription>{filtered.length} entries</CardDescription>
								</div>
								<div className="flex gap-2">
									{(["all", "confirmed", "cancelled"] as const).map((f) => (
										<button
											key={f}
											onClick={() => setFilter(f)}
											className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
												filter === f
													? "border-primary bg-primary/10 text-primary"
													: "border-border text-muted-foreground hover:border-primary/50"
											}`}
										>
											{f}
										</button>
									))}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{filtered.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
									<CalendarDays className="h-10 w-10 opacity-30" />
									<p>No {filter === "all" ? "" : filter} reservations yet.</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-border">
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Guest
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Contact
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Date & Time
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Guests
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Table
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Occasion
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Notes
												</th>
												<th className="text-left py-3 px-4 text-muted-foreground font-medium">
													Status
												</th>
											</tr>
										</thead>
										<tbody>
											{filtered.map((r) => (
												<tr
													key={r.id}
													className="border-b border-border/50 hover:bg-muted/30 transition-colors"
												>
													<td className="py-4 px-4">
														<p className="font-medium">
															{r.firstName} {r.lastName}
														</p>
														<p className="text-muted-foreground text-xs">
															Booked {new Date(r.createdAt).toLocaleDateString()}
														</p>
													</td>
													<td className="py-4 px-4">
														<p className="text-muted-foreground">{r.email}</p>
														<p className="text-muted-foreground text-xs">
															{r.phone}
														</p>
													</td>
													<td className="py-4 px-4 whitespace-nowrap">
														<p className="font-medium">
															{new Date(r.date).toLocaleDateString("en-US", {
																month: "short",
																day: "numeric",
																year: "numeric",
															})}
														</p>
														<p className="text-muted-foreground text-xs">
															{r.time}
														</p>
													</td>
													<td className="py-4 px-4 text-center font-medium">
														{r.numberOfGuests}
													</td>
													<td className="py-4 px-4">
														<span
															className={`text-xs px-2 py-1 uppercase tracking-widest ${
																r.tablePreference === "vip"
																	? "bg-yellow-500/10 text-yellow-500"
																	: "bg-muted text-muted-foreground"
															}`}
														>
															{r.tablePreference === "vip" ? "VIP" : "General"}
														</span>
													</td>
													<td className="py-4 px-4 text-muted-foreground text-xs">
														{OCCASION_LABELS[r.occasion] ?? r.occasion}
													</td>
													<td className="py-4 px-4 max-w-[180px]">
														{r.dietaryNeeds && (
															<p
																className="text-xs text-muted-foreground truncate"
																title={r.dietaryNeeds}
															>
																🍽 {r.dietaryNeeds}
															</p>
														)}
														{r.specialRequests && (
															<p
																className="text-xs text-muted-foreground truncate"
																title={r.specialRequests}
															>
																✏️ {r.specialRequests}
															</p>
														)}
														{r.status === "cancelled" &&
															r.cancellationReason && (
																<p
																	className="text-xs text-red-400 truncate"
																	title={r.cancellationReason}
																>
																	❌ {r.cancellationReason}
																</p>
															)}
													</td>
													<td className="py-4 px-4">
														{r.status === "confirmed" ? (
															<span className="flex items-center gap-1.5 text-green-500 text-xs">
																<CheckCircle className="h-3.5 w-3.5" /> Confirmed
															</span>
														) : (
															<span className="flex items-center gap-1.5 text-red-400 text-xs">
																<XCircle className="h-3.5 w-3.5" /> Cancelled
															</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
			{showEmailModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
					<div className="bg-card border border-border rounded-none w-full max-w-lg mx-4 p-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-lg font-serif font-bold">Send Bulk Email</h2>
								<p className="text-sm text-muted-foreground mt-0.5">
									{uniqueRecipients.length} unique recipient{uniqueRecipients.length !== 1 ? "s" : ""} ({filter} filter)
								</p>
							</div>
							<button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
								<X className="h-5 w-5" />
							</button>
						</div>

						{emailResult ? (
							<div className="space-y-4">
								<div className={`p-4 border ${emailResult.failed === 0 ? "border-green-500/30 bg-green-500/10" : "border-yellow-500/30 bg-yellow-500/10"}`}>
									<p className="text-sm font-medium">
										{emailResult.sent} email{emailResult.sent !== 1 ? "s" : ""} sent successfully.
										{emailResult.failed > 0 && ` ${emailResult.failed} failed.`}
									</p>
								</div>
								<Button onClick={closeModal} className="w-full">Close</Button>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject</label>
									<input
										type="text"
										value={emailSubject}
										onChange={(e) => setEmailSubject(e.target.value)}
										placeholder="Email subject..."
										className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
									/>
								</div>
								<div>
									<label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 block">Message</label>
									<textarea
										value={emailBody}
										onChange={(e) => setEmailBody(e.target.value)}
										placeholder="Write your message here..."
										rows={6}
										className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
									/>
								</div>
								<div className="flex gap-3">
									<Button variant="outline" onClick={closeModal} className="flex-1" disabled={isSending}>
										Cancel
									</Button>
									<Button
										onClick={handleSendBulkEmail}
										className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
										disabled={isSending || !emailSubject.trim() || !emailBody.trim()}
									>
										{isSending ? (
											<span className="flex items-center gap-2">
												<span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
												Sending...
											</span>
										) : (
											<span className="flex items-center gap-2">
												<Send className="h-3.5 w-3.5" />
												Send to {uniqueRecipients.length}
											</span>
										)}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
