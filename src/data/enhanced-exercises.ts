import { ExerciseWithAttributes } from '../types/exercise';

// Enhanced exercise database with detailed tutorials and explanations
export const ENHANCED_EXERCISES: ExerciseWithAttributes[] = [
  // CHEST EXERCISES WITH DETAILED TUTORIALS
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
  {
    id: '3',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'BEGINNER' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Stand with feet shoulder-width apart, toes slightly pointed out\n2. Keep your chest up and core engaged\n3. Initiate the movement by pushing your hips back\n4. Lower down as if sitting back into a chair\n5. Go down until your thighs are parallel to the ground\n6. Drive through your heels to return to standing position' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep your chest up throughout the movement\nDon\'t let your knees cave inward\nKeep your weight on your heels\nMaintain a neutral spine\nBreathe in on the way down, out on the way up' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Knees caving inward\nNot going deep enough\nLeaning too far forward\nLifting heels off the ground\nNot engaging core muscles' },
      { attributeName: 'PROGRESSION', value: 'Start with bodyweight squats\nAdd tempo variations (slow down, pause at bottom)\nTry single-leg variations\nAdd resistance with dumbbells or barbell\nFocus on increasing depth over time' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds functional leg strength\nImproves mobility and flexibility\nDevelops core stability\nBurns calories and builds muscle\nImproves athletic performance' },
      { attributeName: 'VARIATIONS', attributeValue: 'Goblet squat (with dumbbell)\nJump squats (plyometric)\nPistol squats (single leg)\nSumo squats (wide stance)\nWall sits (isometric hold)' }
    ]
  },
  {
    id: '4',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' },
      { attributeName: 'DIFFICULTY', attributeValue: 'BEGINNER' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Stand with feet hip-width apart, holding dumbbells at your sides\n2. Keep your elbows close to your body and core engaged\n3. Curl the weights up by flexing your biceps\n4. Squeeze your biceps at the top of the movement\n5. Slowly lower the weights back to the starting position\n6. Control the movement throughout the entire range' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep your elbows stationary\nDon\'t swing the weights\nSqueeze your biceps at the top\nControl the negative (lowering) phase\nKeep your core engaged' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Swinging the weights for momentum\nMoving your elbows forward\nUsing too much weight\nNot controlling the negative phase\nNot squeezing at the top' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weights to master form\nFocus on the mind-muscle connection\nTry different grip variations\nAdd tempo variations (slow down, pause at top)\nProgress to advanced variations like hammer curls' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds bicep strength and size\nImproves arm definition\nDevelops mind-muscle connection\nCan be done with various equipment\nBuilds grip strength' },
      { attributeName: 'VARIATIONS', attributeValue: 'Hammer curls (neutral grip)\nCable curls (constant tension)\nConcentration curls (seated isolation)\nPreacher curls (supported)\n21s (partial reps)' }
    ]
  },
  {
    id: '5',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'ISOLATION' },
      { attributeName: 'DIFFICULTY', attributeValue: 'BEGINNER' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Start in a push-up position on your forearms\n2. Keep your body in a straight line from head to heels\n3. Engage your core muscles and glutes\n4. Hold this position while breathing normally\n5. Keep your hips level and don\'t let them sag\n6. Maintain the position for the desired duration' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep your body in a straight line\nDon\'t let your hips sag or pike up\nEngage your core throughout\nBreathe normally\nKeep your head in neutral position' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Sagging hips\nPiking up (hips too high)\nHolding breath\nLooking up or down\nNot engaging core muscles' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with 10-15 seconds\nGradually increase hold time\nTry different variations (side plank, forearm plank)\nAdd movement (plank to push-up)\nFocus on quality over duration' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds core strength and stability\nImproves posture\nReduces back pain risk\nNo equipment needed\nCan be done anywhere' },
      { attributeName: 'VARIATIONS', attributeValue: 'Side plank (oblique focus)\nPlank to push-up\nPlank with leg lifts\nPlank with arm reaches\nPlank jacks' }
    ]
  },
  // ADDITIONAL CHEST EXERCISES
  {
    id: '6',
    name: 'Développé incliné barre',
    nameEn: 'Incline Barbell Press',
    description: '<p>Réglez un banc à 30-45 degrés d\'inclinaison.</p><p>Allongez-vous et saisissez la barre avec une prise légèrement plus large que les épaules.</p><p>Descendez la barre de manière contrôlée jusqu\'à ce qu\'elle touche votre poitrine.</p><p>Poussez la barre vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Set a bench to 30-45 degree incline.</p><p>Lie back and grip the bar with hands slightly wider than shoulders.</p><p>Lower the bar in a controlled manner until it touches your chest.</p><p>Push the bar up to full extension.</p>',
    introduction: '<p>Le <strong>développé incliné barre</strong> cible spécifiquement le <strong>haut des pectoraux</strong> et les <strong>épaules</strong>.</p>',
    introductionEn: '<p>The <strong>incline barbell press</strong> specifically targets the <strong>upper chest</strong> and <strong>shoulders</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/8iPEnov-lmU?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/8iPEnov-lmU/hqdefault.jpg',
    slug: 'developpe-incline-barre',
    slugEn: 'incline-barbell-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Set bench to 30-45 degree incline\n2. Lie back with eyes under the bar\n3. Grip bar slightly wider than shoulder-width\n4. Unrack and hold bar over upper chest\n5. Lower bar slowly to upper chest\n6. Press bar up explosively to starting position' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep shoulder blades retracted\nMaintain slight arch in lower back\nControl the descent for 2-3 seconds\nDon\'t bounce the bar off chest\nKeep core engaged throughout' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Using too steep an incline\nBouncing bar off chest\nFlaring elbows too wide\nNot maintaining proper breathing\nGoing too heavy too soon' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weight\nFocus on upper chest contraction\nGradually increase weight\nUse a spotter for heavy sets\nRecord yourself to check form' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper chest development\nImproves shoulder strength\nDevelops pressing power\nCreates balanced chest development\nBuilds confidence' },
      { attributeName: 'VARIATIONS', attributeValue: 'Incline dumbbell press\nIncline machine press\nIncline push-ups\nIncline flyes\nIncline cable press' }
    ]
  },
  {
    id: '7',
    name: 'Développé décliné barre',
    nameEn: 'Decline Barbell Press',
    description: '<p>Réglez un banc en décliné.</p><p>Allongez-vous et saisissez la barre avec une prise légèrement plus large que les épaules.</p><p>Descendez la barre de manière contrôlée jusqu\'à ce qu\'elle touche votre poitrine.</p><p>Poussez la barre vers le haut jusqu\'à l\'extension complète.</p>',
    descriptionEn: '<p>Set a bench to decline position.</p><p>Lie back and grip the bar with hands slightly wider than shoulders.</p><p>Lower the bar in a controlled manner until it touches your chest.</p><p>Push the bar up to full extension.</p>',
    introduction: '<p>Le <strong>développé décliné barre</strong> cible spécifiquement le <strong>bas des pectoraux</strong>.</p>',
    introductionEn: '<p>The <strong>decline barbell press</strong> specifically targets the <strong>lower chest</strong>.</p>',
    fullVideoUrl: 'https://www.youtube.com/embed/LfyQBUKR8SE?autoplay=1',
    fullVideoImageUrl: 'https://img.youtube.com/vi/LfyQBUKR8SE/hqdefault.jpg',
    slug: 'developpe-decline-barre',
    slugEn: 'decline-barbell-press',
    attributes: [
      { attributeName: 'TYPE', attributeValue: 'STRENGTH' },
      { attributeName: 'PRIMARY_MUSCLE', attributeValue: 'CHEST' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'SHOULDERS' },
      { attributeName: 'SECONDARY_MUSCLE', attributeValue: 'TRICEPS' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BARBELL' },
      { attributeName: 'EQUIPMENT', attributeValue: 'BENCH' },
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Set bench to decline position\n2. Secure your feet in the footrests\n3. Lie back and grip bar slightly wider than shoulders\n4. Unrack and hold bar over lower chest\n5. Lower bar slowly to lower chest\n6. Press bar up explosively to starting position' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep feet securely in footrests\nMaintain slight arch in lower back\nControl the descent for 2-3 seconds\nDon\'t bounce the bar off chest\nKeep core engaged throughout' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Not securing feet properly\nBouncing bar off chest\nFlaring elbows too wide\nNot maintaining proper breathing\nGoing too heavy too soon' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weight\nFocus on lower chest contraction\nGradually increase weight\nUse a spotter for heavy sets\nRecord yourself to check form' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds lower chest development\nImproves pressing power\nDevelops complete chest\nCreates balanced chest development\nBuilds confidence' },
      { attributeName: 'VARIATIONS', attributeValue: 'Decline dumbbell press\nDecline machine press\nDecline push-ups\nDecline flyes\nDecline cable press' }
    ]
  },
  {
    id: '8',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'BEGINNER' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Place hands on bench or elevated surface\n2. Position feet on ground behind you\n3. Keep body in straight line from head to heels\n4. Lower chest toward the bench\n5. Push up to starting position\n6. Maintain proper form throughout' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep body in straight line\nDon\'t let hips sag or pike up\nKeep core engaged\nControl both phases of movement\nBreathe normally' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Sagging hips\nPiking up\nNot going low enough\nMoving too fast\nHolding breath' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with higher elevation\nGradually lower elevation\nFocus on perfect form\nIncrease reps gradually\nTry different hand positions' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper chest strength\nImproves pressing power\nNo equipment needed\nCan be done anywhere\nBuilds endurance' },
      { attributeName: 'VARIATIONS', attributeValue: 'Different elevation heights\nWide grip incline push-ups\nNarrow grip incline push-ups\nSingle arm incline push-ups\nPlyometric incline push-ups' }
    ]
  },
  {
    id: '9',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Place feet on bench or elevated surface\n2. Position hands on ground slightly wider than shoulders\n3. Keep body in straight line from head to heels\n4. Lower chest toward the ground\n5. Push up to starting position\n6. Maintain proper form throughout' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep body in straight line\nDon\'t let hips sag or pike up\nKeep core engaged\nControl both phases of movement\nBreathe normally' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Sagging hips\nPiking up\nNot going low enough\nMoving too fast\nHolding breath' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lower elevation\nGradually increase elevation\nFocus on perfect form\nIncrease reps gradually\nTry different hand positions' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds upper chest strength\nImproves pressing power\nNo equipment needed\nCan be done anywhere\nBuilds endurance' },
      { attributeName: 'VARIATIONS', attributeValue: 'Different elevation heights\nWide grip decline push-ups\nNarrow grip decline push-ups\nSingle arm decline push-ups\nPlyometric decline push-ups' }
    ]
  },
  {
    id: '10',
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
      { attributeName: 'MECHANICS_TYPE', attributeValue: 'COMPOUND' },
      { attributeName: 'DIFFICULTY', attributeValue: 'INTERMEDIATE' },
      { attributeName: 'TUTORIAL', attributeValue: '1. Lie on bench with hands closer than shoulder-width\n2. Grip bar with hands about 6-8 inches apart\n3. Unrack and hold bar over chest\n4. Lower bar slowly to chest\n5. Press bar up explosively\n6. Keep elbows close to body' },
      { attributeName: 'FORM_TIPS', attributeValue: 'Keep elbows close to body\nDon\'t flare elbows out\nControl the descent\nKeep core engaged\nMaintain proper breathing' },
      { attributeName: 'COMMON_MISTAKES', attributeValue: 'Flaring elbows too wide\nUsing too much weight\nNot controlling descent\nBouncing bar off chest\nNot engaging core' },
      { attributeName: 'PROGRESSION', attributeValue: 'Start with lighter weight\nFocus on tricep contraction\nGradually increase weight\nUse a spotter for heavy sets\nRecord yourself to check form' },
      { attributeName: 'BENEFITS', attributeValue: 'Builds tricep strength\nImproves pressing power\nDevelops chest muscles\nCan be loaded progressively\nBuilds confidence' },
      { attributeName: 'VARIATIONS', attributeValue: 'Close-grip dumbbell press\nClose-grip machine press\nClose-grip push-ups\nClose-grip cable press\nClose-grip incline press' }
    ]
  }
  // Continue with more exercises...
];

