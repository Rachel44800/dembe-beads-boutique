# Supabase Connection Guide

This guide will help you connect your project to Supabase and view your database.

## Step 1: Get Your Supabase Credentials

**Your Supabase Project ID:** `apxfragycmzzkqhaqonz`

**Your Project URL:** `https://apxfragycmzzkqhaqonz.supabase.co`

### Get Your API Key:

1. Go to [Supabase Dashboard](https://app.supabase.com) and log in
2. Select your project (the one with URL `https://apxfragycmzzkqhaqonz.supabase.co`)
3. Go to **Project Settings** → **API**
4. Copy the **anon public** key (under "Project API keys") - it's a long string starting with `eyJ...`

## Step 2: Create Environment Variables

**Create a `.env` file in the root of your project** (same folder as `package.json`) with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key_here
```

**Replace the placeholders with your actual values from Step 1.**

**Your `.env` file should look like this** (replace `your_anon_key_here` with the actual key from Supabase):
```env
VITE_SUPABASE_URL=https://apxfragycmzzkqhaqonz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

⚠️ **The Project URL is already configured:** `https://apxfragycmzzkqhaqonz.supabase.co`
⚠️ **You only need to get the `anon public` key from your Supabase dashboard.**

⚠️ **Important:** After creating/updating the `.env` file, you must **restart your development server** for the changes to take effect!

## Step 3: View Your Database

### Option A: Using Supabase Dashboard (Easiest - Recommended) 🎯

**This is the best way to view your database!**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **Table Editor** in the left sidebar
   - You'll see all your tables listed
   - Click on any table to view its data
   - You can edit, add, and delete records directly here

4. **View Schema/Database Structure:**
   - Click on **Database** in the left sidebar
   - Go to **Tables** to see your table structure
   - Or go to **Database** → **Schema Visualizer** for a visual diagram

5. **Run SQL Queries:**
   - Click on **SQL Editor** in the left sidebar
   - Write custom queries like:
     ```sql
     SELECT * FROM profiles;
     SELECT * FROM orders ORDER BY created_at DESC;
     SELECT * FROM products;
     ```

### Option B: Using Supabase CLI (For Advanced Users)

You can use Supabase CLI via npx (no installation needed):

```bash
# Link your project (requires authentication)
npx supabase link --project-ref apxfragycmzzkqhaqonz

# Pull database schema
npx supabase db pull

# Start local Supabase Studio (database viewer)
npx supabase studio
```

### Option C: Using External Database Tools

You can connect using PostgreSQL clients like:
- **pgAdmin** (free, GUI)
- **DBeaver** (free, cross-platform)
- **TablePlus** (paid, Mac/Windows)

Use the connection details from: **Project Settings** → **Database** → **Connection string**

## Step 4: Verify Connection

After setting up your `.env` file:
1. Restart your development server (`npm run dev`)
2. Check the browser console for any connection errors
3. Try logging in or using features that interact with the database

## Your Current Database Schema

Based on your migrations, you have these tables:
- `profiles` - User profiles
- `orders` - Customer orders
- `order_items` - Items in each order
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `contact_messages` - Contact form submissions
- `blog_posts` - Blog posts (optional)

## Troubleshooting

- **Connection errors?** Double-check your `.env` file values
- **Can't see tables?** Make sure your migrations have been run in Supabase
- **RLS policies blocking access?** Check your Row Level Security policies in the Supabase dashboard

