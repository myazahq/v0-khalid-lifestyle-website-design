"use server";

import { sendBulkEmail } from "./email";

export async function sendBulkEmailAction({
	recipients,
	subject,
	body,
}: {
	recipients: { email: string; firstName: string }[];
	subject: string;
	body: string;
}): Promise<{ success: boolean; sent: number; failed: number; error?: string }> {
	if (!subject.trim() || !body.trim()) {
		return { success: false, sent: 0, failed: 0, error: "Subject and message are required." };
	}
	if (recipients.length === 0) {
		return { success: false, sent: 0, failed: 0, error: "No recipients selected." };
	}

	const { sent, failed } = await sendBulkEmail({ recipients, subject, body });
	return { success: true, sent, failed };
}
