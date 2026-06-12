/**
 * @since 0.3.0
 * @version 0.3.0
 */

const fs = require('fs');
const { stats } = require('./engine');

/**
 * Reads a custom template file if provided, otherwise returns the default text.
 */
function getTemplate(customPath, defaultTemplate) {
  if (customPath && typeof customPath === 'string' && customPath.trim() !== '') {
    try {
      if (fs.existsSync(customPath)) {
        return fs.readFileSync(customPath, 'utf8');
      } else {
        console.warn(`RPG Suite: Custom template path not found: ${customPath}`);
      }
    } catch (e) {
      console.error(`RPG Suite: Error reading custom template: ${e.message}`);
    }
  }
  return defaultTemplate;
}

const DEFAULT_SHEET = `# {{NAME}}

**Class:** {{CLASS}}
**Level:** {{LEVEL}}
**Background:** {{BACKGROUND}}
**Alignment:** {{ALIGNMENT}}

## Ability Scores
- **STR:** {{STR}}
- **DEX:** {{DEX}}
- **CON:** {{CON}}
- **INT:** {{INT}}
- **WIS:** {{WIS}}
- **CHA:** {{CHA}}

## Combat
- **Armor Class:** {{AC}}
- **Initiative:** +0
- **Speed:** {{SPEED}}
- **Max HP:** {{HP}}
- **Current HP:** 

## Proficiencies & Languages
- 

## Features & Traits
- 

## Equipment
- 
`;

const DEFAULT_NPC = `# {{NAME}}

*Medium humanoid, {{ALIGNMENT}}*

**Armor Class** {{AC}}
**Hit Points** {{HP}}
**Speed** {{SPEED}}

| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| {{STR}} | {{DEX}} | {{CON}} | {{INT}} | {{WIS}} | {{CHA}} |

**Senses** passive Perception 10
**Languages** Common
**Challenge** 0 (10 XP)

## Actions
**Unarmed Strike.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage.
`;

const DEFAULT_ENCOUNTER = `# Encounter

| Initiative | Name | HP | Max HP | Conditions / Notes |
|:---:|:---|:---:|:---:|:---:|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
`;

const STD_ORDER = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

function formatStat(score) {
  const parsed = parseInt(score, 10);
  if (isNaN(parsed)) return score;
  const mod = Math.floor((parsed - 10) / 2);
  return `${parsed} (${mod >= 0 ? '+' : ''}${mod})`;
}

function applyStats(template, args) {
  const needsStats = STD_ORDER.some(s => template.includes(`{{${s}}}`));
  if (!needsStats) return template;

  let assignedStats = {};
  let explicitPassed = false;

  STD_ORDER.forEach(stat => {
    let lowerKey = stat.toLowerCase();
    if (args[lowerKey]) {
      assignedStats[stat] = args[lowerKey];
      explicitPassed = true;
    }
  });

  if (!explicitPassed) {
    let methodVal = args.stats !== undefined ? args.stats : args.stat;
    const method = methodVal !== undefined && methodVal !== true ? parseInt(methodVal, 10) : 4;
    const rolled = stats(method).sort((a, b) => b - a);
    
    let priorityOrder = STD_ORDER;
    if (args.class && args.priorities && args.priorities[args.class]) {
      priorityOrder = args.priorities[args.class].map(s => s.toUpperCase());
    }

    priorityOrder.forEach((statKey, index) => {
      assignedStats[statKey] = rolled[index];
    });
    
    let remainingIndex = priorityOrder.length;
    STD_ORDER.forEach(statKey => {
      if (!assignedStats[statKey] && remainingIndex < rolled.length) {
        assignedStats[statKey] = rolled[remainingIndex++];
      }
    });
  }

  STD_ORDER.forEach(stat => {
    const val = assignedStats[stat] || 10;
    template = template.replace(new RegExp(`{{${stat}}}`, 'g'), formatStat(val));
  });

  // Dynamic Argument Replacement (replaces {{KEY}} with the value passed in args)
  const skipKeys = ['stats', 'stat', 'priorities', ...STD_ORDER.map(s => s.toLowerCase())];
  Object.keys(args).forEach(key => {
    if (skipKeys.includes(key.toLowerCase())) return;
    
    let val = args[key] === true ? '' : args[key];
    if (key.toLowerCase() === 'class' && val) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    
    // Support mapping "name" to {{NAME}} but let NPC default hit if omitted
    template = template.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), val);
  });

  // Clean up any un-passed core defaults
  const coreDefaults = {
    'NAME': 'Character Name',
    'CLASS': '',
    'LEVEL': '',
    'BACKGROUND': '',
    'ALIGNMENT': '',
    'AC': '10',
    'HP': '',
    'SPEED': '30 ft.'
  };

  Object.keys(coreDefaults).forEach(key => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), coreDefaults[key]);
  });

  // Clean up any orphaned placeholder tags that were not passed
  template = template.replace(/\{\{[A-Z_]+\}\}/g, '');

  return template;
}

function generateSheet(customPath, args = {}) {
  let template = getTemplate(customPath, DEFAULT_SHEET);
  return applyStats(template, args);
}

function generateNPC(customPath, args = {}) {
  let template = getTemplate(customPath, DEFAULT_NPC);
  return applyStats(template, args);
}

function generateEncounter(customPath, args = {}) {
  return getTemplate(customPath, DEFAULT_ENCOUNTER);
}

module.exports = {
  generateSheet,
  generateNPC,
  generateEncounter,
  getTemplate
};
