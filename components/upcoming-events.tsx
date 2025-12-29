import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

const events = [
  {
    title: "Vivid Nights: Black & Gold Edition",
    date: "Dec 31, 2025",
    venue: "Onyx Lounge, London",
    description: "The ultimate New Year's Eve celebration with top-tier DJs and premium service.",
    image: "/luxury-party-flyer-dark-gold.jpg",
    featured: true,
  },
  {
    title: "Skyline Soirée",
    date: "Jan 15, 2026",
    venue: "The Penthouse, Dubai",
    description: "An exclusive rooftop experience overlooking the Burj Khalifa.",
    image: "/dubai-nightlife-rooftop.jpg",
    featured: false,
  },
  {
    title: "Midnight Masquerade",
    date: "Feb 14, 2026",
    venue: "Palais Royale, Paris",
    description: "A night of mystery and elegance in the heart of the French capital.",
    image: "/masquerade-ball-luxury.jpg",
    featured: false,
  },
]

export function UpcomingEvents() {
  return (
    <section id="events" className="py-24 px-6 md:px-12 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">Schedule</span>
            <h2 className="text-4xl md:text-6xl font-serif">Upcoming Events</h2>
          </div>
          <p className="max-w-md text-muted-foreground text-sm uppercase tracking-wider leading-relaxed">
            Curating the world's most exclusive parties. Secure your entry to the next KhalidLifestyle production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {events.map((event, i) => (
            <div key={i} className={event.featured ? "md:col-span-8" : "md:col-span-4"}>
              <Card className="bg-transparent border-white/5 overflow-hidden group">
                <CardContent className="p-0 relative aspect-[4/3] md:aspect-auto md:h-[600px]">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 p-8 flex flex-col justify-end">
                    {event.featured && (
                      <Badge className="w-fit bg-gold text-black mb-4 rounded-none uppercase tracking-widest text-[10px]">
                        Featured Event
                      </Badge>
                    )}
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
                        <Calendar size={14} className="text-gold" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
                        <MapPin size={14} className="text-gold" />
                        {event.venue}
                      </div>
                    </div>
                    <button className="w-fit px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold transition-colors">
                      RSVP NOW
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
