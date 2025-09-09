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
  },
  // CHEST EXERCISES
  {
    id: '169',
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
    id: '170',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '171',
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
  // SHOULDER EXERCISES
  {
    id: '172',
    name: 'Développé militaire',
    nameEn: 'Overhead Press',
    description: '<p>Tenez-vous debout avec la barre au niveau des épaules.</p><p>Poussez la barre vers le haut jusqu\'à l\'extension complète des bras.</p><p>Descendez de manière contrôlée jusqu\'aux épaules.</p>',
    descriptionEn: '<p>Stand with the bar at shoulder level.</p><p>Push the bar up to full arm extension.</p><p>Lower in a controlled manner to shoulders.</p>',
    introduction: '<p>Le <strong>développé militaire</strong> est l\'exercice roi pour développer la <strong>force des épaules</strong>.</p>',
    introductionEn: '<p>The <strong>overhead press</strong> is the king exercise for developing <strong>shoulder strength</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/qEwKCR5JCog/hqdefault.jpg',
    slug: 'developpe-militaire',
    slugEn: 'overhead-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '173',
    name: 'Élévations latérales',
    nameEn: 'Lateral Raises',
    description: '<p>Tenez-vous debout avec un haltère dans chaque main.</p><p>Levez les bras sur les côtés jusqu\'à la hauteur des épaules.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Stand with a dumbbell in each hand.</p><p>Raise your arms to the sides until shoulder height.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Les <strong>élévations latérales</strong> ciblent spécifiquement les <strong>deltoïdes moyens</strong>.</p>',
    introductionEn: '<p><strong>Lateral raises</strong> specifically target the <strong>middle deltoids</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/3VcKXNN1LtY?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/3VcKXNN1LtY/hqdefault.jpg',
    slug: 'elevations-laterales',
    slugEn: 'lateral-raises',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  // BACK EXERCISES
  {
    id: '174',
    name: 'Tractions',
    nameEn: 'Pull-ups',
    description: '<p>Accrochez-vous à une barre de traction avec les mains plus larges que les épaules.</p><p>Tirez votre corps vers le haut jusqu\'à ce que votre menton dépasse la barre.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Hang from a pull-up bar with hands wider than shoulders.</p><p>Pull your body up until your chin clears the bar.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Les <strong>tractions</strong> sont l\'exercice roi pour développer la <strong>force du dos</strong> et des <strong>biceps</strong>.</p>',
    introductionEn: '<p><strong>Pull-ups</strong> are the king exercise for developing <strong>back strength</strong> and <strong>biceps</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg',
    slug: 'tractions',
    slugEn: 'pull-ups',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BACK' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'PULL_UP_BAR' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '175',
    name: 'Rowing haltère',
    nameEn: 'Dumbbell Row',
    description: '<p>Penchez-vous en avant avec un haltère dans une main et l\'autre main sur un banc.</p><p>Tirez l\'haltère vers votre hanche en contractant les omoplates.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Bend forward with a dumbbell in one hand and the other hand on a bench.</p><p>Pull the dumbbell toward your hip while squeezing your shoulder blades.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>rowing haltère</strong> cible efficacement les <strong>muscles du dos</strong> et améliore la posture.</p>',
    introductionEn: '<p>The <strong>dumbbell row</strong> effectively targets the <strong>back muscles</strong> and improves posture.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/p6h6G2hQfzE?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/p6h6G2hQfzE/hqdefault.jpg',
    slug: 'rowing-haltere',
    slugEn: 'dumbbell-row',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BACK' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  // BICEPS EXERCISES
  {
    id: '176',
    name: 'Curl marteau',
    nameEn: 'Hammer Curl',
    description: '<p>Tenez un haltère dans chaque main avec une prise neutre.</p><p>Pliez les bras pour soulever les haltères vers les épaules.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Hold a dumbbell in each hand with a neutral grip.</p><p>Bend your arms to lift the dumbbells toward your shoulders.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>curl marteau</strong> cible les <strong>biceps</strong> et les <strong>avant-bras</strong> avec une prise neutre.</p>',
    introductionEn: '<p>The <strong>hammer curl</strong> targets the <strong>biceps</strong> and <strong>forearms</strong> with a neutral grip.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/zC3nLlEvin4/hqdefault.jpg',
    slug: 'curl-marteau',
    slugEn: 'hammer-curl',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'FOREARMS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  // TRICEPS EXERCISES
  {
    id: '177',
    name: 'Dips',
    nameEn: 'Dips',
    description: '<p>Accrochez-vous aux barres parallèles avec les bras tendus.</p><p>Descendez votre corps en pliant les coudes.</p><p>Poussez vers le haut jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Hang from parallel bars with arms extended.</p><p>Lower your body by bending your elbows.</p><p>Push up to the starting position.</p>',
    introduction: '<p>Les <strong>dips</strong> sont excellents pour développer la <strong>force des triceps</strong> et des <strong>épaules</strong>.</p>',
    introductionEn: '<p><strong>Dips</strong> are excellent for developing <strong>tricep strength</strong> and <strong>shoulders</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/2z8JmcrW-As/hqdefault.jpg',
    slug: 'dips',
    slugEn: 'dips',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DIP_BAR' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '178',
    name: 'Extension triceps couché',
    nameEn: 'Lying Tricep Extension',
    description: '<p>Allongez-vous sur un banc avec un haltère dans chaque main.</p><p>Pliez les coudes pour descendre les haltères vers votre front.</p><p>Étendez les bras pour soulever les haltères vers le haut.</p>',
    descriptionEn: '<p>Lie on a bench with a dumbbell in each hand.</p><p>Bend your elbows to lower the dumbbells toward your forehead.</p><p>Extend your arms to lift the dumbbells up.</p>',
    introduction: '<p>L\'<strong>extension triceps couché</strong> isole parfaitement les <strong>triceps</strong>.</p>',
    introductionEn: '<p>The <strong>lying tricep extension</strong> perfectly isolates the <strong>triceps</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/6SS6x3vZx0E?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/6SS6x3vZx0E/hqdefault.jpg',
    slug: 'extension-triceps-couche',
    slugEn: 'lying-tricep-extension',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  // LEG EXERCISES
  {
    id: '179',
    name: 'Fentes',
    nameEn: 'Lunges',
    description: '<p>Tenez-vous debout, les pieds écartés de la largeur des hanches.</p><p>Faites un grand pas en avant et descendez jusqu\'à ce que votre genou arrière touche presque le sol.</p><p>Poussez sur votre talon avant pour revenir à la position de départ.</p>',
    descriptionEn: '<p>Stand with feet hip-width apart.</p><p>Take a big step forward and lower until your back knee almost touches the ground.</p><p>Push through your front heel to return to the starting position.</p>',
    introduction: '<p>Les <strong>fentes</strong> travaillent efficacement les <strong>quadriceps</strong>, <strong>ischio-jambiers</strong> et <strong>fessiers</strong>.</p>',
    introductionEn: '<p><strong>Lunges</strong> effectively work the <strong>quads</strong>, <strong>hamstrings</strong>, and <strong>glutes</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/QOVaHwm-Q6U/hqdefault.jpg',
    slug: 'fentes',
    slugEn: 'lunges',
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
    id: '180',
    name: 'Squat bulgare',
    nameEn: 'Bulgarian Split Squat',
    description: '<p>Placez votre pied arrière sur un banc ou une chaise.</p><p>Descendez en pliant votre genou avant jusqu\'à ce que votre cuisse soit parallèle au sol.</p><p>Poussez sur votre talon avant pour revenir à la position de départ.</p>',
    descriptionEn: '<p>Place your back foot on a bench or chair.</p><p>Lower by bending your front knee until your thigh is parallel to the ground.</p><p>Push through your front heel to return to the starting position.</p>',
    introduction: '<p>Le <strong>squat bulgare</strong> cible intensément les <strong>quadriceps</strong> et améliore l\'équilibre.</p>',
    introductionEn: '<p>The <strong>Bulgarian split squat</strong> intensely targets the <strong>quads</strong> and improves balance.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    slug: 'squat-bulgare',
    slugEn: 'bulgarian-split-squat',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'QUADRICEPS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'GLUTES' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  // CORE EXERCISES
  {
    id: '181',
    name: 'Crunchs',
    nameEn: 'Crunches',
    description: '<p>Allongez-vous sur le dos avec les genoux pliés et les pieds au sol.</p><p>Placez vos mains derrière votre tête.</p><p>Soulevez vos épaules du sol en contractant vos abdominaux.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Lie on your back with knees bent and feet on the ground.</p><p>Place your hands behind your head.</p><p>Lift your shoulders off the ground by contracting your abs.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Les <strong>crunchs</strong> sont l\'exercice de base pour renforcer les <strong>abdominaux</strong>.</p>',
    introductionEn: '<p><strong>Crunches</strong> are the basic exercise for strengthening the <strong>abs</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoUU?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/Xyd_fa5zoUU/hqdefault.jpg',
    slug: 'crunchs',
    slugEn: 'crunches',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'ABS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  {
    id: '182',
    name: 'Mountain Climbers',
    nameEn: 'Mountain Climbers',
    description: '<p>Commencez en position de planche.</p><p>Amenez rapidement un genou vers votre poitrine.</p><p>Retournez à la position de planche et répétez avec l\'autre jambe.</p><p>Continuez en alternant rapidement les jambes.</p>',
    descriptionEn: '<p>Start in a plank position.</p><p>Quickly bring one knee toward your chest.</p><p>Return to plank position and repeat with the other leg.</p><p>Continue alternating legs quickly.</p>',
    introduction: '<p>Les <strong>mountain climbers</strong> combinent <strong>cardio</strong> et renforcement des <strong>abdominaux</strong>.</p>',
    introductionEn: '<p><strong>Mountain climbers</strong> combine <strong>cardio</strong> and <strong>core strengthening</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/cnyTQDSE884?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/cnyTQDSE884/hqdefault.jpg',
    slug: 'mountain-climbers',
    slugEn: 'mountain-climbers',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'CARDIO' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'ABS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  // GLUTES EXERCISES
  {
    id: '183',
    name: 'Hip Thrust',
    nameEn: 'Hip Thrust',
    description: '<p>Asseyez-vous avec le dos contre un banc et un haltère sur vos hanches.</p><p>Poussez vos hanches vers le haut en contractant vos fessiers.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Sit with your back against a bench and a dumbbell on your hips.</p><p>Push your hips up while squeezing your glutes.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>hip thrust</strong> est l\'exercice roi pour développer les <strong>fessiers</strong>.</p>',
    introductionEn: '<p>The <strong>hip thrust</strong> is the king exercise for developing <strong>glutes</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/uY3QKv8OwMI?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/uY3QKv8OwMI/hqdefault.jpg',
    slug: 'hip-thrust',
    slugEn: 'hip-thrust',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'GLUTES' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'HAMSTRINGS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'DUMBBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '184',
    name: 'Pont fessier',
    nameEn: 'Glute Bridge',
    description: '<p>Allongez-vous sur le dos avec les genoux pliés et les pieds au sol.</p><p>Poussez vos hanches vers le haut en contractant vos fessiers.</p><p>Maintenez la position en haut pendant 2 secondes.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Lie on your back with knees bent and feet on the ground.</p><p>Push your hips up while squeezing your glutes.</p><p>Hold the position at the top for 2 seconds.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>pont fessier</strong> renforce efficacement les <strong>fessiers</strong> et les <strong>ischio-jambiers</strong>.</p>',
    introductionEn: '<p>The <strong>glute bridge</strong> effectively strengthens the <strong>glutes</strong> and <strong>hamstrings</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/OUgsJ8Hmiu8?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/OUgsJ8Hmiu8/hqdefault.jpg',
    slug: 'pont-fessier',
    slugEn: 'glute-bridge',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'GLUTES' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'HAMSTRINGS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BODYWEIGHT' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  // RESISTANCE BAND EXERCISES
  {
    id: '185',
    name: 'Curl biceps élastique',
    nameEn: 'Resistance Band Bicep Curl',
    description: '<p>Tenez-vous debout sur une bande élastique avec les pieds écartés de la largeur des épaules.</p><p>Saisissez les poignées avec les paumes vers le haut.</p><p>Pliez les bras pour soulever les poignées vers les épaules.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Stand on a resistance band with feet shoulder-width apart.</p><p>Grab the handles with palms facing up.</p><p>Bend your arms to lift the handles toward your shoulders.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>curl biceps élastique</strong> offre une résistance constante tout au long du mouvement.</p>',
    introductionEn: '<p>The <strong>resistance band bicep curl</strong> provides constant resistance throughout the movement.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/op9S5xKj7aQ?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/op9S5xKj7aQ/hqdefault.jpg',
    slug: 'curl-biceps-elastique',
    slugEn: 'resistance-band-bicep-curl',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BAND' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  {
    id: '186',
    name: 'Élévations latérales élastique',
    nameEn: 'Resistance Band Lateral Raises',
    description: '<p>Tenez-vous debout sur une bande élastique avec les pieds écartés de la largeur des épaules.</p><p>Saisissez les poignées avec les paumes vers le bas.</p><p>Levez les bras sur les côtés jusqu\'à la hauteur des épaules.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Stand on a resistance band with feet shoulder-width apart.</p><p>Grab the handles with palms facing down.</p><p>Raise your arms to the sides until shoulder height.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Les <strong>élévations latérales élastique</strong> ciblent les <strong>deltoïdes moyens</strong> avec une résistance progressive.</p>',
    introductionEn: '<p><strong>Resistance band lateral raises</strong> target the <strong>middle deltoids</strong> with progressive resistance.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/3VcKXNN1LtY?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/3VcKXNN1LtY/hqdefault.jpg',
    slug: 'elevations-laterales-elastique',
    slugEn: 'resistance-band-lateral-raises',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BAND' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' }
    ]
  },
  // CABLE EXERCISES
  {
    id: '187',
    name: 'Tirage vertical',
    nameEn: 'Lat Pulldown',
    description: '<p>Asseyez-vous à la machine de tirage vertical avec les genoux fixés sous les coussinets.</p><p>Saisissez la barre avec une prise large et les paumes vers l\'avant.</p><p>Tirez la barre vers votre poitrine en contractant les omoplates.</p><p>Remontez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Sit at the lat pulldown machine with knees secured under the pads.</p><p>Grip the bar with a wide grip and palms facing forward.</p><p>Pull the bar toward your chest while squeezing your shoulder blades.</p><p>Return slowly to the starting position.</p>',
    introduction: '<p>Le <strong>tirage vertical</strong> est excellent pour développer la <strong>largeur du dos</strong>.</p>',
    introductionEn: '<p>The <strong>lat pulldown</strong> is excellent for developing <strong>back width</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/CAwf7n6Lu78?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/CAwf7n6Lu78/hqdefault.jpg',
    slug: 'tirage-vertical',
    slugEn: 'lat-pulldown',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BACK' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'CABLE' },
      { attributeName: 'EQUIPMENT', attributeValue: 'MACHINE' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' }
    ]
  },
  {
    id: '188',
    name: 'Curl biceps câble',
    nameEn: 'Cable Bicep Curl',
    description: '<p>Réglez la poulie au niveau le plus bas et attachez une poignée.</p><p>Tenez-vous debout face à la machine et saisissez la poignée.</p><p>Pliez le bras pour soulever la poignée vers l\'épaule.</p><p>Descendez lentement jusqu\'à la position de départ.</p>',
    descriptionEn: '<p>Set the pulley to the lowest level and attach a handle.</p><p>Stand facing the machine and grab the handle.</p><p>Bend your arm to lift the handle toward your shoulder.</p><p>Lower slowly to the starting position.</p>',
    introduction: '<p>Le <strong>curl biceps câble</strong> offre une tension constante et une meilleure isolation.</p>',
    introductionEn: '<p>The <strong>cable bicep curl</strong> provides constant tension and better isolation.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/NFzTW5uD4t4?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/NFzTW5uD4t4/hqdefault.jpg',
    slug: 'curl-biceps-cable',
    slugEn: 'cable-bicep-curl',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'BICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'CABLE' },
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
