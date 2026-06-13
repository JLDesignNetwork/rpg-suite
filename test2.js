const e = require('./lib/encounters');
async function test() {
  const db = { 'dnd-5e': [] };
  const m = await e.getMonster('Goblin', 'dnd-5e', db);
  console.log('Result:', m);
}
test().catch(console.error);
