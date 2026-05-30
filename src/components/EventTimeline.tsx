/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, Image as ImageIcon, Video } from 'lucide-react';
import { WeddingEvent, GalleryImage } from '../types';

interface EventsProps {
  events: WeddingEvent[];
  galleryImages: GalleryImage[];
  onOpenUploadDialog: (category: 'haldi' | 'pradhanam' | 'wedding') => void;
}

export default function EventTimeline({ events, galleryImages, onOpenUploadDialog }: EventsProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section id="events" className="py-24 px-4 bg-gold-50 border-t border-gold-100 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Sacred Order</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">Wedding Celebrations</h2>
          <p className="font-sans text-stone-500 text-sm tracking-widest mt-2 max-w-lg mx-auto">
            "Join us across our three beautiful wedding ceremonies"
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative">
          {/* Vertical Center Line (Desktop Only) */}
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold-300 via-[#B08D3E] to-gold-200 hidden lg:block" />

          <div className="space-y-16">
            {sortedEvents.map((event, idx) => {
              const isEven = idx % 2 === 0;
              
              // Filter gallery images specific to this event category
              const eventImages = galleryImages.filter(img => img.category === event.key && img.url);

              return (
                <div key={event.id} className="relative flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-16">
                  
                  {/* Timeline Node Point (Desktop Only) */}
                  <div className="absolute left-[50%] top-12 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-gold-300 hidden lg:flex items-center justify-center z-10 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-[#B08D3E] animate-pulse" />
                  </div>

                  {/* Left Column (Left side content) */}
                  <div className={`w-full lg:w-[45%] flex flex-col justify-center ${isEven ? 'lg:order-1 text-left' : 'lg:order-2 text-left'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                      className="bg-white rounded-2xl p-6 md:p-8 border border-gold-100 shadow-xs hover:shadow-md hover:border-gold-300 transition-all duration-300 flex flex-col"
                    >
                      {/* Ceremony Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#F2E5D5]">
                        <div>
                          <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-gold-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-gold-300 fill-gold-300/20" /> Ceremony {idx + 1}
                          </span>
                          <h3 className="font-serif text-2xl text-gold-900 font-bold mt-1 tracking-wide">
                            {event.name}
                          </h3>
                        </div>
                        <div className="bg-[#F8ECE7] rounded-xl px-4 py-2 border border-gold-100 flex flex-col items-center">
                          <span className="font-serif text-xl font-bold text-[#B08D3E] leading-none">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="font-sans text-[9px] uppercase tracking-widest text-[#B08D3E] font-bold mt-1">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        </div>
                      </div>

                      <p className="font-sans text-sm text-stone-600 leading-relaxed tracking-wide mb-6">
                        {event.description}
                      </p>

                      {/* Info lines */}
                      <div className="space-y-3 bg-[#F8ECE7] p-4 rounded-xl border border-gold-100 mb-6">
                        <div className="flex items-center gap-3 text-gold-900">
                          <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                          <span className="font-sans text-xs tracking-wider font-bold">{event.time}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gold-900">
                          <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <div className="font-sans text-xs tracking-wider leading-relaxed">
                            <p className="font-bold text-gold-900">{event.venueName}</p>
                            <p className="text-stone-500 text-[11px] mt-0.5">{event.venueAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Easy guest photo upload direct trigger */}
                      <div className="mt-auto pt-4 border-t border-[#F2E5D5] flex items-center justify-between">
                        <span className="font-sans text-[10px] text-stone-400 font-bold tracking-wide">
                          Have photos of this event?
                        </span>
                        <button
                          onClick={() => onOpenUploadDialog(event.key as 'haldi' | 'pradhanam' | 'wedding')}
                          className="font-sans text-xs text-[#B08D3E] bg-[#F8ECE7] hover:bg-gold-300 hover:text-white border border-gold-300/40 hover:border-gold-300 transition-all duration-300 px-4 py-1.5 rounded-full font-bold cursor-pointer"
                        >
                          Add ceremony photos
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column (Right side, shows current gallery images for that specific event) */}
                  <div className={`w-full lg:w-[45%] flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="bg-white p-6 rounded-2xl border border-gold-100 h-full flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-serif text-base font-bold text-gold-900 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-gold-300" /> {event.name} Gallery
                          </span>
                          <span className="font-sans text-xs text-stone-400 font-bold tracking-wider">
                            {eventImages.length} Photo{eventImages.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {eventImages.length === 0 ? (
                          <div className="bg-[#F8ECE7] rounded-xl border border-dashed border-gold-300/50 p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                            <ImageIcon className="w-10 h-10 text-gold-300 mb-3 animate-pulse" />
                            <p className="font-sans text-xs text-[#B08D3E] font-bold tracking-wider">No photos uploaded for this event yet.</p>
                            <button
                              onClick={() => onOpenUploadDialog(event.key as 'haldi' | 'pradhanam' | 'wedding')}
                              className="font-sans text-[11px] text-[#B08D3E] bg-white shadow-xs border border-gold-300/30 hover:border-gold-300 duration-300 py-1.5 px-4 rounded-full mt-3 font-bold cursor-pointer"
                            >
                              Be the first to upload!
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 min-h-[220px]">
                            {eventImages.slice(0, 4).map((img, i) => (
                              <div
                                key={img.id}
                                className="group relative aspect-square overflow-hidden rounded-xl border border-gold-100 bg-gold-50 shadow-xs cursor-pointer hover:border-gold-300 transition-colors duration-300"
                              >
                                <img
                                  src={img.url}
                                  alt={img.caption || event.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 hover:brightness-100"
                                  referrerPolicy="no-referrer"
                                />
                                {img.caption && (
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="font-sans text-[9px] text-stone-200 tracking-wider truncate">
                                      {img.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}

                            {eventImages.length > 4 && (
                              <a
                                href="#gallery"
                                className="group aspect-square overflow-hidden rounded-xl border border-gold-300/40 bg-[#F8ECE7] hover:bg-gold-100 flex flex-col justify-center items-center text-center p-2 transition-all duration-300"
                              >
                                <span className="font-serif text-lg font-bold text-[#B08D3E] group-hover:scale-110 transition-transform duration-300 block">
                                  +{eventImages.length - 4}
                                </span>
                                <span className="font-sans text-[9px] uppercase tracking-wider text-[#B08D3E] font-bold block mt-1">
                                  View all
                                </span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
