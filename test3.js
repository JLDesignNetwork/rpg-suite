const e = require('./lib/encounters');
async function test() {
  const result = await e.generateEncounter('', { system: 'dnd-5e', monsters: 'goblin=1' });
  console.log(result.substring(0, 500));
}
test().catch(console.error);
