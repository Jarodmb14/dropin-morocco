// Script to generate comprehensive exercise database
const exercises = [];

// CHEST EXERCISES (15 exercises)
const chestExercises = [
  { id: '1', name: 'Développé couché', nameEn: 'Bench Press', difficulty: 'INTERMEDIATE' },
  { id: '2', name: 'Développé couché haltères', nameEn: 'Dumbbell Bench Press', difficulty: 'INTERMEDIATE' },
  { id: '3', name: 'Pompes', nameEn: 'Push-ups', difficulty: 'BEGINNER' },
  { id: '4', name: 'Développé incliné haltères', nameEn: 'Incline Dumbbell Press', difficulty: 'INTERMEDIATE' },
  { id: '5', name: 'Développé décliné haltères', nameEn: 'Decline Dumbbell Press', difficulty: 'INTERMEDIATE' },
  { id: '6', name: 'Écarté couché haltères', nameEn: 'Dumbbell Flyes', difficulty: 'INTERMEDIATE' },
  { id: '7', name: 'Dips aux barres parallèles', nameEn: 'Parallel Bar Dips', difficulty: 'INTERMEDIATE' },
  { id: '8', name: 'Pompes inclinées', nameEn: 'Incline Push-ups', difficulty: 'BEGINNER' },
  { id: '9', name: 'Pompes déclinées', nameEn: 'Decline Push-ups', difficulty: 'INTERMEDIATE' },
  { id: '10', name: 'Développé couché prise serrée', nameEn: 'Close-Grip Bench Press', difficulty: 'INTERMEDIATE' },
  { id: '11', name: 'Développé couché machine', nameEn: 'Machine Chest Press', difficulty: 'BEGINNER' },
  { id: '12', name: 'Cable flyes', nameEn: 'Cable Flyes', difficulty: 'INTERMEDIATE' },
  { id: '13', name: 'Pompes diamant', nameEn: 'Diamond Push-ups', difficulty: 'INTERMEDIATE' },
  { id: '14', name: 'Développé incliné barre', nameEn: 'Incline Barbell Press', difficulty: 'INTERMEDIATE' },
  { id: '15', name: 'Développé décliné barre', nameEn: 'Decline Barbell Press', difficulty: 'INTERMEDIATE' }
];

// SHOULDER EXERCISES (15 exercises)
const shoulderExercises = [
  { id: '16', name: 'Développé militaire', nameEn: 'Overhead Press', difficulty: 'INTERMEDIATE' },
  { id: '17', name: 'Élévations latérales', nameEn: 'Lateral Raises', difficulty: 'BEGINNER' },
  { id: '18', name: 'Élévations frontales', nameEn: 'Front Raises', difficulty: 'BEGINNER' },
  { id: '19', name: 'Élévations arrière', nameEn: 'Rear Delt Flyes', difficulty: 'INTERMEDIATE' },
  { id: '20', name: 'Face pulls', nameEn: 'Face Pulls', difficulty: 'INTERMEDIATE' },
  { id: '21', name: 'Développé haltères assis', nameEn: 'Seated Dumbbell Press', difficulty: 'INTERMEDIATE' },
  { id: '22', name: 'Arnold press', nameEn: 'Arnold Press', difficulty: 'INTERMEDIATE' },
  { id: '23', name: 'Élévations latérales câble', nameEn: 'Cable Lateral Raises', difficulty: 'INTERMEDIATE' },
  { id: '24', name: 'Pompes pike', nameEn: 'Pike Push-ups', difficulty: 'INTERMEDIATE' },
  { id: '25', name: 'Handstand push-ups', nameEn: 'Handstand Push-ups', difficulty: 'ADVANCED' },
  { id: '26', name: 'Élévations latérales machine', nameEn: 'Machine Lateral Raises', difficulty: 'BEGINNER' },
  { id: '27', name: 'Reverse flyes', nameEn: 'Reverse Flyes', difficulty: 'INTERMEDIATE' },
  { id: '28', name: 'Upright rows', nameEn: 'Upright Rows', difficulty: 'INTERMEDIATE' },
  { id: '29', name: 'Shrugs', nameEn: 'Shrugs', difficulty: 'BEGINNER' },
  { id: '30', name: 'Développé militaire haltères', nameEn: 'Dumbbell Overhead Press', difficulty: 'INTERMEDIATE' }
];

