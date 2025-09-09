# Prisma to Supabase Migration Guide

This guide shows how to migrate from Prisma to Supabase for exercise queries.

## Prisma vs Supabase Syntax Comparison

### 1. Basic Query

**Prisma:**
```typescript
export async function getExercisesByBodyPart(key: string, limit = 50) {
  return prisma.exercise.findMany({
    where: { targets: { has: key } },
    take: limit,
    orderBy: { name: "asc" },
  });
}
```

**Supabase (Direct):**
```typescript
export async function getExercisesByBodyPart(key: string, limit = 50) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .contains('secondary_muscles', [key])
    .order('name', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data;
}
```

**Supabase (Prisma-style):**
```typescript
export async function getExercisesByBodyPart(key: string, limit = 50) {
  return ExerciseService.findMany({
    where: { targets: { has: key } },
    take: limit,
    orderBy: { name: 'asc' }
  });
}
```

### 2. Complex Queries

**Prisma:**
```typescript
const exercises = await prisma.exercise.findMany({
  where: {
    AND: [
      { body_part: 'chest' },
      { difficulty_level: 'intermediate' },
      { equipment: { in: ['dumbbell', 'barbell'] } }
    ]
  },
  take: 20,
  skip: 0,
  orderBy: { name: 'asc' }
});
```

**Supabase (Prisma-style):**
```typescript
const exercises = await ExerciseService.findMany({
  where: {
    AND: [
      { body_part: 'chest' },
      { difficulty_level: 'intermediate' },
      { equipment: { in: ['dumbbell', 'barbell'] } }
    ]
  },
  take: 20,
  skip: 0,
  orderBy: { name: 'asc' }
});
```

### 3. Array Operations

**Prisma:**
```typescript
// Check if array contains value
{ targets: { has: 'chest' } }

// Check if array contains any of multiple values
{ targets: { hasSome: ['chest', 'shoulders'] } }

// Check if array contains all values
{ targets: { hasEvery: ['chest', 'shoulders'] } }
```

**Supabase:**
```typescript
// Check if array contains value
.contains('secondary_muscles', ['chest'])

// Check if array contains any of multiple values
.overlaps('secondary_muscles', ['chest', 'shoulders'])

// Check if array contains all values
.contains('secondary_muscles', ['chest', 'shoulders'])
```

## Migration Steps

### Step 1: Install Dependencies

**Prisma:**
```bash
npm install prisma @prisma/client
npm install -D prisma
```

**Supabase:**
```bash
npm install @supabase/supabase-js
```

### Step 2: Database Schema

**Prisma Schema (schema.prisma):**
```prisma
model Exercise {
  id               String   @id @default(cuid())
  name             String
  body_part        String
  target           String
  equipment        String
  gif_url          String?
  video_url        String?
  instructions     String[]
  secondary_muscles String[]
  difficulty_level DifficultyLevel?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt

  @@map("exercises")
}

enum DifficultyLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

**Supabase SQL:**
```sql
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  body_part VARCHAR(100) NOT NULL,
  target VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) NOT NULL,
  gif_url TEXT,
  video_url TEXT,
  instructions TEXT[],
  secondary_muscles TEXT[],
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3: Client Setup

**Prisma:**
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

**Supabase:**
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

### Step 4: Query Migration

**Before (Prisma):**
```typescript
const exercises = await prisma.exercise.findMany({
  where: { targets: { has: key } },
  take: limit,
  orderBy: { name: "asc" },
});
```

**After (Supabase Prisma-style):**
```typescript
const exercises = await ExerciseService.findMany({
  where: { targets: { has: key } },
  take: limit,
  orderBy: { name: 'asc' }
});
```

## Benefits of Each Approach

### Prisma Benefits:
- **Type Safety**: Full TypeScript support with generated types
- **Query Builder**: Intuitive query syntax
- **Migrations**: Built-in migration system
- **Multi-Database**: Support for multiple databases
- **Performance**: Query optimization and caching

### Supabase Benefits:
- **Real-time**: Built-in real-time subscriptions
- **Auth**: Integrated authentication system
- **Storage**: File storage capabilities
- **Edge Functions**: Serverless functions
- **Dashboard**: Web-based database management
- **Free Tier**: Generous free tier

## Current Project Status

This project currently uses **Supabase** with a Prisma-style wrapper for easier migration. You can:

1. **Keep using Supabase** with the Prisma-style API
2. **Migrate to Prisma** by installing Prisma and updating the schema
3. **Use both** for different parts of the application

## Usage Examples

### Using Prisma-style API (Current):
```typescript
import { useExercises } from '@/hooks/useExercisesPrismaStyle';

const { exercises, loading, error } = useExercises({
  bodyPart: 'chest',
  limit: 20
});
```

### Using Direct Supabase API:
```typescript
import { useExerciseDBByBodyPart } from '@/hooks/useExercisesByBodyPart';

const { exercises, loading, error } = useExerciseDBByBodyPart('chest', 20);
```

### Using Prisma (If Migrated):
```typescript
import { prisma } from '@/lib/prisma';

const exercises = await prisma.exercise.findMany({
  where: { targets: { has: 'chest' } },
  take: 20,
  orderBy: { name: 'asc' }
});
```

## Recommendation

For this project, I recommend **staying with Supabase** because:

1. **Already Integrated**: The project is already using Supabase
2. **Real-time Features**: Built-in real-time capabilities for live updates
3. **Cost Effective**: Free tier covers most use cases
4. **Easy Deployment**: Works well with Vercel
5. **Prisma-style API**: You get Prisma-like syntax without the complexity

The Prisma-style wrapper I created gives you the best of both worlds!
