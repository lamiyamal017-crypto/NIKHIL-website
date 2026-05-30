/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onScrollToEvents: () => void;
}

export default function HeroSection({ settings, onScrollToEvents }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const targetDate = new Date(`${settings.weddingDate}T10:30:00+05:30`); // Indian Standard Time (IST) offset

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings.weddingDate]);

  // Default gorgeous Christian couple theme image from Unsplash if none is uploaded
  const defaultHero = "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=2000";
  const heroImageSrc = settings.heroImage || defaultHero;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-stone-50 select-none pb-12">
      {/* Background Image with Cinematic Filter & Lighting Enhancements */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroImageSrc}
          alt="Nikhil & Hismitha"
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] saturate-[1.1] sepia-[0.05]"
          style={{ objectPosition: 'center 30%' }}
          referrerPolicy="no-referrer"
        />
        {/* Soft Dreamy Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(28,25,23,0.7)_100%]" />
        
        {/* Soft Golden Glow Filter Overlay (adds creamy ambient wedding warmth without altering natural skin tones) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold-900/45 via-gold-500/10 to-stone-900/40 mix-blend-color-burn opacity-80" />
        
        {/* Animated Light Beam Rays (Simulating church/divine blessing rays) */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-gold-200/10 via-transparent to-transparent opacity-60 mix-blend-overlay rotate-12 origin-top-left scale-150 animate-pulse pointer-events-none" />
      </div>

      {/* Floating Sparkles in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white rounded-full animate-ping delay-100" />
        <div className="absolute top-[40%] right-[20%] w-3 h-3 bg-gold-200 rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-[30%] left-[25%] o-2 h-2 bg-white rounded-full animate-pulse delay-500" />
      </div>

      {/* Top Header / Scripture Blessing */}
      <div className="relative z-10 w-full text-center pt-8 px-4">
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-200 font-medium bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-gold-200/20 inline-block shadow-lg">
          Holy Matrimony
        </span>
      </div>

      {/* Hero Content (Nikhil & Hismitha) */}
      <div className="relative z-10 text-center px-4 max-w-4xl my-auto flex flex-col items-center">
        {/* Monogram/Heart Accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-4 bg-stone-900/65 backdrop-blur-md p-4 rounded-full border border-gold-400/30 shadow-2xl relative"
        >
          <Heart className="w-8 h-8 text-gold-300 fill-gold-400/20 animate-pulse" />
          <div className="absolute -inset-1 rounded-full border border-gold-200/10 animate-ring-glow" />
        </motion.div>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-50 tracking-wide leading-tight drop-shadow-2xl"
        >
          Nikhil <span className="text-gold-200 text-3xl md:text-5xl font-sans font-light italic block md:inline mx-2 md:mx-4">weds</span> Hismitha
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-sans text-stone-200 text-base md:text-xl font-light tracking-wide mt-4 drop-shadow max-w-2xl text-center leading-relaxed"
        >
          "{settings.subtitle}"
        </motion.p>

        {/* Verse / Quote Overlay at the bottom of couple photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="mt-6 md:mt-8 max-w-lg bg-stone-900/60 backdrop-blur-xs p-5 rounded-xl border border-stone-100/10 shadow-lg text-center font-serif text-xs md:text-sm text-stone-200 italic leading-relaxed tracking-wide shadow-gold-500/5"
        >
          <span className="text-gold-300 text-base block mb-1">“</span>
          Love is patient, love is kind. It does not envy, it does not boast, it is not proud...
          <span className="text-gold-300 text-base block mt-1">”</span>
          <span className="text-gold-300 font-sans tracking-widest text-[10px] uppercase block mt-1 font-medium">— 1 Corinthians 13:4-7</span>
        </motion.div>
      </div>

      {/* Live Pre-populated Wedding Info & Countdown Timer */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center">
        {/* Date, Location Summary */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-stone-100">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 font-sans text-sm tracking-wider">
            <Calendar className="w-4 h-4 text-gold-300" />
            <span>{new Date(settings.weddingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 font-sans text-sm tracking-wider">
            <MapPin className="w-4 h-4 text-gold-300" />
            <span>Andhra Pradesh, India</span>
          </div>
        </div>

        {/* Countdown Timer */}
        {settings.isCountdownEnabled && (
          <div className="w-full max-w-2xl bg-stone-900/75 backdrop-blur-md rounded-2xl p-6 border border-gold-300/20 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-600 px-4 py-0.5 rounded-full border border-gold-400">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-100 fill-gold-100" /> Countdown to Vows
              </span>
            </div>
            
            {timeLeft.isOver ? (
              <p className="text-center font-serif text-xl md:text-2xl text-gold-300 py-4 font-semibold tracking-wide">
                We are officially married! Thank you for celebrating with us! 🎉
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div key={idx} className="bg-stone-950/40 p-2 md:p-3 rounded-lg border border-white/5">
                    <span className="font-serif text-3xl md:text-5xl font-bold text-gold-100 block tracking-tight">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-gold-400 block mt-1 font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scroll Indicator */}
        <button
          onClick={onScrollToEvents}
          className="mt-8 flex flex-col items-center gap-1 text-stone-300 hover:text-gold-200 transition-colors duration-300 focus:outline-none group"
        >
          <span className="font-sans text-xs tracking-widest uppercase font-light">Scroll Down</span>
          <div className="bg-black/30 p-1.5 rounded-full border border-white/10 group-hover:bg-gold-500/20 transition-all duration-300">
            <ChevronDown className="w-4 h-4 text-gold-300 animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}
