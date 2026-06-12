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

  injectGenerator(type) {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let content = '';
      
      if (type === 'sheet') {
        const customPath = atom.config.get('rpg-suite.customSheetTemplatePath');
        content = generators.generateSheet(customPath);
      } else if (type === 'npc') {
        const customPath = atom.config.get('rpg-suite.customNPCTemplatePath');
        content = generators.generateNPC(customPath);
      } else if (type === 'encounter') {
        const customPath = atom.config.get('rpg-suite.customEncounterTemplatePath');
        content = generators.generateEncounter(customPath);
      }
      
      // Inject the generated template at the cursor
      editor.insertText(content);
    }
  },

  async roll() {
    // Legacy dice rolling logic
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      await atom.commands.dispatch(atom.views.getView(editor), 'bracket-matcher:select-inside-brackets');
      
      let selection = editor.getSelectedText();
      
      if (selection.trim().length === 0) {
        const wordRegex = /[a-zA-Z0-9:\\+\\-]+/g;
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

      if (selection.trim().length === 0) { selection = '1d20'; }

      let expression = selection.trim();
      let lowerExpr = expression.toLowerCase();

      // 1. Smart Router: Generator Commands
      if (lowerExpr.startsWith('gen:')) {
        const genType = lowerExpr.split(':')[1];
        if (genType === 'sheet' || genType === 'npc' || genType === 'encounter') {
          // Erase the 'gen:type' text and inject the markdown template
          editor.insertText(''); 
          this.injectGenerator(genType);
          return;
        }
      }

      // 2. Smart Router: Stat Pools
      let isStat = false;
      let statMethod = 4; // default to 4d6

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
        let isFate = false;

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
        
        let total = rollDice(dice, sides, isFate) + modifier;
        resultString = total.toString();
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
