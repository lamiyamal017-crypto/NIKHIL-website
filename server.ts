/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Lazy initialization of Supabase client to prevent app crashing when credentials are missing
let supabase: any = null;
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    if (!supabase) {
      supabase = createClient(url, key);
    }
    return supabase;
  }
  return null;
}

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to load/save database
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      siteSettings: {
        coupleName: "Nikhil Weds Hismitha",
        weddingDate: "2026-06-04",
        subtitle: "By God's Grace, We Invite You To Celebrate Our Wedding",
        heroImage: "", // empty by default, the app will show a beautiful standard romantic render
        themeColor: "gold",
        isCountdownEnabled: true,
        memorialTitle: "In Loving Memory",
        memorialNames: ["Uppati Isaac Garu", "Uppati Rebecca Garu"]
      },
      familyDetails: {
        groomParents: {
          parents: ["Late Rajasekhar Garu", "Kumari Mannem Garu"]
        },
        mamajiFamily: {
          parents: ["Santhosh Rao Garu", "Bhagyavati Garu"]
        },
        groomRelatives: {
          title: "D. Kantha Rao Garu & Ruth Garu",
          children: ["Kala", "Vidya", "Keerthana"]
        },
        cousins: ["Latha", "Rajesh", "Swarna", "Rakesh", "Satish"]
      },
      events: [
        {
          id: "evt-1",
          key: "haldi",
          name: "Haldi Ceremony",
          date: "2026-06-02",
          time: "10:00 AM onwards",
          description: "Let the celebration begin with the splash of yellow, love, and laughter! Join us as we cover the groom and bride in fragrant turmeric blessings.",
          venueName: "Groom's Residence / Event Hall",
          venueAddress: "Dubacherla, Main Road, NH-5, Eluru–Rajahmundry Road, Dubacherla, Andhra Pradesh 534112"
        },
        {
          id: "evt-2",
          key: "pradhanam",
          name: "Pradhanam",
          date: "2026-06-03",
          time: "05:00 PM onwards",
          description: "An auspicious ceremony sealing the commitments and blessings of both families as we take the step towards the sacred vows.",
          venueName: "Event Venue Hall",
          venueAddress: "Dubacherla, Main Road, NH-5, Eluru–Rajahmundry Road, Dubacherla, Andhra Pradesh 534112"
        },
        {
          id: "evt-3",
          key: "wedding",
          name: "Wedding Ceremony",
          date: "2026-06-04",
          time: "10:30 AM onwards",
          description: "By God's grace, we exchange our wedding vows in holy matrimony. Followed by a joyous celebratory luncheon.",
          venueName: "Wedding Venue",
          venueAddress: "Dubacherla, Main Road, NH-5, Eluru–Rajahmundry Road, Dubacherla, Andhra Pradesh 534112"
        }
      ],
      coordinators: [
        {
          id: "coord-1",
          name: "Rajesh",
          phone: "9100220126",
          role: "Groom Coordinator"
        },
        {
          id: "coord-2",
          name: "Sonu",
          phone: "8384043136",
          role: "Logistics Coordinator"
        }
      ],
      galleryImages: [
        {
          id: "gal-1",
          url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000",
          category: "wedding",
          caption: "Holy Rings of Matrimony",
          order: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: "gal-2",
          url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000",
          category: "haldi",
          caption: "Turmeric Blessings",
          order: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: "gal-3",
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
          category: "pradhanam",
          caption: "Family Commitments",
          order: 1,
          createdAt: new Date().toISOString()
        }
      ],
      rsvps: [],
      guestbookEntries: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (parsed && !parsed.guestbookEntries) {
      parsed.guestbookEntries = [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database", error);
    return {};
  }
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database", error);
  }
}

// REST API Endpoints

// GET Full DB State
app.get('/api/db', (req, res) => {
  const db = loadDatabase();
  res.json(db);
});

