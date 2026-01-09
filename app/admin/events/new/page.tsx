"use client";

import type React from "react";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createEvent } from "@/lib/firestore-services";
import { uploadImage, validateFileSize } from "@/lib/storage-services";

export default function NewEventPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: "",
		date: "",
		location: "",
		description: "",
	});
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const validation = validateFileSize(file);
		if (!validation.valid) {
			setError(validation.message || "Invalid file");
			return;
		}

		setThumbnailFile(file);
		setThumbnailPreview(URL.createObjectURL(file));
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			// Create slug for event ID
			const slug = formData.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

			// Upload thumbnail if provided
			let thumbnailUrl = "";
			if (thumbnailFile) {
				const uploadResult = await uploadImage(thumbnailFile, slug);
				if (!uploadResult.success || !uploadResult.url) {
					throw new Error("Failed to upload thumbnail image");
				}

				console.log(uploadResult);
				thumbnailUrl = uploadResult.url;
			}

			// Create event in Firestore
			const result = await createEvent({
				id: slug,
				title: formData.title,
				date: formData.date,
				location: formData.location,
				description: formData.description,
				thumbnail: thumbnailUrl,
				items: [],
			});
			console.log(result);
			if (!result.success) {
				throw new Error("Failed to create event");
			}

			setIsLoading(false);
			router.push(`/admin/events/${result.id}`);
		} catch (err) {
			console.error("[v0] Error creating event:", err);
			setError(err instanceof Error ? err.message : "Failed to create event");
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-background">
			<AdminSidebar />

			<main className="flex-1 p-8">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center gap-4 mb-8">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-serif font-bold">
								Create New Event
							</h1>
							<p className="text-muted-foreground mt-1">
								Add details for your upcoming or past event
							</p>
						</div>
					</div>

					{error && (
						<Card className="mb-6 border-destructive">
							<CardContent className="pt-6">
								<p className="text-destructive text-sm">{error}</p>
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle>Event Details</CardTitle>
							<CardDescription>
								Fill in the information about your event
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="title">Event Title</Label>
									<Input
										id="title"
										placeholder="e.g. London Fashion Week Afterparty"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										required
										disabled={isLoading}
									/>
								</div>

								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="date">Date</Label>
										<Input
											id="date"
											placeholder="e.g. Autumn 2025"
											value={formData.date}
											onChange={(e) =>
												setFormData({ ...formData, date: e.target.value })
											}
											required
											disabled={isLoading}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="location">Location</Label>
										<Input
											id="location"
											placeholder="e.g. The Mayfair Club"
											value={formData.location}
											onChange={(e) =>
												setFormData({ ...formData, location: e.target.value })
											}
											required
											disabled={isLoading}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										placeholder="Describe the event atmosphere and highlights..."
										className="min-h-32"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										required
										disabled={isLoading}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="thumbnail">Thumbnail Image</Label>
									<div className="flex items-center gap-4">
										<Input
											id="thumbnail"
											type="file"
											accept="image/*"
											onChange={handleThumbnailChange}
											disabled={isLoading}
											className="flex-1"
										/>
										{thumbnailPreview && (
											<img
												src={thumbnailPreview || "/placeholder.svg"}
												alt="Preview"
												className="w-20 h-20 object-cover rounded border"
											/>
										)}
									</div>
									<p className="text-xs text-muted-foreground">
										Upload a cover image for the event (max 10MB). You can add
										more photos after creating the event.
									</p>
								</div>

								<div className="flex gap-4 pt-4">
									<Button
										type="submit"
										className="bg-primary text-primary-foreground hover:bg-primary/90"
										disabled={isLoading || !thumbnailFile}
									>
										<Save className="mr-2 h-4 w-4" />
										{isLoading ? "Creating..." : "Create Event"}
									</Button>
									<Link href="/admin">
										<Button
											type="button"
											variant="outline"
											disabled={isLoading}
										>
											Cancel
										</Button>
									</Link>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