// BACK EXERCISES (15 exercises)
const backExercises = [
  { id: '31', name: 'Tractions', nameEn: 'Pull-ups', difficulty: 'INTERMEDIATE' },
  { id: '32', name: 'Rowing haltère', nameEn: 'Dumbbell Row', difficulty: 'INTERMEDIATE' },
  { id: '33', name: 'Tirage vertical', nameEn: 'Lat Pulldown', difficulty: 'INTERMEDIATE' },
  { id: '34', name: 'Rowing barre', nameEn: 'Barbell Row', difficulty: 'INTERMEDIATE' },
  { id: '35', name: 'Tirage horizontal', nameEn: 'Seated Cable Row', difficulty: 'INTERMEDIATE' },
  { id: '36', name: 'Rowing T-bar', nameEn: 'T-Bar Row', difficulty: 'INTERMEDIATE' },
  { id: '37', name: 'Rowing machine', nameEn: 'Machine Row', difficulty: 'BEGINNER' },
  { id: '38', name: 'Tractions assistées', nameEn: 'Assisted Pull-ups', difficulty: 'BEGINNER' },
  { id: '39', name: 'Rowing unilatéral', nameEn: 'Single Arm Row', difficulty: 'INTERMEDIATE' },
  { id: '40', name: 'Tirage prise serrée', nameEn: 'Close-Grip Pulldown', difficulty: 'INTERMEDIATE' },
  { id: '41', name: 'Rowing inversé', nameEn: 'Reverse Row', difficulty: 'INTERMEDIATE' },
  { id: '42', name: 'Tractions lestées', nameEn: 'Weighted Pull-ups', difficulty: 'ADVANCED' },
  { id: '43', name: 'Rowing câble unilatéral', nameEn: 'Single Arm Cable Row', difficulty: 'INTERMEDIATE' },
  { id: '44', name: 'Tirage prise large', nameEn: 'Wide-Grip Pulldown', difficulty: 'INTERMEDIATE' },
  { id: '45', name: 'Rowing haltère incliné', nameEn: 'Incline Dumbbell Row', difficulty: 'INTERMEDIATE' }
];

