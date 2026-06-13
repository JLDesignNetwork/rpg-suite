/**
 * @since 0.9.0
 * @version 1.0.4
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const generators = require('./generators');

function fetchJson(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 3) return reject(new Error('Too many redirects'));
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: { 'User-Agent': 'Mozilla/5.0 RPG-Suite/1.0' },
      timeout: 3000
    };
    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

function loadLocalDB(customDbPath) {
  let db = {};
  
  // Need to read config dynamically. We're in a Node module, but `atom` is global in Pulsar.
  // Wrap in try/catch just in case it's tested outside atom.
  let dataSource = 'both';
  try {
    dataSource = atom.config.get('rpg-suite.additionalConfiguration.apiSettings.dataSource') || 'both';
  } catch(e) {}

  const loadBuiltIn = (dataSource === 'built_in_only' || dataSource === 'both');
  const loadCustom = (dataSource === 'custom_only' || dataSource === 'both');

  // Load core
  if (loadBuiltIn) {
    try {
      const corePath = path.join(__dirname, '..', 'asset', 'monsters.json');
      if (fs.existsSync(corePath)) {
        db = JSON.parse(fs.readFileSync(corePath, 'utf8'));
      }
    } catch(e) { console.warn("Failed to load core monsters.json", e); }
  }

  // Load custom
  if (loadCustom && customDbPath && typeof customDbPath === 'string' && customDbPath.trim() !== '') {
    try {
      let resolvedPath = customDbPath.trim();
      if (resolvedPath.startsWith('~')) {
        resolvedPath = path.join(os.homedir(), resolvedPath.slice(1));
      }
      if (fs.existsSync(resolvedPath)) {
        const customDb = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
        // Merge
        for (let sys in customDb) {
          if (!db[sys]) db[sys] = [];
          db[sys] = db[sys].concat(customDb[sys]);
        }
      }
    } catch(e) { console.warn("Failed to load custom monsters.json", e); }
  }
  return db;
}

// Utility for dot-notation extraction
function extractValue(obj, path) {
  if (!path) return undefined;
  const keys = path.split('.');
  let current = obj;
  for (let key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

// Dynamic payload mapper
function mapPayload(payload, mapStr, system) {
  let mapping = {};
  if (typeof mapStr === 'string' && mapStr.trim() !== '') {
    try {
      mapping = JSON.parse(mapStr);
    } catch (e) {
      console.warn("Invalid JSON map:", e.message);
    }
  }

  // If no mapping provided, pass directly to local mapper
  if (Object.keys(mapping).length === 0) {
    // We assume the payload might match the local args already, but need to extract name to be safe
    return mapLocalToArgs(payload, system);
  }

  const mappedObj = {};
  for (const [targetKey, sourcePath] of Object.entries(mapping)) {
    if (typeof sourcePath === 'string') {
      mappedObj[targetKey] = extractValue(payload, sourcePath);
    }
  }

  return mapLocalToArgs(mappedObj, system);
}

// Dynamic API Fetcher
async function fetchCustomApi(name, urlTemplate) {
  try {
    const isStatic = !urlTemplate.includes('{name}');
    const url = isStatic ? urlTemplate : urlTemplate.replace(/\{name\}/g, encodeURIComponent(name));
    let data = await fetchJson(url);

    // If static API (full database dump), we must search it client-side
    if (isStatic) {
      let searchArray = null;
      if (Array.isArray(data)) searchArray = data;
      else if (data && data.results && Array.isArray(data.results)) searchArray = data.results;
      
      if (searchArray) {
        let exactMatch = searchArray.find(m => m.name && m.name.toLowerCase() === name.toLowerCase());
        if (exactMatch) return exactMatch;
        let partialMatch = searchArray.find(m => m.name && m.name.toLowerCase().includes(name.toLowerCase()));
        return partialMatch || null;
      }
      return null;
    }

    // REST API Logic (Already filtered by Server)
    // If array returned directly
    if (Array.isArray(data) && data.length > 0) return data[0];

    // If paginated result (like Open5e / OpenHammer)
    if (data && data.results && Array.isArray(data.results)) {
      if (data.results.length === 0) return null;
      
      let exactMatch = data.results.find(m => m.name && m.name.toLowerCase() === name.toLowerCase());
      return exactMatch || null;
    }

    // Fallback for non-paginated single objects
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.name) return data;
    }

    return null;
  } catch (e) {
    console.warn(`API search failed for ${name}: ${e.message}`);
  }
  return null;
}

// Find a monster locally
function searchLocal(db, system, name) {
  let sysKey = system;
  if (sysKey === 'dnd-4e' || sysKey === 'dnd-3.5') sysKey = 'dnd-5e';
  if (sysKey === 'cp') sysKey = 'cyberpunk';
  
  if (!db[sysKey]) return null;
  const list = db[sysKey];
  
  // Exact or partial match
  let match = list.find(m => m.name && m.name.toLowerCase() === name.toLowerCase());
  if (!match) {
    match = list.find(m => m.name && m.name.toLowerCase().includes(name.toLowerCase()));
  }
  return match;
}

// Convert Open5e format to our internal args
function mapOpen5eToArgs(monster, system) {
  let speedStr = "30 ft.";
  if (monster.speed) {
    if (typeof monster.speed === 'string') speedStr = monster.speed;
    else if (typeof monster.speed === 'object') {
      speedStr = Object.entries(monster.speed).map(([k,v]) => `${k} ${v}`).join(', ');
    }
  }

  let actionsStr = "**Unarmed Strike.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage.";
  if (monster.actions) {
    actionsStr = monster.actions.map(a => `**${a.name}.** ${a.desc}`).join("\n\n");
  }

  return {
    system: system,
    name: monster.name,
    ac: monster.armor_class,
    hp: monster.hit_points,
    speed: speedStr,
    str: monster.strength,
    dex: monster.dexterity,
    con: monster.constitution,
    int: monster.intelligence,
    wis: monster.wisdom,
    cha: monster.charisma,
    alignment: monster.alignment || 'neutral',
    size: monster.size || 'Medium',
    type: monster.type || 'humanoid',
    cr: monster.challenge_rating,
    actions: actionsStr
  };
}

// Convert local format to our internal args
function mapLocalToArgs(monster, system) {
  return {
    system: system,
    name: monster.name || 'Unknown Entity',
    ac: monster.ac || 10,
    hp: monster.hp || 10,
    speed: monster.speed || '30 ft.',
    str: monster.str || 10,
    dex: monster.dex || 10,
    con: monster.con || 10,
    int: monster.int || 10,
    wis: monster.wis || 10,
    cha: monster.cha || 10,
    alignment: monster.alignment || 'neutral',
    size: monster.size || 'Medium',
    type: monster.type || 'humanoid',
    cr: monster.cr || 1,
    actions: monster.actions || "**Unarmed Strike.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage."
  };
}

async function getMonster(name, system, localDb) {
  let dataSource = 'both';
  let apiSource = 'all';
  let customUrl = '';
  let customMap = '{}';
  
  try {
    dataSource = atom.config.get('rpg-suite.additionalConfiguration.apiSettings.dataSource') || 'both';
    apiSource = atom.config.get('rpg-suite.additionalConfiguration.apiSettings.apiSource') || 'all';

    let sysKey = system;
    if (sysKey === 'dnd-4e' || sysKey === 'dnd-3.5') sysKey = 'dnd-5e';
    if (sysKey === 'cp') sysKey = 'cyberpunk';
    
    let endpointKey = 'systems.dnd.api.endpoint';
    let mapKey = 'systems.dnd.api.jsonMap';
    if (sysKey === 'cyberpunk') { endpointKey = 'systems.cyberpunk.api.endpoint'; mapKey = 'systems.cyberpunk.api.jsonMap'; }
    if (sysKey === 'w40k') { endpointKey = 'systems.w40k.api.endpoint'; mapKey = 'systems.w40k.api.jsonMap'; }
    if (sysKey === 'rifts') { endpointKey = 'systems.rifts.api.endpoint'; mapKey = 'systems.rifts.api.jsonMap'; }
    
    customUrl = atom.config.get(`rpg-suite.${endpointKey}`);
    customMap = atom.config.get(`rpg-suite.${mapKey}`);
  } catch(e) {}

  const tryUserApi = (dataSource === 'custom_only' || dataSource === 'both') && customUrl && customUrl.trim() !== '';
  const tryOpen5e = (dataSource === 'built_in_only' || dataSource === 'both') && apiSource === 'all' && system.startsWith('dnd-');

  // 1. Try User API
  if (tryUserApi) {
    const apiMonster = await fetchCustomApi(name, customUrl);
    if (apiMonster) {
      // If the map is completely empty, it assumes local DB schema. 
      // If it's D&D and empty map, fallback to mapOpen5eToArgs just in case they used the default API URL but overrode it somehow.
      if (system.startsWith('dnd-') && (!customMap || customMap.trim() === '{}')) {
        return mapOpen5eToArgs(apiMonster, system);
      }
      return mapPayload(apiMonster, customMap, system);
    }
  }

  // 2. Try Open5e Built-in
  if (tryOpen5e && !tryUserApi) { // Don't try Open5e if user explicitly provided a custom D&D URL
    const apiMonster = await fetchCustomApi(name, `https://api.open5e.com/v1/monsters/?search={name}`);
    if (apiMonster) return mapOpen5eToArgs(apiMonster, system);
  }
  
  // 3. Fallback to local DB (which was already routed correctly in loadLocalDB)
  const localMonster = searchLocal(localDb, system, name);
  if (localMonster) {
    return mapLocalToArgs(localMonster, system);
  }
  
  // Ultimate fallback
  return mapLocalToArgs({ name: name }, system);
}

// Pick random monsters from local DB summing to target CR
function pickRandomLocal(localDb, system, targetCR, env) {
  let sysKey = system;
  if (sysKey === 'dnd-4e' || sysKey === 'dnd-3.5') sysKey = 'dnd-5e';
  if (sysKey === 'cp') sysKey = 'cyberpunk';
  
  if (!localDb[sysKey]) return [];
  
  let pool = localDb[sysKey];
  if (env && env !== true) {
    pool = pool.filter(m => m.env && m.env.includes(env.toLowerCase()));
  }
  if (pool.length === 0) pool = localDb[sysKey]; // fallback if env filters out everything
  
  let selected = [];
  let currentCR = 0;
  
  // Sort pool by CR so we don't accidentally grab a massive boss first if targetCR is low
  pool = pool.sort((a,b) => (a.cr || 1) - (b.cr || 1));
  
  let attempts = 0;
  while (currentCR < targetCR && attempts < 50) {
    attempts++;
    // filter to monsters that won't blow the budget
    const valid = pool.filter(m => currentCR + (m.cr || 1) <= targetCR + 1); // allow slight overflow
    if (valid.length === 0) break;
    
    // Pick random from valid
    const pick = valid[Math.floor(Math.random() * valid.length)];
    selected.push(pick);
    currentCR += (pick.cr || 1);
  }
  
  if (selected.length === 0 && pool.length > 0) {
    selected.push(pool[0]); // at least give them something
  }
  
  return selected;
}

async function generateEncounter(customDbPath, args) {
  const localDb = loadLocalDB(customDbPath);
  const system = (args.game || args.system || 'dnd-5e').toLowerCase();
  
  // Calculate Target CR
  let targetCR = 1;
  if (args.cr && args.cr !== true) {
    targetCR = parseFloat(args.cr);
  } else if (args.party && args.level && args.party !== true && args.level !== true) {
    const party = parseInt(args.party, 10);
    const level = parseInt(args.level, 10);
    targetCR = Math.max(0.25, (party * level) / 4);
  }
  
  let monstersList = []; // Array of mapped args

  // 1. Explicit Monsters Check
  if (args.monsters && typeof args.monsters === 'string') {
    // format: goblin=3|orc=1 or goblin:3|orc:1
    // since our arg parser splits by colon, the user might pass goblin=3|orc=1
    const pairs = args.monsters.split('|');
    const fetchPromises = pairs.map(async pair => {
      let [name, countStr] = pair.split(/[=:]/);
      let count = parseInt(countStr || "1", 10);
      if (isNaN(count)) count = 1;
      if (count < 1) count = 1;
      let safeCount = Math.min(count, 50);
      let m = await getMonster(name.trim(), system, localDb);
      return { count: safeCount, m };
    });
    
    const results = await Promise.all(fetchPromises);
    for (const res of results) {
      for (let i = 0; i < res.count; i++) monstersList.push(res.m);
    }
  } 
  else {
    // 2. Random Generation
    const skeletons = pickRandomLocal(localDb, system, targetCR, args.env);
    
    // Deduplicate API requests to avoid redundant fetches
    const uniqueNamesObj = {};
    for (const skel of skeletons) uniqueNamesObj[skel.name] = true;
    
    // Fetch unique skeletons in parallel
    const fetchedData = {};
    await Promise.all(Object.keys(uniqueNamesObj).map(async name => {
      fetchedData[name] = await getMonster(name, system, localDb);
    }));
    
    // Reconstruct the full list
    for (const skel of skeletons) {
      monstersList.push(fetchedData[skel.name]);
    }
  }
  
  // Build Outputs
  let trackerOut = `# Initiative Tracker\n\n`;
  if (args.env && args.env !== true) trackerOut += `**Environment:** ${args.env.charAt(0).toUpperCase() + args.env.slice(1)}\n`;
  
  if (args.adv) {
    const advStr = String(args.adv).toLowerCase();
    if (advStr === 'players' || advStr === 'monsters') {
      trackerOut += `**Advantage:** ${advStr.charAt(0).toUpperCase() + advStr.slice(1)}\n`;
    }
  }
  
  // Calculate total CR of the generated monsters for loot
  const actualCR = monstersList.reduce((sum, m) => sum + parseFloat(m.cr || 0), 0);
  
  if (args.loot && args.loot !== 'false' && args.loot !== false) {
    let multi = 1;
    if (typeof args.loot === 'string' && args.loot.startsWith('true-')) {
       multi = parseFloat(args.loot.split('-')[1]) || 1;
       // Ensure multiplier is between 1 and 5
       multi = Math.max(1, Math.min(5, multi));
    }
    // Basic loot calc
    const gold = Math.floor((actualCR * (Math.random() * 50 + 10)) * multi);
    trackerOut += `**Encounter Loot:** ${gold} Gold Pieces, plus mundane gear.\n`;
  }
  
  trackerOut += `\n| Initiative | Name | HP | Max HP | Conditions / Notes |\n|:---:|:---|:---:|:---:|:---:|\n`;
  
  // Group monsters by name for numbered suffixes
  const nameCounts = {};
  monstersList.forEach(m => {
    if (!nameCounts[m.name]) nameCounts[m.name] = 0;
    nameCounts[m.name]++;
    m.displayName = nameCounts[m.name] > 1 || monstersList.filter(x => x.name === m.name).length > 1 
                    ? `${m.name} ${nameCounts[m.name]}` 
                    : m.name;
    
    trackerOut += `| | ${m.displayName} | ${m.hp} | ${m.hp} | |\n`;
  });
  
  // Append 4 empty rows for player characters
  for(let i=0; i<4; i++) {
    trackerOut += `| | | | | |\n`;
  }
  
  let statsOut = `\n## Quick Stats\n\n`;
  // Only generate one stat block per unique monster type to avoid huge walls of text
  const uniqueNames = [];
  monstersList.forEach(m => {
    if (!uniqueNames.includes(m.name)) {
      uniqueNames.push(m.name);
      let npcBlock = generators.generateNPC('', m);
      // Shift headings down by 2 levels to nest properly under "## Quick Stats"
      npcBlock = npcBlock.replace(/^(#+)\s/gm, (match, hashes) => `${hashes}## `);
      statsOut += npcBlock + `\n---\n`;
    }
  });

  return trackerOut + statsOut;
}

module.exports = {
  generateEncounter,
  fetchJson,
  fetchCustomApi,
  mapPayload,
  mapOpen5eToArgs
};
