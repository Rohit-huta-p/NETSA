


export interface GetGigsQuery {
  page?: number;
  limit?: number;
  category?: string;
  artistType?: string[];
  location?: string;
  compensation_min?: number;
  compensation_max?: number;
  experience_level?: string;
  is_remote?: boolean;
  start_date_from?: string;
  start_date_to?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'compensation_high' | 'compensation_low' | 'deadline';
}
export interface GetGigsResponse {
  gigs: Gig[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  filters: {
    categories: string[];
    locations: string[];
    artistTypes: string[];
    experienceLevels: string[];
    compensationRanges: { min: number; max: number; currency: string }[];
  };
}

export interface Application {
    artistId: string;
    artistName: string;
    artistType: 'dancer' | 'singer' | 'model' | 'musician' | 'dj' | 'actor' | 'other';
    status: 'pending' | 'shortlisted' | 'hired' | 'rejected';
    appliedAt: Date;
}

export interface Gig {
    id: string;
    // Basic Info
    title: string;
    description: string;
    type: 'performance' | 'photoshoot' | 'recording' | 'event' | 'audition' | 'modeling' | 'teaching' | 'collaboration';
    category: string; // More specific categorization
    imageUrl?: string;
    // Organizer Info
    organizerId: string;
    organizerInfo: {
        name: string;
        organization: string;
        profileImageUrl?: string;
        organizationLogoUrl?: string;
        rating: number;
    };
    // Requirements
    artistType: string[];
    requiredSkills?: string[];
    requiredStyles?: string[]; // Dance styles, music genres, acting techniques
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    // Demographic Requirements
    ageRange?: {
        min: number;
        max: number;
    };
    genderPreference?: 'male' | 'female' | 'any' | 'non-binary';
    physicalRequirements?: string;
    // Location & Timing
    location: {
        city: string;
        country: string;
        venue?: string;
        address?: string;
        isRemote: boolean;
    };
    startDate: Date;
    endDate?: Date;
    duration?: string;
    timeCommitment?: string; // "Full-time", "Part-time", "Weekend"
    // Compensation
    compensation: {
        type: 'hourly' | 'daily' | 'project' | 'revenue_share';
        amount?: number;
        currency?: string;
        negotiable: boolean;
        additionalBenefits?: string[];
    };
    // Application Info
    maxApplications?: number;
    currentApplications: number;
    applicationDeadline?: Date;
    // Media Requirements
    mediaRequirements?: {
        needsHeadshots: boolean;
        needsFullBody: boolean;
        needsVideoReel: boolean;
        needsAudioSample: boolean;
        specificRequirements?: string;
    };
    // Status & Metadata
    status: 'draft' | 'active' | 'paused' | 'filled' | 'expired' | 'cancelled';
    isUrgent: boolean;
    isFeatured: boolean;
    tags?: string[];
    // Engagement Stats
    views: number;
    applications: number;
    saves: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}

export interface Event {
    id: string;
    // Basic Info
    title: string;
    description: string;
    shortDescription?: string; // For cards/listings
    thumbnailUrl?: string;
    category: 'performance' | 'competition' | 'masterclass' | 'audition' | 'showcase' | 'networking' | 'festival';
    subCategory?: string;
    tags?: string[];
    // Organizer/Host Info
    organizerId: string; // Can be same as hostId or different
    hostId: string; // The actual host (might be different from organizer)
    organizerInfo: {
        name: string;
        organization?: string;
        profileImageUrl?: string;
        organizationLogoUrl?: string;
        rating: number;
    };
    hostInfo: {
        name: string;
        bio: string;
        profileImageUrl?: string;
        credentials: string[];
        experience: string;
        socialMedia?: {
            instagram?: string;
            youtube?: string;
        };
        rating: number;
        totalParticipants: number;
    };
    // Event Details
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
    duration: {
        totalHours: number;
        sessionsCount: number;
        sessionDuration: number; // minutes
        daysDuration: number;
    };
    // Content Structure
    agenda?: {
        session: number;
        title: string;
        topics: string[];
        duration: number;
    }[];
    outcomes?: string[];
    prerequisites?: string[];
    requiredEquipment?: string[];
    // Scheduling
    schedule: {
        startDate: Date;
        endDate: Date;
        sessions: {
            date: Date;
            startTime: string;
            endTime: string;
            topic: string;
        }[];
    };
    // Location
    location: {
        type: 'online' | 'in_person' | 'hybrid';
        venue?: string;
        address?: string;
        city?: string;
        country?: string;
        meetingUrl?: string;
        platform?: string; // Zoom, Teams, etc.
    };
    // Pricing
    pricing: {
        amount: number;
        currency: string;
        paymentType: 'full' | 'installments';
        installmentPlan?: {
            numberOfInstallments: number;
            amountPerInstallment: number;
        };
        earlyBirdDiscount?: {
            amount: number;
            validUntil: Date;
        };
        groupDiscount?: {
            minParticipants: number;
            discountPercent: number;
        };
    };
    // Registration
    maxParticipants: number;
    currentRegistrations: number;
    minParticipants?: number;
    waitlistEnabled: boolean;
    registrationDeadline?: Date;
    // Media & Materials
    imageGallery?: string[];
    promoVideoUrl?: string;
    materials?: {
        type: 'video' | 'document' | 'audio' | 'link';
        title: string;
        url: string;
        isPreview: boolean;
        description?: string;
    }[];
    // Certification
    providesCertificate: boolean;
    certificateTemplate?: string;
    certificationBody?: string;
    cpdPoints?: number;
    // Stats & Reviews
    averageRating?: number;
    totalReviews?: number;
    completionRate?: number;
    views: number;
    saves: number;
    // Status
    status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
    isRecurring: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
