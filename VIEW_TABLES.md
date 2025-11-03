# How to View Your Supabase Tables

## ⚠️ IMPORTANT: Set Up Your Database First!

**If you're getting "table does not exist" errors, you need to run the migrations first!**

### Setup Steps:

1. **Open the SQL file**: Open `setup_database.sql` in this project folder
2. **Copy all the SQL**: Select all the content (Ctrl+A, then Ctrl+C)
3. **Go to Supabase Dashboard**: https://app.supabase.com → Your project → **SQL Editor**
4. **Paste and Run**: Paste the SQL (Ctrl+V) and click **"Run"** or press **Ctrl+Enter**
5. **Wait for success**: You should see a success message
6. **Check Tables**: Go to **Table Editor** - you should now see all your tables!

---

## Quick Method: Table Editor

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**: `apxfragycmzzkqhaqonz`
3. **Click "Table Editor"** in the left sidebar
4. **Click any table** to view its data

## View All Tables and Schema

1. In Supabase Dashboard, click **"Database"** in the left sidebar
2. Click **"Tables"** tab
3. You'll see:
   - All your tables listed
   - Columns, data types, and relationships
   - RLS (Row Level Security) policies

## Run SQL Queries

1. Click **"SQL Editor"** in the left sidebar
2. Use these queries to see your tables:

### View All Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### View Specific Table Data
```sql
-- View all profiles
SELECT * FROM profiles;

-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View all products
SELECT * FROM products;

-- View all cart items
SELECT * FROM cart_items;

-- View all orders with their items
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.total_amount,
  oi.product_name,
  oi.quantity,
  oi.price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;
```

### Count Records in Each Table
```sql
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'cart_items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;
```

## Your Tables (Based on Migrations)

Based on your database migrations, you should have these tables:

- **profiles** - User profiles (linked to auth.users)
- **orders** - Customer orders
- **order_items** - Items in each order
- **products** - Product catalog
- **cart_items** - Shopping cart items
- **contact_messages** - Contact form submissions
- **blog_posts** - Blog posts (optional)

## Visual Schema Diagram

1. Go to **Database** → **Schema Visualizer**
2. See a visual diagram of all your tables and relationships

