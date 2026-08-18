const fs = require('fs');
const path = require('path');

let SYSTEMS = {};

function getSystem(systemKey) {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'systems.json');
    if (fs.existsSync(dataPath)) {
      SYSTEMS = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (e) {
    console.error("Error loading systems.json", e);
  }

  let key = (systemKey || '').toLowerCase();
  
  if (SYSTEMS[key] && SYSTEMS[key].alias) {
    key = SYSTEMS[key].alias;
  }
  
  return SYSTEMS[key] || SYSTEMS['dnd5']; // fallback to dnd5
}

module.exports = {
  SYSTEMS,
  getSystem
};
