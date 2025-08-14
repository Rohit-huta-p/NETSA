
import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface Artist {
  // Basic Info
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  
  // Account Details
  role: 'artist';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Personal Info
  dob?: Date;
  height?: number; // in cm
  skinTone?: string;
  gender?: 'male' | 'female' | 'other';
  city?: string;
  country?: string;
  languages?: string[];
  
  // Artist Profile
  artistType: 'dancer' | 'singer' | 'model' | 'musician' | 'dj' | 'actor' | 'other';
  otherArtistType?: string;
  bio?: string;
  experienceYears?: number;
  
  // Skills & Expertise
  skills?: string[];
  styles?: string[]; // Dance styles, music genres, acting techniques
  genres?: string[];
  instruments?: string[]; // For musicians
  otherSkill?: string;
  
  // Professional Info
  agencyAffiliated: boolean;
  availableForBooking: boolean;
  preferredCities?: string[];
  travelReady: boolean;
  remoteWorkOk: boolean;
  hourlyRate?: number;
  currency?: string;
  
  // Portfolio Links
  portfolioLinks?: string;
  resumeUrl?: string;
  
  // Social Media
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    spotify?: string;
  };
  
  // Profile Statistics
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
  lastActive: Date;
  totalEarnings?: number;
}


interface Organizer {
  // Basic Info
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  
  // Account Details
  role: 'organizer';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Organization/Company Info
  organizationType: 'company' | 'individual' | 'agency' | 'institution' | 'event_management';
  organizationName?: string; // Company name or individual brand name
  jobTitle?: string;
  organizationDescription?: string;
  organizationWebsite?: string;
  organizationLogoUrl?: string;
  industry?: 'entertainment' | 'advertising' | 'events' | 'theater' | 'film' | 'tv' | 'music' | 'education' | 'other';
  organizationSize?: 'individual' | 'small' | 'medium' | 'large' | 'enterprise';
  
  // Location
  city?: string;
  country?: string;
  
  // Professional Info
  yearsInIndustry?: number;
  specialization?: string[]; // What types of artists they usually hire
  preferredArtistTypes?: string[];
  
  // Budget & Preferences
  typicalBudgetRange?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Organizer Statistics
  stats: {
    gigsPosted: number;
    eventsCreated: number;
    artistsHired: number;
    eventsOrganized: number;
    connectionsCount: number;
    averageRating: number;
    totalReviews: number;
    responseRate: number;
  };
  
  // Social Media & Portfolio
  socialMedia?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  
  // Activity Tracking
  lastActive: Date;
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
