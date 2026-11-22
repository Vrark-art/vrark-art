(function () {
  const animation = {
    animals: {
      label: 'Animals',
      children: ['animals-feline', 'animals-canine', 'animals-birds', 'animals-reptiles', 'animals-insects', 'animals-aquatic', 'animals-hoofed', 'animals-small']
    },
    'animals-feline': { label: 'Feline', terms: ['cat', 'feline', 'lion', 'tiger', 'panther', 'leopard', 'jaguar', 'lynx', 'sabretooth'] },
    'animals-canine': { label: 'Canine', terms: ['dog', 'wolf', 'fox', 'hound', 'jackal', 'hyena', 'worg'] },
    'animals-birds': { label: 'Birds', terms: ['bird', 'eagle', 'hawk', 'falcon', 'raven', 'crow', 'vulture', 'phoenix', 'owl', 'chicken', 'turkey'] },
    'animals-reptiles': { label: 'Reptiles', terms: ['lizard', 'snake', 'serpent', 'crocodile', 'alligator', 'turtle', 'tortoise', 'salamander'] },
    'animals-insects': { label: 'Insects and arachnids', terms: ['beetle', 'spider', 'scorpion', 'ant', 'bee', 'wasp', 'moth', 'butterfly', 'centipede', 'insect'] },
    'animals-aquatic': { label: 'Aquatic animals', terms: ['fish', 'shark', 'whale', 'dolphin', 'crab', 'lobster', 'octopus', 'squid', 'jellyfish', 'sea ', 'aquatic'] },
    'animals-hoofed': { label: 'Hoofed animals', terms: ['horse', 'deer', 'elk', 'goat', 'sheep', 'bull', 'cow', 'boar', 'pig', 'camel', 'reindeer', 'donkey', 'mule'] },
    'animals-small': { label: 'Small animals', terms: ['rat', 'mouse', 'rabbit', 'hare', 'squirrel', 'ferret', 'badger'] },
    humanoids: {
      label: 'Humanoids',
      children: ['humanoids-human', 'humanoids-elven', 'humanoids-orcish', 'humanoids-ogre-troll', 'humanoids-giant', 'humanoids-reptilian', 'humanoids-avian']
    },
    'humanoids-human': { label: 'Humans', terms: ['human', 'person', 'knight', 'warrior', 'paladin', 'mage'] },
    'humanoids-elven': { label: 'Elves', terms: ['elf', 'elven'] },
    'humanoids-orcish': { label: 'Orcs and goblinoids', terms: ['orc', 'goblin', 'hobgoblin', 'bugbear'] },
    'humanoids-ogre-troll': { label: 'Ogres and trolls', terms: ['ogre', 'troll'] },
    'humanoids-giant': { label: 'Giants', terms: ['giant', 'cyclops', 'titan'] },
    'humanoids-reptilian': { label: 'Reptilian humanoids', terms: ['lizardman', 'lizard man', 'saurian', 'reptilian', 'dragonman', 'serpent man'] },
    'humanoids-avian': { label: 'Avian humanoids', terms: ['birdman', 'bird man', 'avian', 'harpy', 'winged humanoid'] },
    dragons: { label: 'Dragons', terms: ['dragon', 'drake', 'wyvern', 'wyrm'] },
    demons: { label: 'Demons', terms: ['demon', 'devil', 'fiend', 'imp', 'succubus', 'infern'] },
    undead: { label: 'Undead', terms: ['undead', 'skeleton', 'zombie', 'lich', 'wraith', 'ghost', 'spectre', 'specter', 'vampire', 'mummy', 'bone'] },
    elementals: { label: 'Elementals', terms: ['elemental', 'fire elemental', 'water elemental', 'earth elemental', 'air elemental'] },
    mounts: { label: 'Mounts', terms: ['mount', 'rider', 'ethereal', 'charger'] },
    wearables: {
      label: 'Wearables',
      children: ['wearables-clothing', 'wearables-weapons']
    },
    'wearables-clothing': {
      label: 'Clothing and armour',
      children: ['wearables-boots', 'wearables-pants', 'wearables-robes', 'wearables-jackets', 'wearables-chest', 'wearables-cloaks', 'wearables-helmets', 'wearables-gloves', 'wearables-belts']
    },
    'wearables-boots': { label: 'Boots and footwear', terms: ['boot', 'shoe', 'sandal', 'footwear'] },
    'wearables-pants': { label: 'Pants and leggings', terms: ['pant', 'trouser', 'legging', 'greave'] },
    'wearables-robes': { label: 'Robes', terms: ['robe', 'dress', 'gown'] },
    'wearables-jackets': { label: 'Jackets and coats', terms: ['jacket', 'coat', 'tunic', 'shirt', 'vest'] },
    'wearables-chest': { label: 'Chest armour', terms: ['chest', 'breastplate', 'cuirass', 'plate', 'armor', 'armour'] },
    'wearables-cloaks': { label: 'Cloaks', terms: ['cloak', 'cape', 'mantle'] },
    'wearables-helmets': { label: 'Helmets and headwear', terms: ['helmet', 'helm', 'hat', 'hood', 'crown', 'circlet'] },
    'wearables-gloves': { label: 'Gloves and handwear', terms: ['glove', 'gauntlet', 'mitten'] },
    'wearables-belts': { label: 'Belts', terms: ['belt', 'sash'] },
    'wearables-weapons': {
      label: 'Weapons',
      children: ['weapons-one-handed', 'weapons-two-handed', 'weapons-off-hand']
    },
    'weapons-one-handed': {
      label: 'One-handed weapons',
      children: ['weapons-one-maces', 'weapons-one-swords', 'weapons-one-axes', 'weapons-one-daggers']
    },
    'weapons-one-maces': { label: 'Maces', terms: ['mace', 'club', 'hammer', 'flail'] },
    'weapons-one-swords': { label: 'Swords', terms: ['sword', 'sabre', 'saber', 'rapier', 'scimitar', 'katana'] },
    'weapons-one-axes': { label: 'Axes', terms: ['axe', 'hatchet'] },
    'weapons-one-daggers': { label: 'Daggers', terms: ['dagger', 'knife', 'dirk'] },
    'weapons-two-handed': {
      label: 'Two-handed weapons',
      children: ['weapons-two-axes', 'weapons-two-swords', 'weapons-two-staves', 'weapons-two-polearms', 'weapons-two-spears', 'weapons-two-bows', 'weapons-two-crossbows']
    },
    'weapons-two-axes': { label: 'Axes', terms: ['battleaxe', 'battle axe', 'greataxe', 'great axe'] },
    'weapons-two-swords': { label: 'Swords', terms: ['greatsword', 'great sword', 'zweihander', 'two handed sword'] },
    'weapons-two-staves': { label: 'Staves', terms: ['staff', 'staffs', 'stave'] },
    'weapons-two-polearms': { label: 'Polearms', terms: ['polearm', 'halberd', 'glaive', 'scythe'] },
    'weapons-two-spears': { label: 'Spears', terms: ['spear', 'pike', 'trident', 'lance'] },
    'weapons-two-bows': { label: 'Bows', terms: ['bow', 'longbow', 'shortbow'] },
    'weapons-two-crossbows': { label: 'Crossbows', terms: ['crossbow'] },
    'weapons-off-hand': {
      label: 'Off-hand items',
      children: ['weapons-off-books', 'weapons-off-orbs', 'weapons-off-wands', 'weapons-off-shields']
    },
    'weapons-off-books': { label: 'Books', terms: ['spellbook', 'book'] },
    'weapons-off-orbs': { label: 'Orbs', terms: ['orb'] },
    'weapons-off-wands': { label: 'Wands', terms: ['wand'] },
    'weapons-off-shields': { label: 'Shields', terms: ['shield', 'buckler'] },
    uncategorised: { label: 'Uncategorised', uncategorised: true }
  };

  const statics = {
    furniture: {
      label: 'Furniture',
      children: ['furniture-tables', 'furniture-chairs', 'furniture-beds', 'furniture-cabinets', 'furniture-shelves', 'furniture-benches', 'furniture-other']
    },
    'furniture-tables': { label: 'Tables', terms: ['table', 'desk', 'counter'] },
    'furniture-chairs': { label: 'Chairs', terms: ['chair', 'stool', 'seat', 'throne'] },
    'furniture-beds': { label: 'Beds', terms: ['bed', 'mattress', 'bunk'] },
    'furniture-cabinets': { label: 'Cabinets and cupboards', terms: ['cabinet', 'cupboard', 'wardrobe', 'dresser', 'closet'] },
    'furniture-shelves': { label: 'Shelves', terms: ['shelf', 'shelves', 'bookcase', 'bookshelf'] },
    'furniture-benches': { label: 'Benches', terms: ['bench', 'pew'] },
    'furniture-other': { label: 'Other furniture', terms: ['sofa', 'couch', 'piano', 'bar', 'furniture'] },
    decorations: {
      label: 'Decorations',
      children: ['decorations-statues', 'decorations-banners', 'decorations-books', 'decorations-containers', 'decorations-indoor', 'decorations-outdoor']
    },
    'decorations-statues': { label: 'Statues', terms: ['statue', 'sculpture', 'bust', 'figurine'] },
    'decorations-banners': { label: 'Banners and tapestries', terms: ['banner', 'tapestry', 'flag', 'carpet', 'rug'] },
    'decorations-books': { label: 'Books and scrolls', terms: ['book', 'scroll', 'parchment', 'writing'] },
    'decorations-containers': { label: 'Containers', terms: ['barrel', 'crate', 'chest', 'box', 'basket', 'bag', 'sack', 'container', 'pot', 'urn', 'amphora'] },
    'decorations-indoor': { label: 'Indoor decorations', terms: ['candle', 'lamp', 'mirror', 'painting', 'picture', 'plate', 'cup', 'mug', 'bottle'] },
    'decorations-outdoor': { label: 'Outdoor decorations', terms: ['fountain', 'well', 'sign', 'mailbox', 'brazier', 'lantern'] },
    vegetation: {
      label: 'Vegetation',
      children: ['vegetation-trees', 'vegetation-plants', 'vegetation-flowers', 'vegetation-bushes']
    },
    'vegetation-trees': { label: 'Trees', terms: ['tree', 'palm', 'pine', 'oak', 'willow'] },
    'vegetation-plants': { label: 'Plants', terms: ['plant', 'fern', 'leaf', 'leaves', 'cactus', 'mushroom'] },
    'vegetation-flowers': { label: 'Flowers', terms: ['flower', 'rose', 'lily', 'daisy', 'blossom'] },
    'vegetation-bushes': { label: 'Bushes', terms: ['bush', 'shrub', 'hedge', 'grass', 'vine'] },
    architecture: {
      label: 'Architecture',
      children: ['architecture-walls', 'architecture-doors', 'architecture-roofs', 'architecture-stairs']
    },
    'architecture-walls': { label: 'Walls and floors', terms: ['wall', 'floor', 'tile', 'brick', 'stonework'] },
    'architecture-doors': { label: 'Doors and windows', terms: ['door', 'gate', 'window', 'shutter'] },
    'architecture-roofs': { label: 'Roofs', terms: ['roof', 'roofing', 'eave'] },
    'architecture-stairs': { label: 'Stairs', terms: ['stair', 'step', 'ladder'] },
    'rocks-terrain': { label: 'Rocks and terrain', terms: ['rock', 'stone', 'boulder', 'terrain', 'mountain', 'sand', 'mud', 'snow'] },
    'food-drink': { label: 'Food and drink', terms: ['food', 'bread', 'meat', 'fruit', 'apple', 'cheese', 'cake', 'drink', 'ale', 'wine', 'food'] },
    'tools-household': { label: 'Tools and household objects', terms: ['tool', 'hammer', 'anvil', 'bucket', 'broom', 'shovel', 'needle', 'loom', 'wheel', 'rope'] },
    uncategorised: { label: 'Uncategorised', uncategorised: true }
  };

  function textOf(item) {
    return String(item && item.name || '').toLowerCase().replace(/[_-]+/g, ' ');
  }

  function matches(slug, rules, item) {
    const rule = rules[slug];
    if (!rule) return false;
    if (rule.uncategorised) return !Object.keys(rules).some(key => key !== 'uncategorised' && matches(key, rules, item));
    if (rule.terms && rule.terms.some(term => textOf(item).includes(term))) return true;
    return Boolean(rule.children && rule.children.some(child => matches(child, rules, item)));
  }

  function filter(items, kind, slug) {
    const rules = kind === 'animation' ? animation : statics;
    if (!slug || !rules[slug]) return items;
    return items.filter(item => {
      if (kind === 'animation' && /^(wearables|weapons)/.test(slug) && !/(?:\s*-\s*|_)P$/i.test(String(item.name || ''))) return false;
      return matches(slug, rules, item);
    });
  }

  function categoryList(kind) {
    return kind === 'animation' ? animation : statics;
  }

  window.VRARK_CATEGORY_RULES = { animation, static: statics };
  window.vrarkFilterCategory = filter;
  window.vrarkCategoryList = categoryList;
  window.vrarkCategoryMatches = matches;
})();
