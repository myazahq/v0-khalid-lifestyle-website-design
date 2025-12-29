"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Sample media items - mix of images and videos
const heroMedia = [
  { type: "image", src: "/luxury-nightclub-interior.jpg" },
  {
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-club-scene-with-people-dancing-under-lasers-4235-large.mp4",
  },
  { type: "image", src: "/champagne-sparklers-vip.jpg" },
  { type: "video", src: "https://assets.mixkit.co/videos/preview/mixkit-dj-performing-in-a-nightclub-4232-large.mp4" },
]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledMedia, setShuffledMedia] = useState<{ type: string; src: string }[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setShuffledMedia(shuffleArray(heroMedia))
  }, [])

  useEffect(() => {
    if (shuffledMedia.length === 0) return

    const currentMedia = shuffledMedia[currentIndex]

    if (currentMedia?.type === "video") {
      const video = videoRef.current
      if (video) {
        const handleEnded = () => {
          setCurrentIndex((prev) => (prev + 1) % shuffledMedia.length)
        }
        video.addEventListener("ended", handleEnded)
        video.play().catch((e) => console.log("[v0] Video play prevented", e))
        return () => video.removeEventListener("ended", handleEnded)
      }
    } else {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % shuffledMedia.length)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, shuffledMedia])

  if (shuffledMedia.length === 0) return <div className="h-screen bg-black" />

  const currentMedia = shuffledMedia[currentIndex]

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          {currentMedia.type === "image" ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${currentMedia.src}')` }}
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              key={currentMedia.src}
            >
              <source src={currentMedia.src} type="video/mp4" />
            </video>
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {shuffledMedia.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 transition-all duration-300 ${i === currentIndex ? "w-8 bg-gold" : "w-4 bg-white/30"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gold text-xs md:text-sm uppercase tracking-[0.5em] mb-6 block"
        >
          Established in Excellence
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-8xl font-serif mb-8 leading-[1.1] tracking-tight"
        >
          Premium Events & <br />
          <span className="italic">Nightlife Experience</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12"
        >
          <Button
            variant="outline"
            className="rounded-none border-white/20 px-10 py-6 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all w-full md:w-auto bg-transparent"
          >
            View Upcoming Events
          </Button>
          <Button className="rounded-none bg-gold text-black hover:bg-gold/90 px-10 py-6 text-xs uppercase tracking-widest w-full md:w-auto">
            Book Exclusive Table
          </Button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  )
}
