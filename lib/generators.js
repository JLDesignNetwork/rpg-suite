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
**Race:** 
**Background:** 
**Alignment:** 

## Ability Scores
- **STR:** 10 (+0)
- **DEX:** 10 (+0)
- **CON:** 10 (+0)
- **INT:** 10 (+0)
- **WIS:** 10 (+0)
- **CHA:** 10 (+0)

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

function generateSheet(customPath) {
  return getTemplate(customPath, DEFAULT_SHEET);
}

function generateNPC(customPath) {
  let template = getTemplate(customPath, DEFAULT_NPC);
  
  // If the template contains stat placeholders, generate random stats and replace them
  if (template.includes('{{STR}}')) {
    const rolledStats = stats(4); // Use standard 4d6 drop lowest
    const formatStat = (score) => {
      const mod = Math.floor((score - 10) / 2);
      return `${score} (${mod >= 0 ? '+' : ''}${mod})`;
    };
    
    if (rolledStats.length === 6) {
      const keys = ['{{STR}}', '{{DEX}}', '{{CON}}', '{{INT}}', '{{WIS}}', '{{CHA}}'];
      for (let i = 0; i < 6; i++) {
        template = template.replace(keys[i], formatStat(rolledStats[i]));
      }
    }
  }
  
  return template;
}

function generateEncounter(customPath) {
  return getTemplate(customPath, DEFAULT_ENCOUNTER);
}

module.exports = {
  generateSheet,
  generateNPC,
  generateEncounter,
  getTemplate
};
