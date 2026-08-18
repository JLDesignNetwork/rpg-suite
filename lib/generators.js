const fs = require('fs');
const path = require('path');
const os = require('os');
const { getSystem } = require('./systems');
const { GameMath } = require('./game_math');
const { UNIVERSAL_SHEET, UNIVERSAL_NPC, SHARED } = require('./templates');
const { compileTemplate } = require('./compiler');

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

function resolveSystem(args) {
    let sysKey = (args.game || args.system || 'dnd5').toLowerCase().trim();
    let sysData = getSystem(sysKey);
    let gameMath = new GameMath(sysKey, sysData);
    return { gameMath, sysData };
}

function buildContext(args, gameMath, sysData) {
  const assignedStats = {};
  
  if (args.stats && typeof args.stats === 'object') {
    Object.keys(args.stats).forEach(k => {
      assignedStats[k.toUpperCase()] = args.stats[k];
    });
  }
  
  (sysData.attributes || []).forEach(attr => {
    let lowerKey = attr.name.toLowerCase();
    if (args[lowerKey] !== undefined) {
      assignedStats[attr.name.toUpperCase()] = args[lowerKey];
    }
  });

  let className = (args.class || args.role || args.archetype || args.occ || args.occupation || args.clan || 'fighter').toString().toLowerCase();
  
  let priorityOrder = [];
  if (sysData.class_profiles && sysData.class_profiles[className]) {
    let profile = sysData.class_profiles[className];
    priorityOrder = (profile.primary || []).concat(profile.secondary || []);
  } else if (sysData.priorities && sysData.priorities[className]) {
    priorityOrder = sysData.priorities[className];
  } else {
    priorityOrder = (sysData.attributes || []).map(a => a.name);
  }

  let preAssignedCount = 0;
  let preAssignedSum = 0;
  Object.keys(assignedStats).forEach(k => {
    preAssignedCount++;
    preAssignedSum += assignedStats[k];
  });
  args._preAssignedCount = preAssignedCount;
  args._preAssignedSum = preAssignedSum;

  const rolled = gameMath.generateStats(args);

  let rollIndex = 0;
  priorityOrder.forEach((statKey) => {
    let upperKey = statKey.toUpperCase();
    if (assignedStats[upperKey] === undefined && rollIndex < rolled.length) {
        assignedStats[upperKey] = rolled[rollIndex++];
    }
  });
  
  (sysData.attributes || []).forEach(attr => {
    let upperKey = attr.name.toUpperCase();
    if (assignedStats[upperKey] === undefined && rollIndex < rolled.length) {
      assignedStats[upperKey] = rolled[rollIndex++];
    }
  });

  // Build the attributes array for the template
  const attributes = (sysData.attributes || []).map(attr => {
    const upperName = attr.name.toUpperCase();
    const score = assignedStats[upperName] || 10;
    return {
      name: attr.name,
      score: score,
      score_formatted: `${score} (${gameMath.formatStat(score)})`
    };
  });

  // Build the skills array for the template
  const skills_payload = (sysData.skills_payload || []).map(skill => {
    const upperGov = (skill.governing_stat || '').toUpperCase();
    const score = assignedStats[upperGov] || 10;
    return {
      name: skill.name,
      governing_stat: skill.governing_stat,
      base_mod: gameMath.formatStat(score)
    };
  });

  let valClass = args.class || args.role || args.archetype || args.occ || args.occupation || args.clan || '';
  if (valClass && valClass.toLowerCase() === 'random') {
    let availableClasses = [];
    if (sysData.class_profiles) availableClasses = Object.keys(sysData.class_profiles);
    else if (sysData.priorities) availableClasses = Object.keys(sysData.priorities);
    else if (sysData.stat_priorities) availableClasses = Object.keys(sysData.stat_priorities);
    else if (sysData.classes) availableClasses = sysData.classes;
    
    if (availableClasses.length > 0) {
      valClass = availableClasses[Math.floor(Math.random() * availableClasses.length)];
      valClass = valClass.charAt(0).toUpperCase() + valClass.slice(1);
    } else {
      valClass = 'Random Class';
    }
  } else if (typeof valClass === 'string') {
    valClass = valClass.charAt(0).toUpperCase() + valClass.slice(1);
  }

  let resolvedLevel = args.level || args.tier || args.generation || args.rank || args.age || '1';
  let levelInt = parseInt(resolvedLevel, 10);
  let defaultHp = !isNaN(levelInt) ? String(10 * levelInt) : '10';

  let hpValue = args.hp || args.current_hp || args.stamina || args.wounds || args.health || defaultHp;
  let maxHpValue = args.max_hp || args.stamina || args.wounds || args.health || defaultHp;
  
  let hdValue = args.hd || args.hit_dice;
  if (!hdValue && sysData.class_profiles && sysData.class_profiles[valClass.toLowerCase()]) {
    hdValue = sysData.class_profiles[valClass.toLowerCase()].hd || '';
  } else if (!hdValue) {
    hdValue = '';
  }

  let acValue = args.ac || args.armor || args.resilience || '10';
  let speedValue = args.speed || args.movement || args.spd || args.move || '30 ft.';

  let context = {
    ...args,
    system_meta: sysData.system_meta || { name: sysData.alias || "System", health_metric_label: "HP" },
    SYSTEM: sysData.system_meta ? sysData.system_meta.name : "System",
    system: sysData.system_meta ? sysData.system_meta.name : "System",
    unique_blocks: sysData.unique_blocks || [],
    attributes: attributes,
    skills_payload: skills_payload,
    
    name: args.name || args.handle || 'Character Name',
    class: valClass,
    role: valClass,
    archetype: valClass,
    occ: valClass,
    occupation: valClass,
    clan: valClass,
    
    level: resolvedLevel,
    tier: resolvedLevel,
    generation: resolvedLevel,
    rank: resolvedLevel,
    
    current_exp: args.exp || args.current_exp || '0',
    max_exp: args.max_exp || '1000',
    
    current_hp: hpValue,
    max_hp: maxHpValue,
    wounds: hpValue,
    stamina: hpValue,
    health: hpValue,
    
    hunger: args.hunger || '1',
    humanity: args.humanity || '50',
    
    ac: acValue,
    armor: acValue,
    resilience: acValue,
    
    init: args.init || '+0',
    
    speed: speedValue,
    movement: speedValue,
    spd: speedValue,
    move: speedValue,
    
    background: args.background || args.lifepath || '',
    hd: hdValue,
    race: args.race || args.species || '',
    alignment: args.alignment || '',
    languages: args.languages || '',
    religion: args.religion || '',
    place_of_origin: args.place_of_origin || args.origin || '',
    gender: args.gender || '',
    age: args.age || '',
    height: args.height || '',
    weight: args.weight || '',
    eye_color: args.eye_color || '',
    hair_color: args.hair_color || '',
    traits: args.traits || ''
  };

  return context;
}

function generateSheet(customPath, args = {}) {
  const { gameMath, sysData } = resolveSystem(args);
  const context = buildContext(args, gameMath, sysData);
  let defaultTemplate = UNIVERSAL_SHEET;
  let template = getTemplate(customPath, defaultTemplate);
  return compileTemplate(template, context);
}

function generateNPC(customPath, args = {}) {
  const { gameMath, sysData } = resolveSystem(args);
  const context = buildContext(args, gameMath, sysData);
  let defaultTemplate = UNIVERSAL_NPC;
  let template = getTemplate(customPath, defaultTemplate);
  return compileTemplate(template, context);
}

function generateTracker(customPath, args = {}) {
  return getTemplate(customPath, SHARED.TRACKER);
}

module.exports = {
  generateSheet,
  generateNPC,
  generateTracker,
  getTemplate
};
