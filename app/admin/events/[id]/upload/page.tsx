"use client";

import type React from "react";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { GalleryItem } from "@/lib/events";
import { addMediaToEvent } from "@/lib/firestore-services";
import {
	uploadImage,
	uploadVideo,
	validateFileSize,
	getFileType,
} from "@/lib/storage-services";

export default function UploadMediaPage() {
	const params = useParams();
	const router = useRouter();
	const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState({
		current: 0,
		total: 0,
	});
	const [error, setError] = useState<string>("");

	const isHeicFile = (file: File) => {
		const isHeicMime = file.type === "image/heic" || file.type === "image/heif";
		const isHeicExt = /\.(heic|heif)$/i.test(file.name);
		return isHeicMime || isHeicExt;
	};

	const convertHeicToJpeg = async (file: File) => {
		const heic2any = (await import("heic2any")).default;
		const output = await heic2any({
			blob: file,
			toType: "image/jpeg",
			quality: 0.9,
		});
		const blob = Array.isArray(output) ? output[0] : output;
		const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
		return new File([blob], newName, { type: "image/jpeg" });
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		// Validate all files (convert HEIC/HEIF to JPEG first)
		const validFiles: File[] = [];
		for (const file of files) {
			try {
				const processedFile = isHeicFile(file)
					? await convertHeicToJpeg(file)
					: file;
				const validation = validateFileSize(processedFile);
				if (!validation.valid) {
					setError(validation.message || "Invalid file");
					continue;
				}
				validFiles.push(processedFile);
			} catch (err) {
				console.error("[v0] HEIC conversion failed:", err);
				setError("Failed to convert HEIC image. Please try a different file.");
			}
		}

		setSelectedFiles((prev) => [...prev, ...validFiles]);
		setError("");
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (selectedFiles.length === 0) {
			setError("Please select at least one file to upload");
			return;
		}

		setIsUploading(true);
		setError("");

		try {
			const eventId = params.id as string;
			const uploadedMedia: GalleryItem[] = [];

			// Upload each file
			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i];
				setUploadProgress({ current: i + 1, total: selectedFiles.length });

				const fileType = getFileType(file);
				const uploadFn = fileType === "video" ? uploadVideo : uploadImage;

				const result = await uploadFn(file, eventId);
				if (!result.success || !result.url) {
					console.error("[v0] Failed to upload file:", file.name);
					continue;
				}

				// Determine aspect ratio from file metadata (simplified version)
				const aspect: "portrait" | "landscape" | "square" = "landscape"; // Default, can be enhanced with image analysis

				uploadedMedia.push({
					type: fileType === "video" ? "video" : "image",
					src: result.url,
					aspect,
				});
			}

			// Add media to event in Firestore
			const addResult = await addMediaToEvent(eventId, uploadedMedia);
			if (!addResult.success) {
				throw new Error("Failed to add media to event");
			}

			router.push(`/admin/events/${eventId}`);
		} catch (err) {
			console.error("[v0] Error uploading media:", err);
			setError(err instanceof Error ? err.message : "Failed to upload media");
			setIsUploading(false);
			setUploadProgress({ current: 0, total: 0 });
		}
	};

	return (
		<div className="flex min-h-screen bg-background">
			<AdminSidebar />

			<main className="flex-1 p-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center gap-4 mb-8">
						<Link href={`/admin/events/${params.id}`}>
							<Button variant="ghost" size="icon" disabled={isUploading}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-serif font-bold">Add Event Media</h1>
							<p className="text-muted-foreground mt-1">
								Upload photos and videos from this event
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

					<form onSubmit={handleSubmit} className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Upload Media Files</CardTitle>
								<CardDescription>
									Select photos and videos to upload from your device
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="mediaFiles">Select Files</Label>
									<Input
										id="mediaFiles"
										type="file"
										accept="image/*,video/*"
										multiple
										onChange={handleFileChange}
										disabled={isUploading}
									/>
									<p className="text-xs text-muted-foreground">
										Select multiple images (max 10MB each) or videos (max 100MB
										each)
									</p>
								</div>

								{isUploading && (
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground">
											Uploading {uploadProgress.current} of{" "}
											{uploadProgress.total}...
										</p>
										<div className="w-full bg-secondary rounded-full h-2">
											<div
												className="bg-primary h-2 rounded-full transition-all duration-300"
												style={{
													width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
												}}
											/>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Selected Files ({selectedFiles.length})</CardTitle>
								<CardDescription>Review files before uploading</CardDescription>
							</CardHeader>
							<CardContent>
								{selectedFiles.length === 0 ? (
									<p className="text-center text-muted-foreground py-8">
										No files selected yet
									</p>
								) : (
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										{selectedFiles.map((file, index) => {
											const isVideo = file.type.startsWith("video/");
											const preview = URL.createObjectURL(file);

											return (
												<div
													key={index}
													className="relative aspect-square rounded-lg overflow-hidden border border-border group"
												>
													{isVideo ? (
														<video
															src={preview}
															className="w-full h-full object-cover"
															muted
														/>
													) : (
														<img
															src={preview || "/placeholder.svg"}
															alt={file.name}
															className="w-full h-full object-cover"
														/>
													)}
													<button
														type="button"
														onClick={() => removeFile(index)}
														disabled={isUploading}
														className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
													>
														<X className="h-4 w-4" />
													</button>
													<div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
														{isVideo ? "video" : "image"} •{" "}
														{(file.size / 1024 / 1024).toFixed(1)}MB
													</div>
												</div>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>

						<div className="flex gap-4">
							<Button
								type="submit"
								disabled={selectedFiles.length === 0 || isUploading}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Upload className="mr-2 h-4 w-4" />
								{isUploading
									? "Uploading..."
									: `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? "s" : ""}`}
							</Button>
							<Link href={`/admin/events/${params.id}`}>
								<Button type="button" variant="outline" disabled={isUploading}>
									Cancel
								</Button>
							</Link>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
