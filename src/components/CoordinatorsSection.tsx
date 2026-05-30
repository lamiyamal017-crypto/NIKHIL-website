/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Coordinator } from '../types';

interface CoordinatorsProps {
  coordinators: Coordinator[];
}

export default function CoordinatorsSection({ coordinators }: CoordinatorsProps) {
  return (
    <section id="coordinators" className="py-20 px-4 bg-gold-50 border-y border-gold-100 select-none">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Any Questions?</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">Event Coordinators</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2">
            Reach out to our coordinators for help with food, lodging, or navigation
          </p>
        </div>

        {/* Column Grid: Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coordinators.map((coordinator, idx) => {
            const formattedPhone = coordinator.phone.replace(/[^0-9]/g, '');
            // Append 91 default India country code prefix if phone number is 10 digits
            const waPhone = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

            return (
              <motion.div
                key={coordinator.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gold-100 shadow-xs hover:shadow-md hover:border-gold-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Decoration Accent */}
                <div className="absolute top-4 right-4 text-gold-300 group-hover:text-gold-400 duration-300 pointer-events-none">
                  <ShieldCheck className="w-6 h-6 stroke-1 fill-gold-50/20" />
                </div>

                <div>
                  <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-gold-400 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-gold-300" /> Coordinator Card
                  </span>
                  <h3 className="font-serif text-2xl text-gold-900 font-bold group-hover:text-[#B08D3E] transition-colors duration-300">
                    {coordinator.name}
                  </h3>
                  <p className="font-sans text-xs text-stone-400 mt-0.5 tracking-widest uppercase font-bold">
                    {coordinator.role || 'Event Host'}
                  </p>
                  
                  {/* Phone Info Display */}
                  <div className="my-6 bg-[#F8ECE7] p-3 rounded-xl border border-gold-100 flex items-center justify-between font-mono text-sm text-gold-900 font-medium">
                    <span>Contact Number:</span>
                    <span className="font-bold tracking-wider">{coordinator.phone}</span>
                  </div>
                </div>

                {/* Direct Action Call buttons */}
                <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-[#F2E5D5] mt-2">
                  
                  {/* Call Button */}
                  <a
                    href={`tel:${coordinator.phone}`}
                    className="h-10 border border-gold-300 hover:border-[#B08D3E] bg-white hover:bg-gold-50 text-gold-900 hover:text-[#B08D3E] flex items-center justify-center gap-2 rounded-xl transition-all duration-300 font-sans text-[13px] font-bold shadow-xs focus:outline-none"
                  >
                    <Phone className="w-4 h-4 text-gold-400" />
                    Call Now
                  </a>

                  {/* WhatsApp Message */}
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-xl transition-colors duration-300 font-sans text-[13px] font-bold shadow-sm focus:outline-none"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    WhatsApp
                  </a>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
