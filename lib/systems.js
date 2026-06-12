/**
 * @since 0.6.0
 * @version 0.7.0
 */

// lib/systems.js

const SYSTEMS = {
  'dnd-5e': {
    stats: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
    diceCount: 6,
    priorities: {
      fighter: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
      barbarian: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
      paladin: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
      rogue: ['DEX', 'CON', 'INT', 'WIS', 'CHA', 'STR'],
      ranger: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
      monk: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
      wizard: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
      artificer: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
      cleric: ['WIS', 'CON', 'STR', 'DEX', 'CHA', 'INT'],
      druid: ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
      sorcerer: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
      warlock: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
      bard: ['CHA', 'DEX', 'CON', 'INT', 'WIS', 'STR']
    }
  },
  // Alias for legacy D&D editions which use the same core scaling
  'dnd-4e': { alias: 'dnd-5e' },
  'dnd-3.5': { alias: 'dnd-5e' },
  
  'cyberpunk': { alias: 'cp' },
  'cp': {
    stats: ['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'],
    diceCount: 10,
    priorities: {
      solo: ['REF', 'DEX', 'BODY', 'WILL', 'MOVE', 'COOL', 'EMP', 'TECH', 'INT', 'LUCK'],
      netrunner: ['INT', 'REF', 'DEX', 'WILL', 'TECH', 'COOL', 'LUCK', 'BODY', 'MOVE', 'EMP'],
      tech: ['TECH', 'INT', 'WILL', 'REF', 'DEX', 'BODY', 'COOL', 'MOVE', 'EMP', 'LUCK'],
      medtech: ['TECH', 'INT', 'WILL', 'EMP', 'REF', 'DEX', 'BODY', 'COOL', 'MOVE', 'LUCK'],
      media: ['COOL', 'INT', 'EMP', 'WILL', 'REF', 'DEX', 'TECH', 'BODY', 'MOVE', 'LUCK'],
      rockerboy: ['COOL', 'EMP', 'REF', 'DEX', 'WILL', 'MOVE', 'BODY', 'INT', 'TECH', 'LUCK'],
      nomad: ['REF', 'TECH', 'DEX', 'BODY', 'WILL', 'MOVE', 'COOL', 'INT', 'EMP', 'LUCK'],
      fixer: ['COOL', 'INT', 'EMP', 'WILL', 'TECH', 'REF', 'DEX', 'BODY', 'MOVE', 'LUCK'],
      exec: ['COOL', 'WILL', 'INT', 'EMP', 'TECH', 'REF', 'DEX', 'BODY', 'MOVE', 'LUCK'],
      lawman: ['REF', 'BODY', 'WILL', 'DEX', 'COOL', 'MOVE', 'INT', 'EMP', 'TECH', 'LUCK']
    }
  },
  
  'w40k': {
    stats: ['T', 'I', 'W', 'S', 'A', 'INT', 'Fel'], // Toughness, Initiative, Willpower, Strength, Agility, Intellect, Fellowship
    diceCount: 7,
    priorities: {
      spacemarine: ['T', 'I', 'S', 'W', 'A', 'INT', 'Fel'],
      assassin: ['A', 'I', 'T', 'S', 'W', 'INT', 'Fel'],
      inquisitor: ['INT', 'W', 'T', 'I', 'Fel', 'A', 'S'],
      psyker: ['W', 'T', 'I', 'INT', 'A', 'S', 'Fel'],
      scum: ['A', 'I', 'Fel', 'T', 'W', 'S', 'INT'],
      techpriest: ['INT', 'T', 'W', 'I', 'S', 'A', 'Fel'],
      guardsman: ['T', 'I', 'A', 'W', 'S', 'Fel', 'INT'],
      commissar: ['Fel', 'W', 'T', 'I', 'S', 'A', 'INT']
    }
  },
  
  'rifts': {
    stats: ['IQ', 'ME', 'MA', 'PS', 'PP', 'PE', 'PB', 'Spd'],
    diceCount: 8,
    priorities: {
      glitterboy: ['PP', 'PE', 'PS', 'Spd', 'ME', 'IQ', 'MA', 'PB'],
      cyberknight: ['PP', 'PE', 'ME', 'PS', 'Spd', 'MA', 'IQ', 'PB'],
      leylinewalker: ['ME', 'PE', 'IQ', 'Spd', 'PP', 'MA', 'PB', 'PS'],
      mindmelter: ['ME', 'IQ', 'PE', 'Spd', 'PP', 'MA', 'PB', 'PS'],
      roguescholar: ['IQ', 'MA', 'PE', 'ME', 'PP', 'Spd', 'PB', 'PS'],
      cityrat: ['PP', 'Spd', 'PE', 'IQ', 'ME', 'MA', 'PB', 'PS'],
      juicer: ['PP', 'Spd', 'PE', 'PS', 'ME', 'IQ', 'MA', 'PB'],
      crazies: ['PP', 'Spd', 'PE', 'PS', 'ME', 'IQ', 'MA', 'PB']
    }
  }
};