// BICEP EXERCISES (15 exercises)
const bicepExercises = [
  { id: '46', name: 'Curl biceps', nameEn: 'Bicep Curl', difficulty: 'BEGINNER' },
  { id: '47', name: 'Curl marteau', nameEn: 'Hammer Curl', difficulty: 'BEGINNER' },
  { id: '48', name: 'Curl biceps câble', nameEn: 'Cable Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '49', name: 'Curl biceps barre', nameEn: 'Barbell Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '50', name: 'Curl concentré', nameEn: 'Concentration Curl', difficulty: 'INTERMEDIATE' },
  { id: '51', name: 'Curl biceps machine', nameEn: 'Machine Bicep Curl', difficulty: 'BEGINNER' },
  { id: '52', name: 'Curl biceps prise large', nameEn: 'Wide-Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '53', name: 'Curl biceps prise serrée', nameEn: 'Close-Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '54', name: 'Curl biceps incliné', nameEn: 'Incline Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '55', name: 'Curl biceps alterné', nameEn: 'Alternating Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '56', name: 'Curl biceps 21s', nameEn: '21s Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '57', name: 'Curl biceps isométrique', nameEn: 'Isometric Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '58', name: 'Curl biceps prise neutre', nameEn: 'Neutral Grip Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '59', name: 'Curl biceps unilatéral', nameEn: 'Single Arm Bicep Curl', difficulty: 'INTERMEDIATE' },
  { id: '60', name: 'Curl biceps prise marteau', nameEn: 'Hammer Grip Bicep Curl', difficulty: 'BEGINNER' }
];

// TRICEP EXERCISES (15 exercises)
const tricepExercises = [
  { id: '61', name: 'Dips', nameEn: 'Dips', difficulty: 'INTERMEDIATE' },
  { id: '62', name: 'Extension triceps couché', nameEn: 'Lying Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '63', name: 'Extension triceps câble', nameEn: 'Cable Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '64', name: 'Extension triceps haltère', nameEn: 'Dumbbell Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '65', name: 'Extension triceps barre', nameEn: 'Barbell Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '66', name: 'Extension triceps machine', nameEn: 'Machine Tricep Extension', difficulty: 'BEGINNER' },
  { id: '67', name: 'Extension triceps assis', nameEn: 'Seated Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '68', name: 'Extension triceps debout', nameEn: 'Standing Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '69', name: 'Extension triceps unilatérale', nameEn: 'Single Arm Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '70', name: 'Extension triceps prise serrée', nameEn: 'Close-Grip Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '71', name: 'Extension triceps prise large', nameEn: 'Wide-Grip Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '72', name: 'Extension triceps incliné', nameEn: 'Incline Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '73', name: 'Extension triceps décliné', nameEn: 'Decline Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '74', name: 'Extension triceps isométrique', nameEn: 'Isometric Tricep Extension', difficulty: 'INTERMEDIATE' },
  { id: '75', name: 'Extension triceps alternée', nameEn: 'Alternating Tricep Extension', difficulty: 'INTERMEDIATE' }
];

// ABS EXERCISES (15 exercises)
const absExercises = [
  { id: '76', name: 'Planche', nameEn: 'Plank', difficulty: 'BEGINNER' },
  { id: '77', name: 'Crunchs', nameEn: 'Crunches', difficulty: 'BEGINNER' },
  { id: '78', name: 'Mountain climbers', nameEn: 'Mountain Climbers', difficulty: 'INTERMEDIATE' },
  { id: '79', name: 'Russian twists', nameEn: 'Russian Twists', difficulty: 'INTERMEDIATE' },
  { id: '80', name: 'Leg raises', nameEn: 'Leg Raises', difficulty: 'INTERMEDIATE' },
  { id: '81', name: 'Bicycle crunches', nameEn: 'Bicycle Crunches', difficulty: 'INTERMEDIATE' },
  { id: '82', name: 'Dead bug', nameEn: 'Dead Bug', difficulty: 'BEGINNER' },
  { id: '83', name: 'Bird dog', nameEn: 'Bird Dog', difficulty: 'BEGINNER' },
  { id: '84', name: 'Side plank', nameEn: 'Side Plank', difficulty: 'INTERMEDIATE' },
  { id: '85', name: 'Hollow hold', nameEn: 'Hollow Hold', difficulty: 'INTERMEDIATE' },
  { id: '86', name: 'V-ups', nameEn: 'V-ups', difficulty: 'INTERMEDIATE' },
  { id: '87', name: 'Flutter kicks', nameEn: 'Flutter Kicks', difficulty: 'INTERMEDIATE' },
  { id: '88', name: 'Scissor kicks', nameEn: 'Scissor Kicks', difficulty: 'INTERMEDIATE' },
  { id: '89', name: 'Reverse crunches', nameEn: 'Reverse Crunches', difficulty: 'INTERMEDIATE' },
  { id: '90', name: 'Plank jacks', nameEn: 'Plank Jacks', difficulty: 'INTERMEDIATE' }
];

// LEG EXERCISES (15 exercises)
const legExercises = [
  { id: '91', name: 'Squat', nameEn: 'Squat', difficulty: 'BEGINNER' },
  { id: '92', name: 'Fentes', nameEn: 'Lunges', difficulty: 'INTERMEDIATE' },
  { id: '93', name: 'Squat bulgare', nameEn: 'Bulgarian Split Squat', difficulty: 'INTERMEDIATE' },
  { id: '94', name: 'Squat haltères', nameEn: 'Dumbbell Squat', difficulty: 'INTERMEDIATE' },
  { id: '95', name: 'Squat barre', nameEn: 'Barbell Squat', difficulty: 'INTERMEDIATE' },
  { id: '96', name: 'Squat goblet', nameEn: 'Goblet Squat', difficulty: 'INTERMEDIATE' },
  { id: '97', name: 'Squat sumo', nameEn: 'Sumo Squat', difficulty: 'INTERMEDIATE' },
  { id: '98', name: 'Squat jump', nameEn: 'Jump Squat', difficulty: 'INTERMEDIATE' },
  { id: '99', name: 'Squat pause', nameEn: 'Pause Squat', difficulty: 'INTERMEDIATE' },
  { id: '100', name: 'Squat unilatéral', nameEn: 'Single Leg Squat', difficulty: 'ADVANCED' },
  { id: '101', name: 'Squat machine', nameEn: 'Machine Squat', difficulty: 'BEGINNER' },
  { id: '102', name: 'Squat wall', nameEn: 'Wall Sit', difficulty: 'BEGINNER' },
  { id: '103', name: 'Squat overhead', nameEn: 'Overhead Squat', difficulty: 'ADVANCED' },
  { id: '104', name: 'Squat front', nameEn: 'Front Squat', difficulty: 'ADVANCED' },
  { id: '105', name: 'Squat hack', nameEn: 'Hack Squat', difficulty: 'INTERMEDIATE' }
];

// GLUTE EXERCISES (15 exercises)
const gluteExercises = [
  { id: '106', name: 'Hip thrust', nameEn: 'Hip Thrust', difficulty: 'INTERMEDIATE' },
  { id: '107', name: 'Pont fessier', nameEn: 'Glute Bridge', difficulty: 'BEGINNER' },
  { id: '108', name: 'Fentes arrière', nameEn: 'Reverse Lunges', difficulty: 'INTERMEDIATE' },
  { id: '109', name: 'Fentes latérales', nameEn: 'Side Lunges', difficulty: 'INTERMEDIATE' },
  { id: '110', name: 'Fentes marchées', nameEn: 'Walking Lunges', difficulty: 'INTERMEDIATE' },
  { id: '111', name: 'Fentes sautées', nameEn: 'Jumping Lunges', difficulty: 'INTERMEDIATE' },
  { id: '112', name: 'Fentes haltères', nameEn: 'Dumbbell Lunges', difficulty: 'INTERMEDIATE' },
  { id: '113', name: 'Fentes barre', nameEn: 'Barbell Lunges', difficulty: 'INTERMEDIATE' },
  { id: '114', name: 'Fentes câble', nameEn: 'Cable Lunges', difficulty: 'INTERMEDIATE' },
  { id: '115', name: 'Fentes machine', nameEn: 'Machine Lunges', difficulty: 'INTERMEDIATE' },
  { id: '116', name: 'Fentes unilatérales', nameEn: 'Single Leg Lunges', difficulty: 'ADVANCED' },
  { id: '117', name: 'Fentes pause', nameEn: 'Pause Lunges', difficulty: 'INTERMEDIATE' },
  { id: '118', name: 'Fentes tempo', nameEn: 'Tempo Lunges', difficulty: 'INTERMEDIATE' },
  { id: '119', name: 'Fentes isométriques', nameEn: 'Isometric Lunges', difficulty: 'INTERMEDIATE' },
  { id: '120', name: 'Fentes plyométriques', nameEn: 'Plyometric Lunges', difficulty: 'ADVANCED' }
];

// Combine all exercises
const allExercises = [
  ...chestExercises.map(ex => ({ ...ex, bodyPart: 'chest' })),
  ...shoulderExercises.map(ex => ({ ...ex, bodyPart: 'shoulders' })),
  ...backExercises.map(ex => ({ ...ex, bodyPart: 'back' })),
  ...bicepExercises.map(ex => ({ ...ex, bodyPart: 'biceps' })),
  ...tricepExercises.map(ex => ({ ...ex, bodyPart: 'triceps' })),
  ...absExercises.map(ex => ({ ...ex, bodyPart: 'abs' })),
  ...legExercises.map(ex => ({ ...ex, bodyPart: 'legs' })),
  ...gluteExercises.map(ex => ({ ...ex, bodyPart: 'glutes' }))
];

console.log(`Generated ${allExercises.length} exercises:`);
console.log(`- Chest: ${chestExercises.length}`);
console.log(`- Shoulders: ${shoulderExercises.length}`);
console.log(`- Back: ${backExercises.length}`);
console.log(`- Biceps: ${bicepExercises.length}`);
console.log(`- Triceps: ${tricepExercises.length}`);
console.log(`- Abs: ${absExercises.length}`);
console.log(`- Legs: ${legExercises.length}`);
console.log(`- Glutes: ${gluteExercises.length}`);

module.exports = allExercises;
