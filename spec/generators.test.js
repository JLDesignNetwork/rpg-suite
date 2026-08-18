/**
 * @since 0.3.0
 * @version 2606.2.0-s
 */

const { generateSheet, generateNPC, generateTracker } = require('../lib/generators');
const { GameMath } = require('../lib/game_math');

describe('RPG Suite Generators', () => {
  it('generates a default character sheet', () => {
    const sheet = generateSheet('');
    expect(sheet).toContain('Character Name');
    expect(sheet).toContain('<b>Hit Points:</b>');
    expect(sheet).toContain('<b>Armor Class:</b>');
  });

  it('generates a default encounter table', () => {
    const table = generateTracker('');
    expect(table).toContain('# Initiative Tracker');
    expect(table).toContain('<b>[Init] Name:</b>');
    expect(table).toContain('<b>HP:</b>');
  });

  it('generates an NPC stat block with pre-rolled stats', () => {
    const npc = generateNPC('');
    expect(npc).toContain('Character Name');
    
    // Ensure the placeholders are gone
    expect(npc).not.toContain('{{STR}}');
    expect(npc).not.toContain('{{CHA}}');
    
    // Ensure actual stat numbers are injected (e.g. " 15 (+2)")
    expect(npc).toMatch(/\d{1,2} \([+\-]\d\)/);
  });

  it('assigns explicit stats when provided in args', () => {
    const npc = generateNPC('', { str: '18', dex: '16', con: '14', int: '12', wis: '10', cha: '8' });
    expect(npc).toContain('18 (+4)');
    expect(npc).toContain('16 (+3)');
    expect(npc).toContain('14 (+2)');
    expect(npc).toContain('12 (+1)');
    expect(npc).toContain('10 (+0)');
    expect(npc).toContain('8 (-1)');
  });

  it('sorts rolled stats by class priority', () => {
    const originalGenerateStats = GameMath.prototype.generateStats;
    
    // Mock the stats roll to a predictable sequence
    GameMath.prototype.generateStats = jest.fn(() => [15, 14, 13, 12, 10, 8]);

    const args = {
      class: 'fighter'
    };
    
    const npc = generateNPC('', args);
    
    // Mapped priorities for D&D 5e fighter (STR, CON, DEX, WIS, CHA, INT):
    // 15 (STR), 14 (CON), 13 (DEX), 12 (WIS), 10 (CHA), 8 (INT)
    expect(npc).toContain('<b>STR:</b> 15 (+2)');
    expect(npc).toContain('<b>DEX:</b> 13 (+1)');
    expect(npc).toContain('<b>CON:</b> 14 (+2)');
    expect(npc).toContain('<b>INT:</b> 8 (-1)');
    expect(npc).toContain('<b>WIS:</b> 12 (+1)');
    expect(npc).toContain('<b>CHA:</b> 10 (+0)');
    
    GameMath.prototype.generateStats = originalGenerateStats; // Restore
  });
});
