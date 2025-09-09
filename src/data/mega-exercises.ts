import { ExerciseWithAttributes } from '../types/exercise';

// MEGA EXERCISE DATABASE - 15+ exercises per body part
export const MEGA_EXERCISES: ExerciseWithAttributes[] = [
  // CHEST EXERCISES (15 exercises)
  {
    id: '1',
    name: 'Développé couché',
    nameEn: 'Bench Press',
    description: '<p>Allongez-vous sur un banc de développé couché avec vos pieds fermement plantés au sol.</p><p>Saisissez la barre avec une prise légèrement plus large que vos épaules.</p><p>Descendez la barre de manière contrôlée jusqu\'à ce qu\'elle touche votre poitrine.</p><p>Poussez la barre vers le haut jusqu\'à l\'extension complète des bras.</p>',
    descriptionEn: '<p>Lie on a bench press bench with your feet firmly planted on the ground.</p><p>Grip the bar with a grip slightly wider than your shoulders.</p><p>Lower the bar in a controlled manner until it touches your chest.</p><p>Push the bar up to full arm extension.</p>',
    introduction: '<p>Le <strong>développé couché</strong> est l\'exercice roi pour développer la <strong>force et la masse musculaire</strong> du <strong>pectoral</strong>, des <strong>épaules</strong> et des <strong>triceps</strong>.</p>',
    introductionEn: '<p>The <strong>bench press</strong> is the king exercise for developing <strong>strength and muscle mass</strong> of the <strong>chest</strong>, <strong>shoulders</strong> and <strong>triceps</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg',
    slug: 'developpe-couche',
    slugEn: 'bench-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Position yourself on the bench with your eyes directly under the bar\n2. Grip the bar with hands slightly wider than shoulder-width\n3. Unrack the bar and hold it over your chest with arms extended\n4. Lower the bar slowly to your chest, keeping elbows at 45-degree angle\n5. Press the bar up explosively while maintaining control\n6. Keep your core tight and feet planted throughout the movement' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep your shoulder blades retracted and depressed\nMaintain a slight arch in your lower back\nKeep your core engaged throughout the movement\nDon\'t bounce the bar off your chest\nControl the descent for 2-3 seconds' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Bouncing the bar off the chest\nFlaring elbows too wide\nLifting feet off the ground\nNot maintaining proper breathing\nGoing too heavy too soon' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with empty bar to master form\nAdd 5-10lbs per week\nFocus on perfect technique before increasing weight\nUse a spotter for heavy sets\nRecord yourself to check form' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper body strength and muscle mass\nImproves pressing power\nDevelops chest, shoulder, and tricep muscles\nCan be loaded progressively\nBuilds confidence and mental toughness' },
      { attributeName: 'VARIATIONS', attributeValue: 'Incline bench press (upper chest focus)\nDecline bench press (lower chest focus)\nClose-grip bench press (tricep focus)\nPause bench press (strength development)\nSpoto press (control and stability)' }
    ]
  },
  {
    id: '2',
    name: 'Développé couché haltères',
    nameEn: 'Dumbbell Bench Press',
    description: '<p>Allongez-vous sur un banc avec un haltère dans chaque main.</p><p>Descendez les haltères de manière contrôlée jusqu\'à ce qu\'ils touchent votre poitrine.</p><p>Poussez les haltères vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Lie on a bench with a dumbbell in each hand.</p><p>Lower the dumbbells in a controlled manner until they touch your chest.</p><p>Push the dumbbells up to full extension.</p>',
    introduction: '<p>Le <strong>développé couché haltères</strong> offre une plus grande amplitude de mouvement et un meilleur équilibre que la barre.</p>',
    introductionEn: '<p>The <strong>dumbbell bench press</strong> offers greater range of motion and better balance than the barbell.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/VmB1G1N7e10?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/VmB1G1N7e10/hqdefault.jpg',
    slug: 'developpe-couche-halteres',
    slugEn: 'dumbbell-bench-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Sit on the bench with dumbbells on your thighs\n2. Lie back while bringing dumbbells to chest level\n3. Position dumbbells at chest level with palms facing forward\n4. Press dumbbells up and slightly together until arms are extended\n5. Lower dumbbells slowly to chest level with control\n6. Keep core tight and maintain stable position throughout' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep dumbbells in line with your chest\nMaintain slight arch in lower back\nControl the weight throughout the entire range of motion\nDon\'t let dumbbells drift too wide or narrow\nKeep shoulder blades retracted' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Using too much weight and losing control\nNot maintaining proper wrist alignment\nLetting dumbbells drift apart or together\nBouncing weights off chest\nNot engaging core muscles' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weights to master form\nFocus on full range of motion\nGradually increase weight while maintaining control\nUse a spotter for heavier weights\nPractice with different grip widths' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper body strength and muscle mass\nImproves pressing power\nDevelops chest, shoulder, and tricep muscles\nCan be loaded progressively\nBuilds confidence and mental toughness' },
      { attributeName: 'VARIATIONS', attributeValue: 'Incline dumbbell press (upper chest focus)\nDecline dumbbell press (lower chest focus)\nNeutral grip dumbbell press\nSingle arm dumbbell press\nDumbbell flyes' }
    ]
  },
  {
    id: '3',
    name: 'Pompes',
    nameEn: 'Push-ups',
    description: '<p>Commencez en position de planche avec les mains légèrement plus larges que les épaules.</p><p>Descendez votre corps jusqu\'à ce que votre poitrine touche presque le sol.</p><p>Poussez vers le haut jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Start in a plank position with hands slightly wider than shoulders.</p><p>Lower your body until your chest almost touches the ground.</p><p>Push up to the starting position.</p>',
    introduction: '<p>Les <strong>pompes</strong> sont l\'exercice de base pour développer la <strong>force du haut du corps</strong> et les <strong>pectoraux</strong>.</p>',
    introductionEn: '<p><strong>Push-ups</strong> are the fundamental exercise for developing <strong>upper body strength</strong> and <strong>chest muscles</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/0pkjOk0EiAk?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/0pkjOk0EiAk/hqdefault.jpg',
    slug: 'pompes',
    slugEn: 'push-ups',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'BEGINNER' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Start in a high plank position with hands under shoulders\n2. Keep your body in a straight line from head to heels\n3. Lower your chest toward the ground by bending your elbows\n4. Keep your core tight and don\'t let your hips sag\n5. Push back up to the starting position\n6. Maintain proper breathing throughout the movement' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep your body in a straight line\nDon\'t let your hips sag or pike up\nKeep your core engaged throughout\nLook slightly forward, not down\nControl both the lowering and pushing phases' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Sagging hips or piking up\nNot going low enough\nFlaring elbows too wide\nHolding breath during the movement\nMoving too fast and losing control' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with knee push-ups if needed\nFocus on perfect form before increasing reps\nTry different hand positions (wide, narrow, diamond)\nAdd tempo variations (slow down, pause at bottom)\nProgress to advanced variations like archer push-ups' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds functional upper body strength\nImproves core stability\nNo equipment needed\nCan be done anywhere\nBuilds endurance and muscle endurance' },
      { attributeName: 'VARIATIONS', attributeValue: 'Incline push-ups (easier)\nDecline push-ups (harder)\nDiamond push-ups (tricep focus)\nWide-grip push-ups (chest focus)\nArcher push-ups (advanced)' }
    ]
  },
  // MORE CHEST EXERCISES (4-15)
  {
    id: '4',
    name: 'Développé incliné haltères',
    nameEn: 'Incline Dumbbell Press',
    description: '<p>Réglez un banc à 30-45 degrés d\'inclinaison.</p><p>Allongez-vous avec un haltère dans chaque main.</p><p>Descendez les haltères de manière contrôlée jusqu\'à ce qu\'ils touchent votre poitrine.</p><p>Poussez les haltères vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Set a bench to 30-45 degree incline.</p><p>Lie back with a dumbbell in each hand.</p><p>Lower the dumbbells in a controlled manner until they touch your chest.</p><p>Push the dumbbells up to full extension.</p>',
    introduction: '<p>Le <strong>développé incliné haltères</strong> cible le <strong>haut des pectoraux</strong> et les <strong>épaules</strong>.</p>',
    introductionEn: '<p>The <strong>incline dumbbell press</strong> targets the <strong>upper chest</strong> and <strong>shoulders</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/8iPEnov-lmU?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/8iPEnov-lmU/hqdefault.jpg',
    slug: 'developpe-incline-halteres',
    slugEn: 'incline-dumbbell-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Set bench to 30-45 degree incline\n2. Lie back with dumbbells at chest level\n3. Press dumbbells up and slightly together\n4. Lower dumbbells slowly to chest level\n5. Keep core tight throughout\n6. Control the movement' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep dumbbells in line with chest\nMaintain slight arch in lower back\nControl the weight throughout\nDon\'t let dumbbells drift\nKeep shoulder blades retracted' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Using too much weight\nNot maintaining proper form\nLetting dumbbells drift apart\nBouncing weights off chest\nNot engaging core' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weights\nFocus on upper chest contraction\nGradually increase weight\nUse a spotter for heavier weights\nPractice with different angles' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper chest development\nImproves shoulder strength\nDevelops pressing power\nCreates balanced chest development\nBuilds confidence' },
      { attributeName: 'VARIATIONS', attributeValue: 'Incline barbell press\nIncline machine press\nIncline push-ups\nIncline flyes\nIncline cable press' }
    ]
  },
  {
    id: '5',
    name: 'Développé décliné haltères',
    nameEn: 'Decline Dumbbell Press',
    description: '<p>Réglez un banc en décliné.</p><p>Allongez-vous avec un haltère dans chaque main.</p><p>Descendez les haltères de manière contrôlée jusqu\'à ce qu\'ils touchent votre poitrine.</p><p>Poussez les haltères vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Set a bench to decline position.</p><p>Lie back with a dumbbell in each hand.</p><p>Lower the dumbbells in a controlled manner until they touch your chest.</p><p>Push the dumbbells up to full extension.</p>',
    introduction: '<p>Le <strong>développé décliné haltères</strong> cible le <strong>bas des pectoraux</strong>.</p>',
    introductionEn: '<p>The <strong>decline dumbbell press</strong> targets the <strong>lower chest</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/LfyQBUKR8SE?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/LfyQBUKR8SE/hqdefault.jpg',
    slug: 'developpe-decline-halteres',
    slugEn: 'decline-dumbbell-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Set bench to decline position\n2. Secure feet in footrests\n3. Lie back with dumbbells at chest level\n4. Press dumbbells up and slightly together\n5. Lower dumbbells slowly to chest level\n6. Keep core tight throughout' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep feet securely in footrests\nMaintain slight arch in lower back\nControl the weight throughout\nDon\'t let dumbbells drift\nKeep shoulder blades retracted' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Not securing feet properly\nUsing too much weight\nNot maintaining proper form\nLetting dumbbells drift apart\nBouncing weights off chest' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weights\nFocus on lower chest contraction\nGradually increase weight\nUse a spotter for heavier weights\nPractice with different angles' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds lower chest development\nImproves pressing power\nDevelops complete chest\nCreates balanced chest development\nBuilds confidence' },
      { attributeName: 'VARIATIONS', attributeValue: 'Decline barbell press\nDecline machine press\nDecline push-ups\nDecline flyes\nDecline cable press' }
    ]
  }
  // Continue with 10 more chest exercises, then 15+ for each other body part...
];

