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
    expect(npc).toMatch(/\d{1,2} \([+\-]\d\)/);
  });

  it('assigns explicit stats when provided in args', () => {
    const npc = generators.generateNPC('', { str: '18', dex: '16', con: '14', int: '12', wis: '10', cha: '8' });
    expect(npc).toContain('18 (+4)');
    expect(npc).toContain('16 (+3)');
    expect(npc).toContain('14 (+2)');
    expect(npc).toContain('12 (+1)');
    expect(npc).toContain('10 (+0)');
    expect(npc).toContain('8 (-1)');
  });

  it('sorts rolled stats by class priority', () => {
    const engine = require('../lib/engine');
    const originalStats = engine.stats;
    
    // Mock the stats roll to a predictable sequence
    engine.stats = jest.fn(() => [15, 14, 13, 12, 10, 8]);

    const args = {
      class: 'fighter',
      priorities: {
        fighter: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT']
      }
    };
    
    const npc = generators.generateNPC('', args);
    
    // Check table order: STR | DEX | CON | INT | WIS | CHA
    // Mapped: 15 (STR), 14 (CON), 13 (DEX), 12 (WIS), 10 (CHA), 8 (INT)
    expect(npc).toContain('| 15 (+2) | 13 (+1) | 14 (+2) | 8 (-1) | 12 (+1) | 10 (+0) |');
    
    engine.stats = originalStats; // Restore
  });
});
