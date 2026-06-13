const e = require('./lib/encounters');

async function run() {
  const output = await e.generateEncounter({
    system: 'dnd-5e',
    monsters: 'dragon wyrmling (red)=1|ogre=2|goblin=5',
    loot: true
  });
  console.log(output);
}
run();
