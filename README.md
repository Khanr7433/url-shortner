# SwiftLink - Premium URL Shortener

SwiftLink is a sophisticated URL shortening application built with modern web technologies. It features a premium, glassmorphic user interface, secure authentication, and real-time analytics, powered by Supabase.

[**🚀 Live Demo**](https://swiftlink.free.nf/)

## ✨ Key Features

- **Premium Design System**:
  - **Glassmorphism**: Extensive use of backdrop blurs and semi-transparent layers for a modern aesthetic.
  - **Animations**: Fluid page transitions and micro-interactions powered by `framer-motion` and CSS keyframes.
  - **Typography**: Curated font pairing of **Outfit** (headings) and **Inter** (body) via Google Fonts.
- **User Dashboard**:
  - **Link Management**: Create, view, and delete shortened URLs.
  - **Analytics**: Track click counts in real-time.
  - **Sharing**: Native "Share" sheet integration with clipboard fallback for universal compatibility.
  - **Pagination**: Efficiently manage large lists of links.
- **Authentication**:
  - Email/Password signup and login.
  - Persisted sessions using `AuthContext`.
  - Protected routes (`RequireAuth`) ensuring secure access.
- **Admin Dashboard**:
  - Role-based access control (Admin/User).
  - System-wide statistics visualization.
  - User management capabilities (Promote/Demote).
- **Redirection Engine**:
  - Custom loading state with an SVG countdown timer.
  - Robust error handling and 404 pages for invalid or expired links.

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS 3.4
- **State Management**: React Context API
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## 📂 Project Structure

A deep dive into the source code organization:

```text
src/
├── assets/                  # Static assets
│   └── react.svg
├── components/
│   ├── ui/                  # Reusable UI primitives
│   │   ├── Button.tsx       # CVA-powered button component
│   │   └── Input.tsx        # Styled input fields with backdrop blur
│   ├── Footer.tsx           # Application-wide footer
│   ├── Layout.tsx           # Main shell wrapper
│   ├── Navbar.tsx           # Responsive navigation with auth detection
│   ├── Pagination.tsx       # Logic for paginating lists
│   └── RequireAuth.tsx      # HOC for protecting routes
├── context/
│   └── AuthContext.tsx      # Global state for user session & role
├── hooks/
│   └── useAuth.ts           # Custom hook to consume AuthContext
├── pages/
│   ├── AdminDashboard.tsx   # Admin-only view for system stats/users
│   ├── Dashboard.tsx        # Main user workspace for shortener
│   ├── LandingPage.tsx      # Public facing marketing page
│   ├── Login.tsx            # Secure login form
│   ├── RedirectHandler.tsx  # Dynamic route resolving short codes
│   └── Signup.tsx           # New user registration
├── services/
│   ├── urlService.ts        # Database operations for URLs (CRUD)
│   └── userService.ts       # Database operations for Profiles
├── utils/
│   ├── cn.ts                # styling utility (clsx + tailwind-merge)
│   └── shortId.ts           # Hex-based short code generator
├── App.tsx                  # Application routing definitions
├── main.tsx                 # React entry point
└── supabase.ts              # Supabase client singleton
```

## ⚙️ Configuration

### Environment Variables (.env)

The application requires the following keys to connect to Supabase:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
```

### Tailwind Configuration

The design system is customized in `tailwind.config.js`:

- **Fonts**: Extends `fontFamily` with `sans` (Inter) and `heading` (Outfit).
- **Colors**: Uses the default Slate palette with custom opacity layers.

## 🚀 Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Khanr7433/url-shortner.git
    cd url-shortner
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Setup Supabase**

    - Create a new project.
    - Enable Email/Password Auth.
    - Create public tables: `profiles` (for roles) and `urls` (for links).

4.  **Configure Environment**

    - Create a `.env` file in the root directory.
    - Copy the keys from your Supabase project settings:

5.  **Run Development Server**

    ```bash
    npm run dev
    ```

6.  **Build for Production**
    ```bash
    npm run build
    ```

---
