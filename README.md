# PhotoStudio — Lumina Photography & Event Management Platform

> An editorial visual photography platform and administration console engineered for university festivals, academic convocations, traditional Telugu weddings, cultural dance recitals, and private celebrations across Vijayawada, Guntur, Amaravati, Mangalagiri, and Tenali (Andhra Pradesh, India).

---

## 🌟 Key Features

### 🏛️ 1. Andhra Pradesh Regional Localization
- **Colleges & Universities**: VRSEC (Vijayawada), Andhra Loyola College, PB Siddhartha College, SRM University AP, KL University, VIT-AP, RVR & JC (Guntur), Dhanekula Institute (Ganguru).
- **Curated Events**: VIVA 2026, SPECTRA 2026, Telugu wedding receptions, Kuchipudi classical dance recitals, and graduation ceremonies.
- **Authentic Indian Event Photography**: Indian campus pro-nites, Telugu wedding mandaps, Haldi & Mehendi rituals, and traditional dance performances.

### 🔍 2. Advanced Multi-Filter Search
- Search across public galleries by **College**, **Event/Keyword**, **Location** (*Vijayawada, Guntur, Amaravati, Mangalagiri, Tenali*), and **Date/Year**.

### 🔐 3. Dual Authentication System
- **Customer Authentication** (`/login`, `/register`, `/account`):
  - Optional for public browsing (visitors can freely explore without registering).
  - Registered customers can save favorite photos, access shared client galleries, and download complete albums.
  - Includes password visibility toggle, remember me, forgot password modal, and **1-Click Demo Customer Login** (`aditya.varma@gmail.com`).
- **Studio Admin Portal** (`/admin/login`, `/admin/dashboard`):
  - Protected admin console for studio staff and photographers.
  - Dedicated route with show/hide password, remember me, forgot password modal, and **1-Click Demo Studio Login** (`rakesh@luminastudios.com`).

### 📊 4. Photographer Administration Dashboard (`/admin/dashboard`)
- **Metrics & Analytics**: Total Events, Total Photos, Total Colleges, Downloads, and R2 Storage gauge.
- **Upload Activity Chart**: Monthly upload and download volume tracking.
- **Event Management**: Create, edit, publish/unpublish, and manage events.
- **Photo Upload Console**: Drag-and-drop interface supporting multi-photo uploads with individual/overall progress bars and Cloudflare R2 direct signed-URL simulation.
- **Private Gallery Access Control**: Generate client passcodes, set expiry dates, and revoke access.

### 🖼️ 5. Premium Customer Gallery Experience
- Responsive masonry grid with lazy-loaded thumbnails.
- Single-click individual photo downloads.
- Multi-photo selection mode with batch ZIP album download powered by JSZip.
- Fullscreen Lightbox viewer with keyboard arrow navigation and camera EXIF drawer.
- **Private Passcode-Protected Galleries** (`/private-access`): Enter encrypted event passcode (e.g., demo passcode `SAITEJA2026`) to unlock unlisted private wedding and family albums.

---

## 🛠️ Technology Stack

| Layer | Technologies Selected |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Vanilla CSS + Tailwind CSS v4, Lucide React Icons |
| **Typography** | Playfair Display + Plus Jakarta Sans |
| **State Management** | Zustand (Auth & Customer Store), TanStack Query |
| **ZIP Compression** | JSZip (Client-side album archiving) |
| **Backend & Database** | Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2 |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Credentials

### Studio Admin
- **URL**: `/admin/login`
- **Email**: `rakesh@luminastudios.com`
- **Password**: `admin123`
*(Or click "One-Click Demo Studio Login" on the login page)*

### Customer Account
- **URL**: `/login`
- **Email**: `aditya.varma@gmail.com`
- **Password**: `customer123`
*(Or click "One-Click Demo Customer Login" on the login page)*

### Private Gallery Demo Passcode
- **URL**: `/private-access`
- **Demo Passcode**: `SAITEJA2026`

---

## 📄 License
MIT
