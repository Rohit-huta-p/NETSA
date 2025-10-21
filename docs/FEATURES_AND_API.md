
# TalentMatch Application Documentation

## 1. Overview

TalentMatch is a platform designed to connect artists with organizers for gigs and events. It features distinct user roles, a comprehensive profile system, and dedicated workflows for creating and discovering opportunities.

The application is built on a Next.js stack with TypeScript, utilizing Firebase for backend services (Authentication and Firestore) and ShadCN for the UI component library.

---

## 2. Core Features

### 2.1. User Roles & Authentication

The platform supports two primary user roles:

-   **Artist**: A creative professional (dancer, singer, musician, etc.) looking for opportunities. Artists can build a detailed profile, showcase their skills, and apply for gigs.
-   **Organizer**: An individual or company (casting director, event manager, etc.) looking to hire talent. Organizers can post gigs and events and manage applications.

**Authentication:**

-   **Registration**: Separate registration flows for Artists (`/register/artist`) and Organizers (`/register/organizer`).
-   **Login**: A unified login page (`/login`) handles authentication for both roles.
-   **Session Management**: User sessions are managed using Firebase Auth state and a secure `user-token` cookie for server-side validation in middleware and API routes.
-   **Role-based Redirects**: After login, users are redirected based on their role (`/dashboard` for Organizers, `/events` for Artists).

### 2.2. Artist Profile (`/artist/[id]`)

This is the central hub for showcasing an artist's talent and information.

-   **Profile Header**: Displays the artist's name, profile picture, primary skills/styles, and key stats (connections, rating, etc.).
-   **About Card**: Contains the artist's bio, physical attributes (age, height), and social media links.
-   **Portfolio & Experience**: Sections for a visual gallery and a list of past work.
-   **In-Place Editing**: When viewing their own profile, an artist can click an "Edit" button to enter a global edit mode. In this mode, all fields become editable inputs, with "Save" and "Cancel" options. Changes are saved field-by-field to the backend.

### 2.3. Gig Discovery & Application (`/gigs`)

-   **Browse Gigs**: A two-pane layout for desktop (list on the left, detail on the right) and a list-to-detail navigation for mobile.
-   **Filtering**: Users can filter gigs by search query, category, and location.
-   **Gig Details**: Shows comprehensive information about the opportunity, including description, requirements, compensation, and organizer details.
-   **Application**: Artists can apply to gigs with a single click. The system prevents duplicate applications.

### 2.4. Event Discovery (`/events`)

-   **Browse Events**: A card-based layout displaying available events (workshops, masterclasses, etc.).
-   **Filtering**: Users can filter events by search query, category, and location.
-   **Event Details**: A dedicated page (`/events/[id]`) shows full details about the event, host, schedule, and pricing.

### 2.5. Organizer Dashboard & Posting

-   **Dashboard (`/dashboard`)**: A central view for organizers to see their recent posts, quick insights, and updates.
-   **Create Hub (`/create`)**: A tabbed interface for posting either a **Gig** or an **Event**.
    -   **Multi-Step Forms**: Both forms use a guided, multi-step process to gather all necessary details, from basic information and requirements to scheduling and media.
    -   **Draft & Publish**: Organizers can either save their post as a draft or publish it immediately.
-   **My Posts (`/myposts`)**: A dedicated page for organizers to view and manage all the gigs and events they have created.

---

## 3. Data Models (API Contracts)

These TypeScript interfaces (from `src/lib/types.ts` and `src/store/userStore.ts`) define the core data structures used throughout the application and in API communication.

### 3.1. `UserProfile` (Artist & Organizer)

-   **Artist**: Contains fields like `artistType`, `skills`, `styles`, `bio`, `hourlyRate`, `portfolioLinks`, and `socialMedia`.
-   **Organizer**: Contains fields like `organizationName`, `organizationType`, `jobTitle`, `specialization`, and `typicalBudgetRange`.