function getSystem(sysKey) {
  let sys = SYSTEMS[sysKey];
  if (sys && sys.alias) {
    return SYSTEMS[sys.alias];
  }
  return sys || SYSTEMS['dnd-5e']; // safe fallback
}

const SKILLS_DND5E = [
  { name: 'Acrobatics', stat: 'DEX' },
  { name: 'Animal Handling', stat: 'WIS' },
  { name: 'Arcana', stat: 'INT' },
  { name: 'Athletics', stat: 'STR' },
  { name: 'Deception', stat: 'CHA' },
  { name: 'History', stat: 'INT' },
  { name: 'Insight', stat: 'WIS' },
  { name: 'Intimidation', stat: 'CHA' },
  { name: 'Investigation', stat: 'INT' },
  { name: 'Medicine', stat: 'WIS' },
  { name: 'Nature', stat: 'INT' },
  { name: 'Perception', stat: 'WIS' },
  { name: 'Performance', stat: 'CHA' },
  { name: 'Persuasion', stat: 'CHA' },
  { name: 'Religion', stat: 'INT' },
  { name: 'Sleight of Hand', stat: 'DEX' },
  { name: 'Stealth', stat: 'DEX' },
  { name: 'Survival', stat: 'WIS' }
];

const SKILLS_DND4E = [
  { name: 'Acrobatics', stat: 'DEX' },
  { name: 'Arcana', stat: 'INT' },
  { name: 'Athletics', stat: 'STR' },
  { name: 'Bluff', stat: 'CHA' },
  { name: 'Diplomacy', stat: 'CHA' },
  { name: 'Dungeoneering', stat: 'WIS' },
  { name: 'Endurance', stat: 'CON' },
  { name: 'Heal', stat: 'WIS' },
  { name: 'History', stat: 'INT' },
  { name: 'Insight', stat: 'WIS' },
  { name: 'Intimidate', stat: 'CHA' },
  { name: 'Nature', stat: 'WIS' },
  { name: 'Perception', stat: 'WIS' },
  { name: 'Religion', stat: 'INT' },
  { name: 'Stealth', stat: 'DEX' },
  { name: 'Streetwise', stat: 'CHA' },
  { name: 'Thievery', stat: 'DEX' }
];

const SKILLS_DND35 = [
  { name: 'Appraise', stat: 'INT' },
  { name: 'Balance', stat: 'DEX' },
  { name: 'Bluff', stat: 'CHA' },
  { name: 'Climb', stat: 'STR' },
  { name: 'Concentration', stat: 'CON' },
  { name: 'Craft', stat: 'INT' },
  { name: 'Decipher Script', stat: 'INT' },
  { name: 'Diplomacy', stat: 'CHA' },
  { name: 'Disable Device', stat: 'INT' },
  { name: 'Disguise', stat: 'CHA' },
  { name: 'Escape Artist', stat: 'DEX' },
  { name: 'Forgery', stat: 'INT' },
  { name: 'Gather Information', stat: 'CHA' },
  { name: 'Handle Animal', stat: 'CHA' },
  { name: 'Heal', stat: 'WIS' },
  { name: 'Hide', stat: 'DEX' },
  { name: 'Intimidate', stat: 'CHA' },
  { name: 'Jump', stat: 'STR' },
  { name: 'Knowledge', stat: 'INT' },
  { name: 'Listen', stat: 'WIS' },
  { name: 'Move Silently', stat: 'DEX' },
  { name: 'Open Lock', stat: 'DEX' },
  { name: 'Perform', stat: 'CHA' },
  { name: 'Profession', stat: 'WIS' },
  { name: 'Ride', stat: 'DEX' },
  { name: 'Search', stat: 'INT' },
  { name: 'Sense Motive', stat: 'WIS' },
  { name: 'Sleight of Hand', stat: 'DEX' },
  { name: 'Spellcraft', stat: 'INT' },
  { name: 'Spot', stat: 'WIS' },
  { name: 'Survival', stat: 'WIS' },
  { name: 'Swim', stat: 'STR' },
  { name: 'Tumble', stat: 'DEX' },
  { name: 'Use Magic Device', stat: 'CHA' },
  { name: 'Use Rope', stat: 'DEX' }
];