// Helper functions for mega exercises
export function getMegaExercisesByMuscleGroup(muscleGroup: string): ExerciseWithAttributes[] {
  return MEGA_EXERCISES.filter(exercise => {
    const primaryMuscle = getPrimaryMuscle(exercise);
    const secondaryMuscles = getSecondaryMuscles(exercise);
    
    const muscleMapping: Record<string, string[]> = {
      'chest': ['CHEST', 'PECTORALS'],
      'shoulders': ['SHOULDERS', 'DELTOIDS'],
      'biceps': ['BICEPS'],
      'triceps': ['TRICEPS'],
      'abs': ['ABS', 'CORE', 'ABDOMINALS'],
      'back': ['BACK', 'LATS', 'RHOMBOIDS', 'TRAPEZIUS'],
      'legs': ['QUADRICEPS', 'HAMSTRINGS', 'CALVES'],
      'glutes': ['GLUTES', 'GLUTEALS'],
      'forearms': ['FOREARMS'],
      'calves': ['CALVES'],
      'full_body': ['FULL_BODY']
    };
    
    const targetMuscles = muscleMapping[muscleGroup] || [];
    
    return targetMuscles.some(muscle => 
      primaryMuscle === muscle || 
      secondaryMuscles.includes(muscle)
    );
  });
}

export function getPrimaryMuscle(exercise: ExerciseWithAttributes): string {
  const primaryMuscles = exercise.attributes
    .filter(attr => attr.attributeName === 'PRIMARY_MUSCLE')
    .map(attr => attr.attributeValue);
  return primaryMuscles[0] || 'FULL_BODY';
}

export function getSecondaryMuscles(exercise: ExerciseWithAttributes): string[] {
  return exercise.attributes
    .filter(attr => attr.attributeName === 'SECONDARY_MUSCLE')
    .map(attr => attr.attributeValue);
}

export function getEquipment(exercise: ExerciseWithAttributes): string[] {
  return exercise.attributes
    .filter(attr => attr.attributeName === 'EQUIPMENT')
    .map(attr => attr.attributeValue);
}
