/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Users, Heart, Users2, Sparkles } from 'lucide-react';
import { FamilySectionDetails } from '../types';

interface FamilyProps {
  details: FamilySectionDetails;
}

export default function FamilySection({ details }: FamilyProps) {
  // Safe fallbacks to prevent errors if details is missing fields
  const groomParents = details?.groomParents?.parents || ["Late Rajasekhar Garu", "Kumari Mannem Garu"];
  const mamajiFamily = details?.mamajiFamily?.parents || ["Santhosh Rao Garu", "Bhagyavati Garu"];
  const groomRelatives = details?.groomRelatives || {
    title: "D. Kantha Rao Garu & Ruth Garu",
    children: ["Kala", "Vidya", "Keerthana"]
  };
  const cousins = details?.cousins || ["Latha", "Rajesh", "Swarna", "Rakesh", "Satish"];

  return (
    <section id="family" className="py-20 px-4 bg-gold-50 select-none border-b border-gold-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Beloved Family</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">The Groom's Family</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2 bg-gradient-to-r from-transparent via-gold-100 to-transparent max-w-lg mx-auto py-1">
            "Blessed with love, guided by traditions"
          </p>
        </div>

        {/* Family Cards Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card: Groom's Parents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative rounded-2xl p-8 bg-white border border-gold-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Top gold ribbon line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gold-300 rounded-t-2xl" />
            
            <div>
              <div className="w-12 h-12 rounded-full bg-blush-100 border border-gold-300/40 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-300 group-hover:text-white transition-all duration-500">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-serif text-xl text-gold-900 tracking-wide mb-1 font-bold">Groom's Parents</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] mb-6 font-bold">Family Pillars</p>
              
              <div className="space-y-4">
                <div className="border-l-2 border-gold-300 pl-4">
                  <span className="font-serif text-lg text-gold-900 font-bold block">{groomParents[0]}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400 block mt-0.5">Late Father</span>
                </div>
                
                <div className="flex items-center text-stone-400 pl-4 py-1">
                  <span className="text-xs italic font-serif">&amp;</span>
                </div>

                <div className="border-l-2 border-gold-300 pl-4">
                  <span className="font-serif text-lg text-gold-900 font-bold block">{groomParents[1]}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400 block mt-0.5">Mother</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F2E5D5] flex justify-end">
              <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 font-bold">Blessings</span>
            </div>
          </motion.div>

          {/* Card: Mamaji Family */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group relative rounded-2xl p-8 bg-white border border-gold-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Top gold ribbon line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gold-300 rounded-t-2xl" />

            <div>
              <div className="w-12 h-12 rounded-full bg-blush-100 border border-gold-300/40 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-300 group-hover:text-white transition-all duration-500">
                <Users2 className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-serif text-xl text-gold-900 tracking-wide mb-1 font-bold">Mamaji Family</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] mb-6 font-bold">Beloved Uncle &amp; Aunt</p>

              <div className="space-y-4">
                <div className="border-l-2 border-gold-300 pl-4">
                  <span className="font-serif text-lg text-gold-900 font-bold block">{mamajiFamily[0]}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400 block mt-0.5">Mamaji</span>
                </div>

                <div className="flex items-center text-stone-400 pl-4 py-1">
                  <span className="text-xs italic font-serif">&amp;</span>
                </div>

                <div className="border-l-2 border-gold-300 pl-4">
                  <span className="font-serif text-lg text-gold-900 font-bold block">{mamajiFamily[1]}</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-stone-400 block mt-0.5">Mami Garu</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F2E5D5] flex justify-end">
              <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 font-bold">Pillars of Love</span>
            </div>
          </motion.div>

          {/* Card: Groom's Relatives / Children */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative rounded-2xl p-8 bg-white border border-gold-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            {/* Top gold ribbon line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gold-300 rounded-t-2xl" />

            <div>
              <div className="w-12 h-12 rounded-full bg-blush-100 border border-gold-300/40 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-300 group-hover:text-white transition-all duration-500">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-gold-900 tracking-wide mb-1 font-bold">{groomRelatives.title}</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] mb-6 font-bold">Groom's Relatives</p>

              <div className="space-y-3 bg-[#F8ECE7] p-4 rounded-xl border border-gold-100">
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#B08D3E] font-bold block border-b border-[#E8D5C8]/45 pb-1.5">Children</span>
                <ul className="space-y-2">
                  {groomRelatives.children.map((child, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-300" />
                      <span className="font-serif text-base text-gold-900 font-bold">{child}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F2E5D5] flex justify-end">
              <span className="text-[10px] font-sans tracking-widest uppercase text-stone-400 font-bold">Family Roots</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner Section: Close Family Cousins */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-12 group relative rounded-2xl p-8 md:p-10 bg-white border border-[#F2E5D5] shadow-xs"
        >
          {/* Subtle floral background pattern or sparkle overlay */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
            <Sparkles className="w-24 h-24 text-gold-300" />
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold-300" />
                <h4 className="font-serif text-lg font-semibold text-gold-900">Close Family Cousins</h4>
              </div>
              <p className="font-sans text-xs text-stone-500 tracking-wider">
                Walking shoulder to shoulder, sharing laughter and everlasting support for Nikhil on his beautiful journey.
              </p>
            </div>

            {/* List of Elegant Cousins Tags */}
            <div className="flex flex-wrap gap-2.5 max-w-xl lg:justify-end">
              {cousins.map((cousin, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8ECE7] border border-[#E8D5C8] px-4 py-2 rounded-full shadow-xs hover:border-gold-300 transition-colors duration-300 flex items-center gap-1.5 group/tag cursor-pointer animate-fade"
                >
                  <div className="w-1 h-1 rounded-full bg-gold-300 group-hover/tag:scale-150 transition-transform duration-300" />
                  <span className="font-serif text-sm font-semibold text-gold-900 group-hover/tag:text-gold-500 transition-colors duration-300">
                    {cousin}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
