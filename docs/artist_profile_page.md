
# Artist Profile Page (`/artist/[id]`) - Frontend Documentation

This document provides a detailed overview of the frontend components, structure, and functionality of the Artist Profile page.

## 1. Overview

The Artist Profile page is a server-rendered page that serves as the public-facing showcase for both "Artist" and "Organizer" users. It is designed to be dynamic, responsive, and editable for the profile owner.

-   **Primary File**: `src/app/(main)/artist/[id]/page.tsx`
-   **URL Structure**: `/artist/[id]`, where `[id]` is the unique user ID from Firebase Authentication.

The page uses Next.js Suspense to handle data fetching, displaying a skeleton loader while the user's profile data is retrieved from the server.

---

## 2. Page Structure (`page.tsx`)

The main page component (`ArtistProfilePage`) is responsible for:
1.  Extracting the `id` from the URL parameters.
2.  Wrapping the main content component (`ArtistProfileContent`) in a `<Suspense>` boundary.
3.  Passing a skeleton loader (`<ArtistProfileSkeleton />`) as the fallback for Suspense.

The `ArtistProfileContent` async component handles the core logic:
1.  It calls a server action (`getUserProfile_Admin`) to fetch the profile data using the `artistId`.
2.  If the profile is not found, it triggers a `notFound()` response.
3.  It renders the main layout of the profile, which is a two-column grid on larger screens.
4.  It composes and passes the fetched `profile` data down to the various child components.

**Layout:**
-   A main container with vertical spacing (`space-y-8`).
-   The `<ProfileHeader />` component is displayed at the top.
-   A responsive grid (`grid-cols-1 lg:grid-cols-3`) contains the main content:
    -   **Left Column (Large Screens)**: `<AboutCard />`
    -   **Right Column (Large Screens)**: A vertical stack containing `<PortfolioGallery />` and `<Experience />`.

---

## 3. Core Components

### 3.1. `ProfileHeader.tsx`

-   **Purpose**: Displays the most prominent information about the user, including their name, role, profile picture, key stats, and primary skills/styles.
-   **Data**: Receives the `artist` (UserProfile) object as a prop.
-   **Editing**:
    -   If the viewer is the profile owner (`isOwnProfile`), an "Edit Profile" button is displayed.
    -   Clicking the "Edit" button opens a modal (`<Dialog />`) pre-filled with the current data.
    -   The modal contains a form with inputs for first name, last name, artist type, email, skills, styles, and a dedicated `<ImageUpload />` component for the profile picture.
    -   On "Save," the `updateUserProfile` server action is called, and the local state (`artist` and the global `userStore`) is updated to reflect the changes immediately.
    -   A loading spinner (`<Loader2 />`) is shown on the save button during the update process.

### 3.2. `AboutCard.tsx`

-   **Purpose**: Displays the user's bio, personal attributes (age, height, skin tone), and social media links (currently Instagram).
-   **Data**: Receives the `artist` (UserProfile) object as a prop.
-   **Editing**:
    -   Functionality is identical to `ProfileHeader.tsx`. An "Edit" button opens a modal for editing the "About" section.
    -   The modal includes a `<Textarea />` for the bio, date and number inputs for personal details, a `<MultiSelectEditable />` component for skills, and a text input for the Instagram handle.
    -   Saving triggers the `updateUserProfile` server action and updates the local and global state.

### 3.3. `PortfolioGallery.tsx`

-   **Purpose**: Displays a grid of visual portfolio items.
-   **Data**: Currently uses a hardcoded array of `portfolioItems`. In a future implementation, this would fetch data from the artist's profile.
-   **Functionality**:
    -   Renders a 2 or 3-column responsive grid.
    -   Each item is an `aspect-square` container.
    -   It displays a placeholder icon (`<Video />` or `<ImageIcon />`) by default.
    -   The actual `next/image` is initially hidden (`opacity-0`) and becomes visible on hover, creating a simple reveal effect.
    -   Includes a `data-ai-hint` attribute for potential future AI-powered image replacement.

### 3.4. `Experience.tsx`

-   **Purpose**: Shows a list of the artist's past work, gigs, or events attended.
-   **Data**: Uses a hardcoded array of `experienceItems`. This would be fetched from the user's profile data in a real application.
-   **Functionality**:
    -   Renders a list of `<Card>` components.
    -   Each card displays the title, date, status, and an icon (`<Briefcase />`).

---

## 4. Helper & Shared Components

### 4.1. `EditableField.tsx`

-   **Purpose**: A display-only component that was previously used for in-place editing. It is now simplified to render formatted text, badges, or links. It no longer contains editing logic.
-   **Props**: `value`, `className`, `as` (e.g., 'badge', 'textarea'), `placeholder`, `isLink`.

### 4.2. `MultiSelectEditable.tsx`

-   **Purpose**: A component for selecting multiple items from a predefined list or creating new ones.
-   **Functionality**:
    -   In **display mode** (`isOwnProfile={false}`), it renders a list of badges.
    -   In **edit mode** (`isOwnProfile={true}`), it allows adding and removing items. A popover with a `cmdk` command menu appears, allowing the user to select from existing options or create a new entry.
    -   Used in the edit modals for "Skills" and "Styles".

### 4.3. `ImageUpload.tsx` (`src/components/shared/`)

-   **Purpose**: A self-contained component for handling file selection, preview, and upload to Firebase Storage.
-   **Functionality**:
    -   Displays a drag-and-drop area or a file selection button.
    -   Shows a preview of the selected image.
    -   When the "Upload Image" button is clicked, it calls the `uploadImage` function from `src/lib/firebase/storage.ts`.
    -   On successful upload, it calls the `onUpload` callback prop with the public `downloadURL`.
    -   Displays a loading state while uploading.

---

## 5. Skeletons (Loading States)

-   **`ArtistProfileSkeleton.tsx`**: The main skeleton component that provides the layout for the entire page while data is loading.
-   **`ProfileHeaderSkeleton.tsx`**: A detailed skeleton for the profile header section.
-   **`ProfileTabsSkeleton.tsx`**: A skeleton for tabbed content (currently not used on the main profile page but available).
