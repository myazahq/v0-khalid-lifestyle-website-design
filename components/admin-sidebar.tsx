"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, TicketCheck, BookOpen, ImageIcon, Settings, Home, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Events", href: "/admin", icon: Calendar, exact: true },
    { name: "Event RSVPs", href: "/admin/all-rsvps", icon: TicketCheck, exact: false },
    { name: "Reservations", href: "/admin/reservations", icon: BookOpen, exact: false },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon, exact: false },
    { name: "Settings", href: "/admin/settings", icon: Settings, exact: false },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="text-xl font-serif tracking-tighter text-gold">
          KHALID<span className="text-foreground">LIFESTYLE</span>
        </Link>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Admin Portal</p>
      </div>

      <nav className="px-4 py-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Khalid Admin</span>
        </div>
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Home className="mr-2 h-4 w-4" />
            View Website
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  )
}
