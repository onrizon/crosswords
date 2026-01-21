import { Locale } from '@/locales';
import { GoogleGenAI, Type } from '@google/genai';
import { RawLevel } from '../types';

// Get API key from environment variable
const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    '⚠️ GEMINI_API_KEY not found. AI generation will use fallback data.'
  );
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

// Creative inspirations to spark unique category ideas (not the categories themselves)
const INSPIRATIONS = [
  // Nature & Living Things
  'creatures that live underwater',
  'animals with fur',
  'things that grow in gardens',
  'life in the rainforest',
  'creatures of the night',
  'things with wings',
  'life in the desert',
  'things that bloom',
  'animals people keep at home',
  'life in cold places',
  'things found in forests',
  'creatures with shells',
  'things that crawl',
  'life on a farm',
  'things in the sky',
  'microscopic life',
  'endangered wildlife',
  'prehistoric creatures',
  'venomous animals',
  'migratory species',

  // Places & Locations
  'a busy city street',
  'tropical paradise',
  'mountain adventures',
  'underground places',
  'places people work',
  'where children play',
  'places to relax',
  'historic locations',
  'places that serve food',
  'where people learn',
  'places for entertainment',
  'outdoor destinations',
  'places in a home',
  'sacred places',
  'places that move (vehicles)',
  'imaginary places',
  'abandoned locations',
  'extreme environments',
  'tourist attractions',
  'secret hideaways',

  // Food & Cooking
  'things in a kitchen',
  'breakfast time',
  'sweet treats',
  'spicy flavors',
  'food from the sea',
  'things you bake',
  'summer refreshments',
  'comfort on a cold day',
  'street food culture',
  'things you grill',
  'food that is raw',
  'fermented delicacies',
  'childhood favorites',
  'gourmet cuisine',
  'quick meals',
  'food that is wrapped',
  'things you dip',
  'celebratory foods',
  'food from plants',
  'aged and cured',

  // Human Activities
  'morning routines',
  'ways to exercise',
  'creative pursuits',
  'things people collect',
  'weekend activities',
  'ways to relax',
  'competitive activities',
  'things done in teams',
  'solo adventures',
  'nighttime activities',
  'seasonal traditions',
  'childhood games',
  'adult responsibilities',
  'romantic gestures',
  'ways to celebrate',
  'acts of kindness',
  'risky activities',
  'meditation and mindfulness',
  'learning something new',
  'expressions of art',

  // Objects & Things
  'things with buttons',
  'things that make noise',
  'things that shine',
  'things in pockets',
  'things that spin',
  'things you wear on your head',
  'things made of glass',
  'things that fold',
  'things with wheels',
  'things that float',
  'things that are sharp',
  'things that keep time',
  'things that store information',
  'things that connect',
  'things that protect',
  'things that measure',
  'things that heat',
  'things that cool',
  'vintage objects',
  'futuristic gadgets',

  // Emotions & Feelings
  'moments of joy',
  'things that scare',
  'feelings of love',
  'sources of stress',
  'peaceful moments',
  'exciting experiences',
  'nostalgic memories',
  'proud achievements',
  'embarrassing moments',
  'sources of inspiration',
  'things that comfort',
  'feelings of freedom',
  'moments of surprise',
  'things that frustrate',
  'sources of hope',
  'feelings of belonging',
  'moments of courage',
  'things that relax',
  'expressions of gratitude',
  'feelings of wonder',

  // Time & Seasons
  'spring awakening',
  'summer vibes',
  'autumn harvest',
  'winter wonderland',
  'things from the past',
  'modern innovations',
  'future predictions',
  'ancient wisdom',
  'teenage years',
  'golden age memories',
  'new beginnings',
  'endings and farewells',
  'daily routines',
  'weekly traditions',
  'annual events',
  'once in a lifetime',
  'fleeting moments',
  'timeless classics',
  'trends that come and go',
  'things that last forever',

  // Culture & Society
  'wedding traditions',
  'birthday celebrations',
  'holiday spirit',
  'funeral customs',
  'coming of age',
  'family gatherings',
  'friendship bonds',
  'workplace dynamics',
  'school memories',
  'community events',
  'religious practices',
  'superstitions and beliefs',
  'fashion through decades',
  'music movements',
  'art revolutions',
  'literary worlds',
  'film magic',
  'theater drama',
  'dance expressions',
  'culinary traditions',

  // Science & Discovery
  'space exploration',
  'ocean depths',
  'human anatomy',
  'chemical reactions',
  'physical forces',
  'mathematical patterns',
  'technological breakthroughs',
  'medical advances',
  'natural phenomena',
  'scientific tools',
  'experiments gone wrong',
  'discoveries by accident',
  'theories and hypotheses',
  'inventions that changed the world',
  'mysteries of the universe',
  'evolution of species',
  'climate and weather',
  'geological formations',
  'quantum mysteries',
  'genetic wonders',

  // Fantasy & Imagination
  'mythical creatures',
  'magical powers',
  'enchanted objects',
  'legendary heroes',
  'villains and monsters',
  'fairy tale settings',
  'dream worlds',
  'nightmare fuel',
  'supernatural beings',
  'parallel universes',
  'time travel scenarios',
  'alien encounters',
  'robot uprising',
  'post-apocalyptic survival',
  'medieval fantasy',
  'steampunk aesthetics',
  'cyberpunk futures',
  'underwater kingdoms',
  'floating cities',
  'hidden realms',

  // Sports & Competition
  'olympic glory',
  'team spirit',
  'individual excellence',
  'extreme challenges',
  'water competitions',
  'winter athletics',
  'combat and fighting',
  'racing speed',
  'precision sports',
  'strength and power',
  'endurance tests',
  'ball games',
  'racket sports',
  'target practice',
  'gymnastics grace',
  'dance competitions',
  'e-sports battles',
  'traditional games',
  'backyard fun',
  'playground classics',

  // Professions & Work
  'healing professions',
  'creative careers',
  'dangerous jobs',
  'helping others',
  'building things',
  'teaching and mentoring',
  'protecting people',
  'entertaining audiences',
  'solving problems',
  'leading organizations',
  'creating art',
  'growing food',
  'moving things',
  'fixing broken things',
  'discovering new things',
  'cooking for others',
  'designing spaces',
  'writing stories',
  'coding the future',
  'caring for animals',

  // Abstract Concepts
  'things that are red',
  'things that are round',
  'things that come in pairs',
  'things that are tiny',
  'things that are massive',
  'things that are fast',
  'things that are slow',
  'things that are loud',
  'things that are silent',
  'things that are smooth',
  'things that are rough',
  'things that are transparent',
  'things that are heavy',
  'things that are light',
  'things that are old',
  'things that are new',
  'things that are rare',
  'things that are common',
  'things that are expensive',
  'things that are free',

  // Sensory Experiences
  'delicious aromas',
  'beautiful sounds',
  'soft textures',
  'bright colors',
  'bitter tastes',
  'sweet scents',
  'harsh noises',
  'gentle touches',
  'vibrant visuals',
  'sour flavors',
  'smooth surfaces',
  'loud environments',
  'quiet spaces',
  'warm sensations',
  'cold feelings',
  'spicy experiences',
  'refreshing moments',
  'overwhelming senses',
  'subtle details',
  'intense experiences',

  // Relationships & Connections
  'family bonds',
  'childhood friends',
  'romantic partners',
  'work colleagues',
  'neighbors and community',
  'teachers and students',
  'doctors and patients',
  'strangers who helped',
  'rivals and competitors',
  'mentors and guides',
  'pets and owners',
  'leaders and followers',
  'artists and fans',
  'buyers and sellers',
  'hosts and guests',
  'players and coaches',
  'authors and readers',
  'performers and audiences',
  'creators and critics',
  'friends turned family',

  // Technology & Innovation
  'things that connect us',
  'devices we carry',
  'screens everywhere',
  'smart home living',
  'social media world',
  'gaming universes',
  'streaming entertainment',
  'digital communication',
  'online shopping',
  'virtual reality',
  'artificial intelligence',
  'cloud computing',
  'mobile apps',
  'wearable technology',
  'electric vehicles',
  'renewable energy',
  'space technology',
  'medical devices',
  'security systems',
  'automation everywhere',

  // Life Events & Milestones
  'first day of school',
  'graduation day',
  'first job',
  'moving out',
  'falling in love',
  'getting married',
  'becoming a parent',
  'career changes',
  'buying a home',
  'retirement dreams',
  'overcoming illness',
  'achieving goals',
  'traveling the world',
  'learning to drive',
  'first heartbreak',
  'making amends',
  'starting over',
  'finding purpose',
  'facing fears',
  'saying goodbye',

  // World Cultures
  'Japanese traditions',
  'Italian lifestyle',
  'Brazilian energy',
  'Indian spirituality',
  'French elegance',
  'Mexican fiesta',
  'Chinese heritage',
  'African rhythms',
  'Australian outback',
  'Russian soul',
  'Greek philosophy',
  'Egyptian mysteries',
  'Nordic resilience',
  'Caribbean vibes',
  'Middle Eastern hospitality',
  'Korean innovation',
  'Spanish passion',
  'German precision',
  'British customs',
  'American dreams',

  // Random & Quirky
  'things grandparents love',
  'things that annoy people',
  'guilty pleasures',
  'things people pretend to like',
  'overrated things',
  'underrated treasures',
  'things that smell weird',
  'things that taste better cold',
  'things people argue about',
  'things that always break',
  'things people forget',
  'things people lose',
  'things that stick',
  'things that bounce',
  'things that melt',
  'things that grow',
  'things that shrink',
  'things that change color',
  'things that make people laugh',
  'things that make people cry',

  // Weather & Atmosphere
  'rainy day essentials',
  'sunny day pleasures',
  'stormy weather feelings',
  'foggy morning vibes',
  'snowy landscape elements',
  'windy day experiences',
  'rainbow after the storm',
  'cloudy sky moods',
  'thunder and lightning',
  'perfect weather moments',

  // Health & Body
  'things that heal',
  'body parts we protect',
  'signs of good health',
  'things that hurt',
  'healing remedies',
  'fitness essentials',
  'relaxation for the body',
  'things doctors recommend',
  'natural medicine',
  'body language signals',

  // Money & Value
  'things worth saving for',
  'expensive luxuries',
  'cheap thrills',
  'priceless moments',
  'things money cant buy',
  'smart investments',
  'wasteful spending',
  'hidden treasures',
  'valuable collectibles',
  'financial milestones',

  // Communication & Expression
  'ways to say I love you',
  'body language signals',
  'written messages',
  'spoken words that matter',
  'silent communication',
  'artistic expression',
  'musical messages',
  'visual storytelling',
  'emotional expressions',
  'cultural greetings',

  // Fashion & Style
  'wardrobe essentials',
  'accessories people love',
  'vintage fashion',
  'modern trends',
  'comfortable clothing',
  'formal attire',
  'casual wear',
  'seasonal fashion',
  'fashion mistakes',
  'timeless style pieces',

  // Beauty & Self-Care
  'skincare routines',
  'haircare essentials',
  'makeup favorites',
  'spa day treats',
  'natural beauty',
  'grooming habits',
  'self-care rituals',
  'beauty secrets',
  'morning routines',
  'bedtime rituals',

  // Music & Rhythm
  'musical instruments',
  'song genres',
  'concert experiences',
  'dance rhythms',
  'singing moments',
  'musical memories',
  'favorite melodies',
  'rhythm patterns',
  'live music vibes',
  'karaoke favorites',

  // Literature & Stories
  'book genres',
  'fictional characters',
  'story settings',
  'plot twists',
  'reading spots',
  'library memories',
  'favorite authors',
  'poetry elements',
  'storytelling traditions',
  'bedtime stories',

  // Cinema & Television
  'movie genres',
  'TV show types',
  'cinema snacks',
  'binge-worthy series',
  'classic films',
  'movie theater memories',
  'streaming favorites',
  'documentary topics',
  'animated worlds',
  'film soundtracks',

  // Games & Entertainment
  'board game nights',
  'video game worlds',
  'card game favorites',
  'puzzle challenges',
  'party games',
  'outdoor games',
  'strategy games',
  'word games',
  'trivia categories',
  'gaming memories',

  // Hobbies & Crafts
  'DIY projects',
  'crafting supplies',
  'artistic hobbies',
  'collecting passions',
  'weekend hobbies',
  'creative outlets',
  'hands-on activities',
  'skill-building hobbies',
  'relaxing pastimes',
  'productive hobbies',

  // Garden & Plants
  'flowering plants',
  'garden vegetables',
  'indoor plants',
  'gardening tools',
  'garden creatures',
  'seasonal blooms',
  'herb garden favorites',
  'tree varieties',
  'garden decorations',
  'landscaping elements',

  // Pets & Companions
  'dog breeds',
  'cat behaviors',
  'pet supplies',
  'exotic pets',
  'pet care routines',
  'animal companions',
  'pet tricks',
  'pet food favorites',
  'veterinary visits',
  'pet adoption stories',

  // Ocean & Water
  'beach essentials',
  'ocean creatures',
  'water sports',
  'underwater wonders',
  'coastal landscapes',
  'sailing adventures',
  'fishing experiences',
  'marine ecosystems',
  'wave riding',
  'beach vacation vibes',

  // Mountains & Heights
  'mountain peaks',
  'hiking trails',
  'climbing gear',
  'alpine wildlife',
  'mountain views',
  'camping in mountains',
  'ski resort vibes',
  'high altitude experiences',
  'mountain weather',
  'summit achievements',

  // Travel & Adventure
  'travel destinations',
  'airport experiences',
  'road trip essentials',
  'backpacking adventures',
  'luxury travel',
  'budget travel tips',
  'travel souvenirs',
  'cultural immersion',
  'travel photography',
  'wanderlust triggers',

  // Parties & Celebrations
  'party decorations',
  'celebration foods',
  'party games',
  'festive music',
  'guest list essentials',
  'party themes',
  'celebration drinks',
  'party favors',
  'memorable parties',
  'surprise elements',

  // Gifts & Giving
  'thoughtful gifts',
  'handmade presents',
  'gift wrapping',
  'surprise deliveries',
  'birthday gifts',
  'holiday presents',
  'gift card options',
  'sentimental gifts',
  'practical gifts',
  'luxury gifts',

  // Collections & Antiques
  'vintage collections',
  'rare finds',
  'antique furniture',
  'collectible items',
  'memorabilia types',
  'auction treasures',
  'family heirlooms',
  'historical artifacts',
  'hobby collections',
  'valuable rarities',

  // Mysteries & Secrets
  'unsolved mysteries',
  'hidden places',
  'secret societies',
  'mysterious creatures',
  'unexplained phenomena',
  'detective elements',
  'crime scene clues',
  'conspiracy theories',
  'ancient secrets',
  'cryptic messages',

  // Dreams & Imagination
  'dream symbols',
  'nightmare elements',
  'daydream scenarios',
  'fantasy worlds',
  'imagination triggers',
  'creative visions',
  'wishful thinking',
  'dream destinations',
  'sleep experiences',
  'lucid dreaming',

  // Fears & Phobias
  'common fears',
  'childhood scares',
  'phobia triggers',
  'horror elements',
  'scary creatures',
  'haunted places',
  'fear of the unknown',
  'thrilling scares',
  'creepy things',
  'spine-chilling moments',

  // Morning & Dawn
  'sunrise rituals',
  'breakfast favorites',
  'morning coffee',
  'early bird activities',
  'wake-up routines',
  'morning exercise',
  'commute essentials',
  'productive mornings',
  'peaceful dawns',
  'morning motivation',

  // Night & Darkness
  'nighttime rituals',
  'stargazing elements',
  'nocturnal creatures',
  'moonlight magic',
  'late night snacks',
  'sleep essentials',
  'night owl activities',
  'evening relaxation',
  'twilight moments',
  'midnight adventures',

  // Colors & Patterns
  'rainbow colors',
  'nature patterns',
  'artistic patterns',
  'color combinations',
  'monochrome aesthetics',
  'vibrant hues',
  'pastel shades',
  'geometric patterns',
  'organic shapes',
  'color psychology',

  // Materials & Textures
  'natural materials',
  'synthetic fabrics',
  'smooth surfaces',
  'rough textures',
  'soft materials',
  'hard substances',
  'flexible materials',
  'transparent things',
  'metallic objects',
  'wooden items',

  // Tools & Equipment
  'kitchen tools',
  'garden equipment',
  'office supplies',
  'construction tools',
  'cleaning supplies',
  'art supplies',
  'sports equipment',
  'medical instruments',
  'musical equipment',
  'photography gear',

  // Containers & Storage
  'kitchen containers',
  'storage solutions',
  'decorative boxes',
  'travel bags',
  'organizing bins',
  'food packaging',
  'gift boxes',
  'treasure chests',
  'medicine cabinets',
  'closet organizers',

  // Furniture & Home
  'living room pieces',
  'bedroom essentials',
  'kitchen furniture',
  'outdoor furniture',
  'office furniture',
  'vintage furniture',
  'modern designs',
  'comfortable seating',
  'storage furniture',
  'decorative pieces',

  // Buildings & Structures
  'famous landmarks',
  'architectural styles',
  'ancient structures',
  'modern buildings',
  'religious buildings',
  'residential types',
  'commercial spaces',
  'industrial structures',
  'bridges and tunnels',
  'towers and monuments',

  // Transportation Modes
  'land vehicles',
  'water vessels',
  'air transport',
  'public transit',
  'personal vehicles',
  'emergency vehicles',
  'recreational vehicles',
  'vintage transport',
  'futuristic vehicles',
  'animal transport',

  // Writing & Words
  'writing instruments',
  'literary devices',
  'punctuation marks',
  'word categories',
  'language families',
  'writing styles',
  'poetry forms',
  'narrative elements',
  'dialogue types',
  'written formats',

  // Numbers & Counting
  'lucky numbers',
  'mathematical concepts',
  'counting systems',
  'numerical patterns',
  'statistical terms',
  'measurement units',
  'time measurements',
  'quantity words',
  'ordinal concepts',
  'number symbolism',

  // Rules & Systems
  'game rules',
  'social norms',
  'traffic laws',
  'etiquette rules',
  'workplace policies',
  'school rules',
  'family traditions',
  'cultural customs',
  'legal terms',
  'moral principles',

  // Problems & Solutions
  'everyday problems',
  'creative solutions',
  'technical issues',
  'relationship challenges',
  'health concerns',
  'financial troubles',
  'environmental issues',
  'social problems',
  'workplace challenges',
  'personal struggles',

  // Success & Achievement
  'victory moments',
  'career milestones',
  'personal records',
  'academic achievements',
  'athletic victories',
  'creative accomplishments',
  'financial success',
  'relationship wins',
  'health achievements',
  'life goals reached',

  // Failure & Learning
  'common mistakes',
  'learning moments',
  'failed attempts',
  'second chances',
  'recovery stories',
  'lessons learned',
  'growth from failure',
  'resilience examples',
  'comeback stories',
  'turning points',

  // Opposites & Contrasts
  'hot versus cold',
  'light versus dark',
  'big versus small',
  'fast versus slow',
  'old versus new',
  'hard versus soft',
  'loud versus quiet',
  'near versus far',
  'simple versus complex',
  'natural versus artificial',

  // Beginnings & Origins
  'first experiences',
  'origin stories',
  'starting points',
  'birth moments',
  'creation myths',
  'founding events',
  'pioneering moments',
  'early stages',
  'initial steps',
  'dawn of things',

  // Endings & Conclusions
  'final moments',
  'closing ceremonies',
  'last chapters',
  'farewell rituals',
  'ending traditions',
  'conclusion types',
  'retirement moments',
  'graduation events',
  'sunset experiences',
  'legacy elements',

  // Comfort & Coziness
  'cozy home elements',
  'comfort foods',
  'warm beverages',
  'soft furnishings',
  'relaxation spots',
  'peaceful environments',
  'security feelings',
  'familiar comforts',
  'soothing activities',
  'calming presence',

  // Energy & Excitement
  'adrenaline activities',
  'exciting events',
  'energizing foods',
  'thrilling experiences',
  'motivating factors',
  'power sources',
  'dynamic activities',
  'stimulating environments',
  'action moments',
  'high-energy vibes',

  // Silence & Calm
  'quiet places',
  'meditation spaces',
  'peaceful moments',
  'silent activities',
  'calming sounds',
  'tranquil environments',
  'restful experiences',
  'serene landscapes',
  'mindful moments',
  'stillness feelings',

  // Chaos & Disorder
  'messy situations',
  'chaotic events',
  'disorganized spaces',
  'unpredictable moments',
  'wild experiences',
  'turbulent times',
  'hectic schedules',
  'overwhelming situations',
  'frantic activities',
  'disorder elements',

  // Tradition & Heritage
  'cultural traditions',
  'family customs',
  'holiday rituals',
  'ancestral practices',
  'generational wisdom',
  'traditional foods',
  'ceremonial objects',
  'heritage sites',
  'folklore elements',
  'time-honored practices',

  // Innovation & Change
  'revolutionary ideas',
  'technological advances',
  'social changes',
  'creative innovations',
  'breakthrough moments',
  'paradigm shifts',
  'modern solutions',
  'future trends',
  'transformative events',
  'progressive movements',

  // Solitude & Independence
  'alone time activities',
  'solo travel',
  'independent living',
  'self-reliance skills',
  'personal space',
  'introspective moments',
  'solitary hobbies',
  'quiet reflection',
  'individual pursuits',
  'freedom feelings',

  // Community & Togetherness
  'group activities',
  'team experiences',
  'community events',
  'shared moments',
  'collective celebrations',
  'neighborhood vibes',
  'social gatherings',
  'collaborative projects',
  'unity symbols',
  'belonging feelings',

  // Childhood Memories
  'playground equipment',
  'school supplies',
  'childhood toys',
  'kids cartoons',
  'birthday party elements',
  'summer vacation memories',
  'school lunch favorites',
  'childhood heroes',
  'bedtime routines',
  'imaginary friends',

  // Aging & Wisdom
  'retirement activities',
  'life lessons',
  'generational differences',
  'aging gracefully',
  'wisdom sources',
  'mature perspectives',
  'legacy building',
  'reflection moments',
  'experienced insights',
  'time passage markers',

  // Everyday Objects
  'household items',
  'personal belongings',
  'daily essentials',
  'common tools',
  'ordinary objects',
  'utilitarian things',
  'mundane items',
  'practical objects',
  'functional things',
  'basic necessities',

  // Luxury & Indulgence
  'premium experiences',
  'high-end products',
  'exclusive services',
  'indulgent treats',
  'VIP experiences',
  'luxury brands',
  'extravagant gifts',
  'opulent settings',
  'refined tastes',
  'sophisticated pleasures',

  // Simplicity & Minimalism
  'basic essentials',
  'minimalist design',
  'simple pleasures',
  'uncluttered spaces',
  'essential items',
  'streamlined living',
  'bare necessities',
  'clean aesthetics',
  'simplified routines',
  'less is more concepts',

  // Nature Phenomena
  'natural disasters',
  'weather events',
  'celestial phenomena',
  'geological events',
  'biological wonders',
  'seasonal changes',
  'tidal movements',
  'volcanic activity',
  'aurora displays',
  'eclipse moments',

  // Human Senses
  'visual experiences',
  'auditory pleasures',
  'tactile sensations',
  'olfactory memories',
  'taste experiences',
  'sensory overload',
  'subtle perceptions',
  'heightened awareness',
  'sensory deprivation',
  'synesthesia concepts',

  // Movement & Motion
  'dance moves',
  'athletic motions',
  'travel movements',
  'natural movements',
  'mechanical motions',
  'fluid movements',
  'rhythmic actions',
  'swift motions',
  'graceful movements',
  'powerful actions',

  // Rest & Recovery
  'sleep essentials',
  'nap time favorites',
  'relaxation techniques',
  'recovery methods',
  'rest day activities',
  'peaceful retreats',
  'rejuvenation practices',
  'healing rest',
  'restorative sleep',
  'quiet recovery',

  // Energy Sources
  'natural energy',
  'renewable power',
  'personal energy',
  'motivational sources',
  'caffeine kicks',
  'sugar rushes',
  'exercise energy',
  'mental stimulation',
  'spiritual energy',
  'creative fuel',

  // Protection & Safety
  'safety equipment',
  'protective gear',
  'security measures',
  'defense mechanisms',
  'shelter types',
  'insurance concepts',
  'emergency preparedness',
  'health precautions',
  'digital security',
  'personal safety',

  // Risk & Danger
  'dangerous activities',
  'risky behaviors',
  'hazardous situations',
  'extreme sports',
  'calculated risks',
  'adventurous pursuits',
  'daring feats',
  'dangerous animals',
  'natural hazards',
  'thrill-seeking activities',

  // Memory & Nostalgia
  'childhood memories',
  'nostalgic triggers',
  'memorable moments',
  'forgotten things',
  'memory keepers',
  'photo albums',
  'souvenir collections',
  'time capsules',
  'anniversary markers',
  'reminiscence triggers',

  // Future & Anticipation
  'future predictions',
  'anticipated events',
  'upcoming trends',
  'planned adventures',
  'expected changes',
  'hopeful outcomes',
  'future technology',
  'next generation',
  'forward thinking',
  'visionary concepts',

  // Magic & Wonder
  'magical moments',
  'wondrous discoveries',
  'enchanting places',
  'miraculous events',
  'spellbinding experiences',
  'mystical elements',
  'fairy tale magic',
  'childhood wonder',
  'awe-inspiring sights',
  'magical creatures',

  // Reality & Truth
  'factual information',
  'proven theories',
  'real experiences',
  'truthful moments',
  'authentic encounters',
  'genuine connections',
  'verified facts',
  'realistic expectations',
  'honest expressions',
  'true stories',
];

