-- Test Progress Tracking
-- Run this after setting up the tables to test the functionality

-- Test inserting a workout session (replace with actual user ID)
INSERT INTO workout_sessions (
  user_id,
  program_id,
  workout_id,
  date,
  duration,
  exercises,
  notes,
  rating
) VALUES (
  auth.uid(), -- This will use the current authenticated user
  'quick-workout',
  'test-workout-1',
  CURRENT_DATE,
  30,
  '[
    {
      "exerciseId": "1",
      "exerciseName": "Push-ups",
      "sets": [
        {"setNumber": 1, "reps": 12, "weight": 0, "completed": true},
        {"setNumber": 2, "reps": 10, "weight": 0, "completed": true},
        {"setNumber": 3, "reps": 8, "weight": 0, "completed": true}
      ]
    }
  ]'::jsonb,
  'First test workout',
  4
);

-- Test inserting a personal record
INSERT INTO personal_records (
  user_id,
  exercise_id,
  exercise_name,
  record_type,
  value,
  date,
  workout_id
) VALUES (
  auth.uid(),
  '1',
  'Push-ups',
  'MAX_REPS',
  12,
  CURRENT_DATE,
  'test-workout-1'
);

-- Query to check if data was inserted
SELECT 
  ws.id,
  ws.date,
  ws.duration,
  ws.rating,
  ws.exercises
FROM workout_sessions ws
WHERE ws.user_id = auth.uid()
ORDER BY ws.created_at DESC
LIMIT 5;

-- Query to check personal records
SELECT 
  pr.exercise_name,
  pr.record_type,
  pr.value,
  pr.date
FROM personal_records pr
WHERE pr.user_id = auth.uid()
ORDER BY pr.created_at DESC
LIMIT 5;
