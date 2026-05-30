/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface MemorialProps {
  title?: string;
  names?: string[];
}

export default function MemorialSection({ title = "In Loving Memory", names = ["Uppati Isaac Garu", "Uppati Rebecca Garu"] }: MemorialProps) {
  return (
    <section id="memorial" className="py-16 px-4 bg-gold-50 border-y border-gold-100 select-none">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-[1px] w-8 bg-gold-300" />
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">{title}</span>
          <div className="h-[1px] w-8 bg-gold-300" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-gold-900 tracking-wide mb-8">Honoring Our Ancestors</h2>
 
        {/* Elegant Tribute Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="relative max-w-2xl mx-auto rounded-r-2xl p-8 md:p-12 overflow-hidden shadow-sm bg-blush-105 border-l-2 border-gold-300"
          style={{
            backgroundColor: '#F8ECE7',
          }}
        >
          {/* Candle Flame Glow Background SVG */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 pointer-events-none bg-gradient-to-t from-gold-100/30 via-transparent to-transparent opacity-70" />
 
          {/* Elegant Memorial Candle Graphic */}
          <div className="flex flex-col items-center justify-center mb-6 relative">
            {/* Candle Lit Flame */}
            <div className="relative w-8 h-10 flex justify-center">
              {/* Core Flame */}
              <div className="absolute bottom-1 w-2.5 h-6 rounded-full bg-amber-400 blur-[0.5px] origin-bottom animate-pulse" />
              {/* Outer Glow */}
              <div className="absolute bottom-0 w-6 h-8 rounded-full bg-orange-300 blur-md opacity-70 animate-pulse" />
              {/* Wick */}
              <div className="absolute bottom-0 w-0.5 h-2 bg-gold-900" />
            </div>
            {/* Candle Body */}
            <div className="w-5 h-16 bg-gradient-to-r from-stone-100 via-stone-200 to-stone-300 rounded-sm border border-stone-400/20 shadow-inner relative overflow-hidden">
              {/* Golden Wax Drips */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-200/40 rounded-b-sm" />
              <div className="absolute top-0 left-1 w-1 h-3 bg-stone-300/60 rounded-full" />
              <div className="absolute top-0 right-1 w-1 h-5 bg-stone-300/40 rounded-full" />
            </div>
            {/* Candle Stand */}
            <div className="w-10 h-1 bg-stone-400 rounded-full shadow-md mt-0.5" />
          </div>
 
          {/* Memorial Text and Names */}
          <div className="relative z-10 max-w-lg mx-auto text-gold-900">
            <p className="font-sans text-xs md:text-sm text-gold-400 tracking-wider uppercase mb-6 leading-relaxed font-bold">
              With deep respect and eternal love, we remember our beloved grandparents who continue to bless us from heaven above
            </p>
 
            <div className="space-y-4">
              {names.map((name, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="font-serif text-2xl md:text-3xl text-gold-900 font-bold tracking-wide">
                    {name}
                  </span>
                  {idx < names.length - 1 && (
                    <div className="flex items-center gap-1.5 my-2">
                      <Sparkles className="w-3 h-3 text-gold-300" />
                      <div className="w-1.5 h-1.5 bg-gold-300 rounded-full" />
                      <Sparkles className="w-3 h-3 text-gold-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
 
            <p className="font-serif italic text-xs text-gold-900/70 mt-8 tracking-wider">
              "Gone from our sight, but never from our hearts. Your blessings guide us on this beautiful journey."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
