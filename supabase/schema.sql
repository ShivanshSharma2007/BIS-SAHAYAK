-- Tech Reapers - BIS Portal Supabase Schema

-- Enable PostGIS for Geospatial queries (Labs mapping)
create extension if not exists postgis schema extensions;

-- 1. Standards Table
create table public.standards (
    id uuid default gen_random_uuid() primary key,
    standard_number text not null unique,
    title text not null,
    description text,
    product_category text,
    is_mandatory boolean default false,
    status text check (status in ('Active', 'Draft', 'Withdrawn')),
    pdf_url text,
    last_updated timestamp with time zone default now()
);

-- 2. Labs Table
create table public.labs (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    address text not null,
    location geography(POINT) not null, -- Stores Lat/Lng
    contact text,
    accredited_standards uuid[] -- Array of standard IDs
);

-- 3. Product Registrations (Fraud Radar)
create table public.product_registrations (
    id uuid default gen_random_uuid() primary key,
    isi_mark text not null unique,
    product_name text not null,
    manufacturer text not null,
    status text check (status in ('Valid', 'Fake', 'Revoked')),
    issue_date timestamp with time zone,
    expiry_date timestamp with time zone
);

-- 4. Draft Comments
create table public.draft_comments (
    id uuid default gen_random_uuid() primary key,
    standard_id uuid references public.standards(id) on delete cascade,
    user_id uuid not null, -- References auth.users later
    user_name text not null,
    comment text not null,
    section text,
    created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_standards_number on public.standards(standard_number);
create index idx_labs_location on public.labs using GIST(location);
create index idx_product_isi on public.product_registrations(isi_mark);