// SUBMIT RSVP
app.post('/api/rsvp', (req, res) => {
  const { name, phone, guestsCount, attending, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const db = loadDatabase();
  const newRsvp = {
    id: `rsvp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    phone,
    guestsCount: Number(guestsCount) || 1,
    attending: !!attending,
    message: message || '',
    createdAt: new Date().toISOString()
  };

  db.rsvps = db.rsvps || [];
  // Prevent duplication of phone RSVP
  const existingIdx = db.rsvps.findIndex((r: any) => r.phone === phone);
  if (existingIdx >= 0) {
    db.rsvps[existingIdx] = { ...db.rsvps[existingIdx], ...newRsvp, id: db.rsvps[existingIdx].id };
  } else {
    db.rsvps.push(newRsvp);
  }

  saveDatabase(db);
  res.json({ success: true, rsvp: newRsvp });
});

// DELETE RSVP
app.delete('/api/rsvp/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();
  
  db.rsvps = db.rsvps || [];
  db.rsvps = db.rsvps.filter((r: any) => r.id !== id);
  
  saveDatabase(db);
  res.json({ success: true });
});

// --- GUESTBOOK SECTION ---

// GET approved Guestbook Entries (for front-end visitors)
app.get('/api/guestbook', async (req, res) => {
  try {
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('guestbook_entries')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const entries = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          message: item.message,
          relationship: item.relationship || '',
          isApproved: item.is_approved,
          createdAt: item.created_at
        }));
        return res.json({ success: true, dbType: 'supabase', entries });
      } else {
        console.warn("Supabase query error, falling back to local database:", error?.message);
      }
    }
  } catch (err: any) {
    console.warn("Supabase initialization error, falling back to local database:", err.message);
  }

  // FALLBACK TO JSON DATABASE
  const db = loadDatabase();
  db.guestbookEntries = db.guestbookEntries || [];
  const approvedEntries = db.guestbookEntries
    .filter((e: any) => e.isApproved)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, dbType: 'local', entries: approvedEntries });
});

// GET all Guestbook Entries (for Admin dash moderation)
app.get('/api/guestbook/admin', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer session_token_sunny_wedding') {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  try {
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('guestbook_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const entries = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          message: item.message,
          relationship: item.relationship || '',
          isApproved: item.is_approved,
          createdAt: item.created_at
        }));
        return res.json({ success: true, dbType: 'supabase', entries });
      } else {
        console.warn("Supabase admin query error, falling back to local database:", error?.message);
      }
    }
  } catch (err: any) {
    console.warn("Supabase admin client error, falling back to local database:", err.message);
  }

  const db = loadDatabase();
  db.guestbookEntries = db.guestbookEntries || [];
  const entries = [...db.guestbookEntries].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, dbType: 'local', entries });
});

// SUBMIT Guestbook Entry
app.post('/api/guestbook', async (req, res) => {
  const { name, message, relationship } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const newEntry = {
    id: `gb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    message,
    relationship: relationship || '',
    isApproved: false, // Moderated by default
    createdAt: new Date().toISOString()
  };

  try {
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('guestbook_entries')
        .insert([{
          id: newEntry.id, // Support string keys so local & cloud entries align
          name: newEntry.name,
          message: newEntry.message,
          relationship: newEntry.relationship,
          is_approved: newEntry.isApproved,
          created_at: newEntry.createdAt
        }]);
      
      if (!error) {
        return res.json({ success: true, dbType: 'supabase', entry: newEntry });
      } else {
        console.warn("Supabase insert error, falling back to local database:", error.message);
      }
    }
  } catch (err: any) {
    console.warn("Supabase initialization insert error, falling back to local database:", err.message);
  }

  // FALLBACK TO JSON DATABASE
  const db = loadDatabase();
  db.guestbookEntries = db.guestbookEntries || [];
  db.guestbookEntries.push(newEntry);
  saveDatabase(db);
  res.json({ success: true, dbType: 'local', entry: newEntry });
});

// MODERATE (APPROVE/REJECT) Guestbook Entry
app.put('/api/guestbook/:id/approve', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer session_token_sunny_wedding') {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('guestbook_entries')
        .update({ is_approved: isApproved })
        .eq('id', id);
      
      if (!error) {
        return res.json({ success: true, dbType: 'supabase' });
      } else {
        console.warn("Supabase update error, falling back to local database:", error.message);
      }
    }
  } catch (err: any) {
    console.warn("Supabase update client error, falling back to local database:", err.message);
  }

  const db = loadDatabase();
  db.guestbookEntries = db.guestbookEntries || [];
  const index = db.guestbookEntries.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    db.guestbookEntries[index].isApproved = isApproved;
    saveDatabase(db);
    return res.json({ success: true, dbType: 'local' });
  }

  res.status(404).json({ error: 'Guestbook entry not found' });
});

