/**
 * @since 0.4.0
 * @version 0.7.0
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { stats } = require('./engine');
const { getSystem, SKILLS_DND5E, SKILLS_DND4E, SKILLS_DND35, SKILLS_CP, SKILLS_W40K, SKILLS_RIFTS } = require('./systems');

function getStatModifier(systemKey, score) {
  const parsed = parseInt(score, 10);
  if (isNaN(parsed)) return '';

  if (systemKey && systemKey.startsWith('dnd')) {
    const mod = Math.floor((parsed - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }
  if (systemKey === 'rifts') {
    if (parsed >= 16) {
      const bonus = (parsed - 15) * 2; 
      return `+${bonus}%`;
    }
    return '+0%';
  }
  return `${parsed}`;
}

function generateSkillsTable(systemKey, assignedStats) {
  let skills = [];
  if (systemKey === 'dnd-5e') skills = SKILLS_DND5E;
  else if (systemKey === 'dnd-4e') skills = SKILLS_DND4E;
  else if (systemKey === 'dnd-3.5') skills = SKILLS_DND35;
  else if (systemKey === 'cyberpunk' || systemKey === 'cp') skills = SKILLS_CP;
  else if (systemKey === 'w40k') skills = SKILLS_W40K;
  else if (systemKey === 'rifts') skills = SKILLS_RIFTS;
  
  if (!skills || skills.length === 0) return '';

  let table = `| Skill | Mod | Bonus | Total | Prof |\n|:---|:---:|:---:|:---:|:---:|\n`;
  skills.forEach(skill => {
    let statUpper = skill.stat.toUpperCase();
    let score = assignedStats[statUpper] || 10;
    let mod = getStatModifier(systemKey, score);
    table += `| ${skill.name} (${statUpper}) | ${mod} | | | [ ] |\n`;
  });
  
  return table;
}

/**
 * Reads a custom template file if provided, otherwise returns the default text.
 */
function getTemplate(customPath, defaultTemplate) {
  if (customPath && typeof customPath === 'string' && customPath.trim() !== '') {
    try {
      let resolvedPath = customPath.trim();
      if (resolvedPath.startsWith('~')) {
        resolvedPath = path.join(os.homedir(), resolvedPath.slice(1));
      }
      if (fs.existsSync(resolvedPath)) {
        return fs.readFileSync(resolvedPath, 'utf8');
      } else {
        console.warn(`RPG Suite: Custom template path not found: ${customPath}`);
      }
    } catch (e) {
      console.error(`RPG Suite: Error reading custom template: ${e.message}`);
    }
  }
  return defaultTemplate;
}

