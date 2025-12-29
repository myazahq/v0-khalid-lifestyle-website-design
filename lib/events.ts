export interface GalleryItem {
  type: "image" | "video"
  src: string
  aspect: "portrait" | "landscape" | "square"
}

export interface PastEvent {
  id: string
  title: string
  date: string
  location: string
  thumbnail: string
  description: string
  items: GalleryItem[]
}

export const pastEvents: PastEvent[] = [
  {
    id: "london-fashion-week-2025",
    title: "London Fashion Week Afterparty",
    date: "Autumn 2025",
    location: "The Mayfair Club",
    thumbnail: "/luxury-fashion-party.jpg",
    description: "An exclusive gathering of the fashion elite during London's most prestigious week.",
    items: Array.from({ length: 24 }).map((_, i) => ({
      type: i % 8 === 0 ? "video" : "image",
      src:
        i % 8 === 0
          ? "https://assets.mixkit.co/videos/preview/mixkit-party-crowd-dancing-under-flashing-lights-4240-large.mp4"
          : `/placeholder.svg?height=${i % 3 === 0 ? 1200 : 800}&width=800&query=luxury+nightlife+event+${i}`,
      aspect: i % 3 === 0 ? "portrait" : i % 3 === 1 ? "landscape" : "square",
    })),
  },
  {
    id: "summer-solstice-vips",
    title: "Summer Solstice VIP Gala",
    date: "Summer 2025",
    location: "Saint-Tropez",
    thumbnail: "/luxury-champagne-sparklers.jpg",
    description: "A sun-drenched celebration of luxury on the French Riviera.",
    items: Array.from({ length: 20 }).map((_, i) => ({
      type: "image",
      src: `/gallery/summer-${i + 1}.jpg`,
      aspect: i % 2 === 0 ? "landscape" : "portrait",
    })),
  },
  {
    id: "midnight-in-dubai",
    title: "Midnight in Dubai",
    date: "Winter 2024",
    location: "Burj Khalifa District",
    thumbnail: "/exclusive-vip-booth.jpg",
    description: "Neon lights and desert luxury at the heart of Dubai's nightlife scene.",
    items: Array.from({ length: 30 }).map((_, i) => ({
      type: "image",
      src: `/gallery/dubai-${i + 1}.jpg`,
      aspect: "square",
    })),
  },
]
