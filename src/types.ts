/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  guestsCount: number;
  attending: boolean;
  message?: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: 'haldi' | 'pradhanam' | 'wedding' | 'hero';
  caption?: string;
  order: number;
  createdAt: string;
}

export interface WeddingEvent {
  id: string;
  key: 'haldi' | 'pradhanam' | 'wedding';
  name: string;
  date: string;
  time: string;
  description: string;
  venueName: string;
  venueAddress: string;
}

export interface Coordinator {
  id: string;
  name: string;
  phone: string;
  role?: string;
}

export interface Memorial {
  title: string;
  names: string[];
  candlesLit: number;
}

export interface FamilyPerson {
  name: string;
  subNames?: string[];
}

export interface FamilySectionDetails {
  groomParents: {
    parents: string[]; // e.g. ["Late Rajasekhar Garu", "Kumari Mannem Garu"]
  };
  mamajiFamily: {
    parents: string[]; // ["Santhosh Rao Garu", "Bhagyavati Garu"]
  };
  groomRelatives: {
    title: string; // "D. Kantha Rao Garu & Ruth Garu"
    children: string[]; // ["Kala", "Vidya", "Keerthana"]
  };
  cousins: string[]; // ["Latha", "Rajesh", "Swarna", "Rakesh", "Satish"]
}

export interface SiteSettings {
  coupleName: string;
  weddingDate: string;
  subtitle: string;
  heroImage: string;
  themeColor: string; // 'gold' | 'blush' | 'rose'
  isCountdownEnabled: boolean;
  memorialTitle: string;
  memorialNames: string[];
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  relationship?: string;
  isApproved: boolean;
  createdAt: string;
}
