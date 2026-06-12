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

const DEFAULT_SHEET = `# Character Name

**Class & Level:** 
**Class:** {{CLASS}}
**Background:** 
**Alignment:** 

## Ability Scores
- **STR:** {{STR}}
- **DEX:** {{DEX}}
- **CON:** {{CON}}
- **INT:** {{INT}}
- **WIS:** {{WIS}}
- **CHA:** {{CHA}}

## Combat
- **Armor Class:** 10
- **Initiative:** +0
- **Speed:** 30 ft.
- **Max HP:** 
- **Current HP:** 

## Proficiencies & Languages
- 

## Features & Traits
- 

## Equipment
- 
`;

const DEFAULT_NPC = `# NPC Name

*Medium humanoid, unaligned*

**Armor Class** 10
**Hit Points** 4 (1d8)
**Speed** 30 ft.

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
    const method = args.stats ? parseInt(args.stats, 10) : 4;
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

  if (args.class) {
    const capitalized = args.class.charAt(0).toUpperCase() + args.class.slice(1);
    template = template.replace(new RegExp('{{CLASS}}', 'g'), capitalized);
  } else {
    template = template.replace(new RegExp('{{CLASS}}', 'g'), '');
  }

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
