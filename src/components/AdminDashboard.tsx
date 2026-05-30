/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Lock, KeyRound, Grid, Users, Image as ImageIcon, Calendar,
  PhoneCall, Settings2, Trash2, Search, ArrowDownToLine, Plus,
  Sparkles, Save, LogOut, Loader2, Upload, MoveUp, MoveDown,
  BookOpen, CheckCheck, ShieldAlert
} from 'lucide-react';
import { RSVP, GalleryImage, WeddingEvent, Coordinator, SiteSettings, FamilySectionDetails, GuestbookEntry } from '../types';
import { motion } from 'motion/react';

interface AdminProps {
  onDataChanged: () => void;
  onCloseAdmin: () => void;
}

export default function AdminDashboard({ onDataChanged, onCloseAdmin }: AdminProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // DB States
  const [activeTab, setActiveTab] = useState<'overview' | 'rsvps' | 'gallery' | 'events' | 'coordinators' | 'guestbook' | 'site_settings'>('overview');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [familyDetails, setFamilyDetails] = useState<FamilySectionDetails | null>(null);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [isGuestbookLoading, setIsGuestbookLoading] = useState(false);
  const [dbType, setDbType] = useState<'local' | 'supabase'>('local');

  // Search/Filters
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'attending' | 'not-attending'>('all');

  // Photo uploads state
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    category: 'wedding' as 'haldi' | 'pradhanam' | 'wedding' | 'hero',
    caption: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Save changes loader states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Check auth session on load
  useEffect(() => {
    const token = localStorage.getItem('sunny_wedding_token');
    if (token === 'session_token_sunny_wedding') {
      setIsAuthenticated(true);
      fetchLiveDb();
    }
  }, []);

  const fetchLiveDb = async () => {
    try {
      const response = await fetch('/api/db');
      const data = await response.json();
      setRsvps(data.rsvps || []);
      setGalleryImages(data.galleryImages || []);
      setEvents(data.events || []);
      setCoordinators(data.coordinators || []);
      setSiteSettings(data.siteSettings || null);
      setFamilyDetails(data.familyDetails || null);
    } catch (err) {
      console.error("Error fetching db state", err);
    }
  };

  const fetchGuestbookEntries = async () => {
    setIsGuestbookLoading(true);
    try {
      const token = localStorage.getItem('sunny_wedding_token');
      const res = await fetch('/api/guestbook/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const body = await res.json();
        setGuestbookEntries(body.entries || []);
        setDbType(body.dbType || 'local');
      }
    } catch (err) {
      console.error("Error fetching admin guestbook entries", err);
    } finally {
      setIsGuestbookLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'guestbook' && isAuthenticated) {
      fetchGuestbookEntries();
    }
  }, [activeTab, isAuthenticated]);

  const handleToggleApproveGuestbook = async (id: string, currentApproved: boolean) => {
    try {
      const token = localStorage.getItem('sunny_wedding_token');
      const res = await fetch(`/api/guestbook/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentApproved })
      });
      if (res.ok) {
        setGuestbookEntries(prev => prev.map(e => e.id === id ? { ...e, isApproved: !currentApproved } : e));
        onDataChanged();
      } else {
        alert("Failed to update verification status.");
      }
    } catch {
      alert("Error occurred while verifying entry.");
    }
  };

  const handleDeleteGuestbook = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this guest blessing?")) return;
    try {
      const token = localStorage.getItem('sunny_wedding_token');
      const res = await fetch(`/api/guestbook/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setGuestbookEntries(prev => prev.filter(e => e.id !== id));
        onDataChanged();
      } else {
        alert("Failed to delete entry.");
      }
    } catch {
      alert("Error deleting guestbook entry.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const body = await res.json();
        localStorage.setItem('sunny_wedding_token', body.token);
        setIsAuthenticated(true);
        fetchLiveDb();
      } else {
        setLoginError('Invalid dashboard password.');
      }
    } catch {
      setLoginError('Network failure. Please retry.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sunny_wedding_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  // RSVP: Delete
  const handleDeleteRsvp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this RSVP record?")) return;
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRsvps(prev => prev.filter(r => r.id !== id));
        onDataChanged();
      }
    } catch (err) {
      alert("Error deleting record.");
    }
  };

  // RSVP: Export CSV helper
  const handleExportCsv = () => {
    const headers = ["ID", "Name", "Phone", "Guests Count", "Attending", "Message", "Created At"];
    const rows = rsvps.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.phone,
      r.guestsCount,
      r.attending ? "Yes" : "No",
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.createdAt
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wedding-rsvp-submissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gallery: Upload base64
  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      setUploadError('Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Content = reader.result as string;
      try {
        const res = await fetch('/api/gallery/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: uploadData.file?.name || 'photo.png',
            category: uploadData.category,
            caption: uploadData.caption,
            data: base64Content
          })
        });

        if (res.ok) {
          const body = await res.json();
          setGalleryImages(prev => [...prev, body.image]);
          setUploadData({ file: null, category: 'wedding', caption: '' });
          // Reset file input label
          const inp = document.getElementById('gallery-file-input') as HTMLInputElement;
          if (inp) inp.value = '';
          
          onDataChanged();
          alert("Image uploaded successfully!");
        } else {
          setUploadError('Failed to upload image. Please check size limits.');
        }
      } catch (err) {
        setUploadError('Network connection issue.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(uploadData.file);
  };

  // Gallery: Delete image
  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleryImages(prev => prev.filter(g => g.id !== id));
        onDataChanged();
      }
    } catch {
      alert("Failed to delete.");
    }
  };

  // Gallery: Reorder position
  const handleMoveImage = async (id: string, direction: 'up' | 'down') => {
    const index = galleryImages.findIndex(g => g.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryImages.length - 1) return;

    const newImages = [...galleryImages];
    const swapWithIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newImages[index].order;
    newImages[index].order = newImages[swapWithIndex].order;
    newImages[swapWithIndex].order = tempOrder;

    // Swap elements in state
    const tempVal = newImages[index];
    newImages[index] = newImages[swapWithIndex];
    newImages[swapWithIndex] = tempVal;

    setGalleryImages(newImages);

    // Save orders list
    try {
      await fetch('/api/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: newImages.map(img => ({ id: img.id, order: img.order }))
        })
      });
      onDataChanged();
    } catch (err) {
      console.error("Failed to reorder in database", err);
    }
  };

  // PUT updates payload helper
  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteSettings, familyDetails })
      });

      // Save events
      const resEv = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });

      // Save coordinators
      const resCoord = await fetch('/api/coordinators', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinators })
      });

      if (res.ok && resEv.ok && resCoord.ok) {
        setSaveSuccessMsg('All configurations saved successfully!');
        onDataChanged();
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert("Some items failed to save.");
      }
    } catch {
      alert("Error occurred while saving configurations.");
    } finally {
      setIsSaving(false);
    }
  };

  // RSVP filter computational logic
  const filteredRsvps = rsvps.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(rsvpSearch.toLowerCase()) || r.phone.includes(rsvpSearch);
    if (rsvpFilter === 'attending') return matchesSearch && r.attending;
    if (rsvpFilter === 'not-attending') return matchesSearch && !r.attending;
    return matchesSearch;
  });

  const totals = {
    all: rsvps.length,
    attending: rsvps.filter(r => r.attending).reduce((sum, item) => sum + item.guestsCount, 0),
    notAttendingCount: rsvps.filter(r => !r.attending).length,
    attendingCardsCount: rsvps.filter(r => r.attending).length,
    photos: galleryImages.length,
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-stone-900 flex items-center justify-center p-4 z-50 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-stone-950 p-8 rounded-2xl border border-gold-300/20 shadow-2xl text-center"
        >
          <div className="w-14 h-14 bg-gold-950 text-gold-400 border border-gold-500/25 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gold-500/5">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <h1 className="font-serif text-2xl text-stone-100 font-bold tracking-wide">Admin Authentication</h1>
          <p className="font-sans text-xs text-stone-400 mt-1 max-w-xs mx-auto text-center leading-relaxed">
            Please provide the secure marriage dashboard passcode to access guest RSVPs & site configurations
          </p>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl font-sans text-xs text-left">
                {loginError}
              </div>
            )}

            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password (sunnymarriage)"
                className="w-full h-11 bg-stone-900 border border-stone-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-xl px-4 pl-10 text-stone-100 font-sans text-sm focus:outline-none transition-colors"
              />
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-[14px]" />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 bg-gold-600 hover:bg-gold-700 disabled:opacity-75 text-white rounded-xl font-sans text-sm font-semibold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors duration-300 focus:outline-none"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Validating Password...
                </>
              ) : (
                <>Unlock Dashboard</>
              )}
            </button>
          </form>

          <button
            onClick={onCloseAdmin}
            className="font-sans text-xs text-stone-500 hover:text-stone-300 duration-300 mt-6 focus:outline-none"
          >
            ← Back to Wedding Website
          </button>
        </motion.div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="fixed inset-0 bg-stone-100 text-stone-800 z-50 flex flex-col pt-0 font-sans overflow-hidden">
      
      {/* Top Header Controls bar */}
      <header className="bg-stone-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-gold-600 p-1.5 rounded-lg border border-gold-400">
            <Sparkles className="w-5 h-5 text-white fill-white/10" />
          </span>
          <div>
            <h2 className="font-serif text-lg md:text-xl font-semibold tracking-wide text-stone-100">
              Wedding Control Center
            </h2>
            <p className="font-sans text-[10px] text-stone-400 tracking-widest uppercase mt-0.5">
              Nikhil Weds Hismitha • Admin Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3.5 md:mt-0">
          <span className="font-sans text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold px-4 py-1.5 rounded-full shadow-inner flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Synchronized Storage
          </span>
          <button
            onClick={handleLogout}
            className="h-9 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center gap-2 px-3.5 rounded-lg border border-stone-800 hover:border-stone-700 transition-colors duration-300 text-xs font-semibold focus:outline-none"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            Sign Out
          </button>
          <button
            onClick={onCloseAdmin}
            className="h-9 bg-gold-600 hover:bg-gold-700 text-white flex items-center gap-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-xs focus:outline-none"
          >
            View Website
          </button>
        </div>
      </header>

      {/* Main Body Column */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col justify-between py-6 shrink-0 h-full">
          <nav className="space-y-1.5 px-4">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold block mb-4 px-2">Navigation Modes</span>
            {([
              { key: 'overview', label: 'Dashboard Overview', icon: Grid },
              { key: 'rsvps', label: 'RSVP Submissions', icon: Users },
              { key: 'gallery', label: 'Gallery Management', icon: ImageIcon },
              { key: 'events', label: 'Ceremonial Timelines', icon: Calendar },
              { key: 'coordinators', label: 'Coordinators', icon: PhoneCall },
              { key: 'guestbook', label: 'Guestbook Moderation', icon: BookOpen },
              { key: 'site_settings', label: 'Site Theme settings', icon: Settings2 },
            ] as const).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full h-10 flex items-center gap-3 px-4 rounded-xl font-sans text-xs font-bold transition-all duration-300 focus:outline-none ${
                    activeTab === item.key
                      ? 'bg-gold-50 text-gold-800 border-l-4 border-gold-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${activeTab === item.key ? 'text-gold-600' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="px-6 border-t border-stone-100 pt-6">
            <p className="font-serif italic text-xs text-stone-400 text-center uppercase">
              "Love Never Fails"
            </p>
          </div>
        </aside>

        {/* Content Pane Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-stone-50">
          
          {/* Quick save settings bar indicator for settings options */}
          {(activeTab === 'events' || activeTab === 'coordinators' || activeTab === 'site_settings') && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 mb-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="font-sans text-xs uppercase tracking-wider text-stone-500 font-bold block">Apply Workspace Changes</span>
                <p className="font-sans text-[11px] text-stone-400">Modify coordinates, colors, event notes, then commit changes below.</p>
              </div>
              <div className="flex items-center gap-4">
                {saveSuccessMsg && (
                  <span className="font-sans text-xs bg-emerald-50 text-emerald-700 border border-emerald-400/20 py-1.5 px-4 rounded-full font-semibold animate-fade">
                    {saveSuccessMsg}
                  </span>
                )}
                <button
                  onClick={handleSaveConfiguration}
                  disabled={isSaving}
                  className="bg-gold-600 hover:bg-gold-700 disabled:opacity-75 text-white flex items-center gap-2 py-2 px-5 rounded-lg text-xs font-bold transition-all duration-300 focus:outline-none hover:shadow"
                >
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Save Configurations
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TAB VIEWS */}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade select-none">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                    Executive Health Metrics
                  </h3>
                  <p className="font-sans text-stone-500 text-xs tracking-wider mt-1.5">Track real-time RSVPs with guest volume analytics.</p>
                </div>
              </div>

              {/* Counter grid widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Attending Guests', value: totals.attending, icon: Users, color: 'border-l-4 border-l-emerald-500 text-emerald-600 bg-white' },
                  { label: 'Attending Parties', value: totals.attendingCardsCount, icon: Users, color: 'border-l-4 border-l-gold-500 text-gold-600 bg-white' },
                  { label: 'Declined Invites', value: totals.notAttendingCount, icon: Trash2, color: 'border-l-4 border-l-rose-500 text-rose-600 bg-white' },
                  { label: 'Gallery Photos', value: totals.photos, icon: ImageIcon, color: 'border-l-4 border-l-cyan-500 text-cyan-600 bg-white' },
                ].map((item, id) => {
                  const Icon = item.icon;
                  return (
                    <div key={id} className={`rounded-xl p-5 border border-stone-200/50 shadow-xs flex items-center justify-between ${item.color}`}>
                      <div>
                        <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-stone-400 block">{item.label}</span>
                        <span className="font-serif text-3xl font-bold tracking-tight block mt-1.5">{item.value}</span>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-full border border-stone-100">
                        <Icon className="w-5 h-5 opacity-80" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attendance quick analysis visualization bar */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-md">
                <h4 className="font-serif text-lg font-bold text-stone-850 mb-3 block">Guest Attendance Trends Tracker</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between font-sans text-xs uppercase tracking-wider text-stone-500 font-bold mb-1.5">
                      <span>Attending Progress ({totals.attending} Guests total) </span>
                      <span>{totals.all > 0 ? Math.round((totals.attendingCardsCount / totals.all) * 100) : 0}%</span>
                    </div>
                    {/* Linear bar progress */}
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200/80">
                      <div
                        className="h-full bg-emerald-500 duration-500 rounded-full"
                        style={{ width: `${totals.all > 0 ? (totals.attendingCardsCount / totals.all) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RSVPs */}
          {activeTab === 'rsvps' && (
            <div className="space-y-6 animate-fade select-none">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                    RSVP submissions list
                  </h3>
                  <p className="font-sans text-stone-500 text-xs mt-1.5">View and manage all RSVP confirmations here.</p>
                </div>
                
                {/* Export CSV action trigger */}
                <button
                  onClick={handleExportCsv}
                  className="h-10 bg-stone-900 text-stone-100 border border-stone-800 hover:bg-gold-600 hover:border-gold-600 duration-300 font-sans text-xs font-bold tracking-wider uppercase px-4 rounded-xl flex items-center gap-2 shadow-sm focus:outline-none"
                >
                  <ArrowDownToLine className="w-4 h-4 text-gold-300" /> Export CSV Spreadsheet
                </button>
              </div>

              {/* Search & filters controls row */}
              <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search by respondent name or phone number..."
                    value={rsvpSearch}
                    onChange={e => setRsvpSearch(e.target.value)}
                    className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 pl-10 text-stone-800 font-sans text-xs focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>

                <div className="flex gap-2 w-full md:w-auto self-stretch md:self-auto">
                  {(['all', 'attending', 'not-attending'] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setRsvpFilter(opt)}
                      className={`h-10 px-4 rounded-lg font-sans text-xs font-bold border capitalize transition-colors duration-300 focus:outline-none flex-1 md:flex-none ${
                        rsvpFilter === opt
                          ? 'bg-gold-500 border-gold-500 text-white'
                          : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      {opt.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / List card block */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-md">
                {filteredRsvps.length === 0 ? (
                  <div className="p-16 text-center">
                    <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="font-sans text-xs text-stone-400 tracking-wider">No RSVP respondents matched your query.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs select-text">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                          <th className="px-6 py-4">Guest Info</th>
                          <th className="px-6 py-4">Contact Number</th>
                          <th className="px-6 py-4">Attending</th>
                          <th className="px-6 py-4">Guests Volume</th>
                          <th className="px-6 py-4">Message Note</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {filteredRsvps.map(rsvp => (
                          <tr key={rsvp.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-stone-900">{rsvp.name}</td>
                            <td className="px-6 py-4 font-mono">{rsvp.phone}</td>
                            <td className="px-6 py-4 font-semibold">
                              {rsvp.attending ? (
                                <span className="bg-emerald-50 text-emerald-705 border border-emerald-300/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                  Attending
                                </span>
                              ) : (
                                <span className="bg-red-50 text-red-705 border border-red-300/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                                  Declined
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold">{rsvp.attending ? rsvp.guestsCount : '0'}</td>
                            <td className="px-6 py-4 italic text-stone-500 max-w-xs truncate">{rsvp.message || '-'}</td>
                            <td className="px-6 py-4 text-right select-none">
                              <button
                                onClick={() => handleDeleteRsvp(rsvp.id)}
                                className="w-7 h-7 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 rounded-lg transition-colors flex items-center justify-center focus:outline-none"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 animate-fade select-none">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                  Gallery management
                </h3>
                <p className="font-sans text-stone-500 text-xs mt-1.5 font-medium">Add, delete or reorder photos appearing across ceremony galleries.</p>
              </div>

              {/* Form card blocks: Upload Panel */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow">
                <h4 className="font-serif text-lg font-bold text-stone-950 mb-4 tracking-wide flex items-center gap-2">
                  <Upload className="w-5 h-5 text-gold-500" /> New Gallery Photo Upload
                </h4>

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-sans mb-4">
                    {uploadError}
                  </div>
                )}

                <form onSubmit={handleGalleryUpload} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  {/* File field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="gallery-file-input" className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                      Choose Image *
                    </label>
                    <input
                      id="gallery-file-input"
                      type="file"
                      accept="image/*"
                      required
                      onChange={e => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                      className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
                    />
                  </div>

                  {/* Program ceremony selector tab */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="gallery-category-select" className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                      Ceremony category
                    </label>
                    <select
                      id="gallery-category-select"
                      value={uploadData.category}
                      onChange={e => setUploadData({ ...uploadData, category: e.target.value as any })}
                      className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                    >
                      <option value="wedding">Wedding Gallery</option>
                      <option value="haldi">Haldi Gallery</option>
                      <option value="pradhanam">Pradhanam Gallery</option>
                      <option value="hero">Hero Slides/Mockup</option>
                    </select>
                  </div>

                  {/* Caption */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="gallery-caption-input" className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                      Brief Caption
                    </label>
                    <input
                      id="gallery-caption-input"
                      type="text"
                      placeholder="E.g. Couple Portrait"
                      value={uploadData.caption}
                      onChange={e => setUploadData({ ...uploadData, caption: e.target.value })}
                      className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 text-stone-800 font-sans text-xs focus:outline-none"
                    />
                  </div>

                  {/* Submit Upload */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="h-10 bg-gold-600 hover:bg-gold-700 disabled:opacity-75 text-white rounded-lg font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 focus:outline-none transition-colors duration-300"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" /> Uploading Image...
                      </>
                    ) : (
                      <>Commit Upload</>
                    )}
                  </button>
                </form>
              </div>

              {/* Pictures List and control reordering */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow">
                <h4 className="font-serif text-lg font-bold text-stone-950 mb-6 tracking-wide block">
                  Active Gallery Photos List
                </h4>

                {galleryImages.length === 0 ? (
                  <div className="p-10 text-center border-2 border-dashed border-stone-200 rounded-xl">
                    <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="font-sans text-xs text-stone-400 tracking-wider">No photos are active in coordinates yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 relative group flex flex-col justify-between"
                      >
                        <div className="aspect-[4/3] bg-black relative">
                          <img
                            src={img.url}
                            alt={img.caption || img.category}
                            className="w-full h-full object-cover filter brightness-95"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-black/60 text-gold-300 border border-white/5 font-sans text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold">
                            {img.category}
                          </span>
                        </div>

                        <div className="p-3.5 flex items-center justify-between">
                          <div className="max-w-[70%]">
                            <p className="font-serif text-xs font-bold text-stone-800 truncate">
                              {img.caption || 'Celebration Portrait'}
                            </p>
                            <span className="font-sans text-[9px] text-stone-400">Order: #{img.order}</span>
                          </div>

                          {/* Control buttons */}
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => handleMoveImage(img.id, 'up')}
                              disabled={idx === 0}
                              className="w-7 h-7 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-600 border border-stone-200 rounded-lg flex items-center justify-center focus:outline-none"
                              title="Move photo up in sequence selection"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveImage(img.id, 'down')}
                              disabled={idx === galleryImages.length - 1}
                              className="w-7 h-7 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-600 border border-stone-200 rounded-lg flex items-center justify-center focus:outline-none"
                              title="Move photo down in sequence selection"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(img.id)}
                              className="w-7 h-7 bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 rounded-lg flex items-center justify-center focus:outline-none"
                              title="Delete Photo Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fade select-none">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                  Wedding Ceremony Event details
                </h3>
                <p className="font-sans text-stone-500 text-xs mt-1.5 font-medium">Update timing description venue name coordinates for wedding ceremonies.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {events.map((evt, idx) => (
                  <div key={evt.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold-600 font-bold block mb-3">Ceremony {idx + 1} Configuration</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Event Name</label>
                        <input
                          type="text"
                          required
                          value={evt.name}
                          onChange={e => {
                            const newEvents = [...events];
                            newEvents[idx].name = e.target.value;
                            setEvents(newEvents);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>

                      {/* Date */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Ceremony Date (YYYY-MM-DD)</label>
                        <input
                          type="date"
                          required
                          value={evt.date}
                          onChange={e => {
                            const newEvents = [...events];
                            newEvents[idx].date = e.target.value;
                            setEvents(newEvents);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-mono text-xs focus:outline-none"
                        />
                      </div>

                      {/* Time */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Ceremony Time</label>
                        <input
                          type="text"
                          required
                          value={evt.time}
                          onChange={e => {
                            const newEvents = [...events];
                            newEvents[idx].time = e.target.value;
                            setEvents(newEvents);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                      {/* Venue Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Venue Address Hall Name</label>
                        <input
                          type="text"
                          required
                          value={evt.venueName}
                          onChange={e => {
                            const newEvents = [...events];
                            newEvents[idx].venueName = e.target.value;
                            setEvents(newEvents);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Brief Description</label>
                        <input
                          type="text"
                          required
                          value={evt.description}
                          onChange={e => {
                            const newEvents = [...events];
                            newEvents[idx].description = e.target.value;
                            setEvents(newEvents);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Venue physical location */}
                    <div className="flex flex-col gap-1 mt-4">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Venue Full Address Details</label>
                      <textarea
                        rows={2}
                        required
                        value={evt.venueAddress}
                        onChange={e => {
                          const newEvents = [...events];
                          newEvents[idx].venueAddress = e.target.value;
                          setEvents(newEvents);
                        }}
                        className="bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg p-3 text-stone-800 font-sans text-xs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COORDINATORS */}
          {activeTab === 'coordinators' && (
            <div className="space-y-6 animate-fade select-none">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                  Wedding coordinators contact
                </h3>
                <p className="font-sans text-stone-500 text-xs mt-1.5">Configure coordinator cards and phone lines safely.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coordinators.map((coord, idx) => (
                  <div key={coord.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold-600 font-bold block mb-3">Coordinator #{idx + 1} Profile</span>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={coord.name}
                          onChange={e => {
                            const newCoords = [...coordinators];
                            newCoords[idx].name = e.target.value;
                            setCoordinators(newCoords);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Phone Number (Required)</label>
                        <input
                          type="text"
                          required
                          value={coord.phone}
                          onChange={e => {
                            const newCoords = [...coordinators];
                            newCoords[idx].phone = e.target.value;
                            setCoordinators(newCoords);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-mono text-xs focus:outline-none"
                        />
                      </div>

                      {/* Role description */}
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Coordinator Role</label>
                        <input
                          type="text"
                          value={coord.role || ''}
                          onChange={e => {
                            const newCoords = [...coordinators];
                            newCoords[idx].role = e.target.value;
                            setCoordinators(newCoords);
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GUESTBOOK MODERATION */}
          {activeTab === 'guestbook' && (
            <div className="space-y-6 animate-fade select-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                    Guestbook Moderation Feed
                  </h3>
                  <p className="font-sans text-stone-500 text-xs mt-1.5 font-medium">
                    Screen, verify, publish, or remove blessings written by wedding attendees.
                  </p>
                </div>

                {/* DB Type Pill Indicator */}
                <span className={`self-start md:self-auto text-xs font-bold font-sans tracking-wide uppercase px-3 py-1 rounded-full border shadow-sm ${
                  dbType === 'supabase'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300/40'
                    : 'bg-amber-50 text-amber-800 border-amber-300/40'
                }`}>
                  🌐 Engine: {dbType === 'supabase' ? 'Supabase Table "guestbook_entries"' : 'Local Storage "db.json"'}
                </span>
              </div>

              {/* Moderation Controls Panel */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-md">
                
                {isGuestbookLoading ? (
                  <div className="py-20 text-center">
                    <Loader2 className="animate-spin w-8 h-8 text-gold-600 mx-auto mb-4" />
                    <p className="font-sans text-xs text-stone-400 font-bold uppercase tracking-wider">Synchronizing live entries...</p>
                  </div>
                ) : guestbookEntries.length === 0 ? (
                  <div className="p-16 text-center border-2 border-dashed border-stone-100 rounded-xl bg-stone-50/20">
                    <BookOpen className="w-12 h-12 text-stone-300/80 mx-auto mb-3" />
                    <h4 className="font-serif text-base text-stone-800 font-bold">No Guestbook Blessings Recorded</h4>
                    <p className="font-sans text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                      Whenever friends or family write congratulations in the guestbook section, they will instantly display here for your approval.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left text-xs font-sans border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                          <th className="px-6 py-4">Guest Name</th>
                          <th className="px-6 py-4">Relationship</th>
                          <th className="px-6 py-4 max-w-sm">Blessing Message</th>
                          <th className="px-6 py-4">Submitted At</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {guestbookEntries.map(entry => (
                          <tr key={entry.id} className="hover:bg-stone-50/40 transition-colors">
                            {/* Name */}
                            <td className="px-6 py-4">
                              <span className="font-bold text-stone-900 block text-sm">{entry.name}</span>
                              <span className="font-mono text-[9px] text-stone-400 block mt-0.5">ID: {entry.id}</span>
                            </td>

                            {/* Relationship */}
                            <td className="px-6 py-4 font-medium">
                              {entry.relationship ? (
                                <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200/50 uppercase text-[9px] tracking-wider">
                                  {entry.relationship}
                                </span>
                              ) : (
                                <span className="text-stone-300">-</span>
                              )}
                            </td>

                            {/* Blessing Message */}
                            <td className="px-6 py-4 max-w-sm">
                              <p className="italic text-stone-600 line-clamp-3 text-xs leading-relaxed" title={entry.message}>
                                "{entry.message}"
                              </p>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 font-mono text-[10px] text-stone-505 whitespace-nowrap">
                              {new Date(entry.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              {entry.isApproved ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Published
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Pending Review
                                </span>
                              )}
                            </td>

                            {/* Actions toggle and delete */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Approve/Revoke toggle trigger */}
                                <button
                                  onClick={() => handleToggleApproveGuestbook(entry.id, entry.isApproved)}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                                    entry.isApproved
                                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                                      : 'bg-gold-600 hover:bg-gold-700 text-white border-gold-500 shadow-xs'
                                  }`}
                                  title={entry.isApproved ? "Revoke approval" : "Approve and publish blessing"}
                                >
                                  {entry.isApproved ? 'Hide / Revoke' : 'Approve & Show'}
                                </button>

                                {/* Delete permanently */}
                                <button
                                  onClick={() => handleDeleteGuestbook(entry.id)}
                                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-450 hover:text-rose-600 border border-stone-200 hover:border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Delete blessing entry forever"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB: SITE SETTINGS */}
          {activeTab === 'site_settings' && siteSettings && familyDetails && (
            <div className="space-y-6 animate-fade select-none">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-stone-900 border-b-2 border-gold-500 pb-1.5 inline-block">
                  Wedding Theme Settings and Extras
                </h3>
                <p className="font-sans text-stone-500 text-xs mt-1.5">Edit Couples Names, Hero Backdrop Image Url, Countdowns, and Ancestors.</p>
              </div>

              {/* Box container */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* Section: Couples Basic Details */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 block border-b pb-1.5">Couples Setup</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Couple identifier */}
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Couples Banner Name</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.coupleName}
                        onChange={e => setSiteSettings({ ...siteSettings, coupleName: e.target.value })}
                        className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    {/* Wedding Vows target countdown */}
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Wedding Vows Target Date (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        required
                        value={siteSettings.weddingDate}
                        onChange={e => setSiteSettings({ ...siteSettings, weddingDate: e.target.value })}
                        className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Hero Subtitle Greeting</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.subtitle}
                        onChange={e => setSiteSettings({ ...siteSettings, subtitle: e.target.value })}
                        className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="settings-hero" className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                        Hero Photo url (uploaded image or custom CDN link)
                      </label>
                      <input
                        id="settings-hero"
                        type="text"
                        placeholder="Leave blank for luxurious standard stock background"
                        value={siteSettings.heroImage || ''}
                        onChange={e => setSiteSettings({ ...siteSettings, heroImage: e.target.value })}
                        className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                      />
                      <span className="font-sans text-[9px] text-stone-400 mt-1 leading-normal block">
                        💡 Tips: You can upload your groom &amp; bride photo in "Gallery Management" (using category "Hero Slides/Mockup"). That will save the uploaded photo as an dynamic path (like /uploads/xxxx-photo.png) which you can simply copy and paste here to make the uploaded photo your primary hero theme!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Honor Memorial Ancestors */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 block border-b pb-1.5">Ancestors Memorial Section</h4>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Memorial Section Header Title</label>
                      <input
                        type="text"
                        required
                        value={siteSettings.memorialTitle}
                        onChange={e => setSiteSettings({ ...siteSettings, memorialTitle: e.target.value })}
                        className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1 font-bold">First Ancestor</label>
                        <input
                          type="text"
                          required
                          value={siteSettings.memorialNames[0] || ''}
                          onChange={e => {
                            const newNames = [...siteSettings.memorialNames];
                            newNames[0] = e.target.value;
                            setSiteSettings({ ...siteSettings, memorialNames: newNames });
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1 font-bold">Second Ancestor</label>
                        <input
                          type="text"
                          required
                          value={siteSettings.memorialNames[1] || ''}
                          onChange={e => {
                            const newNames = [...siteSettings.memorialNames];
                            newNames[1] = e.target.value;
                            setSiteSettings({ ...siteSettings, memorialNames: newNames });
                          }}
                          className="h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Family Settings parents */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md">
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 block border-b pb-1.5">Groom Family setup</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parents */}
                    <div className="space-y-3">
                      <span className="font-sans text-[10px] uppercase tracking-wider text-gold-600 font-bold block">Parents</span>
                      
                      <input
                        type="text"
                        required
                        value={familyDetails.groomParents.parents[0] || ''}
                        onChange={e => {
                          const det = { ...familyDetails };
                          det.groomParents.parents[0] = e.target.value;
                          setFamilyDetails(det);
                        }}
                        className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        placeholder="Late Rajasekhar Garu (Father)"
                      />

                      <input
                        type="text"
                        required
                        value={familyDetails.groomParents.parents[1] || ''}
                        onChange={e => {
                          const det = { ...familyDetails };
                          det.groomParents.parents[1] = e.target.value;
                          setFamilyDetails(det);
                        }}
                        className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        placeholder="Kumari Mannem Garu (Mother)"
                      />
                    </div>

                    {/* Mamaji */}
                    <div className="space-y-3">
                      <span className="font-sans text-[10px] uppercase tracking-wider text-gold-600 font-bold block">Mamaji Uncle</span>
                      
                      <input
                        type="text"
                        required
                        value={familyDetails.mamajiFamily.parents[0] || ''}
                        onChange={e => {
                          const det = { ...familyDetails };
                          det.mamajiFamily.parents[0] = e.target.value;
                          setFamilyDetails(det);
                        }}
                        className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        placeholder="Santhosh Rao Garu"
                      />

                      <input
                        type="text"
                        required
                        value={familyDetails.mamajiFamily.parents[1] || ''}
                        onChange={e => {
                          const det = { ...familyDetails };
                          det.mamajiFamily.parents[1] = e.target.value;
                          setFamilyDetails(det);
                        }}
                        className="w-full h-10 bg-stone-50 border border-stone-200 focus:border-gold-500 rounded-lg px-3.5 text-stone-800 font-sans text-xs focus:outline-none"
                        placeholder="Bhagyavati Garu"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
