/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Navigation, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface VenueProps {
  venueName?: string;
  address?: string;
}

export default function VenueSection({
  venueName = "Wedding Venue",
  address = "Dubacherla, Main Road,\nNH-5, Eluru–Rajahmundry Road,\nDubacherla,\nAndhra Pradesh 534112"
}: VenueProps) {
  
  const mapUrl = "https://share.google/JYVs6Jrbt0tEMhkK0";
  
  // High-reliability embed map link for Dubacherla, Andhra Pradesh area mapping
  const iframeSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15259.0343350392!2d81.4278457!3d16.9602497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a6b8a8b1ef3b%3A0xe7f9cb89fddff887!2sDubacherla%2C%20Andhra%20Pradesh%20534112!5e0!3m2!1sen!2sin!4v1716946000000!5m2!1sen!2sin";

  return (
    <section id="venue" className="py-24 px-4 bg-gold-50 select-none border-b border-gold-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Sacred Space</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">The Wedding Venue</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2">
            Please join us and grace the occasion at our celebration address
          </p>
        </div>

        {/* Column Grid: Text vs Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Column 1: Card Address */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-8 border border-gold-100 shadow-xs h-full flex flex-col justify-between relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-gold-300/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="w-12 h-12 rounded-full bg-[#F8ECE7] text-[#B08D3E] flex items-center justify-center mb-6 border border-gold-100 shadow-xs">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>

                <h3 className="font-serif text-2xl text-gold-900 font-bold mb-3 tracking-wide flex items-center gap-2">
                  {venueName} <Sparkles className="w-4 h-4 text-gold-300 fill-gold-300/15" />
                </h3>

                {/* Preformatted Address Display */}
                <div className="font-sans text-stone-600 text-sm md:text-base leading-relaxed tracking-wide space-y-2 whitespace-pre-line border-l-2 border-[#B08D3E] pl-4 my-6">
                  {address}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-[#F2E5D5] relative z-10">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-gold-900 hover:bg-[#B08D3E] text-white flex items-center justify-center gap-2 rounded-xl transition-colors duration-300 font-sans text-sm font-bold tracking-wide shadow-xs focus:outline-none cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
                
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=16.9602497,81.4278457`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#F8ECE7] hover:bg-[#E8D5C8] text-[#B08D3E] flex items-center justify-center gap-2 rounded-xl transition-colors duration-300 font-sans text-sm font-bold tracking-wide shadow-xs focus:outline-none cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Gorgeous Google Map Embed */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#F8ECE7] rounded-2xl overflow-hidden border border-gold-100 shadow-md h-[340px] lg:h-full min-h-[400px] relative group"
            >
              {/* Map Loading Shadow */}
              <div className="absolute inset-0 bg-[#F8ECE7]/50 flex items-center justify-center pointer-events-none group-focus-within:opacity-0 transition-opacity duration-300">
                <span className="font-sans text-xs text-gold-400 uppercase tracking-widest font-bold flex items-center gap-2 animate-pulse">
                  <MapPin className="w-4 h-4" /> Initializing Map...
                </span>
              </div>
              
              <iframe
                title="Wedding Venue Coordinates Marker"
                src={iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full relative z-10 filter brightness-[0.98] contrast-[1.02]"
              />
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
