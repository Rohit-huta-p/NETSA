
import { create } from 'zustand';
import type { User } from 'firebase/auth';

// ============================================
// COMPLETE PROFILE INTERFACES (POST-REGISTRATION)
// ============================================

interface Artist {
  // System Generated
  uid: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;

  // Essential Identity
  firstName: string;
  lastName: string;
  email: string | null;
  
  // Account Setup
  role: 'artist';
  
  // Core Artist Info (Minimum viable)
  artistType: 'dancer' | 'singer' | 'model' | 'musician' | 'dj' | 'actor' | 'other';
  otherArtistType?: string; // Only if artistType is 'other'
  
  // Basic Location (for matching)
  city: string;
  country: string;

  // Personal Details
  phoneNumber?: string;
  profileImageUrl?: string;
  dob?: Date;
  gender?: 'male' | 'female' | 'other';
  languages?: string[];
  
  // Artist Profile Enhancement
  bio?: string;
  experienceYears?: number;
  skills?: string[];
  styles?: string[];
  genres?: string[];
  instruments?: string[]; // For musicians
  
  // Professional Settings
  agencyAffiliated?: boolean;
  availableForBooking?: boolean;
  preferredCities?: string[];
  travelReady?: boolean;
  remoteWorkOk?: boolean;
  hourlyRate?: number;
  currency?: string;
  
  // Portfolio & Social
  portfolioLinks?: string;
  resumeUrl?: string;
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    spotify?: string;
  };

  // Profile Statistics (System managed)
  stats: {
    eventsAttended: number;
    eventsHosted: number;
    connectionsCount: number;
    averageRating: number;
    totalReviews: number;
    profileViews: number;
    portfolioViews: number;
  };
  
  // Activity Tracking
  totalEarnings?: number;
}

interface Organizer {
  // System Generated
  uid: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;

  // Essential Identity
  firstName: string;
  lastName: string;
  email: string | null;
  
  // Account Setup
  role: 'organizer';

  // Organization Basics
  organizationType: 'company' | 'individual' | 'agency' | 'institution' | 'event_management';
  organizationName?: string; // Required if not 'individual'
  
  // Basic Location (for matching)
  city: string;
  country: string;

  // Personal/Professional Details
  phoneNumber?: string;
  profileImageUrl?: string;
  jobTitle?: string;
  
  // Organization Enhancement
  organizationDescription?: string;
  organizationWebsite?: string;
  organizationLogoUrl?: string;
  industry?: 'entertainment' | 'advertising' | 'events' | 'theater' | 'film' | 'tv' | 'music' | 'education' | 'other';
  organizationSize?: 'individual' | 'small' | 'medium' | 'large' | 'enterprise';
  
  // Professional Info
  yearsInIndustry?: number;
  specialization?: string[];
  preferredArtistTypes?: string[];
  
  // Budget & Hiring Preferences
  typicalBudgetRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Social Media & Portfolio
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  
  // Profile Statistics (System managed)
  stats: {
    opportunitiesPosted: number;
    eventsCreated: number;
    artistsHired: number;
    eventsOrganized: number;
    connectionsCount: number;
    averageRating: number;
    totalReviews: number;
    responseRate: number;
  };
  
  // Activity Tracking
  totalSpent?: number;
}


export type UserProfile = (Artist | Organizer) & Omit<User, 'uid' | 'email'>;

interface UserState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  clearUser: () => set({ user: null, loading: false }),
}));
