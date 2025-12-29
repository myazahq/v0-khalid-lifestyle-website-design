"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/#events" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Booking", href: "/#booking" },
  ]

  const isHomePage = pathname === "/"
  const navBackground = !isHomePage || isScrolled ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent"

  return (
    <nav
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 px-6 md:px-12", navBackground)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-serif tracking-tighter uppercase font-bold">
          Khalid<span className="text-gold">Lifestyle</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-[0.2em] hover:text-gold transition-colors",
                pathname === link.href ? "text-gold" : "text-white",
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/#booking"
            className="px-6 py-2 border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Book Me
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-t border-white/10 p-8 flex flex-col space-y-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif tracking-widest uppercase text-center"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
