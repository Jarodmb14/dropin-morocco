// Script to generate comprehensive exercise database with 120 exercises (15 per body part)
import { ExerciseWithAttributes } from '../types/exercise';

// Exercise data for each body part
const exerciseData = {
  chest: [
    { name: 'Développé couché', nameEn: 'Bench Press', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
    { name: 'Développé couché haltères', nameEn: 'Dumbbell Bench Press', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=8iPEnov-lmU' },
    { name: 'Pompes', nameEn: 'Push-ups', difficulty: 'BEGINNER', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { name: 'Développé incliné haltères', nameEn: 'Incline Dumbbell Press', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=8iPEnov-lmU' },
    { name: 'Développé décliné haltères', nameEn: 'Decline Dumbbell Press', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=8iPEnov-lmU' },
    { name: 'Écarté couché haltères', nameEn: 'Dumbbell Flyes', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0' },
    { name: 'Dips aux barres parallèles', nameEn: 'Parallel Bar Dips', difficulty: 'INTERMEDIATE', videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
    { name: 'Pompes inclinées', nameEn: 'Incline Push-ups', difficulty: 'BEGINNER', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { name: 'Pompes déclinées', nameEn: 'Decline Push-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Développé couché prise serrée', nameEn: 'Close-Grip Bench Press', difficulty: 'INTERMEDIATE' },
    { name: 'Développé couché machine', nameEn: 'Machine Chest Press', difficulty: 'BEGINNER' },
    { name: 'Cable flyes', nameEn: 'Cable Flyes', difficulty: 'INTERMEDIATE' },
    { name: 'Pompes diamant', nameEn: 'Diamond Push-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Développé incliné barre', nameEn: 'Incline Barbell Press', difficulty: 'INTERMEDIATE' },
    { name: 'Développé décliné barre', nameEn: 'Decline Barbell Press', difficulty: 'INTERMEDIATE' }
  ],
  shoulders: [
    { name: 'Développé militaire', nameEn: 'Overhead Press', difficulty: 'INTERMEDIATE' },
    { name: 'Élévations latérales', nameEn: 'Lateral Raises', difficulty: 'BEGINNER' },
    { name: 'Élévations frontales', nameEn: 'Front Raises', difficulty: 'BEGINNER' },
    { name: 'Élévations arrière', nameEn: 'Rear Delt Flyes', difficulty: 'INTERMEDIATE' },
    { name: 'Face pulls', nameEn: 'Face Pulls', difficulty: 'INTERMEDIATE' },
    { name: 'Développé haltères assis', nameEn: 'Seated Dumbbell Press', difficulty: 'INTERMEDIATE' },
    { name: 'Arnold press', nameEn: 'Arnold Press', difficulty: 'INTERMEDIATE' },
    { name: 'Élévations latérales câble', nameEn: 'Cable Lateral Raises', difficulty: 'INTERMEDIATE' },
    { name: 'Pompes pike', nameEn: 'Pike Push-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Handstand push-ups', nameEn: 'Handstand Push-ups', difficulty: 'ADVANCED' },
    { name: 'Élévations latérales machine', nameEn: 'Machine Lateral Raises', difficulty: 'BEGINNER' },
    { name: 'Reverse flyes', nameEn: 'Reverse Flyes', difficulty: 'INTERMEDIATE' },
    { name: 'Upright rows', nameEn: 'Upright Rows', difficulty: 'INTERMEDIATE' },
    { name: 'Shrugs', nameEn: 'Shrugs', difficulty: 'BEGINNER' },
    { name: 'Développé militaire haltères', nameEn: 'Dumbbell Overhead Press', difficulty: 'INTERMEDIATE' }
  ],
  back: [
    { name: 'Tractions', nameEn: 'Pull-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing haltère', nameEn: 'Dumbbell Row', difficulty: 'INTERMEDIATE' },
    { name: 'Tirage vertical', nameEn: 'Lat Pulldown', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing barre', nameEn: 'Barbell Row', difficulty: 'INTERMEDIATE' },
    { name: 'Tirage horizontal', nameEn: 'Seated Cable Row', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing T-bar', nameEn: 'T-Bar Row', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing machine', nameEn: 'Machine Row', difficulty: 'BEGINNER' },
    { name: 'Tractions assistées', nameEn: 'Assisted Pull-ups', difficulty: 'BEGINNER' },
    { name: 'Rowing unilatéral', nameEn: 'Single Arm Row', difficulty: 'INTERMEDIATE' },
    { name: 'Tirage prise serrée', nameEn: 'Close-Grip Pulldown', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing inversé', nameEn: 'Reverse Row', difficulty: 'INTERMEDIATE' },
    { name: 'Tractions lestées', nameEn: 'Weighted Pull-ups', difficulty: 'ADVANCED' },
    { name: 'Rowing câble unilatéral', nameEn: 'Single Arm Cable Row', difficulty: 'INTERMEDIATE' },
    { name: 'Tirage prise large', nameEn: 'Wide-Grip Pulldown', difficulty: 'INTERMEDIATE' },
    { name: 'Rowing haltère incliné', nameEn: 'Incline Dumbbell Row', difficulty: 'INTERMEDIATE' }
  ],
  biceps: [
    { name: 'Curl biceps', nameEn: 'Bicep Curl', difficulty: 'BEGINNER' },
    { name: 'Curl marteau', nameEn: 'Hammer Curl', difficulty: 'BEGINNER' },
    { name: 'Curl biceps câble', nameEn: 'Cable Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps barre', nameEn: 'Barbell Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl concentré', nameEn: 'Concentration Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps machine', nameEn: 'Machine Bicep Curl', difficulty: 'BEGINNER' },
    { name: 'Curl biceps prise large', nameEn: 'Wide-Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps prise serrée', nameEn: 'Close-Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps incliné', nameEn: 'Incline Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps alterné', nameEn: 'Alternating Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps 21s', nameEn: '21s Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps isométrique', nameEn: 'Isometric Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps prise neutre', nameEn: 'Neutral Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps unilatéral', nameEn: 'Single Arm Bicep Curl', difficulty: 'INTERMEDIATE' },
    { name: 'Curl biceps prise marteau', nameEn: 'Hammer Grip Bicep Curl', difficulty: 'BEGINNER' }
  ],
  triceps: [
    { name: 'Dips', nameEn: 'Dips', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps couché', nameEn: 'Lying Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps câble', nameEn: 'Cable Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps haltère', nameEn: 'Dumbbell Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps barre', nameEn: 'Barbell Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps machine', nameEn: 'Machine Tricep Extension', difficulty: 'BEGINNER' },
    { name: 'Extension triceps assis', nameEn: 'Seated Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps debout', nameEn: 'Standing Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps unilatérale', nameEn: 'Single Arm Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps prise serrée', nameEn: 'Close-Grip Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps prise large', nameEn: 'Wide-Grip Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps incliné', nameEn: 'Incline Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps décliné', nameEn: 'Decline Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps isométrique', nameEn: 'Isometric Tricep Extension', difficulty: 'INTERMEDIATE' },
    { name: 'Extension triceps alternée', nameEn: 'Alternating Tricep Extension', difficulty: 'INTERMEDIATE' }
  ],
  abs: [
    { name: 'Planche', nameEn: 'Plank', difficulty: 'BEGINNER' },
    { name: 'Crunchs', nameEn: 'Crunches', difficulty: 'BEGINNER' },
    { name: 'Mountain climbers', nameEn: 'Mountain Climbers', difficulty: 'INTERMEDIATE' },
    { name: 'Russian twists', nameEn: 'Russian Twists', difficulty: 'INTERMEDIATE' },
    { name: 'Leg raises', nameEn: 'Leg Raises', difficulty: 'INTERMEDIATE' },
    { name: 'Bicycle crunches', nameEn: 'Bicycle Crunches', difficulty: 'INTERMEDIATE' },
    { name: 'Dead bug', nameEn: 'Dead Bug', difficulty: 'BEGINNER' },
    { name: 'Bird dog', nameEn: 'Bird Dog', difficulty: 'BEGINNER' },
    { name: 'Side plank', nameEn: 'Side Plank', difficulty: 'INTERMEDIATE' },
    { name: 'Hollow hold', nameEn: 'Hollow Hold', difficulty: 'INTERMEDIATE' },
    { name: 'V-ups', nameEn: 'V-ups', difficulty: 'INTERMEDIATE' },
    { name: 'Flutter kicks', nameEn: 'Flutter Kicks', difficulty: 'INTERMEDIATE' },
    { name: 'Scissor kicks', nameEn: 'Scissor Kicks', difficulty: 'INTERMEDIATE' },
    { name: 'Reverse crunches', nameEn: 'Reverse Crunches', difficulty: 'INTERMEDIATE' },
    { name: 'Plank jacks', nameEn: 'Plank Jacks', difficulty: 'INTERMEDIATE' }
  ],
  legs: [
    { name: 'Squat', nameEn: 'Squat', difficulty: 'BEGINNER' },
    { name: 'Fentes', nameEn: 'Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Squat bulgare', nameEn: 'Bulgarian Split Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat haltères', nameEn: 'Dumbbell Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat barre', nameEn: 'Barbell Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat goblet', nameEn: 'Goblet Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat sumo', nameEn: 'Sumo Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat jump', nameEn: 'Jump Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat pause', nameEn: 'Pause Squat', difficulty: 'INTERMEDIATE' },
    { name: 'Squat unilatéral', nameEn: 'Single Leg Squat', difficulty: 'ADVANCED' },
    { name: 'Squat machine', nameEn: 'Machine Squat', difficulty: 'BEGINNER' },
    { name: 'Squat wall', nameEn: 'Wall Sit', difficulty: 'BEGINNER' },
    { name: 'Squat overhead', nameEn: 'Overhead Squat', difficulty: 'ADVANCED' },
    { name: 'Squat front', nameEn: 'Front Squat', difficulty: 'ADVANCED' },
    { name: 'Squat hack', nameEn: 'Hack Squat', difficulty: 'INTERMEDIATE' }
  ],
  glutes: [
    { name: 'Hip thrust', nameEn: 'Hip Thrust', difficulty: 'INTERMEDIATE' },
    { name: 'Pont fessier', nameEn: 'Glute Bridge', difficulty: 'BEGINNER' },
    { name: 'Fentes arrière', nameEn: 'Reverse Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes latérales', nameEn: 'Side Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes marchées', nameEn: 'Walking Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes sautées', nameEn: 'Jumping Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes haltères', nameEn: 'Dumbbell Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes barre', nameEn: 'Barbell Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes câble', nameEn: 'Cable Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes machine', nameEn: 'Machine Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes unilatérales', nameEn: 'Single Leg Lunges', difficulty: 'ADVANCED' },
    { name: 'Fentes pause', nameEn: 'Pause Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes tempo', nameEn: 'Tempo Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes isométriques', nameEn: 'Isometric Lunges', difficulty: 'INTERMEDIATE' },
    { name: 'Fentes plyométriques', nameEn: 'Plyometric Lunges', difficulty: 'ADVANCED' }
  ]
};

// Generate comprehensive exercise database
export function generateAllExercises(): ExerciseWithAttributes[] {
  const allExercises: ExerciseWithAttributes[] = [];
  let id = 1;

  Object.entries(exerciseData).forEach(([bodyPart, exercises]) => {
    exercises.forEach(exercise => {
      const primaryMuscle = bodyPart.toUpperCase();
      const secondaryMuscles = getSecondaryMuscles(bodyPart);
      const equipment = getEquipment(bodyPart, exercise.name);
      
      allExercises.push({
        id: id.toString(),
        name: exercise.name,
        nameEn: exercise.nameEn,
        description: `<p>Description de l'exercice ${exercise.name}.</p>`,
        descriptionEn: `<p>Description of ${exercise.nameEn} exercise.</p>`,
        introduction: `<p>L'exercice <strong>${exercise.name}</strong> cible les <strong>${primaryMuscle}</strong>.</p>`,
        introductionEn: `<p>The <strong>${exercise.nameEn}</strong> exercise targets the <strong>${primaryMuscle}</strong>.</p>`,
        fullVideoUrl: exercise.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        fullVideoImageUrl: exercise.videoUrl ? `https://img.youtube.com/vi/${exercise.videoUrl.split('v=')[1]}/hqdefault.jpg` : 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        slug: exercise.name.toLowerCase().replace(/\s+/g, '-'),
        slugEn: exercise.nameEn.toLowerCase().replace(/\s+/g, '-'),
        attributes: [
          { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
          { attributeName: 'PRIMARY_MUSCLE', attributeValue: primaryMuscle },
          ...secondaryMuscles.map(muscle => ({ attributeName: 'SECONDARY_MUSCLE', attributeValue: muscle })),
          ...equipment.map(eq => ({ attributeName: 'EQUIPMENT', attributeValue: eq })),
          { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
          { attributeName: 'DIFFICULTY', attributeValue: exercise.difficulty },
          { attributeName: 'TUTORIAL', attributeValue: `1. Setup for ${exercise.nameEn}\n2. Execute the movement\n3. Control the weight\n4. Repeat for desired reps\n5. Focus on form\n6. Breathe properly` },
          { attributeName: 'FORM_TIPS', attributeValue: 'Maintain proper posture\nControl the movement\nKeep core engaged\nBreathe properly\nFocus on the target muscle' },
          { attributeName: 'COMMON_MISTAKES', attributeValue: 'Using too much weight\nPoor form\nNot controlling the movement\nHolding breath\nNot engaging core' },
          { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weight\nFocus on perfect form\nGradually increase weight\nAdd variations\nRecord your progress' },
          { attributeName: 'BENEFITS', attributeValue: 'Builds strength\nImproves muscle mass\nEnhances performance\nBuilds confidence\nDevelops coordination' },
          { attributeName: 'VARIATIONS', attributeValue: 'Try different angles\nUse different equipment\nModify the tempo\nAdd pauses\nSingle arm variations' }
        ]
      });
      id++;
    });
  });

  return allExercises;
}

function getSecondaryMuscles(bodyPart: string): string[] {
  const secondaryMuscleMap: Record<string, string[]> = {
    'chest': ['SHOULDERS', 'TRICEPS'],
    'shoulders': ['TRICEPS', 'CHEST'],
    'back': ['BICEPS', 'SHOULDERS'],
    'biceps': ['FOREARMS'],
    'triceps': ['SHOULDERS', 'CHEST'],
    'abs': ['HIPS', 'LOWER_BACK'],
    'legs': ['GLUTES', 'CALVES'],
    'glutes': ['HAMSTRINGS', 'QUADRICEPS']
  };
  return secondaryMuscleMap[bodyPart] || [];
}

function getEquipment(bodyPart: string, exerciseName: string): string[] {
  if (exerciseName.includes('machine') || exerciseName.includes('Machine')) {
    return ['MACHINE'];
  }
  if (exerciseName.includes('câble') || exerciseName.includes('Cable')) {
    return ['CABLE'];
  }
  if (exerciseName.includes('haltère') || exerciseName.includes('Dumbbell')) {
    return ['DUMBBELL'];
  }
  if (exerciseName.includes('barre') || exerciseName.includes('Barbell')) {
    return ['BARBELL'];
  }
  if (exerciseName.includes('Pompes') || exerciseName.includes('Push-ups') || exerciseName.includes('Squat') || exerciseName.includes('Plank')) {
    return ['BODYWEIGHT'];
  }
  return ['DUMBBELL', 'BARBELL'];
}

// Export the generated exercises
export const ALL_EXERCISES = generateAllExercises();

console.log(`Generated ${ALL_EXERCISES.length} exercises:`);
Object.entries(exerciseData).forEach(([bodyPart, exercises]) => {
  console.log(`- ${bodyPart}: ${exercises.length}`);
});
