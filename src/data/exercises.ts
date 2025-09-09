import { Exercise, ExerciseWithAttributes, MUSCLE_GROUPS, EXERCISE_TYPES, EQUIPMENT_TYPES, MECHANICS_TYPES } from '../types/exercise';

// Re-export the types for other components to use
export { MUSCLE_GROUPS, EXERCISE_TYPES, EQUIPMENT_TYPES, MECHANICS_TYPES };

// Sample exercise data based on workout-cool structure
export const SAMPLE_EXERCISES: ExerciseWithAttributes[] = [
  {
    id: '157',
    name: 'Fentes arrières à la barre',
    nameEn: 'Barbell Alternating Reverse Lunges',
    description: '<p>Tenez-vous droit en tenant une barre placée sur l\'arrière de vos épaules.</p><p>Faites un pas en arrière de 2 à 3 pieds avec un pied et abaissez votre corps au sol.</p><p>Votre genou arrière doit presque toucher le sol et votre genou avant doit être à un angle de 90 degrés.</p><p>Poussez vers le haut et revenez à la position de départ.</p><p>Répétez avec l\'autre jambe.</p>',
    descriptionEn: '<p>Stand upright holding a barbell placed across the back of your shoulders.</p><p>Step back 2-3 feet with one foot and lower your body to the ground.</p><p>Your back knee should almost touch the ground and your front knee should be at a 90-degree angle.</p><p>Push up to return to the starting position.</p><p>Repeat with the other leg.</p>',
    introduction: '<p>Les <strong>fentes arrières à la barre</strong> sont un exercice efficace pour cibler les <strong>muscles des jambes</strong> et les <strong>fessiers</strong>. Idéal pour les sportifs intermédiaires à avancés, cet exercice aide à améliorer l\'<em>équilibre</em> et la <em>stabilité</em> tout en augmentant la <strong>force des jambes</strong>.</p>',
    introductionEn: '<p>The <strong>barbell alternating reverse lunges</strong> are an effective exercise to target the <strong>leg muscles</strong> and <strong>glutes</strong>. Ideal for intermediate to advanced athletes, this exercise helps improve <em>balance</em> and <em>stability</em> while increasing <strong>leg strength</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/NmfQzqGktgs?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/NmfQzqGktgs/hqdefault.jpg',
    slug: 'fentes-arrieres-barre',
    slugEn: 'barbell-alternating-reverse-lunges',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'QUADRICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'GLUTES' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'HAMSTRINGS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BAR' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '163',
    name: 'Tirage horizontal corde à la poulie haute',
    nameEn: 'Facepulls',
    description: '<p>Fixez une corde à la machine à câble à un réglage bas.</p><p>Tenez-vous face à la machine et tenez la corde avec une prise en pronation.</p><p>Reculez pour créer une tension dans le câble, les pieds écartés à la largeur des épaules.</p><p>Gardez le dos droit et penchez-vous légèrement en avant, en fléchissant légèrement les genoux.</p><p>Tirez la corde vers votre poitrine, en contractant vos omoplates ensemble.</p>',
    descriptionEn: '<p>Attach a rope to a low pulley cable machine.</p><p>Stand facing the machine and hold the rope with an overhand grip.</p><p>Step back to create tension in the cable, with feet shoulder-width apart.</p><p>Keep your back straight and lean slightly forward, bending your knees slightly.</p><p>Pull the rope towards your chest, squeezing your shoulder blades together.</p>',
    introduction: '<p>Le <strong>Tirage horizontal corde à la poulie haute</strong>, ou <em>Facepull</em>, est un excellent <em>exercice d\'isolement</em> pour renforcer les<strong> muscles de la partie postérieure des épaules</strong> et du <strong>haut du dos</strong>.</p>',
    introductionEn: '<p>The <strong>Facepull</strong> or <em>Face Pull</em> is an excellent <em>isolation exercise</em> for strengthening the <strong>posterior shoulder muscles</strong> and the <strong>upper back</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/3ZViIERC1QQ?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/3ZViIERC1QQ/hqdefault.jpg',
    slug: 'tirage-horizontal-corde-poulie-haute',
    slugEn: 'facepulls',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'FOREARMS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'CABLE' },
      { attributeName: 'EQUIPMENT', attributeValue: 'ROPE' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  {
    id: '164',
    name: 'Sauts alternés aux côtés du banc',
    nameEn: 'Bench Hops',
    description: '<p>Commencez avec une box ou un banc devant vous. Tenez-vous debout, les pieds écartés de la largeur des épaules.</p><p>Effectuez un court squat en préparation du saut</p><p>Sautez par-dessus le banc, atterrissez avec les genoux pliés, en absorbant l\'impact à travers les jambes.</p>',
    descriptionEn: '<p>Start with a box or bench in front of you. Stand with feet shoulder-width apart.</p><p>Perform a short squat in preparation for the jump.</p><p>Jump over the bench, landing with your knees bent, absorbing the impact through your legs.</p>',
    introduction: '<p>Les <strong>sauts alternés aux côtés du banc</strong> sont un excellent moyen d\'<em>améliorer la puissance explosive</em> et l\'<em>agilité</em>. En sautant de manière répétitive d\'un côté à l\'autre du banc, vous ferez travailler vos <strong>quadriceps, ischio-jambiers et mollets</strong>.</p>',
    introductionEn: '<p><strong>Bench hops</strong> are an excellent way to <em>improve explosive power</em> and <em>agility</em>. By repeatedly hopping from side to side over a bench, you\'ll work your <strong>quads, hamstrings, and calves</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/R3TCOHRwCl8?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/R3TCOHRwCl8/hqdefault.jpg',
    slug: 'sauts-alternes-cotes-banc',
    slugEn: 'bench-hops',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'PLYOMETRICS' },
      { attributeName: 'TYPE', attributeValue: 'CROSSFIT' },
      { attributeName: 'TYPE', attributeValue: 'CARDIO' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'FULL_BODY' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '165',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '166',
    name: 'Squat',
    nameEn: 'Squat',
    description: '<p>Tenez-vous debout, les pieds écartés de la largeur des épaules.</p><p>Descendez en pliant les genoux et en poussant les hanches vers l\'arrière.</p><p>Descendez jusqu\'à ce que vos cuisses soient parallèles au sol.</p><p>Remontez en poussant sur vos talons et en contractant vos fessiers.</p>',
    descriptionEn: '<p>Stand with your feet shoulder-width apart.</p><p>Lower down by bending your knees and pushing your hips back.</p><p>Lower until your thighs are parallel to the ground.</p><p>Return up by pushing through your heels and contracting your glutes.</p>',
    introduction: '<p>Le <strong>squat</strong> est un exercice fondamental qui travaille tous les <strong>muscles des jambes</strong> et des <strong>fessiers</strong>. C\'est l\'un des mouvements les plus efficaces pour développer la force et la puissance.</p>',
    introductionEn: '<p>The <strong>squat</strong> is a fundamental exercise that works all the <strong>leg muscles</strong> and <strong>glutes</strong>. It\'s one of the most effective movements for developing strength and power.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/gsNoPYwWXeM?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/gsNoPYwWXeM/hqdefault.jpg',
    slug: 'squat',
    slugEn: 'squat',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'QUADRICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'GLUTES' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'HAMSTRINGS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '167',
    name: 'Curl biceps',
    nameEn: 'Bicep Curl',
    description: '<p>Tenez-vous debout avec un haltère dans chaque main.</p><p>Gardez vos coudes près de votre corps.</p><p>Pliez vos bras pour soulever les haltères vers vos épaules.</p><p>Contractez vos biceps au sommet du mouvement.</p><p>Descendez lentement les haltères à la position de départ.</p>',
    descriptionEn: '<p>Stand with a dumbbell in each hand.</p><p>Keep your elbows close to your body.</p><p>Bend your arms to lift the dumbbells toward your shoulders.</p><p>Squeeze your biceps at the top of the movement.</p><p>Slowly lower the dumbbells to the starting position.</p>',
    introduction: '<p>Le <strong>curl biceps</strong> est l\'exercice classique pour développer la <strong>force et la définition</strong> des <strong>biceps</strong>. Parfait pour isoler ce muscle.</p>',
    introductionEn: '<p>The <strong>bicep curl</strong> is the classic exercise for developing <strong>strength and definition</strong> of the <strong>biceps</strong>. Perfect for isolating this muscle.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/ykJmrZ5v0Oo/hqdefault.jpg',
    slug: 'curl-biceps',
    slugEn: 'bicep-curl',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'FOREARMS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  {
    id: '168',
    name: 'Planche',
    nameEn: 'Plank',
    description: '<p>Commencez en position de pompe, mais appuyez-vous sur vos avant-bras au lieu de vos mains.</p><p>Gardez votre corps en ligne droite de la tête aux pieds.</p><p>Contractez vos abdominaux et maintenez cette position.</p><p>Respirez normalement pendant que vous maintenez la position.</p>',
    descriptionEn: '<p>Start in a push-up position, but rest on your forearms instead of your hands.</p><p>Keep your body in a straight line from head to toe.</p><p>Engage your core and hold this position.</p><p>Breathe normally while holding the position.</p>',
    introduction: '<p>La <strong>planche</strong> est un exercice isométrique excellent pour renforcer les <strong>abdominaux</strong> et améliorer la <strong>stabilité du tronc</strong>.</p>',
    introductionEn: '<p>The <strong>plank</strong> is an excellent isometric exercise for strengthening the <strong>core</strong> and improving <strong>trunk stability</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/pSHjTRCQxIw/hqdefault.jpg',
    slug: 'planche',
    slugEn: 'plank',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'ABS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  }
];

// Helper functions to get exercise attributes
export function getExerciseAttributesValueOf(exercise: ExerciseWithAttributes, attributeName: string): string[] {
  return exercise.attributes
    .filter(attr => attr.attributeName === attributeName)
    .map(attr => attr.attributeValue);
}

export function getPrimaryMuscle(exercise: ExerciseWithAttributes): string {
  const primaryMuscles = getExerciseAttributesValueOf(exercise, 'PRIMARY_MUSCLE');
  return primaryMuscles[0] || 'FULL_BODY';
}

export function getSecondaryMuscles(exercise: ExerciseWithAttributes): string[] {
  return getExerciseAttributesValueOf(exercise, 'SECONDARY_MUSCLE');
}

export function getEquipment(exercise: ExerciseWithAttributes): string[] {
  return getExerciseAttributesValueOf(exercise, 'EQUIPMENT');
}

export function getExerciseTypes(exercise: ExerciseWithAttributes): string[] {
  return getExerciseAttributesValueOf(exercise, 'TYPE');
}

export function getMechanicsType(exercise: ExerciseWithAttributes): string[] {
  return getExerciseAttributesValueOf(exercise, 'MECHANICS_TYPE');
}

// Filter exercises by muscle group
export function getExercisesByMuscleGroup(muscleGroup: string): ExerciseWithAttributes[] {
  return SAMPLE_EXERCISES.filter(exercise => {
    const primaryMuscle = getPrimaryMuscle(exercise);
    const secondaryMuscles = getSecondaryMuscles(exercise);
    
    // Map workout-cool muscle names to our muscle groups
    const muscleMapping: Record<string, string[]> = {
      [MUSCLE_GROUPS.CHEST]: ['CHEST', 'PECTORALS'],
      [MUSCLE_GROUPS.SHOULDERS]: ['SHOULDERS', 'DELTOIDS'],
      [MUSCLE_GROUPS.BICEPS]: ['BICEPS'],
      [MUSCLE_GROUPS.TRICEPS]: ['TRICEPS'],
      [MUSCLE_GROUPS.ABS]: ['ABS', 'CORE', 'ABDOMINALS'],
      [MUSCLE_GROUPS.BACK]: ['BACK', 'LATS', 'RHOMBOIDS', 'TRAPEZIUS'],
      [MUSCLE_GROUPS.LEGS]: ['QUADRICEPS', 'HAMSTRINGS', 'CALVES'],
      [MUSCLE_GROUPS.GLUTES]: ['GLUTES', 'GLUTEALS'],
      [MUSCLE_GROUPS.FOREARMS]: ['FOREARMS'],
      [MUSCLE_GROUPS.CALVES]: ['CALVES'],
      [MUSCLE_GROUPS.FULL_BODY]: ['FULL_BODY']
    };
    
    const targetMuscles = muscleMapping[muscleGroup] || [];
    
    return targetMuscles.some(muscle => 
      primaryMuscle === muscle || 
      secondaryMuscles.includes(muscle)
    );
  });
}