const TEMPLATES = {
  'dnd-5e': {
    sheet: `# Character Sheet\n\n| Name | Class | Level | Alignment |\n|:---|:---|:---:|:---:|\n| {{NAME}} | {{CLASS}} | {{LEVEL}} | {{ALIGNMENT}} |\n\n## Ability Scores\n\n| STR | DEX | CON | INT | WIS | CHA |\n|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{STR}} | {{DEX}} | {{CON}} | {{INT}} | {{WIS}} | {{CHA}} |\n\n## Combat\n\n| AC | Initiative | Speed | Max HP | Current |\n|:---:|:---:|:---:|:---:|:---:|\n| {{AC}} | {{INIT}} | {{SPEED}} | {{HP}} | |\n\n## Skills & Proficiencies\n\n### Languages\n- \n\n### Skills\n{{SKILLS_TABLE}}\n\n## Features & Traits\n\n| Name | Description |\n|:---|:---|\n| | |\n| | |\n\n## Equipment\n\n| Item | Weight | Location | Value | Notes |\n|:---|:---:|:---|:---|:---|\n| | | | | |\n| | | | | |\n| | | | | |\n\n## Background & History\n\n### Background:\n{{BACKGROUND}}\n\n### History:\n- \n`,
    npc: `# {{NAME}}\n\n*Medium humanoid, {{ALIGNMENT}}*\n\n| Armor Class | Hit Points | Speed |\n|:---:|:---:|:---:|\n| {{AC}} | {{HP}} | {{SPEED}} |\n\n| STR | DEX | CON | INT | WIS | CHA |\n|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{STR}} | {{DEX}} | {{CON}} | {{INT}} | {{WIS}} | {{CHA}} |\n\n**Senses** passive Perception 10\n**Languages** Common\n**Challenge** 0 (10 XP)\n\n## Actions\n**Unarmed Strike.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage.\n`
  },
  'cyberpunk': {
    sheet: `# Character Sheet\n\n| Handle | Role |\n|:---|:---|\n| {{HANDLE}} | {{CLASS}} |\n\n## Stats\n\n| INT | REF | DEX | TECH | COOL | WILL | LUCK | MOVE | BODY | EMP |\n|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{INT}} | {{REF}} | {{DEX}} | {{TECH}} | {{COOL}} | {{WILL}} | {{LUCK}} | {{MOVE}} | {{BODY}} | {{EMP}} |\n\n## Combat\n\n| Armor (SP) | Max HP | Current | Seriously Wounded |\n|:---:|:---:|:---:|:---:|\n| | {{HP}} | | |\n\n## Skills\n\n{{SKILLS_TABLE}}\n\n## Cyberware\n\n| Name | Installation | Humanity Loss | Notes |\n|:---|:---|:---:|:---|\n| | | | |\n\n## Equipment & Gear\n\n| Item | Description | Location |\n|:---|:---|:---|\n| | | |\n\n## Lifepath & History\n\n### Background:\n- \n`,
    npc: `# {{NAME}}\n\n**Role:** {{CLASS}}\n\n| INT | REF | DEX | TECH | COOL | WILL | LUCK | MOVE | BODY | EMP |\n|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{INT}} | {{REF}} | {{DEX}} | {{TECH}} | {{COOL}} | {{WILL}} | {{LUCK}} | {{MOVE}} | {{BODY}} | {{EMP}} |\n\n**HP** {{HP}}\n**Weapons**\n- Unarmed: 1d6\n`
  },
  'w40k': {
    sheet: `# Character Sheet\n\n| Name | Archetype | Tier | Species |\n|:---|:---|:---:|:---|\n| {{NAME}} | {{CLASS}} | {{TIER}} | {{SPECIES}} |\n\n## Attributes\n\n| Toughness | Initiative | Willpower | Strength | Agility | Intellect | Fellowship |\n|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{T}} | {{I}} | {{W}} | {{S}} | {{A}} | {{INT}} | {{FEL}} |\n\n## Combat\n\n| Max Wounds | Current Wounds | Max Shock | Current Shock | Resilience | Defence |\n|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{HP}} | | | | {{AC}} | {{DEFENCE}} |\n\n## Skills\n\n{{SKILLS_TABLE}}\n\n## Wargear\n\n| Item | Damage | AP | Range | Traits |\n|:---|:---|:---|:---|:---|\n| | | | | |\n\n## Background & History\n\n### Origin:\n- \n\n### Background:\n- \n`,
    npc: `# {{NAME}}\n\n**Archetype:** {{CLASS}}\n\n| T | I | W | S | A | INT | FEL |\n|:-:|:-:|:-:|:-:|:-:|:-:|:-:|\n| {{T}} | {{I}} | {{W}} | {{S}} | {{A}} | {{INT}} | {{FEL}} |\n\n**Wounds** {{HP}}\n**Resilience** {{AC}}\n**Attacks**\n- Melee: \n- Ranged: \n`
  },
  'rifts': {
    sheet: `# Character Sheet\n\n| Name | O.C.C. / R.C.C. | Level | Alignment |\n|:---|:---|:---:|:---|\n| {{NAME}} | {{CLASS}} | {{LEVEL}} | {{ALIGNMENT}} |\n\n## Attributes\n\n| I.Q. | M.E. | M.A. | P.S. | P.P. | P.E. | P.B. | Spd |\n|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n| {{IQ}} | {{ME}} | {{MA}} | {{PS}} | {{PP}} | {{PE}} | {{PB}} | {{SPD}} |\n\n## Combat\n\n| M.D.C. (Armor) | S.D.C. (Base) | Hit Points | Attacks per Melee |\n|:---:|:---:|:---:|:---:|\n| {{AC}} | | {{HP}} | |\n\n## Skills\n\n{{SKILLS_TABLE}}\n\n## Equipment / Cybernetics\n\n| Item | Notes |\n|:---|:---|\n| | |\n\n## Background & History\n\n### Background:\n- \n`,
    npc: `# {{NAME}}\n\n**O.C.C.:** {{CLASS}}\n\n| IQ | ME | MA | PS | PP | PE | PB | SPD |\n|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|\n| {{IQ}} | {{ME}} | {{MA}} | {{PS}} | {{PP}} | {{PE}} | {{PB}} | {{SPD}} |\n\n**Hit Points** {{HP}}\n**S.D.C.** \n**Attacks per Melee** 2\n`
  }
};

const DEFAULT_TRACKER = `# Initiative Tracker\n\n| Initiative | Name | HP | Max HP | Conditions / Notes |\n|:---:|:---|:---:|:---:|:---:|\n| | | | | |\n| | | | | |\n| | | | | |\n| | | | | |\n`;

function formatStat(score, systemKey) {
  const parsed = parseInt(score, 10);
  if (isNaN(parsed)) return score;
  
  if (systemKey && systemKey.startsWith('dnd')) {
    const mod = Math.floor((parsed - 10) / 2);
    return `${parsed} (${mod >= 0 ? '+' : ''}${mod})`;
  }
  return `${parsed}`;
}

