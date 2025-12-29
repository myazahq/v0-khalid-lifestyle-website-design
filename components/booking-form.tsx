"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Instagram, Mail } from "lucide-react"

export function BookingForm() {
  return (
    <section id="booking" className="py-24 px-6 md:px-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-gold text-xs uppercase tracking-[0.3em] mb-6 block">Get in touch</span>
          <h2 className="text-4xl md:text-7xl font-serif mb-8 leading-tight">
            Book the <br /> <span className="italic">Lifestyle</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-md leading-relaxed">
            Interested in booking a table, organizing a private event, or collaborating with the brand? Fill out the
            form below.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-gold transition-colors">
                <Instagram size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Follow Us</p>
                <p className="text-sm tracking-widest group-hover:text-gold transition-colors">@KhalidLifestyle</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-gold transition-colors">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                <p className="text-sm tracking-widest group-hover:text-gold transition-colors">
                  events@khalidlifestyle.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 p-8 md:p-12 border border-white/5"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                <Input
                  className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
                  placeholder="Your Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <Input
                  className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Event Type</label>
              <Input
                className="bg-transparent border-white/10 rounded-none h-12 focus-visible:ring-gold"
                placeholder="VIP Table, Private Party, PR..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Message</label>
              <Textarea
                className="bg-transparent border-white/10 rounded-none min-h-[150px] focus-visible:ring-gold"
                placeholder="Tell us more about your request..."
              />
            </div>
            <Button className="w-full bg-gold text-black rounded-none h-14 uppercase tracking-[0.3em] text-xs font-bold hover:bg-gold/80 transition-all">
              Send Inquiry
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
