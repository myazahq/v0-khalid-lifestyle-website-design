import type React from "react";
import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "KhalidLifestyle | Premium Events & Nightlife",
	description:
		"Exclusive events, luxury nightlife, and premium lifestyle experiences curated by KhalidLifestyle.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${geist.variable} ${playfair.variable}`}>
			<body className="font-sans antialiased overflow-x-hidden">
				{children}
			</body>
		</html>
	);
}