// Track used inspirations to avoid repetition within a session
const usedInspirations: Set<string> = new Set();

// Function to get a random unused inspiration
const getRandomInspiration = (): string => {
  // If all inspirations have been used, reset the list
  if (usedInspirations.size >= INSPIRATIONS.length) {
    usedInspirations.clear();
  }

  // Filter out used inspirations
  const availableInspirations = INSPIRATIONS.filter(
    (i) => !usedInspirations.has(i)
  );

  // Select a random one
  const inspiration =
    availableInspirations[
      Math.floor(Math.random() * availableInspirations.length)
    ];

  // Mark it as used
  usedInspirations.add(inspiration);

  return inspiration;
};

// Function to reset used inspirations (can be called when starting a new session)
export const resetUsedInspirations = () => {
  usedInspirations.clear();
};

const LANGUAGE_NAMES: Record<Locale, string> = {
  pt: 'Portuguese (Brazil)',
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  es: 'Spanish',
  ru: 'Russian',
  tr: 'Turkish',
  vi: 'Vietnamese',
  pl: 'Polish',
  ro: 'Romanian',
  cs: 'Czech',
  nl: 'Dutch',
  hr: 'Croatian',
  el: 'Greek',
};

// Robust fallback data with enough words to guarantee a valid grid
const FALLBACK_DATA: RawLevel = {
  theme: 'TECNOLOGIA (OFFLINE)',
  words: [
    'INTERNET',
    'COMPUTADOR',
    'MOUSE',
    'TECLADO',
    'MONITOR',
    'WIFI',
    'DADOS',
    'MEMORIA',
    'PROCESSADOR',
    'SOFTWARE',
    'HARDWARE',
    'CAMERA',
    'FONE',
    'GAMER',
    'STREAM',
    'CHAT',
    'BOTAO',
    'CLIQUE',
    'ICONE',
    'PASTA',
    'SERVIDOR',
    'REDE',
    'SISTEMA',
    'ARQUIVO',
    'DIGITAL',
    'CODIGO',
    'PIXEL',
    'TELA',
    'DISCO',
    'NUVEM',
    'LINK',
    'SITE',
    'BLOG',
    'EMAIL',
    'SENHA',
    'LOGIN',
    'PERFIL',
    'VIDEO',
    'AUDIO',
    'TECLA',
  ],
};

