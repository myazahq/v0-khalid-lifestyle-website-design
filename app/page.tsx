import { Navbar } from "@/components/navbar";
import Hero from "@/components/hero";
import { UpcomingEvents } from "@/components/upcoming-events";
import { Gallery } from "@/components/gallery";
import { BookingForm } from "@/components/booking-form";
import { Footer } from "@/components/footer";
import { getHeroMedia } from "@/lib/events";
import { getAllEventsFromFirestore } from "@/lib/firestore-services";

export default async function Home() {
	const eventsData = await getAllEventsFromFirestore();

	const media = (await getHeroMedia()) as {
		type: "image" | "video";
		src: string;
	}[];

	return (
		<main className="min-h-screen bg-black">
			<Navbar />
			<Hero media={media} />

			{/* Brand Statement Section */}
			<section className="py-32 px-6 md:px-12 flex items-center justify-center text-center">
				<div className="max-w-4xl">
					<p className="text-2xl md:text-5xl font-serif italic leading-snug">
						"We don't just host parties; we curate moments that define your
						lifestyle."
					</p>
					<div className="mt-12 flex items-center justify-center gap-4">
						<div className="h-px w-12 bg-gold/50" />
						<span className="text-[10px] uppercase tracking-[0.4em] text-gold">
							Khalid Lifestyle PR
						</span>
						<div className="h-px w-12 bg-gold/50" />
					</div>
				</div>
			</section>

			<UpcomingEvents eventsData={eventsData} />
			<Gallery eventsData={eventsData} />
			<BookingForm />

			<Footer />
		</main>
	);
}
