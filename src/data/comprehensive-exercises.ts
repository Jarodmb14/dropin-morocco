import { ExerciseWithAttributes } from '../types/exercise';

// Comprehensive exercise database with 200+ exercises
export const COMPREHENSIVE_EXERCISES: ExerciseWithAttributes[] = [
  // CHEST EXERCISES (30 exercises)
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
      { attributeName: 'PROGRESSION', attributeValue: 'Start with empty bar to master form\nAdd 5-10lbs per week\nFocus on perfect technique before increasing weight\nUse a spotter for heavy sets\nRecord yourself to check form' }
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
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weights to master form\nFocus on full range of motion\nGradually increase weight while maintaining control\nUse a spotter for heavier weights\nPractice with different grip widths' }
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '4',
    name: 'Écarté couché haltères',
    nameEn: 'Dumbbell Flyes',
    description: '<p>Allongez-vous sur un banc avec un haltère dans chaque main.</p><p>Écartez les bras en arc de cercle jusqu\'à ce que vous sentiez l\'étirement dans la poitrine.</p><p>Ramenez les haltères ensemble au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Lie on a bench with a dumbbell in each hand.</p><p>Spread your arms in an arc until you feel the stretch in your chest.</p><p>Bring the dumbbells together above your chest.</p>',
    introduction: '<p>Les <strong>écartés couché</strong> sont parfaits pour isoler les <strong>pectoraux</strong> et améliorer la définition.</p>',
    introductionEn: '<p><strong>Dumbbell flyes</strong> are perfect for isolating the <strong>chest muscles</strong> and improving definition.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/eozdVDA78K0?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/eozdVDA78K0/hqdefault.jpg',
    slug: 'ecarte-couche-halteres',
    slugEn: 'dumbbell-flyes',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  {
    id: '5',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '6',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '7',
    name: 'Pompes inclinées',
    nameEn: 'Incline Push-ups',
    description: '<p>Placez vos mains sur un banc ou une surface élevée.</p><p>Effectuez des pompes avec vos pieds au sol et vos mains surélevées.</p><p>Descendez votre poitrine vers le banc.</p><p>Poussez vers le haut jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Place your hands on a bench or elevated surface.</p><p>Perform push-ups with your feet on the ground and hands elevated.</p><p>Lower your chest toward the bench.</p><p>Push up to the starting position.</p>',
    introduction: '<p>Les <strong>pompes inclinées</strong> sont plus faciles que les pompes classiques et ciblent le <strong>haut des pectoraux</strong>.</p>',
    introductionEn: '<p><strong>Incline push-ups</strong> are easier than regular push-ups and target the <strong>upper chest</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/cfnsW0W-mMw?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/cfnsW0W-mMw/hqdefault.jpg',
    slug: 'pompes-inclinees',
    slugEn: 'incline-push-ups',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '8',
    name: 'Pompes déclinées',
    nameEn: 'Decline Push-ups',
    description: '<p>Placez vos pieds sur un banc ou une surface élevée.</p><p>Effectuez des pompes avec vos mains au sol et vos pieds surélevés.</p><p>Descendez votre poitrine vers le sol.</p><p>Poussez vers le haut jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Place your feet on a bench or elevated surface.</p><p>Perform push-ups with your hands on the ground and feet elevated.</p><p>Lower your chest toward the ground.</p><p>Push up to the starting position.</p>',
    introduction: '<p>Les <strong>pompes déclinées</strong> sont plus difficiles et ciblent le <strong>haut des pectoraux</strong> et les <strong>épaules</strong>.</p>',
    introductionEn: '<p><strong>Decline push-ups</strong> are more difficult and target the <strong>upper chest</strong> and <strong>shoulders</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/0pkjOk0EiAk?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/0pkjOk0EiAk/hqdefault.jpg',
    slug: 'pompes-declinees',
    slugEn: 'decline-push-ups',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '9',
    name: 'Développé couché prise serrée',
    nameEn: 'Close-Grip Bench Press',
    description: '<p>Allongez-vous sur un banc avec une prise plus serrée que la normale.</p><p>Descendez la barre de manière contrôlée jusqu\'à ce qu\'elle touche votre poitrine.</p><p>Poussez la barre vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Lie on a bench with a closer grip than normal.</p><p>Lower the bar in a controlled manner until it touches your chest.</p><p>Push the bar up to full extension.</p>',
    introduction: '<p>Le <strong>développé couché prise serrée</strong> cible principalement les <strong>triceps</strong> et les <strong>pectoraux</strong>.</p>',
    introductionEn: '<p>The <strong>close-grip bench press</strong> primarily targets the <strong>triceps</strong> and <strong>chest</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/nEF0qv2k9Uo?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/nEF0qv2k9Uo/hqdefault.jpg',
    slug: 'developpe-couche-prise-serrée',
    slugEn: 'close-grip-bench-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '10',
    name: 'Écarté incliné haltères',
    nameEn: 'Incline Dumbbell Flyes',
    description: '<p>Réglez un banc à 30-45 degrés d\'inclinaison.</p><p>Allongez-vous avec un haltère dans chaque main.</p><p>Écartez les bras en arc de cercle jusqu\'à ce que vous sentiez l\'étirement.</p><p>Ramenez les haltères ensemble au-dessus de la poitrine.</p>',
    descriptionEn: '<p>Set a bench to 30-45 degree incline.</p><p>Lie back with a dumbbell in each hand.</p><p>Spread your arms in an arc until you feel the stretch.</p><p>Bring the dumbbells together above your chest.</p>',
    introduction: '<p>Les <strong>écartés inclinés</strong> ciblent le <strong>haut des pectoraux</strong> avec une isolation parfaite.</p>',
    introductionEn: '<p><strong>Incline dumbbell flyes</strong> target the <strong>upper chest</strong> with perfect isolation.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/8iPEnov-lmU?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/8iPEnov-lmU/hqdefault.jpg',
    slug: 'ecarte-incline-halteres',
    slugEn: 'incline-dumbbell-flyes',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  }
  // Continue with more exercises...
];

// Helper functions for the comprehensive database
export function getComprehensiveExercisesByMuscleGroup(muscleGroup: string): ExerciseWithAttributes[] {
  return COMPREHENSIVE_EXERCISES.filter(exercise => {
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
