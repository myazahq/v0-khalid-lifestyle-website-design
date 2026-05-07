"use server";

import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { db } from "./firebase";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  replyToEmail: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappUrl: string;
  tiktokHandle: string;
}

const SETTINGS_DOC = "settings/site";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "KhalidLifestyle",
  tagline: "Premium Events & PR Experience",
  contactEmail: "events@khalidlifestyle.com",
  replyToEmail: "",
  instagramHandle: "@KhalidLifestyle",
  instagramUrl: "https://instagram.com/khalidlifestyle",
  whatsappUrl: "",
  tiktokHandle: "",
};

async function _getSiteSettings(): Promise<SiteSettings> {
  try {
    const ref = doc(db, SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...snap.data() } as SiteSettings;
  } catch (error) {
    console.error("[settings] Error fetching site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export const getSiteSettings = cache(_getSiteSettings, ["site-settings"], {
  revalidate: 60,
  tags: ["settings"],
});

export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const ref = doc(db, SETTINGS_DOC);
    await setDoc(
      ref,
      { ...updates, updatedAt: Timestamp.now() },
      { merge: true }
    );
    revalidateTag("settings", {});
    return { success: true };
  } catch (error) {
    console.error("[settings] Error updating site settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
