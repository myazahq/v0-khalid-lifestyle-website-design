import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-20 px-6 md:px-12 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-serif mb-4 uppercase">KhalidLifestyle</h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/60">Premium Events & PR Experience</p>
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
            <Link href="#" className="hover:text-gold transition-colors">
              Instagram
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-20 text-center">
        <p className="text-[10px] uppercase tracking-widest text-white/20">
          © 2025 KhalidLifestyle. All rights reserved. Designed for the elite.
        </p>
      </div>
    </footer>
  )
}
