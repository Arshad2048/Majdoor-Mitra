-- =====================================================
-- Majdoor Mitra - Full Database Schema
-- Compatible with dbdiagram.io PostgreSQL Import
-- =====================================================
-- HOW TO USE:
-- 1. Go to https://dbdiagram.io
-- 2. Click "Import" → Select "PostgreSQL"
-- 3. Paste this entire file → Click "Submit"
-- =====================================================

-- ─────────────────────────────────────────────────────
-- TABLE: auth_users (Supabase internal - simplified)
-- This is Supabase's built-in authentication table.
-- Your profiles table links to this via profiles.id
-- ─────────────────────────────────────────────────────
CREATE TABLE auth_users (
    instance_id UUID,
    id UUID PRIMARY KEY,
    aud VARCHAR,
    role VARCHAR,
    email VARCHAR,
    encrypted_password VARCHAR,
    email_confirmed_at TIMESTAMPTZ,
    invited_at TIMESTAMPTZ,
    confirmation_token VARCHAR,
    confirmation_sent_at TIMESTAMPTZ,
    recovery_token VARCHAR,
    recovery_sent_at TIMESTAMPTZ,
    email_change_token_new VARCHAR,
    email_change VARCHAR,
    email_change_sent_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    phone TEXT DEFAULT NULL,
    phone_confirmed_at TIMESTAMPTZ,
    phone_change TEXT DEFAULT '',
    phone_change_token VARCHAR DEFAULT '',
    phone_change_sent_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    email_change_token_current VARCHAR DEFAULT '',
    email_change_confirm_status SMALLINT DEFAULT 0,
    banned_until TIMESTAMPTZ,
    reauthentication_token VARCHAR DEFAULT '',
    reauthentication_sent_at TIMESTAMPTZ,
    is_sso_user BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    is_anonymous BOOLEAN NOT NULL DEFAULT false
);

-- ─────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('normal_user', 'contractor', 'labour');
CREATE TYPE post_type AS ENUM ('job', 'labour');

-- ─────────────────────────────────────────────────────
-- TABLE: profiles
-- Stores user profile data, linked to Supabase Auth
-- ─────────────────────────────────────────────────────
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    role user_role NOT NULL DEFAULT 'normal_user',
    location TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}',
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    rating NUMERIC DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    banner_images JSONB DEFAULT '[]',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    email TEXT NOT NULL DEFAULT '',
    is_admin BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    is_banned BOOLEAN DEFAULT false
);

-- ─────────────────────────────────────────────────────
-- TABLE: posts
-- Stores job postings and labour availability listings
-- ─────────────────────────────────────────────────────
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type post_type NOT NULL DEFAULT 'job',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    skill TEXT DEFAULT '',
    location TEXT DEFAULT '',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    amount TEXT DEFAULT '',
    contact_number TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now(),
    experience TEXT,
    pay_type TEXT,
    availability TEXT,
    workers_needed INTEGER,
    duration TEXT,
    budget_min INTEGER,
    budget_max INTEGER,
    urgency TEXT,
    preferred_date DATE,
    time_slot TEXT,
    budget_note TEXT,
    looking_for TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    amount_numeric NUMERIC
);

-- ─────────────────────────────────────────────────────
-- TABLE: reviews
-- Stores user-to-user ratings and feedback
-- ─────────────────────────────────────────────────────
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL,
    reviewee_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    helpful_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────
-- TABLE: review_helpful_votes
-- Tracks which users marked which reviews as helpful
-- ─────────────────────────────────────────────────────
CREATE TABLE review_helpful_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- TABLE: contact_messages
-- Stores contact form submissions from the public site
-- ─────────────────────────────────────────────────────
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- TABLE: admin_notifications
-- Stores system alerts for administrators
-- ─────────────────────────────────────────────────────
CREATE TABLE admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- FOREIGN KEY RELATIONSHIPS
-- =====================================================

-- posts.user_id → profiles.id
ALTER TABLE posts
    ADD CONSTRAINT posts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles (id);

-- reviews.reviewer_id → profiles.id
ALTER TABLE reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey
    FOREIGN KEY (reviewer_id) REFERENCES profiles (id);

-- reviews.reviewee_id → profiles.id
ALTER TABLE reviews
    ADD CONSTRAINT reviews_reviewee_id_fkey
    FOREIGN KEY (reviewee_id) REFERENCES profiles (id);

-- review_helpful_votes.review_id → reviews.id
ALTER TABLE review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_review_id_fkey
    FOREIGN KEY (review_id) REFERENCES reviews (id);

-- review_helpful_votes.user_id → profiles.id
ALTER TABLE review_helpful_votes
    ADD CONSTRAINT review_helpful_votes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES profiles (id);

-- profiles.id → auth_users.id (Supabase Auth link)
ALTER TABLE profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth_users (id);

-- =====================================================
-- UNIQUE CONSTRAINTS
-- =====================================================

-- One user can only review another user once
ALTER TABLE reviews
    ADD CONSTRAINT unique_review_pair
    UNIQUE (reviewer_id, reviewee_id);

-- One user can only vote "helpful" on a review once
ALTER TABLE review_helpful_votes
    ADD CONSTRAINT unique_vote
    UNIQUE (review_id, user_id);

-- =====================================================
-- CHECK CONSTRAINTS
-- =====================================================

-- A user cannot review themselves
ALTER TABLE reviews
    ADD CONSTRAINT no_self_review
    CHECK (reviewer_id <> reviewee_id);

-- =====================================================
-- INDEXES (Performance)
-- =====================================================

-- Posts: fast lookup by user
CREATE INDEX idx_posts_user_id ON posts (user_id);

-- Posts: sort by newest
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);

-- Posts: fast feed query (active posts only)
CREATE INDEX idx_posts_active ON posts (created_at DESC) WHERE (is_deleted = false);

-- Profiles: sort by last seen (for admin online tracking)
CREATE INDEX idx_profiles_last_seen ON profiles (last_seen_at);

-- Reviews: lookup by reviewee (who is being reviewed)
CREATE INDEX idx_reviews_reviewee ON reviews (reviewee_id);

-- Reviews: lookup by reviewer (who wrote the review)
CREATE INDEX idx_reviews_reviewer ON reviews (reviewer_id);

-- Review helpful votes: lookup by user
CREATE INDEX idx_review_helpful_votes_user_id ON review_helpful_votes (user_id);
