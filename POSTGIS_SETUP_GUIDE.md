# PostGIS Location Data Setup Guide

## 🗺️ Overview

This guide will help you set up PostGIS location data for the Drop-In Morocco application, enabling advanced geographical features like:

- **Distance-based gym searches** (find gyms within X km)
- **Map-based browsing** with real-time location filtering
- **City-based searches** with geographical accuracy
- **Bounding box queries** for map viewport optimization

## 📋 Prerequisites

- Supabase project with database access
- SQL editor access (Supabase Dashboard → SQL Editor)
- Basic understanding of geographical coordinates

## 🚀 Step-by-Step Setup

### Step 1: Run the PostGIS Diagnostic Script

1. **First, diagnose the current state**
   
   **Option A: Simple Diagnostic (Recommended)**
   ```sql
   -- Copy and run: src/lib/api/postgis-simple-diagnostic.sql
   ```
   This will show you:
   - ✅ PostGIS extension status
   - ✅ Current clubs table structure
   - ✅ Dependent views and objects
   - ✅ Location column type
   - ✅ Column existence checks
   - ✅ Recommendations for next steps
   
   **Option B: Detailed Diagnostic**
   ```sql
   -- Copy and run: src/lib/api/postgis-diagnostic.sql
   ```
   This provides more detailed analysis but may show errors if columns don't exist yet.

### Step 2: Run the PostGIS Implementation Script

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Navigate to "SQL Editor"
   - Create a new query

2. **Choose the appropriate script:**
   
   **Option A: Safe Implementation (Recommended)**
   ```sql
   -- Copy the entire content from: src/lib/api/postgis-safe-implementation.sql
   ```
   This script:
   - ✅ Safely handles existing location columns
   - ✅ Checks for dependent views before making changes
   - ✅ Only creates functions if location column exists
   - ✅ Provides detailed logging of each step
   
   **Option B: Full Implementation (If no dependent views)**
   ```sql
   -- Copy the entire content from: src/lib/api/postgis-location-implementation.sql
   ```
   This script will:
   - ✅ Enable PostGIS extension
   - ✅ Add proper geometry columns to clubs table
   - ✅ Create spatial indexes for performance
   - ✅ Add latitude/longitude columns for easier access
   - ✅ Create automatic location update triggers
   - ✅ Add sample location data for Moroccan cities
   - ✅ Create optimized PostGIS functions

### Step 2: Verify the Setup

After running the script, verify everything is working:

```sql
-- Check if PostGIS extension is enabled
SELECT PostGIS_version();

-- Check clubs table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clubs' 
ORDER BY ordinal_position;

-- Test the nearby clubs function
SELECT * FROM find_nearby_clubs(33.5731, -7.5898, 5) LIMIT 3;
```

### Step 3: Test the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test the location features**
   - Visit `http://localhost:5181/location-test`
   - Try searching for gyms by coordinates
   - Test city-based searches
   - Verify map functionality

## 🎯 Features Enabled

### 1. **Distance-Based Search**
```typescript
// Find gyms within 5km of Casablanca
const nearbyGyms = await LocationAPI.getNearbyClubs(33.5731, -7.5898, 5);
```

### 2. **City-Based Search**
```typescript
// Search gyms in Marrakech
const cityGyms = await LocationAPI.searchClubsByCity('Marrakech');
```

### 3. **Map Viewport Search**
```typescript
// Get gyms visible in current map bounds
const mapGyms = await LocationAPI.getClubsInBounds({
  north: 34.0, south: 33.0,
  east: -6.0, west: -8.0
});
```

## 🏗️ Database Structure

### Updated `clubs` Table
```sql
clubs (
  id UUID PRIMARY KEY,
  name TEXT,
  address TEXT,
  city TEXT,
  tier TEXT,
  amenities JSONB,
  monthly_price NUMERIC,
  is_active BOOLEAN,
  
  -- NEW PostGIS columns
  location GEOMETRY(POINT, 4326),  -- PostGIS geometry
  latitude DECIMAL(10, 8),         -- Easy access lat
  longitude DECIMAL(11, 8),         -- Easy access lng
  
  -- Spatial index for performance
  INDEX idx_clubs_location_gist USING GIST (location)
)
```

### PostGIS Functions Created

1. **`find_nearby_clubs(user_lat, user_lng, max_distance_km)`**
   - Returns gyms within specified distance
   - Includes distance calculation
   - Optimized with spatial indexing

2. **`search_clubs_by_city(search_city, limit_count)`**
   - City-based search with fuzzy matching
   - Returns up to specified limit
   - Case-insensitive search

3. **`get_clubs_in_bounds(min_lat, min_lng, max_lat, max_lng)`**
   - Returns gyms within geographical bounding box
   - Perfect for map viewport queries
   - Optimized for map interactions

## 🔧 Troubleshooting

### Common Issues

1. **"PostGIS extension not found"**
   ```sql
   -- Enable PostGIS extension
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

2. **"Cannot drop column location because other objects depend on it"**
   ```sql
   -- This error occurs when there are dependent views
   -- Solution: Use the safe implementation script instead
   -- Run: src/lib/api/postgis-safe-implementation.sql
   ```

3. **"Function find_nearby_clubs does not exist"**
   - Ensure the PostGIS implementation script ran completely
   - Check for any SQL errors in the execution
   - Run the diagnostic script to verify setup

4. **"Location column type error"**
   ```sql
   -- Check current column type first
   SELECT column_name, data_type FROM information_schema.columns 
   WHERE table_name = 'clubs' AND column_name = 'location';
   
   -- If it's not PostGIS geometry, convert it
   ALTER TABLE clubs ALTER COLUMN location TYPE GEOMETRY(POINT, 4326);
   ```

5. **"Dependent views prevent column changes"**
   ```sql
   -- Check what views depend on the clubs table
   SELECT schemaname, viewname FROM pg_views 
   WHERE definition LIKE '%clubs%' AND schemaname = 'public';
   
   -- Use the safe implementation script that handles this automatically
   ```

### Performance Optimization

1. **Spatial Index**
   ```sql
   -- Ensure spatial index exists
   CREATE INDEX IF NOT EXISTS idx_clubs_location_gist 
   ON clubs USING GIST (location);
   ```

2. **Query Optimization**
   - Use bounding box queries for map views
   - Limit results with reasonable distance ranges
   - Cache frequently accessed location data

## 📍 Sample Data

The script includes sample coordinates for major Moroccan cities:

- **Casablanca**: 33.5731, -7.5898
- **Rabat**: 34.0209, -6.8416
- **Marrakech**: 31.6295, -8.0089
- **Fez**: 34.0331, -5.0003
- **Agadir**: 30.4278, -9.5981

## 🎉 Next Steps

After successful setup:

1. **Test all location features** in the application
2. **Add more precise coordinates** for individual gyms
3. **Implement geocoding** for address-to-coordinates conversion
4. **Add location-based notifications** for nearby gyms
5. **Optimize map performance** with clustering

## 📚 Additional Resources

- [PostGIS Documentation](https://postgis.net/documentation/)
- [Supabase PostGIS Guide](https://supabase.com/docs/guides/database/extensions/postgis)
- [Geographic Coordinate Systems](https://en.wikipedia.org/wiki/Geographic_coordinate_system)

---

**✅ PostGIS Location Data Setup Complete!**

Your Drop-In Morocco application now has full geographical capabilities with optimized PostGIS functions and spatial indexing.