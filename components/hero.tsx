"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { getHeroMedia } from "@/lib/events";

type HeroProps = {
	media: {
		type: "image" | "video";
		src: string;
	}[];
};

const Hero = ({ media }: HeroProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [mediaItems, setMediaItems] = useState<
		{ type: "image" | "video"; src: string }[]
	>([]);

	useEffect(() => {
		setMediaItems(media);
	}, []);

	useEffect(() => {
		if (mediaItems.length === 0) return;

		const timer = setTimeout(() => {
			setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
		}, 5000);
		return () => clearTimeout(timer);
	}, [currentIndex, mediaItems]);

	const currentMedia = mediaItems[currentIndex];

	if (!currentMedia) {
		return null;
	}

	return (
		<section className="relative h-screen flex items-center justify-center overflow-hidden">
			<div className="absolute inset-0 z-0">
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
					className="w-full h-full"
				>
					{currentMedia.type === "video" ? (
						<video
							src={currentMedia.src}
							autoPlay
							muted
							loop
							playsInline
							className="w-full h-full object-cover"
						/>
					) : (
						<div
							className="w-full h-full bg-cover bg-center"
							style={{ backgroundImage: `url('${currentMedia.src}')` }}
						/>
					)}
				</motion.div>
				<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black" />
			</div>

			<div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
				{mediaItems.map((_, i) => (
					<button
						key={i}
						onClick={() => setCurrentIndex(i)}
						className={`h-1 transition-all duration-300 ${
							i === currentIndex ? "w-8 bg-gold" : "w-4 bg-white/30"
						}`}
						aria-label={`Go to slide ${i + 1}`}
					/>
				))}
			</div>

			<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
				<motion.span
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-gold text-xs md:text-sm uppercase tracking-[0.5em] mb-6 block"
				>
					Established in Excellence
				</motion.span>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
					className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight"
				>
					Premium Events & <br />
					<span className="italic">Nightlife Experience</span>
				</motion.h1>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.5 }}
					className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12"
				>
					<Button
						variant="outline"
						className="rounded-none border-white/20 px-10 py-6 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full md:w-auto bg-transparent"
					>
						View Upcoming Events
					</Button>
					<Button className="rounded-none bg-gold text-black hover:bg-gold/90 px-10 py-6 text-xs uppercase tracking-widest w-full md:w-auto">
						Book Exclusive Table
					</Button>
				</motion.div>
			</div>

			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
				className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
			>
				<ChevronDown size={32} />
			</motion.div>
		</section>
	);
};

export default Hero;
