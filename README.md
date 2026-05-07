# Next.js 16 Scalable Admin Template

This project is a production-ready, scalable Next.js 16 application using the App Router, TypeScript, TailwindCSS, MongoDB, NextAuth, and Cloudinary.

## Features

- **Full-stack Next.js**: App Router with Server Components and Client Components.
- **Authentication**: Secure auth with NextAuth.js (Credentials, Google, Github).
- **Database**: MongoDB with Mongoose using Singleton pattern.
- **File Uploads**: Cloudinary integration for scalable media storage.
- **Form Validation**: Zod & React Hook Form.
- **API Routes**: Type-safe API endpoints using Route Handlers.
- **Role-Based Access**: Middleware protection for admin routes.
- **Styling**: TailwindCSS with CSS Variables and Dark Mode support.
- **Architecture**: Modular, service-based architecture for scalability.

## Getting Started

1.  **Clone the repository**

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables**

    Copy `.env.example` to `.env.local` and fill in the values:

    ```bash
    cp .env.example .env.local
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
/project-root
│
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── (auth)/         # Auth pages (Login, Register)
│   │   ├── (dashboard)/    # Protected dashboard pages
│   │   ├── api/            # API Route Handlers
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   │
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI components (Buttons, Inputs)
│   │   ├── forms/          # Form components
│   │   └── providers/      # Context providers
│   │
│   ├── config/             # App configuration (site, env)
│   ├── constants/          # Static constants (nav items)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core libraries (db, auth, utils)
│   ├── models/             # Mongoose models
│   ├── services/           # Business logic & DB queries
│   ├── store/              # Global state management
│   ├── types/              # TypeScript definitions
│   └── validations/        # Zod schemas
│
├── .env.local              # Environment variables
├── next.config.ts          # Next.js config
├── tailwind.config.ts      # Tailwind config
└── tsconfig.json           # TypeScript config
```

## Best Practices Used

-   **Server Actions & API Routes**: separation of backend logic.
-   **Service Layer**: `src/services` handles DB logic, keeping controllers clean.
-   **Environment Validation**: `src/config/env.ts` ensures all env vars are present.
-   **Singleton DB**: `src/lib/db.ts` prevents connection exhaustion in dev mode.
-   **Absolute Imports**: `@/` alias for cleaner imports.
-   **Strict TypeScript**: Type safety across the entire application.

## Security

-   **Middleware**: Protected routes using NextAuth middleware.
-   **Zod Validation**: Input validation for all API routes and Forms.
-   **Secure Headers**: Next.js default security headers.
-   **Password Hashing**: Bcrypt for credential storage.

## License

MIT
