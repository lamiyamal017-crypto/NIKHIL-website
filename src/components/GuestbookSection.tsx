/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Send, Users, Heart, MessageSquare, Check, AlertCircle, Bookmark } from 'lucide-react';
import { GuestbookEntry } from '../types';

export default function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch approved entries
  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (!res.ok) throw new Error("Could not fetch guestbook entries");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to synchronize guestbook. Retrying...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // Refresh guestbook every 30 seconds for live interactions
    const interval = setInterval(fetchEntries, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setSubmitError('Please provide both your name and a sweet message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim(),
          message: message.trim()
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setName('');
        setRelationship('');
        setMessage('');
        // Re-fetch entries in case of instant approval (by default it goes to moderation)
        fetchEntries();
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Failed to record your blessing. Please try again.');
      }
    } catch {
      setSubmitError('Communication error. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Humanize relationship names for elegant display badges
  const getRelationshipBadgeStyles = (rel: string) => {
    const r = rel.toLowerCase();
    if (r.includes('groom') || r.includes('friend')) {
      return 'bg-gold-50 text-gold-800 border-gold-200';
    }
    if (r.includes('family') || r.includes('relative') || r.includes('parent')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (r.includes('bride') || r.includes('sister') || r.includes('brother')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-stone-50 text-stone-700 border-stone-200';
  };

  return (
    <section id="guestbook" className="py-24 px-4 bg-white select-none border-b border-gold-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold-300" />
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#B08D3E] font-bold">Showers of Blessings</span>
            <div className="h-[1px] w-8 bg-gold-300" />
          </div>
          <h2 className="font-serif text-3.5xl md:text-5xl text-gold-900 tracking-wide font-medium">The Wedding Guestbook</h2>
          <p className="font-sans text-stone-500 text-sm tracking-wider mt-2.5">
            Please share your prayers, warm wishes, and notes of love as we embark on this sacred lifetime adventure.
          </p>
        </div>

        {/* Content Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Submission Form Card (Left/Top) */}
          <div className="lg:col-span-5 bg-gold-50/50 rounded-2xl p-6 md:p-8 border border-gold-100 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F8ECE7] text-[#B08D3E] border border-gold-100 flex items-center justify-center shadow-xs shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-gold-900 leading-snug">Leave Your Blessings</h3>
                <p className="font-sans text-xs text-stone-400">Write a wedding message for Nikhil and Hismitha</p>
              </div>
            </div>

            {submitSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#F8ECE7]/60 border border-gold-300/30 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-gold-900">Sweet Blessing Received!</h4>
                <p className="font-sans text-stone-600 text-xs mt-2 leading-relaxed font-bold">
                  Thank you! By God's grace, your beautiful message has been successfully recorded and will appear in the guestbook upon review by the couple.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 text-xs text-[#B08D3E] hover:text-gold-900 hover:underline font-bold focus:outline-none"
                >
                  Write another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {submitError && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 font-sans text-xs rounded-r-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] font-bold block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-11 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl px-4 text-gold-900 font-sans text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Relationship to Couple */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] font-bold block mb-1">
                    Relationship to Couple (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Groom's Friend, Cousin, Colleagues"
                    value={relationship}
                    onChange={e => setRelationship(e.target.value)}
                    className="w-full h-11 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl px-4 text-gold-900 font-sans text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-[#B08D3E] font-bold block mb-1 font-bold">
                    Sweet Wedding Blessings *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your congratulations, prayers, and words of encouragement here..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#E8D5C8] focus:border-[#B08D3E] focus:ring-1 focus:ring-[#B08D3E] rounded-xl p-4 text-gold-900 font-sans text-sm focus:outline-none resize-none transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-gold-900 hover:bg-[#B08D3E] disabled:opacity-75 text-white rounded-xl font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 focus:outline-none transition-colors duration-300 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Sending blessing...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Message for Approval
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Active Guestbook Message Feed (Right/Bottom) */}
          <div className="lg:col-span-7 h-full flex flex-col justify-start">
            <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-6">
              <h3 className="font-serif text-2xl font-medium text-gold-900 tracking-wide flex items-center gap-2">
                Blessings & Wishes Feed <Sparkles className="w-4 h-4 text-gold-300 fill-gold-300/15" />
              </h3>
              <p className="font-sans text-xs text-stone-400 font-bold bg-[#F8ECE7] px-2.5 py-1 rounded-full border border-gold-100">
                {isLoading ? 'Syncing...' : `${entries.length} approved`}
              </p>
            </div>

            {isLoading ? (
              <div className="py-20 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-8 h-8 border-2 border-[#B08D3E] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="font-sans text-xs text-stone-400 font-medium">Syncing sacred wedding guestbook...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="py-16 px-6 text-center border-2 border-dashed border-gold-100 rounded-2xl bg-gold-50/15">
                <MessageSquare className="w-10 h-10 text-gold-300/65 mx-auto mb-3" />
                <h4 className="font-serif text-base text-gold-900 font-bold">Be the First to Bless them!</h4>
                <p className="font-sans text-stone-400 text-xs mt-1.5 leading-relaxed max-w-sm mx-auto">
                  No guest greetings have been verified or published yet. Write yours and submit it above to show your love!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {entries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                      className="bg-white rounded-xl p-5 border border-gold-100 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden"
                    >
                      {/* Decorative elements */}
                      <div className="absolute right-3 top-3 text-[#B08D3E]/10 pointer-events-none">
                        <Bookmark className="w-8 h-8 fill-current" />
                      </div>

                      {/* Header signature */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <span className="font-serif text-base text-gold-900 font-bold block pr-4">
                          {entry.name}
                        </span>
                        
                        {/* Optionally show relationship badge */}
                        {entry.relationship && (
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 shrink-0 ${getRelationshipBadgeStyles(entry.relationship)}`}>
                            <Users className="w-3 h-3" />
                            {entry.relationship}
                          </span>
                        )}
                      </div>

                      {/* Message Content */}
                      <p className="font-sans text-stone-605 text-sm leading-relaxed whitespace-pre-line tracking-wide pr-6 pl-1 italic border-l border-[#B08D3E]/30">
                        "{entry.message}"
                      </p>

                      {/* Date Indicator */}
                      <div className="mt-3.5 flex items-center justify-between text-[10px] text-stone-400 font-sans">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-gold-300 fill-gold-300/10" /> Warm prayers of celebration
                        </span>
                        <span className="font-mono bg-stone-50 border border-stone-200/50 rounded px-1.5 text-stone-450">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
