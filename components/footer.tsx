import Link from "next/link"
import type { SiteSettings } from "@/lib/settings-services"

const FOOTER_DEFAULTS: SiteSettings = {
  siteName: "KhalidLifestyle",
  tagline: "Premium Events & PR Experience",
  contactEmail: "events@khalidlifestyle.com",
  replyToEmail: "",
  instagramHandle: "@KhalidLifestyle",
  instagramUrl: "https://instagram.com/khalidlifestyle",
  whatsappUrl: "",
  tiktokHandle: "",
}

interface FooterProps {
  settings?: SiteSettings
}

export function Footer({ settings = FOOTER_DEFAULTS }: FooterProps) {
  return (
    <footer className="py-20 px-6 md:px-12 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-serif mb-4 uppercase">{settings.siteName}</h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/60">{settings.tagline}</p>
        </div>

        <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-light">
          <div className="flex flex-col gap-4">
            <Link href="#" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {settings.instagramUrl ? (
              <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                Instagram
              </Link>
            ) : (
              <span className="text-white/30">Instagram</span>
            )}
            {settings.whatsappUrl ? (
              <Link href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                WhatsApp
              </Link>
            ) : (
              <span className="text-white/30">WhatsApp</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-20 text-center">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved. Designed for the elite.
        </p>
      </div>
    </footer>
  )
}
