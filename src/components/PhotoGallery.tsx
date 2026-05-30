/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Camera, Eye, X, Image as ImageIcon, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
  onOpenUploadDialog: (category: 'haldi' | 'pradhanam' | 'wedding') => void;
}

type CategoryType = 'all' | 'haldi' | 'pradhanam' | 'wedding';

export default function PhotoGallery({ images, onOpenUploadDialog }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Filter images safely
  const filteredImages = images
    .filter(img => activeCategory === 'all' || img.category === activeCategory)
    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0)); // Newest first

  return (
    <section id="gallery" className="py-24 px-4 bg-gold-50 select-none relative overflow-hidden border-b border-gold-100">
      
      {/* Background Gold Accents */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-gold-300/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Sweet Memories</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">Wedding Photo Gallery</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2">
            Explore the beautiful moments captured across all ceremonies
          </p>
        </div>

        {/* Gallery Filter Navigation Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gold-100 pb-6 mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {([
              { key: 'all', label: 'All Photos' },
              { key: 'haldi', label: 'Haldi Gallery' },
              { key: 'pradhanam', label: 'Pradhanam Gallery' },
              { key: 'wedding', label: 'Wedding Gallery' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`font-sans text-xs tracking-wider uppercase px-5 py-2.5 rounded-full border transition-all duration-300 font-bold focus:outline-none cursor-pointer ${
                  activeCategory === tab.key
                    ? 'bg-[#B08D3E] border-[#B08D3E] text-white shadow-sm'
                    : 'bg-[#F8ECE7] border-[#E8D5C8] text-gold-900 hover:bg-gold-100 hover:border-gold-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick upload trigger inside gallery */}
          <button
            onClick={() => onOpenUploadDialog(activeCategory === 'all' ? 'wedding' : activeCategory)}
            className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase bg-gold-900 hover:bg-[#B08D3E] text-white duration-300 px-5 py-2.5 rounded-full shadow-sm font-bold focus:outline-none cursor-pointer"
          >
            <Camera className="w-4 h-4 text-gold-300 animate-pulse" />
            Upload Photo
          </button>
        </div>

        {/* Masonry Layout grid system */}
        <AnimatePresence mode="popLayout">
          {filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#F8ECE7] rounded-2xl border border-dashed border-gold-300/50 p-16 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]"
            >
              <ImageIcon className="w-12 h-12 text-gold-300 mb-4 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-gold-900 mb-1">No Photos Found</h3>
              <p className="font-sans text-xs text-stone-500 tracking-wider">
                Be the first to share your memories in our {activeCategory === 'all' ? 'ceremonies' : `${activeCategory}`} gallery!
              </p>
              <button
                onClick={() => onOpenUploadDialog(activeCategory === 'all' ? 'wedding' : activeCategory)}
                className="font-sans text-xs text-[#B08D3E] bg-[#F8ECE7] hover:bg-gold-300 hover:text-white border border-gold-300/40 hover:border-gold-300 duration-300 py-2 px-6 rounded-full mt-6 font-bold cursor-pointer"
              >
                Choose Photo
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="masonry-grid"
            >
              {filteredImages.map(img => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-gold-100 shadow-xs hover:shadow-md transition-all duration-300 aspect-[4/3]"
                >
                  {/* Photo Visual */}
                  <img
                    src={img.url}
                    alt={img.caption || "Wedding Memory"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* High Quality Overlay Grading Blend (Soft, dream-look vignette overlay) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />

                  {/* Category Stamp hover */}
                  <div className="absolute top-4 left-4 bg-[#2D2926] px-3.5 py-1 rounded-full border border-gold-300/40 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      {img.category}
                    </span>
                  </div>

                  {/* Caption & View Icon Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between z-10">
                    <div className="max-w-[80%]">
                      <p className="font-serif text-stone-100 text-base font-bold tracking-wide truncate">
                        {img.caption || 'Celebration Memory'}
                      </p>
                      <span className="font-sans text-stone-300 text-[10px] uppercase tracking-wider block mt-0.5">
                        Uploaded recently
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#B08D3E] text-white flex items-center justify-center border border-gold-300/40 shadow-xs">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Photo Lightbox Carousel */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 focus:outline-none select-none"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#2D2926] text-stone-100 hover:bg-[#B08D3E] transition-colors duration-300 border border-gold-300/20 shadow-lg focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || "Lightbox View"}
                  className="max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-gold-300/25 bg-black"
                  referrerPolicy="no-referrer"
                />
                
                {/* Lightbox Caption */}
                <div className="w-full text-center mt-6 text-stone-100 select-none px-4">
                  <span className="font-sans text-[10px] tracking-widest uppercase text-[#D4AF37] font-bold bg-[#2D2926] border border-gold-300/30 px-3.5 py-1 rounded-full">
                    {selectedImage.category} ceremony
                  </span>
                  <h4 className="font-serif text-xl font-bold tracking-wide mt-3 text-white">
                    {selectedImage.caption || 'Cherished Celebration Moments'}
                  </h4>
                  <p className="font-sans text-stone-300 text-xs mt-1 font-medium">
                    Shared for Nikhil &amp; Hismitha's Wedding
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
