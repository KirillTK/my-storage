# My Storage

A modern, full-stack document management system built with Next.js, featuring secure file storage, folder organization, and automated cleanup. Built on the [T3 Stack](https://create.t3.gg/).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables Setup](#environment-variables-setup)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Cron Jobs](#cron-jobs)

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth.js
- 📁 **Folder Organization** - Hierarchical folder structure with breadcrumb navigation
- 📄 **Document Management** - Upload, view, rename, download, and delete files
- 🖼️ **Preview Support** - Built-in preview for images, PDFs, videos, audio, and text files
- 🔍 **Advanced Search** - Search across documents with filters by type and date
- 🗑️ **Soft Delete** - Safe deletion with automatic cleanup via cron jobs
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and Radix UI
- 📱 **Responsive Design** - Works seamlessly on desktop
- ☁️ **Cloud Storage** - Leverages Vercel Blob for scalable file storage

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router with Turbopack)
- **Authentication**: [NextAuth.js 5](https://next-auth.js.org)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Type Safety**: TypeScript
- **Deployment**: [Vercel](https://vercel.com)

## 🏗 Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js App Router + React 19 + Tailwind CSS)            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Feature Layer                            │
│  • Dashboard Filters    • Document Viewer                   │
│  • Folder Viewer        • Upload/Download                   │
│  • Search               • Breadcrumbs                        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Server Layer                            │
│  • Server Actions       • API Routes                        │
│  • NextAuth.js          • CRON Endpoints                    │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
┌────────────▼───────────┐  ┌───────────▼────────────────────┐
│   PostgreSQL Database  │  │    Vercel Blob Storage         │
│   (Drizzle ORM)        │  │    (File Storage)              │
│                        │  │                                │
│  • Users               │  │  • Document Files              │
│  • Documents           │  │  • Binary Data                 │
│  • Folders             │  │                                │
│  • Sessions            │  │                                │
└────────────────────────┘  └────────────────────────────────┘
```

### Key Design Patterns

#### 1. **Feature-Sliced Design (FSD)**
The project follows a modified FSD architecture:

- **`widgets/`** - Complete UI sections (header, footer, storage grid)
- **`features/`** - Self-contained features with business logic (upload, viewer, filters)
- **`entities/`** - Business entities (document, folder, user) with hooks and components
- **`shared/`** - Reusable UI components, hooks, and utilities

#### 2. **Server Actions Pattern**
All data mutations use Next.js Server Actions for type-safe, server-side logic:

```typescript
// src/server/actions/document.actions.ts
- uploadDocument()
- deleteDocument()
- renameDocument()
- getDocumentMetadata()
```

#### 3. **Soft Delete with Automated Cleanup**
Documents are soft-deleted (marked with `deletedAt` timestamp) and permanently removed via a CRON job running every day.

#### 4. **Hierarchical Folder Structure**
Folders support infinite nesting with referential integrity:
- Parent-child relationships via `parentFolderId`
- Cascade deletion for nested structures
- Breadcrumb navigation for easy traversal

### Database Schema

#### Core Tables

**Users** - Authentication and user profiles
- OAuth integration via NextAuth.js
- Linked to documents and folders

**Documents** - File metadata and references
- Soft delete support (`deletedAt`)
- Vercel Blob URL references
- Versioning system (future-ready)
- Folder hierarchy integration

**Folders** - Hierarchical organization
- Self-referential structure (`parentFolderId`)
- Cascade delete support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 10.x or higher (comes with Node.js)
- **PostgreSQL** database (local or cloud-based) or Docker
- **Git** ([Download](https://git-scm.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KirillTK/my-storage
cd my-storage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then configure all required environment variables (see [Environment Variables Setup](#environment-variables-setup) below).

### 4. Set Up the Database

**If using Docker (recommended for local development):**

```bash
# Run the database setup script
./start-database.sh

# This will:
# - Start a PostgreSQL container
# - Configure the database based on your .env file
# - Handle port conflicts automatically
```

**After database is running:**

```bash
# Push the schema to your database
npm run db:push

# Open Drizzle Studio to view your database (optional)
npm run db:studio
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables Setup

Create a `.env` file with the following variables:

```bash
# Database
POSTGRES_URL="postgresql://user:password@host:port/database"

# NextAuth.js
AUTH_SECRET="your-auth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# CRON Job (Production only)
CRON_SECRET="your-cron-secret"

# Node Environment
NODE_ENV="development"
```

### How to Get Each Environment Variable

#### 1. **POSTGRES_URL** (PostgreSQL Connection String)

**Option A: Vercel Postgres (Recommended for production)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Storage** → **Create Database** → **Postgres**
4. Click **Create** and copy the connection string
5. The URL format will be: `postgresql://username:password@host:port/database?sslmode=require`

**Option B: Docker (Recommended for local development)**

Use the included `start-database.sh` script:

```bash
# Make the script executable
chmod +x start-database.sh

# Run the script
./start-database.sh
```

**Option C: Other Providers**
- [Supabase](https://supabase.com/) - Free tier available
- [Neon](https://neon.tech/) - Serverless Postgres
- [Railway](https://railway.app/) - Simple PostgreSQL hosting
- [AWS RDS](https://aws.amazon.com/rds/) - Managed PostgreSQL

#### 2. **AUTH_SECRET** (NextAuth.js Secret)

Generate a secure random string:

```bash
# Using OpenSSL (Mac/Linux)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `AUTH_SECRET`.

#### 3. **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET** (Google OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Click **Create** and copy the **Client ID** and **Client Secret**

**Important**: Keep the Client Secret secure and never commit it to version control.

#### 4. **BLOB_READ_WRITE_TOKEN** (Vercel Blob Storage)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **Blob**
3. Click **Create** to create a Blob store
4. Go to the Blob store settings
5. Copy the **Read-Write Token** (starts with `vercel_blob_rw_`)

#### 5. **CRON_SECRET** (CRON Job Authentication)

Generate a secure secret for CRON endpoint protection:

```bash
openssl rand -base64 32
```

This is used to authenticate automated cleanup jobs in production.

**Note**: This is optional for development but **required for production**.

### Example `.env` File

```bash
# Database (Example with Vercel Postgres)
POSTGRES_URL="postgresql://default:abc123xyz@ep-cool-cloud-12345.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"

# NextAuth.js
AUTH_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890+/="
GOOGLE_CLIENT_ID="123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-AbCdEfGhIjKlMnOpQrStUvWx"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_AbCdEfGhIjKlMn_0pQrStUvWxYz1234567890AbCdEf"

# CRON (Production)
CRON_SECRET="Zy9XwVuTsRqPoNmLkJiHgFeDcBa0123456789+/="

# Environment
NODE_ENV="development"
```

## 💾 Database Setup

### Using Drizzle Kit

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Database Schema Tables

- `my-storage_users` - User accounts
- `my-storage_accounts` - OAuth accounts
- `my-storage_sessions` - Auth sessions
- `my-storage_verification_tokens` - Email verification
- `my-storage_documents` - File metadata
- `my-storage_folders` - Folder hierarchy

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run preview          # Build and start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run typecheck        # Run TypeScript compiler
npm run format:check     # Check code formatting
npm run format:write     # Format code with Prettier
npm run check            # Run lint + typecheck

# Database
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio

# Testing
npm run cron:test        # Test CRON cleanup endpoint
```

## 📁 Project Structure

```
my-storage/
├── src/
│   ├── app/                    # Next.js App Router (pages, layouts, API routes)
│   ├── widgets/                # Composite UI blocks (header, footer, storage-grid)
│   ├── features/               # User interactions (upload, filters, search, viewer)
│   ├── entities/               # Business entities (document, folder, user)
│   ├── shared/                 # Reusable code (ui, hooks, utils)
│   ├── server/                 # Server-side logic (actions, auth, database)
│   ├── styles/                 # Global styles
│   └── env.js                  # Environment validation
│
├── public/                     # Static assets
├── drizzle.config.ts          # Drizzle ORM configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config (including cron jobs)
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click **Import Project**
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Add all environment variables from your `.env` file
   - Make sure to set `NODE_ENV=production`
   - Set the `AUTH_SECRET` and `CRON_SECRET`

4. **Add Storage Services**
   - In Vercel Dashboard, go to **Storage**
   - Create **Postgres** database
   - Create **Blob** storage
   - Copy the connection strings to your environment variables

5. **Deploy**
   - Click **Deploy**
   - Wait for the build to complete
   - Your app will be live at `https://your-app.vercel.app`

6. **Update Google OAuth Redirect URI**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Add your production URL to authorized redirect URIs:
     - `https://your-app.vercel.app/api/auth/callback/google`


## ⏰ Cron Jobs

### Automated Document Cleanup

The app includes a CRON job that runs **once daily** to permanently delete soft-deleted documents.

**How it works:**
1. Finds all documents where `deletedAt` is not null
2. Deletes files from Vercel Blob storage
3. Removes database records permanently
4. Logs results for monitoring

**Configuration:**

The schedule is defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 1 * * *"
    }
  ]
}
```

**Schedule**: `0 1 * * *` runs at 1:00 AM every day

**Requirements:**
- Vercel Pro plan (cron jobs not available on Hobby plan)
- `CRON_SECRET` environment variable must be set

**Testing locally:**

```bash
npm run cron:test
```

**Testing in production:**

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-app.vercel.app/api/cron/cleanup
```

For more details, see [CRON_SETUP.md](./CRON_SETUP.md).

## 🔒 Security Considerations

- **Authentication**: OAuth 2.0 via Google with secure session management
- **File Access**: Server-side validation for all file operations
- **Environment Variables**: Never commit `.env` files to version control
- **CRON Protection**: Endpoint secured with secret token
- **SQL Injection**: Protected via Drizzle ORM parameterized queries
- **CSRF Protection**: Built-in with NextAuth.js
- **XSS Protection**: React's automatic escaping + Content Security Policy

## 📚 Learn More

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [T3 Stack Documentation](https://create.t3.gg/)

### Useful Resources

- [T3 Stack Discord](https://t3.gg/discord) - Community support
- [Next.js GitHub](https://github.com/vercel/next.js) - Next.js repository
- [Vercel Platform](https://vercel.com) - Deployment platform

