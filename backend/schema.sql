-- ==============================================================================
-- Lumina Studios Platform - Cloudflare D1 Database Schema
-- Production SQL Schema for Cloudflare D1 (SQLite Edge Distributed Engine)
-- ==============================================================================

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('super_admin', 'photographer', 'editor')) DEFAULT 'photographer',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 1b. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 1c. Customer Photo Favorites Table
CREATE TABLE IF NOT EXISTS customer_favorites (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    photo_id TEXT NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, photo_id)
);

-- 2. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    description TEXT,
    established_year INTEGER,
    total_events INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    college_id TEXT REFERENCES colleges(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT CHECK(category IN ('college_fest', 'cultural_event', 'convocation', 'wedding', 'anniversary', 'birthday', 'private_event')) NOT NULL,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    location TEXT NOT NULL,
    photographer TEXT NOT NULL,
    cover_photo_url TEXT NOT NULL,
    description TEXT NOT NULL,
    total_photos INTEGER DEFAULT 0,
    status TEXT CHECK(status IN ('published', 'draft', 'archived')) DEFAULT 'published',
    is_private BOOLEAN DEFAULT 0,
    private_access_code TEXT,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Galleries Table (Collections grouping photos within events)
CREATE TABLE IF NOT EXISTS galleries (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    cover_photo_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Photos Table (Stores metadata only; binaries stored in Cloudflare R2)
CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    gallery_id TEXT REFERENCES galleries(id) ON DELETE SET NULL,
    storage_key TEXT NOT NULL UNIQUE, -- Key in Cloudflare R2 bucket
    title TEXT NOT NULL,
    cdn_url TEXT NOT NULL, -- Public CDN or custom domain URL
    thumbnail_url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    aspect_ratio REAL NOT NULL,
    size_bytes INTEGER NOT NULL,
    captured_at TIMESTAMP,
    camera_model TEXT,
    lens_model TEXT,
    focal_length TEXT,
    iso INTEGER,
    shutter_speed TEXT,
    aperture TEXT,
    download_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Private Gallery Access Table (GalleryAccess)
CREATE TABLE IF NOT EXISTS private_gallery_access (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    access_code_hash TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    expires_at TIMESTAMP,
    allow_high_res_downloads BOOLEAN DEFAULT 1,
    watermark_enabled BOOLEAN DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Downloads Table (Auditing download sessions)
CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
    photo_id TEXT REFERENCES photos(id) ON DELETE SET NULL,
    is_full_album_zip BOOLEAN DEFAULT 0,
    photos_count INTEGER DEFAULT 1,
    total_bytes INTEGER,
    ip_hash TEXT,
    user_agent TEXT,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT REFERENCES admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast queries under 1,000+ simultaneous visitors
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_favorites_cid ON customer_favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_events_college_id ON events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status_is_private ON events(status, is_private);
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_captured_at ON photos(captured_at);
CREATE INDEX IF NOT EXISTS idx_private_access_code ON private_gallery_access(access_code_hash);
CREATE INDEX IF NOT EXISTS idx_downloads_customer_id ON downloads(customer_id);
