// Prisma-style exercise queries for Supabase
// This provides Prisma-like syntax while using Supabase

import { supabase } from '@/integrations/supabase/client';
import { LocalExercise } from './exercises.getByBodyPart';

/**
 * Prisma-style exercise queries using Supabase
 * These functions mimic Prisma's API for easier migration
 */

export class ExerciseService {
  /**
   * Find many exercises with Prisma-style syntax
   * Equivalent to: prisma.exercise.findMany({ where: { targets: { has: key } } })
   */
  static async findMany(options: {
    where?: {
      targets?: { has: string };
      body_part?: string;
      target?: string;
      equipment?: string;
      difficulty_level?: string;
    };
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    skip?: number;
  } = {}): Promise<LocalExercise[]> {
    const {
      where = {},
      take = 50,
      orderBy = { name: 'asc' },
      skip = 0
    } = options;

    let query = supabase.from('exercises').select('*');

    // Handle where conditions
    if (where.targets?.has) {
      // For array fields, use contains operator
      query = query.contains('secondary_muscles', [where.targets.has]);
    }

    if (where.body_part) {
      query = query.eq('body_part', where.body_part);
    }

    if (where.target) {
      query = query.eq('target', where.target);
    }

    if (where.equipment) {
      query = query.eq('equipment', where.equipment);
    }

    if (where.difficulty_level) {
      query = query.eq('difficulty_level', where.difficulty_level);
    }

    // Handle ordering
    const orderKey = Object.keys(orderBy)[0];
    const orderDirection = orderBy[orderKey];
    if (orderKey && orderDirection) {
      query = query.order(orderKey, { ascending: orderDirection === 'asc' });
    }

    // Handle pagination
    if (skip > 0) {
      query = query.range(skip, skip + take - 1);
    } else {
      query = query.limit(take);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find unique exercise by ID
   * Equivalent to: prisma.exercise.findUnique({ where: { id } })
   */
  static async findUnique(where: { id: string }): Promise<LocalExercise | null> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', where.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new exercise
   * Equivalent to: prisma.exercise.create({ data })
   */
  static async create(data: Omit<LocalExercise, 'id' | 'created_at' | 'updated_at'>): Promise<LocalExercise> {
    const { data: result, error } = await supabase
      .from('exercises')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create exercise: ${error.message}`);
    }

    return result;
  }

  /**
   * Update an exercise
   * Equivalent to: prisma.exercise.update({ where, data })
   */
  static async update(
    where: { id: string },
    data: Partial<Omit<LocalExercise, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<LocalExercise> {
    const { data: result, error } = await supabase
      .from('exercises')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', where.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update exercise: ${error.message}`);
    }

    return result;
  }

  /**
   * Delete an exercise
   * Equivalent to: prisma.exercise.delete({ where })
   */
  static async delete(where: { id: string }): Promise<LocalExercise> {
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', where.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete exercise: ${error.message}`);
    }

    return data;
  }

  /**
   * Count exercises
   * Equivalent to: prisma.exercise.count({ where })
   */
  static async count(where: {
    targets?: { has: string };
    body_part?: string;
    target?: string;
    equipment?: string;
    difficulty_level?: string;
  } = {}): Promise<number> {
    let query = supabase.from('exercises').select('*', { count: 'exact', head: true });

    // Apply where conditions (same logic as findMany)
    if (where.targets?.has) {
      query = query.contains('secondary_muscles', [where.targets.has]);
    }

    if (where.body_part) {
      query = query.eq('body_part', where.body_part);
    }

    if (where.target) {
      query = query.eq('target', where.target);
    }

    if (where.equipment) {
      query = query.eq('equipment', where.equipment);
    }

    if (where.difficulty_level) {
      query = query.eq('difficulty_level', where.difficulty_level);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Count query failed: ${error.message}`);
    }

    return count || 0;
  }
}

/**
 * Prisma-style functions for easy migration
 */

export async function getExercisesByBodyPart(key: string, limit = 50): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: { targets: { has: key } },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

export async function getExercisesByTarget(target: string, limit = 50): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: { target },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

export async function getExercisesByEquipment(equipment: string, limit = 50): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: { equipment },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

export async function getExercisesByDifficulty(difficulty: string, limit = 50): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: { difficulty_level: difficulty },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

/**
 * Advanced query examples
 */

export async function getExercisesByMultipleTargets(
  targets: string[], 
  limit = 50
): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: {
      OR: targets.map(target => ({ targets: { has: target } }))
    },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

export async function searchExercises(
  searchTerm: string, 
  limit = 50
): Promise<LocalExercise[]> {
  return ExerciseService.findMany({
    where: {
      name: { ilike: `%${searchTerm}%` }
    },
    take: limit,
    orderBy: { name: 'asc' }
  });
}

export async function getExercisesWithPagination(
  page: number = 1,
  pageSize: number = 20,
  filters: {
    body_part?: string;
    target?: string;
    equipment?: string;
    difficulty_level?: string;
  } = {}
): Promise<{
  exercises: LocalExercise[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const skip = (page - 1) * pageSize;
  
  const [exercises, total] = await Promise.all([
    ExerciseService.findMany({
      where: filters,
      take: pageSize,
      skip,
      orderBy: { name: 'asc' }
    }),
    ExerciseService.count(filters)
  ]);

  return {
    exercises,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}
