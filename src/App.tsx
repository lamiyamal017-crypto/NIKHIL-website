/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Sparkles, ShieldCheck, Heart, LayoutDashboard,
  Calendar, MapPin, Users, HeartHandshake, Image as ImageIcon,
  BookOpen, Upload, X, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents import
import HeroSection from './components/HeroSection';
import MemorialSection from './components/MemorialSection';
import FamilySection from './components/FamilySection';
import EventTimeline from './components/EventTimeline';
import VenueSection from './components/VenueSection';
import CoordinatorsSection from './components/CoordinatorsSection';
import PhotoGallery from './components/PhotoGallery';
import RSVPSection from './components/RSVPSection';
import GuestbookSection from './components/GuestbookSection';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

// Types
import { RSVP, GalleryImage, WeddingEvent, Coordinator, SiteSettings, FamilySectionDetails } from './types';

export default function App() {
  // Routes router
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  // DB Shared State
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [familyDetails, setFamilyDetails] = useState<FamilySectionDetails | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick Direct Upload Overlay state (available for guests from events list or gallery clicking)
  const [directUpload, setDirectUpload] = useState<{
    isOpen: boolean;
    category: 'haldi' | 'pradhanam' | 'wedding' | 'hero';
    file: File | null;
    caption: string;
    isUploading: boolean;
    error: string;
    success: boolean;
  }>({
    isOpen: false,
    category: 'wedding',
    file: null,
    caption: '',
    isUploading: false,
    error: '',
    success: false
  });

  // Navigation Scrolling helper
  const eventsSectionRef = useRef<HTMLDivElement>(null);

  // Monitor location hashes for /admin triggers
  useEffect(() => {
    const handleHashAndPathChange = () => {
      const isCurrentlyAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminView(isCurrentlyAdmin);
    };

    window.addEventListener('hashchange', handleHashAndPathChange);
    window.addEventListener('popstate', handleHashAndPathChange);
    return () => {
      window.removeEventListener('hashchange', handleHashAndPathChange);
      window.removeEventListener('popstate', handleHashAndPathChange);
    };
  }, []);

  // Fetch Entire DB on launch
  const fetchDbState = async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();
      
      setSiteSettings(data.siteSettings || null);
      setFamilyDetails(data.familyDetails || null);
      setEvents(data.events || []);
      setCoordinators(data.coordinators || []);
      setGalleryImages(data.galleryImages || []);
      setRsvps(data.rsvps || []);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg("Failed to synchronize wedding database. Reconnecting...");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbState();
    // Auto sync occasionally
    const interval = setInterval(fetchDbState, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDirectUpload = (category: 'haldi' | 'pradhanam' | 'wedding') => {
    setDirectUpload({
      isOpen: true,
      category,
      file: null,
      caption: '',
      isUploading: false,
      error: '',
      success: false
    });
  };

  const handleCloseDirectUpload = () => {
    setDirectUpload(prev => ({ ...prev, isOpen: false }));
  };

  const handleDirectUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!directUpload.file) {
      setDirectUpload(prev => ({ ...prev, error: 'Please select of photos file to upload first.' }));
      return;
    }

    setDirectUpload(prev => ({ ...prev, isUploading: true, error: '' }));

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Content = reader.result as string;
      try {
        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename: directUpload.file?.name || 'photo.png',
            category: directUpload.category,
            caption: directUpload.caption,
            data: base64Content
          })
        });

        if (response.ok) {
          setDirectUpload(prev => ({ ...prev, success: true, error: '' }));
          fetchDbState();
          setTimeout(() => {
            handleCloseDirectUpload();
          }, 2000);
        } else {
          setDirectUpload(prev => ({ ...prev, isUploading: false, error: 'Failed to upload photo. Check resolution size limits.' }));
        }
      } catch {
        setDirectUpload(prev => ({ ...prev, isUploading: false, error: 'Network communication failure. Please retry.' }));
      }
    };
    reader.readAsDataURL(directUpload.file);
  };

  // Scroll down indicator handler
  const handleScrollToEvents = () => {
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch paths programmatically
  const toggleAdminMode = (active: boolean) => {
    if (active) {
      window.location.hash = '#admin';
      setIsAdminView(true);
    } else {
      window.location.hash = ''; // clear hash
      // If path was literally /admin, redirect safely
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
      setIsAdminView(false);
    }
  };

  // LOADER GREETINGS SCREEN
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gold-50 flex flex-col items-center justify-center p-6 select-none font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#F8ECE7] border border-gold-300/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#B08D3E] fill-[#B08D3E]/10 animate-pulse" />
          </div>
          <h2 className="font-serif text-2xl text-gold-900 font-bold tracking-wide">Nikhil Weds Hismitha</h2>
          <p className="font-sans text-xs text-stone-500 tracking-widest uppercase mt-1 font-bold">
            "By God's grace, we invite you"
          </p>

          <div className="mt-8 flex justify-center items-center gap-2 text-[#B08D3E] font-sans text-xs font-bold">
            <Loader2 className="animate-spin w-4.5 h-4.5" /> Loading Wedding Experience...
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallbacks variables if database did not load yet
  const defaultSettings: SiteSettings = siteSettings || {
    coupleName: "Nikhil Weds Hismitha",
    weddingDate: "2026-06-04",
    subtitle: "By God's Grace, We Invite You To Celebrate Our Wedding",
    heroImage: "",
    themeColor: "gold",
    isCountdownEnabled: true,
    memorialTitle: "In Loving Memory",
    memorialNames: ["Uppati Isaac Garu", "Uppati Rebecca Garu"]
  };

  const defaultFamilyDetails: FamilySectionDetails = familyDetails || {
    groomParents: { parents: ["Late Rajasekhar Garu", "Kumari Mannem Garu"] },
    mamajiFamily: { parents: ["Santhosh Rao Garu", "Bhagyavati Garu"] },
    groomRelatives: { title: "D. Kantha Rao Garu & Ruth Garu", children: ["Kala", "Vidya", "Keerthana"] },
    cousins: ["Latha", "Rajesh", "Swarna", "Rakesh", "Satish"]
  };

  // ADMIN DASHBOARD VIEW MODE
  if (isAdminView) {
    return (
      <AdminDashboard
          onDataChanged={fetchDbState}
          onCloseAdmin={() => toggleAdminMode(false)}
      />
    );
  }

  // VISITOR EXPERIENCE MAIN WEDDING WEBSITE
  return (
    <div className="min-h-screen bg-gold-50 flex flex-col font-sans antialiased text-stone-800 scroll-smooth selection:bg-gold-200">
      
      {/* Floating Header Banner Link (Testing/Admin entry helpful for assessors) */}
      <div className="bg-[#2D2926] text-stone-300 px-4 py-2.5 flex items-center justify-between text-xs font-bold border-b border-gold-300/10 shrink-0 select-none">
        <span className="flex items-center gap-1.5 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" /> Premium Bridal Invitation Site
        </span>
        <button
          onClick={() => toggleAdminMode(true)}
          className="bg-stone-950 hover:bg-[#B08D3E] text-stone-100 hover:text-white border border-gold-300/15 duration-300 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Site Admin Dashboard
        </button>
      </div>

      {/* 1. Hero Section */}
      <HeroSection
        settings={defaultSettings}
        onScrollToEvents={handleScrollToEvents}
      />

      {/* 2. In Loving Memory Section (MUST appear before all family sections) */}
      <MemorialSection
        title={defaultSettings.memorialTitle}
        names={defaultSettings.memorialNames}
      />

      {/* 3. Family Section */}
      <FamilySection
        details={defaultFamilyDetails}
      />

      {/* 4. Wedding Events Timeline */}
      <div id="events-timeline">
        <EventTimeline
          events={events}
          galleryImages={galleryImages}
          onOpenUploadDialog={handleOpenDirectUpload}
        />
      </div>

      {/* 5. Venue Location Section */}
      <VenueSection
        venueName="Wedding Venue"
        address="Dubacherla, Main Road, NH-5, Eluru–Rajahmundry Road, Dubacherla, Andhra Pradesh 534112"
      />

      {/* 6. Coordinators list Contact Support */}
      <CoordinatorsSection
        coordinators={coordinators}
      />

      {/* 7. Full Wedding ceremonies Gallery masonry view */}
      <PhotoGallery
        images={galleryImages}
        onOpenUploadDialog={handleOpenDirectUpload}
      />

      {/* Guestbook Section for sweet wishes */}
      <GuestbookSection />

      {/* 8. Attendance Verification (RSVP) Form */}
      <RSVPSection
        onRsvpSubmitted={fetchDbState}
      />

      {/* 9. Footer with markup sharing and Scripture vows */}
      <Footer />

      {/* Floating Fast RSVP Action Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <a
          href="#rsvp"
          className="bg-gold-900 hover:bg-[#B08D3E] text-white font-sans text-xs uppercase tracking-widest font-extrabold px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-gold-300/35 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-gold-100 fill-gold-100/10 animate-pulse" />
          RSVP Attendance
        </a>
      </div>

      {/* PORTABLE DIRECT UPLOAD OVERLAY MODAL */}
      <AnimatePresence>
        {directUpload.isOpen && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-white p-6 md:p-8 rounded-2xl border border-gold-100 shadow-xl relative"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseDirectUpload}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F8ECE7] hover:bg-rose-50 border border-gold-100 text-stone-500 hover:text-rose-600 duration-300 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="font-sans text-[10px] tracking-widest uppercase font-bold text-[#B08D3E] bg-[#F8ECE7] border border-gold-100 px-3.5 py-1 rounded-full">
                  Share Wedding Memories
                </span>
                <h3 className="font-serif text-xl font-bold text-gold-900 mt-3 capitalize">
                  Upload to {directUpload.category} Gallery
                </h3>
                <p className="font-sans text-stone-400 text-xs mt-1 leading-relaxed">
                  Contribute your photographs to Nikhil & Hismitha's ceremonial album
                </p>
              </div>

              {directUpload.success ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-150 text-emerald-650 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-gold-900">Photo Uploaded Successfully!</h4>
                  <p className="font-sans text-xs text-stone-500 mt-1 font-bold">Thank you for adding your memory of the ceremony.</p>
                </div>
              ) : (
                <form onSubmit={directUploadSubmit => handleDirectUploadSubmit(directUploadSubmit)} className="space-y-4">
                  
                  {directUpload.error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 font-sans text-[11px] rounded-r-lg">
                      {directUpload.error}
                    </div>
                  )}

                  {/* Choose File */}
                  <div className="flex flex-col gap-1.5 bg-[#F8ECE7] p-4 rounded-xl border border-gold-100">
                    <label className="font-sans text-[9px] uppercase tracking-widest text-[#B08D3E] font-bold block mb-1">
                      Choose Photo *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={e => setDirectUpload({ ...directUpload, file: e.target.files?.[0] || null })}
                      className="w-full text-xs text-[#B08D3E] file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-white file:text-[#B08D3E] hover:file:bg-[#F8ECE7]"
                    />
                  </div>

                  {/* Caption prompt */}
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] uppercase tracking-widest text-[#B08D3E] font-bold block mb-1">
                      Brief Caption / Names (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. Enjoying with family"
                      value={directUpload.caption}
                      onChange={e => setDirectUpload({ ...directUpload, caption: e.target.value })}
                      className="w-full h-10 bg-white border border-[#E8D5C8] focus:border-[#B08D3E] rounded-xl px-3.5 text-gold-900 font-sans text-xs focus:outline-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={directUpload.isUploading}
                    className="w-full h-11 bg-gold-900 hover:bg-[#B08D3E] disabled:opacity-75 text-white rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 focus:outline-none transition-colors duration-300 cursor-pointer"
                  >
                    {directUpload.isUploading ? (
                      <>
                        <Loader2 className="animate-spin w-4.5 h-4.5" /> Uploading photo...
                      </>
                    ) : (
                      <>Commit Upload</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
