/**
 * @since 0.3.0
 * @version 0.3.0
 */

const { generateSheet, generateNPC, generateEncounter } = require('../lib/generators');

describe('RPG Suite Generators', () => {
  it('generates a default character sheet', () => {
    const sheet = generateSheet('');
    expect(sheet).toContain('# Character Name');
    expect(sheet).toContain('**Armor Class:**');
  });

  it('generates a default encounter table', () => {
    const table = generateEncounter('');
    expect(table).toContain('| Initiative | Name | HP | Max HP | Conditions / Notes |');
  });

  it('generates an NPC stat block with pre-rolled stats', () => {
    const npc = generateNPC('');
    expect(npc).toContain('# NPC Name');
    
    // Ensure the placeholders are gone
    expect(npc).not.toContain('{{STR}}');
    expect(npc).not.toContain('{{CHA}}');
    
    // Ensure actual stat numbers are injected (e.g. " 15 (+2)")
    expect(npc).toMatch(/\\d{1,2} \\([+\\-]\\d\\)/);
  });
});