function applyStats(template, args, sys, systemKey) {
  const needsStats = sys.stats.some(s => template.includes(`{{${s.toUpperCase()}}}`));
  if (!needsStats) return template;

  let assignedStats = {};
  let explicitPassed = false;

  sys.stats.forEach(stat => {
    let lowerKey = stat.toLowerCase();
    if (args[lowerKey]) {
      assignedStats[stat.toUpperCase()] = args[lowerKey];
      explicitPassed = true;
    }
  });

  if (!explicitPassed) {
    let defaultMethod = 4;
    if (typeof atom !== 'undefined' && atom.config) {
      defaultMethod = atom.config.get('rpg-suite.diceEngine.defaultStatMethod') || 4;
    }
    
    let methodVal = args.stats !== undefined ? args.stats : args.stat;
    const method = methodVal !== undefined && methodVal !== true ? parseInt(methodVal, 10) : defaultMethod;
    
    const rolled = stats(method, 0, sys.diceCount).sort((a, b) => b - a);
    
    let priorityOrder = sys.stats;
    let className = args.class || args.role || args.archetype || args.occ;
    if (className) {
        className = className.toString().toLowerCase();
        if (sys.priorities[className]) {
            priorityOrder = sys.priorities[className];
        }
    }

    priorityOrder.forEach((statKey, index) => {
      if (index < rolled.length) {
          assignedStats[statKey.toUpperCase()] = rolled[index];
      }
    });
    
    let remainingIndex = priorityOrder.length;
    sys.stats.forEach(statKey => {
      let upperKey = statKey.toUpperCase();
      if (!assignedStats[upperKey] && remainingIndex < rolled.length) {
        assignedStats[upperKey] = rolled[remainingIndex++];
      }
    });
  }

  const skillsTable = generateSkillsTable(systemKey, assignedStats);
  template = template.replace(/\{\{SKILLS_TABLE\}\}/g, skillsTable);

  sys.stats.forEach(stat => {
    const upperKey = stat.toUpperCase();
    const val = assignedStats[upperKey] || 10;
    template = template.replace(new RegExp(`{{${upperKey}}}`, 'g'), formatStat(val, systemKey));
  });

  const skipKeys = ['stats', 'stat', 'priorities', 'system', 'game', ...sys.stats.map(s => s.toLowerCase())];
  Object.keys(args).forEach(key => {
    if (skipKeys.includes(key.toLowerCase())) return;
    
    let val = args[key] === true ? '' : args[key];
    if (key.toLowerCase() === 'class' && val) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    
    template = template.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), val);
  });

  const coreDefaults = {
    'NAME': 'Character Name',
    'CLASS': '',
    'LEVEL': '',
    'BACKGROUND': '',
    'ALIGNMENT': '',
    'AC': '10',
    'INIT': '+0',
    'HP': '',
    'SPEED': '30 ft.',
    'HANDLE': '',
    'TIER': '1',
    'SPECIES': 'Human',
    'DEFENCE': '',
    'SPD': ''
  };

  Object.keys(coreDefaults).forEach(key => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), coreDefaults[key]);
  });

  template = template.replace(/\{\{[A-Z_]+\}\}/g, '');

  return template;
}

function resolveSystem(args) {
    let sysKey = (args.game || args.system || 'dnd-5e').toLowerCase().trim();
    let sys = getSystem(sysKey);
    let actualKey = sysKey;
    if (sysKey === 'dnd-4e' || sysKey === 'dnd-3.5') actualKey = 'dnd-5e';
    if (sysKey === 'cp') actualKey = 'cyberpunk';
    
    return { sys, actualKey, originalKey: sysKey };
}

function generateSheet(customPath, args = {}) {
  const { sys, actualKey, originalKey } = resolveSystem(args);
  let defaultTemplate = TEMPLATES[actualKey] ? TEMPLATES[actualKey].sheet : TEMPLATES['dnd-5e'].sheet;
  let template = getTemplate(customPath, defaultTemplate);
  return applyStats(template, args, sys, originalKey);
}

function generateNPC(customPath, args = {}) {
  const { sys, actualKey, originalKey } = resolveSystem(args);
  let defaultTemplate = TEMPLATES[actualKey] ? TEMPLATES[actualKey].npc : TEMPLATES['dnd-5e'].npc;
  let template = getTemplate(customPath, defaultTemplate);
  return applyStats(template, args, sys, originalKey);
}

function generateTracker(customPath, args = {}) {
  return getTemplate(customPath, DEFAULT_TRACKER);
}

module.exports = {
  generateSheet,
  generateNPC,
  generateTracker,
  getTemplate,
  TEMPLATES
};
