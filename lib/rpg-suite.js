/**
 * @since 0.1.0
 * @version 0.3.0
 */

const { CompositeDisposable } = require('atom');
const { rollDice, stats } = require('./engine');
const generators = require('./generators');

module.exports = {
  subscriptions: null,
  
  // Expose our configuration settings to the Pulsar UI
  config: {
    verbose: {
      title: 'Verbose Output',
      description: 'Append original dice string in parenthesis after roll.',
      type: 'boolean',
      default: false
    },
    defaultDice: {
      title: 'Default Dice',
      description: 'Number of dice to roll when no text is selected.',
      type: 'integer',
      default: 1
    },
    defaultSides: {
      title: 'Default Sides',
      description: 'Number of sides on the dice when no text is selected.',
      type: 'integer',
      default: 20
    },
    forceFateDice: {
      title: 'Fate Dice',
      description: 'Force all dice rolls to use Fate/Fudge logic (-1 to 1).',
      type: 'boolean',
      default: false
    },
    defaultStatMethod: {
      title: 'Stat Generation Rules',
      description: 'Default roll method when you just type "stats". 3 = 3d6, 4 = 4d6-drop-lowest.',
      type: 'integer',
      default: 4,
      enum: [3, 4]
    },
    defaultModifier: {
      title: 'Default Modifier',
      description: 'Modifier to add when no text is selected.',
      type: 'integer',
      default: 0
    },
    customSheetTemplatePath: {
      title: 'Custom Character Sheet Template',
      description: 'Absolute path to a custom Markdown template for Character Sheets. Leave blank to use default.',
      type: 'string',
      default: ''
    },
    customNPCTemplatePath: {
      title: 'Custom NPC Stat Block Template',
      description: 'Absolute path to a custom Markdown template for NPCs. Leave blank to use default. Use {{STR}}, {{DEX}}, etc. for auto-rolled stats.',
      type: 'string',
      default: ''
    },
    customEncounterTemplatePath: {
      title: 'Custom Encounter Table Template',
      description: 'Absolute path to a custom Markdown template for Encounters. Leave blank to use default.',
      type: 'string',
      default: ''
    },
    classStatPriorities: {
      title: 'Class Stat Priorities',
      description: 'JSON defining stat priority order per class.',
      type: 'string',
      default: '{"fighter":["STR","CON","DEX","WIS","CHA","INT"],"wizard":["INT","CON","DEX","WIS","CHA","STR"],"rogue":["DEX","CON","INT","WIS","CHA","STR"],"cleric":["WIS","CON","STR","DEX","CHA","INT"],"barbarian":["STR","CON","DEX","WIS","CHA","INT"],"bard":["CHA","DEX","CON","INT","WIS","STR"],"druid":["WIS","CON","DEX","INT","CHA","STR"],"monk":["DEX","WIS","CON","STR","INT","CHA"],"paladin":["STR","CHA","CON","WIS","DEX","INT"],"ranger":["DEX","WIS","CON","STR","INT","CHA"],"sorcerer":["CHA","CON","DEX","WIS","INT","STR"],"warlock":["CHA","CON","DEX","WIS","INT","STR"]}'
    }
  },

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    // Register all our core suite commands
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rpg-suite:roll': () => this.roll(),
      'rpg-suite:gen-sheet': () => this.injectGenerator('sheet'),
      'rpg-suite:gen-npc': () => this.injectGenerator('npc'),
      'rpg-suite:gen-encounter': () => this.injectGenerator('encounter')
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  injectGenerator(type, args = {}) {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let content = '';
      
      let prioritiesStr = atom.config.get('rpg-suite.classStatPriorities');
      let prioritiesObj = {};
      try {
        if (prioritiesStr) prioritiesObj = JSON.parse(prioritiesStr);
      } catch (e) {
        console.warn('RPG Suite: Invalid JSON in classStatPriorities setting');
      }
      args.priorities = prioritiesObj;
      
      if (type === 'sheet') {
        const customPath = atom.config.get('rpg-suite.customSheetTemplatePath');
        content = generators.generateSheet(customPath, args);
      } else if (type === 'npc') {
        const customPath = atom.config.get('rpg-suite.customNPCTemplatePath');
        content = generators.generateNPC(customPath, args);
      } else if (type === 'encounter') {
        const customPath = atom.config.get('rpg-suite.customEncounterTemplatePath');
        content = generators.generateEncounter(customPath, args);
      }
      
      // Inject the generated template at the cursor
      editor.insertText(content);
    }
  },

  async roll() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let selection = editor.getSelectedText();
      
      if (selection.trim().length === 0) {
        const wordRegex = /[a-zA-Z0-9:\\+\\-\\{\\},]+/g;
        let lineText = editor.lineTextForBufferRow(editor.getCursorBufferPosition().row);
        let cursorCol = editor.getCursorBufferPosition().column;
        let match;
        while ((match = wordRegex.exec(lineText)) !== null) {
          if (cursorCol >= match.index && cursorCol <= match.index + match[0].length) {
            selection = match[0];
            editor.setSelectedBufferRange([
              [editor.getCursorBufferPosition().row, match.index],
              [editor.getCursorBufferPosition().row, match.index + match[0].length]
            ]);
            break;
          }
        }
      }

      if (selection.trim().length === 0) {
        let defDice = atom.config.get('rpg-suite.defaultDice') || 1;
        let defSides = atom.config.get('rpg-suite.defaultSides') || 20;
        let defMod = atom.config.get('rpg-suite.defaultModifier') || 0;
        let modStr = defMod > 0 ? `+${defMod}` : (defMod < 0 ? `${defMod}` : '');
        selection = `${defDice}d${defSides}${modStr}`;
      }

      let expression = selection.trim();
      let lowerExpr = expression.toLowerCase();

      // 1. Smart Router: Generator Commands
      let genMatch = expression.match(/^gen:([a-zA-Z]+)(?:\{(.+)\})?$/i);
      if (genMatch) {
        const genType = genMatch[1].toLowerCase();
        const argString = genMatch[2];
        
        let args = {};
        if (argString) {
          argString.split(',').forEach(pair => {
            let [key, val] = pair.split(':');
            if (key) {
              args[key.trim()] = val ? val.trim() : true;
            }
          });
        }
        
        if (genType === 'sheet' || genType === 'npc' || genType === 'encounter') {
          // Erase the trigger string
          editor.insertText(''); 
          this.injectGenerator(genType, args);
          return;
        }
      }

      // 2. Smart Router: Stat Pools
      let isStat = false;
      let statMethod = atom.config.get('rpg-suite.defaultStatMethod') || 4;

      if (lowerExpr.startsWith('stat')) {
        isStat = true;
        const parts = lowerExpr.split(':');
        if (parts.length > 1) {
          statMethod = parseInt(parts[1], 10);
        }
      }

      // 3. Smart Router: Dice Math
      let resultString = '';
      if (isStat) {
        let statRolls = stats(statMethod);
        const formatStat = (score) => {
          const mod = Math.floor((score - 10) / 2);
          const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
          return `${score.toString().padStart(2, ' ')} (${modStr})`;
        };
        const formatted = statRolls.map(formatStat).join(' | ');
        resultString = 'Ability Score Pool:  ' + formatted;
      } else {
        let dice = 1;
        let sides = 20;
        let modifier = 0;
        let isFate = atom.config.get('rpg-suite.forceFateDice') || false;

        // Parse format like "2d6+4" or "dF" or "1d20-2"
        let match = expression.match(/^(\d*)d([0-9f]+)?([+\-]\d+)?$/i);
        if (match) {
          if (match[1]) dice = parseInt(match[1], 10);
          if (match[2]) {
            if (match[2].toLowerCase() === 'f') {
              isFate = true;
            } else {
              sides = parseInt(match[2], 10);
            }
          }
          if (match[3]) modifier = parseInt(match[3], 10);
        } else {
          // If it's just a modifier like "+4" or "-2", default to 1d20
          if (/^[+\-]\d+$/.test(expression.trim())) {
             modifier = parseInt(expression.trim(), 10);
          }
        }
        
        let rawRoll = rollDice(dice, sides, isFate);
        let total = rawRoll + modifier;
        resultString = total.toString();

        // Inject emojis for Critical Success and Failure on 1d20 rolls
        if (dice === 1 && sides === 20 && !isFate) {
          if (rawRoll === 20) {
            resultString += ' 🎉';
          } else if (rawRoll === 1) {
            resultString += ' 💀';
          }
        }
      }
      
      const verbose = atom.config.get('rpg-suite.verbose');
      let insertStr = resultString;
      if (verbose) {
         insertStr = resultString + ' (' + selection + ')';
      }
      
      editor.moveToEndOfLine();
      editor.insertText('  |  ' + insertStr);
    }
  }
};