// Helper functions for enhanced exercises
export function getEnhancedExercisesByMuscleGroup(muscleGroup: string): ExerciseWithAttributes[] {
  return ENHANCED_EXERCISES.filter(exercise => {
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

export function getTutorial(exercise: ExerciseWithAttributes): string {
  const tutorial = exercise.attributes
    .filter(attr => attr.attributeName === 'TUTORIAL')
    .map(attr => attr.attributeValue);
  return tutorial[0] || '';
}

export function getFormTips(exercise: ExerciseWithAttributes): string {
  const tips = exercise.attributes
    .filter(attr => attr.attributeName === 'FORM_TIPS')
    .map(attr => attr.attributeValue);
  return tips[0] || '';
}

export function getCommonMistakes(exercise: ExerciseWithAttributes): string {
  const mistakes = exercise.attributes
    .filter(attr => attr.attributeName === 'COMMON_MISTAKES')
    .map(attr => attr.attributeValue);
  return mistakes[0] || '';
}

export function getProgression(exercise: ExerciseWithAttributes): string {
  const progression = exercise.attributes
    .filter(attr => attr.attributeName === 'PROGRESSION')
    .map(attr => attr.attributeValue);
  return progression[0] || '';
}

export function getBenefits(exercise: ExerciseWithAttributes): string {
  const benefits = exercise.attributes
    .filter(attr => attr.attributeName === 'BENEFITS')
    .map(attr => attr.attributeValue);
  return benefits[0] || '';
}

export function getVariations(exercise: ExerciseWithAttributes): string {
  const variations = exercise.attributes
    .filter(attr => attr.attributeName === 'VARIATIONS')
    .map(attr => attr.attributeValue);
  return variations[0] || '';
}

export function getDifficulty(exercise: ExerciseWithAttributes): string {
  const difficulty = exercise.attributes
    .filter(attr => attr.attributeName === 'DIFFICULTY')
    .map(attr => attr.attributeValue);
  return difficulty[0] || 'BEGINNER';
}
