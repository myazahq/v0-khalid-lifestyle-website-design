// Upload image to Cloudinary
export async function uploadImage(
	file: File,
	eventId: string
): Promise<{ success: boolean; url?: string; error?: any }> {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
		);
		formData.append("folder", `khalid-lifestyle/${eventId}`);

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!response.ok) {
			throw new Error(`Upload failed with status ${response.status}`);
		}

		const data = await response.json();
		return { success: true, url: data.secure_url };
	} catch (error) {
		console.error("[v0] Error uploading image:", error);
		return { success: false, error };
	}
}

// Upload multiple images
export async function uploadMultipleImages(
	files: File[],
	eventId: string,
	onProgress?: (current: number, total: number) => void
): Promise<{ success: boolean; urls?: string[]; errors?: any[] }> {
	const urls: string[] = [];
	const errors: any[] = [];

	for (let i = 0; i < files.length; i++) {
		const result = await uploadImage(files[i], eventId);

		if (result.success && result.url) {
			urls.push(result.url);
		} else {
			errors.push(result.error);
		}

		if (onProgress) {
			onProgress(i + 1, files.length);
		}
	}

	return {
		success: errors.length === 0,
		urls,
		errors: errors.length > 0 ? errors : undefined,
	};
}

// Delete image from Cloudinary
export async function deleteImage(
	imageUrl: string
): Promise<{ success: boolean; error?: any }> {
	try {
		// Extract public_id from Cloudinary URL
		const urlParts = imageUrl.split("/");
		const fileName = urlParts[urlParts.length - 1].split(".")[0];
		const folderPath = urlParts.slice(-3, -1).join("/");
		const publicId = `${folderPath}/${fileName}`;

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					public_id: publicId,
					api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
					signature: "", // In production, you'd generate this on the backend
				}).toString(),
			}
		);

		if (!response.ok) {
			throw new Error(`Delete failed with status ${response.status}`);
		}

		return { success: true };
	} catch (error) {
		console.error("[v0] Error deleting image:", error);
		return { success: false, error };
	}
}

// Upload video to Cloudinary
export async function uploadVideo(
	file: File,
	eventId: string
): Promise<{ success: boolean; url?: string; error?: any }> {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
		);
		formData.append("folder", `khalid-lifestyle/${eventId}/videos`);
		formData.append("resource_type", "video");

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!response.ok) {
			throw new Error(`Upload failed with status ${response.status}`);
		}

		const data = await response.json();
		return { success: true, url: data.secure_url };
	} catch (error) {
		console.error("[v0] Error uploading video:", error);
		return { success: false, error };
	}
}

// Helper to determine file type
export function getFileType(file: File): "image" | "video" | "unknown" {
	if (file.type.startsWith("image/")) return "image";
	if (file.type.startsWith("video/")) return "video";
	return "unknown";
}

// Helper to validate file size (max 10MB for images, 100MB for videos)
export function validateFileSize(file: File): {
	valid: boolean;
	message?: string;
} {
	const fileType = getFileType(file);
	const maxSize = fileType === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB or 100MB

	if (file.size > maxSize) {
		const maxSizeMB = fileType === "image" ? "10MB" : "100MB";
		return {
			valid: false,
			message: `File size exceeds ${maxSizeMB}. Please choose a smaller file.`,
		};
	}

	return { valid: true };
}