### 3.2. `Gig`

Represents a paid opportunity or casting call.

```typescript
export interface Gig {
    id: string;
    organizerId: string;
    title: string;
    description: string;
    type: 'performance' | 'photoshoot' | 'recording' | 'event' | 'audition' | 'modeling' | 'teaching' | 'collaboration';
    category: string;
    artistType: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    location: {
        city: string;
        country: string;
        isRemote: boolean;
        // ... and other location fields
    };
    startDate: Date;
    compensation: {
        type: 'hourly' | 'daily' | 'project' | 'revenue_share';
        amount?: number;
        // ... and other compensation fields
    };
    status: 'draft' | 'active' | 'paused' | 'filled' | 'expired' | 'cancelled';
    // ... and many other fields
}
```

### 3.3. `Event`

Represents a workshop, masterclass, or other organized event.

```typescript
export interface Event {
    id: string;
    organizerId: string;
    title: string;
    description: string;
    category: 'performance' | 'competition' | 'masterclass' | 'audition' | 'showcase' | 'networking' | 'festival';
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
    location: {
        type: 'online' | 'in_person' | 'hybrid';
        city?: string;
        country?: string;
        // ... and other location fields
    };
    schedule: {
        startDate: Date;
        endDate: Date;
    };
    pricing: {
        amount: number;
        currency: string;
    };
    status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
    // ... and many other fields
}
```

### 3.4. `Application`

Represents an artist's application to a specific gig.

```typescript
export interface Application {
    artistId: string;
    artistName: string;
    artistType: string;
    status: 'pending' | 'shortlisted' | 'hired' | 'rejected';
    appliedAt: Date;
    bio?: string;
    location?: string;
    skills?: string[];
    styles?: string[];
}
```

---

## 4. API Endpoints

The application uses Next.js API Routes to handle backend operations securely. All routes expect a `Bearer` token in the `Authorization` header for user authentication.

### `POST /api/events`

-   **Description**: Creates a new event.
-   **Auth**: Required (User must be an 'organizer').
-   **Body**: A JSON object matching the `Event` data model.
-   **Response (Success)**: `201 Created` with `{ message: 'Event created successfully', eventId: string }`.
-   **Response (Error)**: `401 Unauthorized`, `400 Bad Request`.

### `POST /api/gigs`

-   **Description**: Creates a new gig.
-   **Auth**: Required (User must be an 'organizer').
-   **Body**: A JSON object matching the `Gig` data model.
-   **Response (Success)**: `201 Created` with `{ message: 'Gig created successfully', gigId: string }`.
-   **Response (Error)**: `401 Unauthorized`, `400 Bad Request`.

### `GET /api/gigs`

-   **Description**: Retrieves a list of active gigs with filtering and pagination.
-   **Auth**: Required.
-   **Query Parameters**: `search`, `category`, `location`, etc. (See `GetGigsQuery` in `src/lib/types.ts`).
-   **Response (Success)**: `200 OK` with a `GetGigsResponse` object containing the gigs list and pagination metadata.
-   **Response (Error)**: `401 Unauthorized`, `500 Internal Server Error`.

### `POST /api/gigs/[id]/apply`

-   **Description**: Submits an application for a specific gig on behalf of the authenticated artist.
-   **Auth**: Required (User must be an 'artist').
-   **Body**: Empty.
-   **Response (Success)**: `201 Created` with `{ message: 'Application submitted successfully' }`.
-   **Response (Error)**: `401 Unauthorized`, `403 Forbidden` (if not an artist), `409 Conflict` (if already applied), `404 Not Found`.

### `GET /api/gigs/[id]/applications`

-   **Description**: Retrieves all applications for a specific gig.
-   **Auth**: Required (User must be the organizer who owns the gig).
-   **Body**: None.
-   **Response (Success)**: `200 OK` with `{ applications: Application[] }`.
-   **Response (Error)**: `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.