export const generateTopicAndWords = async (
  language: Locale = 'pt'
): Promise<RawLevel> => {
  // Return fallback data if no API key is configured
  if (!API_KEY) {
    console.warn('No API key configured, using fallback data');
    return FALLBACK_DATA;
  }

  const model = 'gemini-2.5-flash';

  // Select a random unused inspiration
  const inspiration = getRandomInspiration();
  const randomSeed = Math.floor(Math.random() * 1000000);
  const targetLanguage = LANGUAGE_NAMES[language];

  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        temperature: 1.0, // Reduced temperature slightly for more coherent/common lists
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: {
              type: Type.STRING,
              description: `The theme title in ${targetLanguage} (e.g., 'Frutas', 'Países', 'Cores').`,
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description:
                  'The word answer (uppercase, no spaces, no special chars, normalized).',
              },
            },
          },
          required: ['theme', 'words'],
        },
        systemInstruction: `You are a crossword puzzle generator for a casual livestream game.

        TASK:
        1. Use this creative inspiration to come up with a FRESH, UNIQUE theme: "${inspiration}"
           - DO NOT use the inspiration text directly as the theme name.
           - Create a specific, catchy category name in ${targetLanguage} that is INSPIRED BY but DIFFERENT from the prompt.
           - Examples: "creatures that live underwater" could become "Peixes Tropicais", "Vida Marinha", "Animais do Oceano", "Habitantes do Mar", etc.
           - Be creative! Each theme should feel fresh and unique.
        2. Generate exactly 40 common words related to YOUR CREATED theme in ${targetLanguage}.

        RULES:
        - Theme name must be in ${targetLanguage}, creative, and specific.
        - Words must be in ${targetLanguage}.
        - Words must be common vocabulary that an average person knows.
        - Remove spaces and hyphens from answer words.
        - Words must be between 3 and 12 letters long.
        - Normalize answer words: Remove accents/diacritics (e.g., 'JOÃO' -> 'JOAO', 'MÜNCHEN' -> 'MUNCHEN', 'ÑAME' -> 'NAME').
        - Generate up to 40 words, but not less than 15.
        - Return strictly JSON.`,
      },
      contents: `Generate a new crossword theme and word list in ${targetLanguage}. Random seed: ${randomSeed}`,
    });

    if (response.text) {
      return JSON.parse(response.text) as RawLevel;
    }
    throw new Error('Empty response from AI');
  } catch (error) {
    console.error('AI Generation Error:', error);
    return FALLBACK_DATA;
  }
};
