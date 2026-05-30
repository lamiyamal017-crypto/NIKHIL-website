/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart, Share2, MessageSquareCode, Facebook, MessageCircleCode } from 'lucide-react';

export default function Footer() {
  const currentUrl = window.location.href;
  const shareText = "You're invited to celebrate the elegant Christian wedding of Nikhil Weds Hismitha on 4 June 2026! Access our wedding website for timelines, locations, and RSVP updates:";

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <footer className="py-12 bg-[#2D2926] border-t border-gold-300/10 text-[#F8ECE7]/80 select-none">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Decorative monogram */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gold-300/30" />
          <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/20" />
          <div className="h-[1px] w-12 bg-gold-300/30" />
        </div>

        {/* Brand */}
        <h3 className="font-serif text-3xl font-bold tracking-wide text-white">
          Nikhil <span className="text-[#D4AF37] font-sans text-xl italic font-light mx-1">weds</span> Hismitha
        </h3>
        <p className="font-sans text-xs tracking-widest text-gold-300/60 uppercase mt-1">
          4 June 2026 • Andhra Pradesh
        </p>

        {/* Share Section */}
        <div className="my-6 max-w-sm mx-auto">
          <p className="font-sans text-xs text-stone-300 tracking-wider mb-3 flex items-center justify-center gap-1.5 font-bold">
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Share Invitation with Family
          </p>
          <div className="flex justify-center gap-3">
            {/* WhatsApp Share */}
            <button
              onClick={shareOnWhatsApp}
              className="w-10 h-10 rounded-full bg-stone-900 hover:bg-emerald-600 hover:text-white border border-gold-300/10 transition-all duration-300 flex items-center justify-center focus:outline-none shadow-md group cursor-pointer"
            >
              <MessageCircleCode className="w-4 h-4 text-emerald-500 group-hover:text-white" />
            </button>

            {/* Facebook Share */}
            <button
              onClick={shareOnFacebook}
              className="w-10 h-10 rounded-full bg-stone-900 hover:bg-blue-600 hover:text-white border border-gold-300/10 transition-all duration-300 flex items-center justify-center focus:outline-none shadow-md group cursor-pointer"
            >
              <Facebook className="w-4 h-4 text-blue-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Verses & Copy */}
        <div className="border-t border-gold-300/10 pt-8 mt-6">
          <p className="font-serif italic text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
            "Therefore what God has joined together, let no one separate."<br />
            <span className="font-sans text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block mt-1">Mark 10:9</span>
          </p>
          <p className="font-sans text-[10px] text-stone-500 mt-6 tracking-wider">
            All rights reserved. Created with absolute love and grace. © {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
}