const SKILLS_CP = [
  { name: 'Animal Handling', stat: 'WILL' },
  { name: 'Archery', stat: 'REF' },
  { name: 'Athletics', stat: 'DEX' },
  { name: 'Autofire', stat: 'REF' },
  { name: 'Brawling', stat: 'DEX' },
  { name: 'Conceal/Reveal Object', stat: 'INT' },
  { name: 'Concentration', stat: 'WILL' },
  { name: 'Conversation', stat: 'EMP' },
  { name: 'Criminology', stat: 'INT' },
  { name: 'Cryptography', stat: 'INT' },
  { name: 'Cybertech', stat: 'TECH' },
  { name: 'Dance', stat: 'DEX' },
  { name: 'Deduction', stat: 'INT' },
  { name: 'Drive Land Vehicle', stat: 'REF' },
  { name: 'Education', stat: 'INT' },
  { name: 'Electonics/Security Tech', stat: 'TECH' },
  { name: 'Evasion', stat: 'DEX' },
  { name: 'First Aid', stat: 'TECH' },
  { name: 'Forgery', stat: 'TECH' },
  { name: 'Handgun', stat: 'REF' },
  { name: 'Heavy Weapons', stat: 'REF' },
  { name: 'Human Perception', stat: 'EMP' },
  { name: 'Interrogation', stat: 'COOL' },
  { name: 'Language', stat: 'INT' },
  { name: 'Library Search', stat: 'INT' },
  { name: 'Lip Reading', stat: 'INT' },
  { name: 'Local Expert', stat: 'INT' },
  { name: 'Martial Arts', stat: 'DEX' },
  { name: 'Melee Weapon', stat: 'DEX' },
  { name: 'Paint/Draw/Sculpt', stat: 'TECH' },
  { name: 'Paramedic', stat: 'TECH' },
  { name: 'Perception', stat: 'INT' },
  { name: 'Personal Grooming', stat: 'COOL' },
  { name: 'Persuasion', stat: 'COOL' },
  { name: 'Pilot Air Vehicle', stat: 'REF' },
  { name: 'Pilot Sea Vehicle', stat: 'REF' },
  { name: 'Play Instrument', stat: 'TECH' },
  { name: 'Resist Torture/Drugs', stat: 'WILL' },
  { name: 'Riding', stat: 'REF' },
  { name: 'Science', stat: 'INT' },
  { name: 'Shoulder Arms', stat: 'REF' },
  { name: 'Stealth', stat: 'DEX' },
  { name: 'Streetwise', stat: 'COOL' },
  { name: 'Tactics', stat: 'INT' },
  { name: 'Tracking', stat: 'INT' },
  { name: 'Trading', stat: 'COOL' },
  { name: 'Wardrobe & Style', stat: 'COOL' },
  { name: 'Weaponstech', stat: 'TECH' },
  { name: 'Basic Tech', stat: 'TECH' }
];

const SKILLS_W40K = [
  { name: 'Athletics', stat: 'S' },
  { name: 'Awareness', stat: 'INT' },
  { name: 'Ballistic Skill', stat: 'A' },
  { name: 'Cunning', stat: 'Fel' },
  { name: 'Deception', stat: 'Fel' },
  { name: 'Insight', stat: 'Fel' },
  { name: 'Intimidation', stat: 'W' },
  { name: 'Investigation', stat: 'INT' },
  { name: 'Leadership', stat: 'W' },
  { name: 'Medicae', stat: 'INT' },
  { name: 'Persuasion', stat: 'Fel' },
  { name: 'Pilot', stat: 'A' },
  { name: 'Psychic Mastery', stat: 'W' },
  { name: 'Scholar', stat: 'INT' },
  { name: 'Stealth', stat: 'A' },
  { name: 'Survival', stat: 'W' },
  { name: 'Tech', stat: 'INT' },
  { name: 'Weapon Skill', stat: 'I' }
];

const SKILLS_RIFTS = [
  { name: 'Appraise Goods', stat: 'IQ' },
  { name: 'Basic Electronics', stat: 'IQ' },
  { name: 'Basic Mechanics', stat: 'IQ' },
  { name: 'Climbing', stat: 'PP' },
  { name: 'Computer Operation', stat: 'IQ' },
  { name: 'Concealment', stat: 'IQ' },
  { name: 'Find Contraband', stat: 'IQ' },
  { name: 'First Aid', stat: 'IQ' },
  { name: 'Intelligence', stat: 'IQ' },
  { name: 'Land Navigation', stat: 'IQ' },
  { name: 'Language', stat: 'IQ' },
  { name: 'Math: Basic', stat: 'IQ' },
  { name: 'Pilot: Automobile', stat: 'PP' },
  { name: 'Prowl', stat: 'PP' },
  { name: 'Radio: Basic', stat: 'IQ' },
  { name: 'Streetwise', stat: 'IQ' },
  { name: 'Swimming', stat: 'PS' },
  { name: 'Wilderness Survival', stat: 'IQ' }
];

module.exports = {
  SYSTEMS,
  getSystem,
  SKILLS_DND5E,
  SKILLS_DND4E,
  SKILLS_DND35,
  SKILLS_CP,
  SKILLS_W40K,
  SKILLS_RIFTS
};

