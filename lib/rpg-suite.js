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

      let isStat = false;
      let statCount = 0;
      let expression = selection;

      if (selection.toLowerCase().startsWith('stat')) {
        isStat = true;
        const parts = selection.split(':');
        if (parts.length > 1) {
          statCount = parseInt(parts[1], 10);
        } else {
          statCount = 6;
        }
      }

      let resultString = '';
      if (isStat) {
        let statRolls = stats(statCount);
        resultString = 'Ability Score Pool:  ' + statRolls;
      } else {
        resultString = rollDice(expression);
      }
      
      const verbose = atom.config.get('rpg-suite.verbose');
      let insertStr = resultString;
      if (verbose) {
         insertStr = resultString + ' (' + selection + ')';
      }
      
      editor.moveToEndOfLine();
      editor.insertText('\\n' + insertStr);
    }
  }
};