// DELETE Guestbook Entry
app.delete('/api/guestbook/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer session_token_sunny_wedding') {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  const { id } = req.params;

  try {
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('guestbook_entries')
        .delete()
        .eq('id', id);
      
      if (!error) {
        return res.json({ success: true, dbType: 'supabase' });
      } else {
        console.warn("Supabase delete error, falling back to local database:", error.message);
      }
    }
  } catch (err: any) {
    console.warn("Supabase delete client error, falling back to local database:", err.message);
  }

  const db = loadDatabase();
  db.guestbookEntries = db.guestbookEntries || [];
  db.guestbookEntries = db.guestbookEntries.filter((e: any) => e.id !== id);
  saveDatabase(db);
  res.json({ success: true, dbType: 'local' });
});

// UPLOAD Image
app.post('/api/gallery/upload', (req, res) => {
  const { filename, data, category, caption } = req.body;
  if (!filename || !data || !category) {
    return res.status(400).json({ error: 'filename, data, and category are required' });
  }

  try {
    // Extract base64 mime and pure raw base64 data
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const fileBuffer = Buffer.from(matches[2], 'base64');
    // Sanitize filename to avoid directory traversals
    const sanitizedFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(UPLOADS_DIR, sanitizedFilename);

    fs.writeFileSync(filePath, fileBuffer);

    // Save in DB state
    const db = loadDatabase();
    db.galleryImages = db.galleryImages || [];
    
    const imageUrl = `/uploads/${sanitizedFilename}`;
    const order = db.galleryImages.filter((g: any) => g.category === category).length + 1;

    const newImage = {
      id: `img-${Date.now()}`,
      url: imageUrl,
      category,
      caption: caption || '',
      order,
      createdAt: new Date().toISOString()
    };

    db.galleryImages.push(newImage);
    saveDatabase(db);

    res.json({ success: true, image: newImage });
  } catch (error: any) {
    console.error("Upload error", error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// DELETE Image
app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDatabase();

  db.galleryImages = db.galleryImages || [];

  // Optionally delete local file
  const imageToDelete = db.galleryImages.find((g: any) => g.id === id);
  if (imageToDelete && imageToDelete.url.startsWith('/uploads/')) {
    const filename = path.basename(imageToDelete.url);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete local uploaded file", err);
      }
    }
  }

  db.galleryImages = db.galleryImages.filter((g: any) => g.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// REORDER Images
app.put('/api/gallery/reorder', (req, res) => {
  const { images } = req.body; // Array of { id, order }
  if (!Array.isArray(images)) {
    return res.status(400).json({ error: 'images must be an array' });
  }

  const db = loadDatabase();
  db.galleryImages = db.galleryImages || [];

  images.forEach((item: any) => {
    const imgObj = db.galleryImages.find((dg: any) => dg.id === item.id);
    if (imgObj) {
      imgObj.order = Number(item.order) || imgObj.order;
    }
  });

  saveDatabase(db);
  res.json({ success: true });
});

// EDIT Events
app.put('/api/events', (req, res) => {
  const { events } = req.body;
  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Events must be an array' });
  }

  const db = loadDatabase();
  db.events = events;
  saveDatabase(db);
  res.json({ success: true, events });
});

// EDIT Coordinators
app.put('/api/coordinators', (req, res) => {
  const { coordinators } = req.body;
  if (!Array.isArray(coordinators)) {
    return res.status(400).json({ error: 'Coordinators must be an array' });
  }

  const db = loadDatabase();
  db.coordinators = coordinators;
  saveDatabase(db);
  res.json({ success: true, coordinators });
});

// EDIT Settings (includes Colors and Couples details)
app.put('/api/settings', (req, res) => {
  const { siteSettings, familyDetails } = req.body;
  const db = loadDatabase();

  if (siteSettings) {
    db.siteSettings = { ...db.siteSettings, ...siteSettings };
  }
  if (familyDetails) {
    db.familyDetails = { ...db.familyDetails, ...familyDetails };
  }

  saveDatabase(db);
  res.json({ success: true, siteSettings: db.siteSettings, familyDetails: db.familyDetails });
});

// ADMIN Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === 'sunnymarriage') {
    res.json({ success: true, token: 'session_token_sunny_wedding' });
  } else {
    res.status(401).json({ error: 'Incorrect password' });
  }
});

// Start routing
async function init() {
  if (process.env.NODE_ENV !== 'production') {
    // In development mode, mount Vite dev middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static content
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

init();
