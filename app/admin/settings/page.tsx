"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Globe, Mail, Instagram } from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings-services";
import type { SiteSettings } from "@/lib/settings-services";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    getSiteSettings().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
  }, []);

  const set = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setStatus("idle");
    const result = await updateSiteSettings(settings);
    setIsSaving(false);
    setStatus(result.success ? "saved" : "error");
    if (result.success) setTimeout(() => setStatus("idle"), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="flex-1 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your site configuration
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Site
              </CardTitle>
              <CardDescription>General site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => set("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </CardTitle>
              <CardDescription>Email and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="hello@khalidlifestyle.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={settings.replyToEmail}
                  onChange={(e) => set("replyToEmail", e.target.value)}
                  placeholder="noreply@khalidlifestyle.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Social
              </CardTitle>
              <CardDescription>Social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramHandle">Instagram Handle</Label>
                <Input
                  id="instagramHandle"
                  value={settings.instagramHandle}
                  onChange={(e) => set("instagramHandle", e.target.value)}
                  placeholder="@khalidlifestyle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={(e) => set("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/khalidlifestyle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
                <Input
                  id="whatsappUrl"
                  value={settings.whatsappUrl}
                  onChange={(e) => set("whatsappUrl", e.target.value)}
                  placeholder="https://wa.me/447700000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokHandle">TikTok Handle</Label>
                <Input
                  id="tiktokHandle"
                  value={settings.tiktokHandle}
                  onChange={(e) => set("tiktokHandle", e.target.value)}
                  placeholder="@khalidlifestyle"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            {status === "saved" && (
              <p className="text-sm text-green-500">Changes saved.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">Failed to save. Try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
