/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MailCheck, Users, Phone, Smile, Compass, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RsvpProps {
  onRsvpSubmitted: () => void;
}

export default function RSVPSection({ onRsvpSubmitted }: RsvpProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guestsCount: 1,
    attending: true,
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP. Please try again.');
      }

      setStatus('success');
      onRsvpSubmitted();
      
      // Auto-reset form after success display
      setTimeout(() => {
        setFormData({ name: '', phone: '', guestsCount: 1, attending: true, message: '' });
        setStatus('idle');
      }, 5000);
      
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Check your connection.');
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="py-24 px-4 relative overflow-hidden bg-gold-50 select-none border-b border-gold-100">
      
      {/* Decorative floral or heart vectors */}
      <div className="absolute top-12 left-12 opacity-5 pointer-events-none">
        <MailCheck className="w-40 h-40 text-[#B08D3E]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">Join Our Day</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">Verify Attendance (RSVP)</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2">
            Be part of our special celebrations. Let us know if you can make it before the date!
          </p>
        </div>

        {/* Combined RSVP Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-gold-100 bg-white shadow-xs"
        >
          {/* Card Top Banner */}
          <div className="bg-[#B08D3E] p-8 text-center text-white relative">
            <h3 className="font-serif text-2xl font-bold tracking-wide">Are You Requesting Attendance?</h3>
            <p className="font-sans text-[11px] uppercase tracking-widest text-[#F8ECE7] mt-1 font-bold">
              Submission syncs live to the wedding coordinator list
            </p>
          </div>

          {/* Form / Success screen Toggle */}
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle className="w-8 h-8 font-bold" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-gold-900 tracking-wide">RSVP Submitted Securely!</h4>
                  <p className="font-sans text-stone-500 text-sm tracking-wider mt-2 max-w-sm">
                    Thank you so much! Your response has been recorded. The wedding coordinators have been notified.
                  </p>
                  <p className="font-mono text-[10px] text-stone-400 mt-6 tracking-widest uppercase">
                    Looking forward to celebrating with you!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg font-sans text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* Dual Grid Name and phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rsvp-name" className="font-sans text-xs uppercase tracking-widest text-[#B08D3E] block font-bold">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          id="rsvp-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="E.g. Samuel Robert"
                          className="w-full h-11 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl px-4 pl-10 text-gold-900 font-sans text-sm tracking-wide focus:outline-none transition-colors"
                        />
                        <Smile className="w-4 h-4 text-stone-400 absolute left-3.5 top-[14px]" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rsvp-phone" className="font-sans text-xs uppercase tracking-widest text-[#B08D3E] block font-bold">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          id="rsvp-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full h-11 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl px-4 pl-10 text-gold-900 font-mono text-sm tracking-wider focus:outline-none transition-colors"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-[14px]" />
                      </div>
                    </div>
                  </div>

                  {/* RSVP attending status Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Attending Toggle */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-sans text-xs uppercase tracking-widest text-[#B08D3E] block font-bold">
                        Attending Status *
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, attending: true })}
                          className={`h-11 rounded-xl font-sans text-xs font-bold tracking-widest uppercase border transition-all duration-300 focus:outline-none cursor-pointer ${
                            formData.attending
                              ? 'bg-gold-50 border-[#B08D3E] text-[#B08D3E] shadow-xs font-black'
                              : 'bg-white border-[#E8D5C8] text-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          Yes, Attending
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, attending: false })}
                          className={`h-11 rounded-xl font-sans text-xs font-bold tracking-widest uppercase border transition-all duration-300 focus:outline-none cursor-pointer ${
                            !formData.attending
                              ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs font-black'
                              : 'bg-white border-[#E8D5C8] text-stone-100 hover:bg-stone-50'
                          }`}
                        >
                          No, Sorry
                        </button>
                      </div>
                    </div>

                    {/* Guests count */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rsvp-guests" className="font-sans text-xs uppercase tracking-widest text-[#B08D3E] block font-bold">
                        Number of Guests
                      </label>
                      <div className="relative">
                        <select
                          id="rsvp-guests"
                          value={formData.guestsCount}
                          disabled={!formData.attending}
                          onChange={e => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                          className="w-full h-11 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl px-4 pl-10 text-gold-900 font-sans text-sm focus:outline-none appearance-none transition-colors disabled:opacity-50 disabled:bg-stone-100"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-[14px]" />
                        <div className="absolute right-3.5 top-[18px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-stone-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-message" className="font-sans text-xs uppercase tracking-widest text-[#B08D3E] block font-bold">
                      Blessing / Message
                    </label>
                    <div className="relative">
                      <textarea
                        id="rsvp-message"
                        rows={3}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write a warm note of blessing to Nikhil & Hismitha..."
                        className="w-full bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl p-3 text-gold-900 font-sans text-sm tracking-wide focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full h-12 bg-gold-900 hover:bg-[#B08D3E] disabled:opacity-75 text-white rounded-xl font-sans text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 shadow-sm focus:outline-none cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Response...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-gold-200 fill-gold-200/10" />
                        Send RSVP Response
                      </>
                    )}
                  </button>

                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
