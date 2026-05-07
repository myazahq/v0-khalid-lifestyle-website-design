"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { getReservationByToken } from "@/lib/reservation-services";
import { cancelReservationAction } from "@/lib/reservation-actions";
import type { TableReservation } from "@/lib/reservation-types";

type PageState = "loading" | "found" | "already_cancelled" | "not_found" | "submitting" | "success" | "error";

export default function CancelReservationPage() {
	const { token } = useParams<{ token: string }>();
	const [reservation, setReservation] = useState<TableReservation | null>(null);
	const [pageState, setPageState] = useState<PageState>("loading");
	const [reason, setReason] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		async function load() {
			const found = await getReservationByToken(token);
			if (!found) {
				setPageState("not_found");
				return;
			}
			setReservation(found);
			setPageState(found.status === "cancelled" ? "already_cancelled" : "found");
		}
		load();
	}, [token]);

	const handleCancel = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!reason.trim()) return;
		setPageState("submitting");

		try {
			const result = await cancelReservationAction(token, reason);
			if (result.success) {
				setPageState("success");
			} else {
				setErrorMsg(result.error || "Something went wrong.");
				setPageState("error");
			}
		} catch {
			setErrorMsg("Something went wrong. Please try again.");
			setPageState("error");
		}
	};

	const formattedDate = reservation?.date
		? new Date(reservation.date).toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "";

	if (pageState === "loading") {
		return (
			<div className="min-h-screen bg-[#050505] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (pageState === "not_found") {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white px-6">
				<AlertCircle className="w-14 h-14 text-white/30" />
				<h1 className="text-3xl font-serif">Reservation Not Found</h1>
				<p className="text-white/40 text-sm text-center">
					This cancellation link is invalid or has expired.
				</p>
				<Link
					href="/"
					className="mt-4 text-[10px] uppercase tracking-[0.3em] border border-white/20 text-white/50 px-8 py-3 hover:border-gold hover:text-gold transition-colors"
				>
					Return Home
				</Link>
			</div>
		);
	}

	if (pageState === "already_cancelled") {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white px-6">
				<XCircle className="w-14 h-14 text-white/30" />
				<h1 className="text-3xl font-serif">Already Cancelled</h1>
				<p className="text-white/40 text-sm text-center">
					Your reservation for{" "}
					<span className="text-white">{formattedDate}</span> has already been
					cancelled.
				</p>
				<Link
					href="/"
					className="mt-4 text-[10px] uppercase tracking-[0.3em] border border-white/20 text-white/50 px-8 py-3 hover:border-gold hover:text-gold transition-colors"
				>
					Return Home
				</Link>
			</div>
		);
	}

	if (pageState === "success") {
		return (
			<div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white px-6">
				<CheckCircle className="w-14 h-14 text-gold" />
				<h1 className="text-3xl font-serif">Reservation Cancelled</h1>
				<p className="text-white/50 text-sm text-center max-w-sm">
					Your table reservation for{" "}
					<span className="text-white">{formattedDate}</span> has been cancelled.
					We hope to welcome you on another occasion.
				</p>
				<Link
					href="/"
					className="mt-4 text-[10px] uppercase tracking-[0.3em] border border-gold text-gold px-8 py-3 hover:bg-gold hover:text-black transition-colors"
				>
					Return Home
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
			<div className="w-full max-w-md">
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-serif mb-3">Cancel Reservation</h1>
					<p className="text-white/50 text-sm">
						You are about to cancel your table reservation for{" "}
						<span className="text-gold">{formattedDate}</span> at{" "}
						<span className="text-gold">{reservation?.time}</span>.
					</p>
					{reservation && (
						<p className="text-white/30 text-xs mt-2">
							{reservation.firstName} {reservation.lastName} ·{" "}
							{reservation.numberOfGuests}{" "}
							{reservation.numberOfGuests === 1 ? "guest" : "guests"}
						</p>
					)}
				</div>

				{pageState === "error" && (
					<div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm text-center">
						{errorMsg}
					</div>
				)}

				<form onSubmit={handleCancel} className="space-y-6">
					<div>
						<label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
							Reason for cancellation <span className="text-gold">*</span>
						</label>
						<textarea
							required
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							rows={4}
							className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors resize-none"
							placeholder="Please let us know why you're cancelling..."
							disabled={pageState === "submitting"}
						/>
					</div>

					<button
						type="submit"
						disabled={pageState === "submitting" || !reason.trim()}
						className="w-full py-4 bg-red-700 text-white text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{pageState === "submitting" ? "Cancelling..." : "Cancel My Reservation"}
					</button>

					<Link
						href="/"
						className="block text-center text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
					>
						Keep My Reservation
					</Link>
				</form>
			</div>
		</div>
	);
}
