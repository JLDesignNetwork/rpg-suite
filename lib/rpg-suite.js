/**
 * @since 0.1.0
 * @version 1.0.0
 */

const { CompositeDisposable } = require('atom');
const { rollDice, stats } = require('./engine');
const generators = require('./generators');

module.exports = {
  subscriptions: null,

  // Expose our configuration settings to the Pulsar UI
  config: {
    diceEngine: {
      type: 'object',
      title: '🎲 Dice Engine',
      collapsed: true,
      order: 1,
      properties: {
        diceRollDefaults: {
          type: 'object',
          title: 'Dice Roll Defaults',
          collapsed: true,
          order: 1,
          properties: {
            defaultDice: { title: 'Default Dice', description: 'Number of dice to roll when no text is selected.', type: 'integer', default: 1, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            defaultSides: { title: 'Default Sides', description: 'Number of sides on the dice when no text is selected.', type: 'integer', default: 20, enum: [4, 6, 8, 10, 12, 20, 30, 50, 100] },
            defaultModifier: { title: 'Default Modifier', description: 'Modifier to add when no text is selected.', type: 'integer', default: 0 }
          }
        },
        statGeneration: {
          type: 'object',
          title: 'Stat Generation',
          collapsed: true,
          order: 2,
          properties: {
            defaultStatMethod: { title: 'Default Generation Method', description: 'Default roll method when you type "stats". strict 3d6, or 4d6 and drop-lowest.', type: 'integer', default: 4, enum: [{ value: 3, description: '3d6' }, { value: 4, description: '4d6 drop lowest' }] },
            statPriorityMap: { title: 'Stat Priority Map', description: 'JSON defining stat priority order per class.', type: 'string', default: '{"fighter":["STR","CON","DEX","WIS","CHA","INT"],"wizard":["INT","CON","DEX","WIS","CHA","STR"],"rogue":["DEX","CON","INT","WIS","CHA","STR"],"cleric":["WIS","CON","STR","DEX","CHA","INT"],"barbarian":["STR","CON","DEX","WIS","CHA","INT"],"bard":["CHA","DEX","CON","INT","WIS","STR"],"druid":["WIS","CON","DEX","INT","CHA","STR"],"monk":["DEX","WIS","CON","STR","INT","CHA"],"paladin":["STR","CHA","CON","WIS","DEX","INT"],"ranger":["DEX","WIS","CON","STR","INT","CHA"],"sorcerer":["CHA","CON","DEX","WIS","INT","STR"],"warlock":["CHA","CON","DEX","WIS","INT","STR"]}' }
          }
        },
        additionalSettings: {
          type: 'object',
          title: 'Additional Settings',
          collapsed: true,
          order: 3,
          properties: {
            forceFateDice: { title: 'Use Fate/Fudge Dice', description: 'Force all dice rolls to use Fate/Fudge logic (-1 to 1).', type: 'boolean', default: false },
            verbose: { title: 'Verbose Mode', description: 'Append original dice string in parenthesis after roll.', type: 'boolean', default: false }
          }
        }
      }
    },
    systems: {
      type: 'object',
      title: '🛡️ Systems',
      collapsed: true,
      order: 2,
      properties: {
        cyberpunk: {
          type: 'object',
          title: 'Cyberpunk Red',
          collapsed: true,
          order: 1,
          properties: {
            templates: {
              type: 'object',
              title: 'Custom Templates',
              collapsed: true,
              order: 1,
              properties: {
                customCharacterSheet: { title: 'Custom Character Sheet (.md)', description: 'Absolute path to custom Character Sheet template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" },
                customNpcSheet: { title: 'Custom NPC Sheet (.md)', description: 'Absolute path to custom NPC template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" }
              }
            },
            api: {
              type: 'object',
              title: 'User-Defined API',
              collapsed: true,
              order: 2,
              properties: {
                endpoint: { title: 'Endpoint URL', description: 'URL for custom API (use {name} as placeholder).', type: 'string', default: '', pattern: "^(https?:\\/\\/.*)?$" },
                jsonMap: { title: 'JSON Map', description: 'JSON object mapping custom API fields to internal keys.', type: 'string', default: '{}' }
              }
            }
          }
        },
        dnd: {
          type: 'object',
          title: 'D&D 5e',
          collapsed: true,
          order: 2,
          properties: {
            templates: {
              type: 'object',
              title: 'Custom Templates',
              collapsed: true,
              order: 1,
              properties: {
                customCharacterSheet: { title: 'Custom Character Sheet (.md)', description: 'Absolute path to custom Character Sheet template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" },
                customNpcSheet: { title: 'Custom NPC Sheet (.md)', description: 'Absolute path to custom NPC template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" }
              }
            },
            api: {
              type: 'object',
              title: 'User-Defined API',
              collapsed: true,
              order: 2,
              properties: {
                endpoint: { title: 'Endpoint URL', description: 'URL for custom API (use {name} as placeholder).', type: 'string', default: '', pattern: "^(https?:\\/\\/.*)?$" },
                jsonMap: { title: 'JSON Map', description: 'JSON object mapping custom API fields to internal keys.', type: 'string', default: '{}' }
              }
            }
          }
        },
        rifts: {
          type: 'object',
          title: 'Rifts / Palladium',
          collapsed: true,
          order: 3,
          properties: {
            templates: {
              type: 'object',
              title: 'Custom Templates',
              collapsed: true,
              order: 1,
              properties: {
                customCharacterSheet: { title: 'Custom Character Sheet (.md)', description: 'Absolute path to custom Character Sheet template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" },
                customNpcSheet: { title: 'Custom NPC Sheet (.md)', description: 'Absolute path to custom NPC template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" }
              }
            },
            api: {
              type: 'object',
              title: 'User-Defined API',
              collapsed: true,
              order: 2,
              properties: {
                endpoint: { title: 'Endpoint URL', description: 'URL for custom API (use {name} as placeholder).', type: 'string', default: '', pattern: "^(https?:\\/\\/.*)?$" },
                jsonMap: { title: 'JSON Map', description: 'JSON object mapping custom API fields to internal keys.', type: 'string', default: '{}' }
              }
            }
          }
        },
        w40k: {
          type: 'object',
          title: 'Warhammer 40K',
          collapsed: true,
          order: 4,
          properties: {
            templates: {
              type: 'object',
              title: 'Custom Templates',
              collapsed: true,
              order: 1,
              properties: {
                customCharacterSheet: { title: 'Custom Character Sheet (.md)', description: 'Absolute path to custom Character Sheet template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" },
                customNpcSheet: { title: 'Custom NPC Sheet (.md)', description: 'Absolute path to custom NPC template.', type: 'string', default: '', pattern: "^(.*\\.md)?$" }
              }
            },
            api: {
              type: 'object',
              title: 'User-Defined API',
              collapsed: true,
              order: 2,
              properties: {
                endpoint: { title: 'Endpoint URL', description: 'URL for custom API (use {name} as placeholder).', type: 'string', default: '', pattern: "^(https?:\\/\\/.*)?$" },
                jsonMap: { title: 'JSON Map', description: 'JSON object mapping custom API fields to internal keys.', type: 'string', default: '{}' }
              }
            }
          }
        }
      }
    },
    additionalConfiguration: {
      type: 'object',
      title: '⚙️ Additional Configuration',
      collapsed: true,
      order: 3,
      properties: {
        apiSettings: {
          type: 'object',
          title: 'API Settings',
          collapsed: true,
          order: 1,
          properties: {
            apiSource: {
              title: 'API Selection',
              description: 'Which APIs should be queried?',
              type: 'string',
              default: 'all',
              enum: [{ value: 'user_only', description: 'User-defined APIs only' }, { value: 'all', description: 'User-defined APIs + Open5e fallback' }]
            },
            dataSource: {
              title: 'Database Selection',
              description: 'Which databases should be queried during encounter generation?',
              type: 'string',
              default: 'both',
              enum: [{ value: 'built_in_only', description: 'Built-in Defaults Only' }, { value: 'custom_only', description: 'Custom User Data Only' }, { value: 'both', description: 'Use All Available Sources' }]
            },
          },
        },
        moreTemplates: {
          type: 'object',
          title: 'More Templates',
          collapsed: true,
          order: 2,
          properties: {
            customMonstersDB: {
              title: 'Custom Monsters Database (.json)',
              description: 'Absolute path to a custom JSON file containing your own monsters.',
              type: 'string',
              default: '',
              pattern: "^(.*\\.json)?$"
            },
            trackerTemplate: {
              title: 'Initiative Tracker Template (.md)',
              description: 'Absolute path to a custom Initiative Tracker template.',
              type: 'string',
              default: '',
              pattern: "^(.*\\.md)?$"
            }
          }
        }
      }
    }
  },

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    // Register all our core suite commands
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rpg-suite:roll': () => this.roll(),
      'rpg-suite:gen-sheet': () => this.injectGenerator('sheet'),
      'rpg-suite:gen-sheet-dnd5e': () => this.injectGenerator('sheet', { system: 'dnd-5e' }),
      'rpg-suite:gen-sheet-dnd4e': () => this.injectGenerator('sheet', { system: 'dnd-4e' }),
      'rpg-suite:gen-sheet-dnd35': () => this.injectGenerator('sheet', { system: 'dnd-3.5' }),
      'rpg-suite:gen-sheet-cyberpunk': () => this.injectGenerator('sheet', { system: 'cyberpunk' }),
      'rpg-suite:gen-sheet-w40k': () => this.injectGenerator('sheet', { system: 'w40k' }),
      'rpg-suite:gen-sheet-rifts': () => this.injectGenerator('sheet', { system: 'rifts' }),
      'rpg-suite:gen-npc': () => this.injectGenerator('npc'),
      'rpg-suite:gen-npc-dnd5e': () => this.injectGenerator('npc', { system: 'dnd-5e' }),
      'rpg-suite:gen-npc-dnd4e': () => this.injectGenerator('npc', { system: 'dnd-4e' }),
      'rpg-suite:gen-npc-dnd35': () => this.injectGenerator('npc', { system: 'dnd-3.5' }),
      'rpg-suite:gen-npc-cyberpunk': () => this.injectGenerator('npc', { system: 'cyberpunk' }),
      'rpg-suite:gen-npc-w40k': () => this.injectGenerator('npc', { system: 'w40k' }),
      'rpg-suite:gen-npc-rifts': () => this.injectGenerator('npc', { system: 'rifts' }),
      'rpg-suite:gen-tracker': () => this.injectGenerator('tracker'),
      'rpg-suite:gen-encounter': () => this.injectGenerator('encounter'),
      'rpg-suite:test-api-endpoints': () => this.testApiEndpoints()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  async injectGenerator(type, args = {}) {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let content = '';

      let prioritiesStr = atom.config.get('rpg-suite.diceEngine.statGeneration.statPriorityMap');
      let prioritiesObj = {};
      let gameSys = (args.game || args.system || 'dnd-5e').toLowerCase();
      let customPath = '';
      const generators = require('./generators');
      console.log(`RPG-Suite: Injecting ${type} for system ${gameSys}`);

      if (type === 'sheet' || type === 'npc') {
        let classKey = ['class', 'role', 'archetype', 'occ'].find(k => args[k]);
        let classStr = classKey ? String(args[classKey]).toLowerCase() : '';
        let unrolledClasses = [];
        
        let unrolledNames = [];
        if (args.name) {
          unrolledNames = String(args.name).split('-').map(n => n.trim()).filter(n => n);
        }

        if (classStr) {
          let parts = classStr.split('-');
          let generateList = [];
          for (let i = 0; i < parts.length; i++) {
            let num = parseInt(parts[i], 10);
            if (!isNaN(num) && generateList.length > 0) {
              generateList[generateList.length - 1].qty = num;
            } else if (isNaN(num)) {
              generateList.push({ name: parts[i], qty: 1 });
            }
          }
          
          generateList.forEach(item => {
            let safeQty = Math.max(0, Math.min(item.qty || 1, 50));
            for (let q = 0; q < safeQty; q++) {
              unrolledClasses.push(item.name || 'random');
            }
          });
        } else {
          unrolledClasses.push('');
        }
        
        let totalNPCs = Math.max(0, Math.min(unrolledClasses.length, 50));
        
        if (type === 'sheet') {
          if (gameSys.startsWith('dnd')) customPath = atom.config.get('rpg-suite.systems.dnd.templates.customCharacterSheet');
          else if (gameSys === 'cp' || gameSys === 'cyberpunk') customPath = atom.config.get('rpg-suite.systems.cyberpunk.templates.customCharacterSheet');
          else if (gameSys === 'w40k') customPath = atom.config.get('rpg-suite.systems.w40k.templates.customCharacterSheet');
          else if (gameSys === 'rifts') customPath = atom.config.get('rpg-suite.systems.rifts.templates.customCharacterSheet');
        } else {
          if (gameSys.startsWith('dnd')) customPath = atom.config.get('rpg-suite.systems.dnd.templates.customNpcSheet');
          else if (gameSys === 'cp' || gameSys === 'cyberpunk') customPath = atom.config.get('rpg-suite.systems.cyberpunk.templates.customNpcSheet');
          else if (gameSys === 'w40k') customPath = atom.config.get('rpg-suite.systems.w40k.templates.customNpcSheet');
          else if (gameSys === 'rifts') customPath = atom.config.get('rpg-suite.systems.rifts.templates.customNpcSheet');
        }

        for (let i = 0; i < totalNPCs; i++) {
          let isLeader = (i === 0);
          let localArgs = {...args};
          if (classKey) {
            localArgs[classKey] = unrolledClasses[i];
          }
          if (unrolledNames.length > 0) {
            if (unrolledNames[i]) {
              localArgs.name = unrolledNames[i];
            } else {
              delete localArgs.name;
            }
          }
          
          for (let k in localArgs) {
            if (typeof localArgs[k] === 'string') {
              if (k === 'stat' || k === 'stats') {
                let statMatch = localArgs[k].toString().match(/^([34])(?:-(\d+))?$/);
                if (statMatch) {
                  let method = parseInt(statMatch[1], 10);
                  let sets = statMatch[2] ? parseInt(statMatch[2], 10) : 1;
                  sets = Math.max(0, Math.min(sets, 10));
                  localArgs[k] = `${method}-${sets}`;
                }
                continue;
              }
              
              let match = localArgs[k].match(/^(\d+)(?:-(\d+))?(?:-l(\d+))?$/i);
              if (match) {
                let base = parseInt(match[1], 10);
                if (isNaN(base)) base = 1;
                let high = match[2] ? parseInt(match[2], 10) : base;
                if (isNaN(high)) high = base;
                let leaderVal = match[3] ? parseInt(match[3], 10) : undefined;
                
                if (isLeader && leaderVal !== undefined && !isNaN(leaderVal)) {
                  localArgs[k] = leaderVal.toString();
                } else {
                  let min = Math.min(base, high);
                  let max = Math.max(base, high);
                  localArgs[k] = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
                }
              }
            }
          }
          
          try {
            if (type === 'sheet') content += generators.generateSheet(customPath, localArgs);
            else content += generators.generateNPC(customPath, localArgs);
          } catch(e) {
            console.error('RPG-Suite Generation Error:', e);
            content += `\n**Error Generating NPC/Sheet:** ${e.message}\n`;
          }
          
          if (i < totalNPCs - 1) content += '\n---\n\n';
        }
      } else if (type === 'tracker') {
        customPath = atom.config.get('rpg-suite.additionalConfiguration.moreTemplates.trackerTemplate');
        content = generators.generateTracker(customPath, args);
      } else if (type === 'encounter') {
        const encounters = require('./encounters');
        const customDbPath = atom.config.get('rpg-suite.additionalConfiguration.moreTemplates.customMonstersDB');
        try {
          content = await encounters.generateEncounter(customDbPath, args);
        } catch(e) {
          console.error('RPG-Suite Encounter Error:', e);
          content = `\n**Error Generating Encounter:** ${e.message}\n`;
        }
      }

      editor.insertText(content || '\n[No Content Generated]\n');
    }
  },

  async roll() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      let selection = editor.getSelectedText();

      if (!selection) {
        // Find the word under the cursor
        let cursorCol = editor.getCursorBufferPosition().column;
        let lineText = editor.lineTextForBufferRow(editor.getCursorBufferPosition().row);

        // 1. Try to match an entire gen:{...} command block (which might contain spaces)
        let genBlockRegex = /gen:[a-zA-Z]+(?:\{[^}]*\})?/gi;
        let match;
        while ((match = genBlockRegex.exec(lineText)) !== null) {
          if (cursorCol >= match.index && cursorCol <= match.index + match[0].length) {
            selection = match[0];
            editor.setSelectedBufferRange([
              [editor.getCursorBufferPosition().row, match.index],
              [editor.getCursorBufferPosition().row, match.index + match[0].length]
            ]);
            break;
          }
        }

        // 2. Fallback to standard word/dice matching if no gen block was found
        if (!selection) {
          let wordRegex = /[\w{}:\-|=,()"]+/g;
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
      }

      if (selection.trim().length === 0) {
        let defDice = atom.config.get('rpg-suite.diceEngine.diceRollDefaults.defaultDice') || 1;
        let defSides = atom.config.get('rpg-suite.diceEngine.diceRollDefaults.defaultSides') || 20;
        let defMod = atom.config.get('rpg-suite.diceEngine.diceRollDefaults.defaultModifier') || 0;
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
              let cleanKey = key.trim().replace(/^["']|["']$/g, '');
              let cleanVal = val ? val.trim().replace(/^["']|["']$/g, '') : true;
              if (cleanVal === 'true') cleanVal = true;
              if (cleanVal === 'false') cleanVal = false;
              args[cleanKey] = cleanVal;
            }
          });
        }

        if (genType === 'sheet' || genType === 'npc' || genType === 'tracker' || genType === 'encounter') {
          // Erase the trigger string
          editor.insertText('');
          await this.injectGenerator(genType, args);
          return;
        }
      }

      // 2. Smart Router: Stat Pools
      let isStat = false;
      let statMethod = atom.config.get('rpg-suite.diceEngine.statGeneration.defaultStatMethod') || 4;
      let statCountOpt = 0;

      if (lowerExpr.startsWith('stat')) {
        isStat = true;
        const parts = lowerExpr.split(':');
        if (parts.length > 1) {
          const subParts = parts[1].split('-');
          statMethod = parseInt(subParts[0], 10);
          if (subParts[1]) statCountOpt = parseInt(subParts[1], 10);
        }
      }

      // 3. Smart Router: Dice Math
      let resultString = '';
      if (isStat) {
        let statRolls = stats(statMethod, statCountOpt);
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
        let isFate = atom.config.get('rpg-suite.diceEngine.additionalSettings.forceFateDice') || false;

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

      const verbose = atom.config.get('rpg-suite.diceEngine.additionalSettings.verbose');
      let insertStr = resultString;
      if (verbose) {
        insertStr = resultString + ' (' + selection + ')';
      }

      editor.moveToEndOfLine();
      editor.insertText('  |  ' + insertStr);
    }
  },

  async testApiEndpoints() {
    const encounters = require('./encounters');

    let sysList = [
      { id: 'dnd-5e', urlConfig: 'systems.dnd.api.endpoint', mapConfig: 'systems.dnd.api.jsonMap', testName: 'aboleth' },
      { id: 'cyberpunk', urlConfig: 'systems.cyberpunk.api.endpoint', mapConfig: 'systems.cyberpunk.api.jsonMap', testName: 'boosterganger' },
      { id: 'w40k', urlConfig: 'systems.w40k.api.endpoint', mapConfig: 'systems.w40k.api.jsonMap', testName: 'ork' },
      { id: 'rifts', urlConfig: 'systems.rifts.api.endpoint', mapConfig: 'systems.rifts.api.jsonMap', testName: 'coalition' }
    ];

    let testedAny = false;

    for (let sys of sysList) {
      let customUrl = atom.config.get(`rpg-suite.apiRouting.${sys.urlConfig}`);
      let customMap = atom.config.get(`rpg-suite.apiRouting.${sys.mapConfig}`);

      if (customUrl && customUrl.trim() !== '') {
        testedAny = true;
        const testUrl = customUrl.includes('{name}') ? customUrl.replace('{name}', sys.testName) : customUrl;
        atom.notifications.addInfo(`Testing ${sys.id} API...`, { detail: `Fetching: ${testUrl}` });

        try {
          const apiMonster = await encounters.fetchCustomApi(sys.testName, customUrl);
          if (!apiMonster) {
            atom.notifications.addWarning(`${sys.id} Test Failed`, { detail: `No data returned for '${sys.testName}'. Check your URL and network.` });
            continue;
          }

          let mapped = null;
          if (sys.id === 'dnd-5e' && (!customMap || customMap.trim() === '{}')) {
            mapped = encounters.mapOpen5eToArgs(apiMonster, sys.id);
          } else {
            mapped = encounters.mapPayload(apiMonster, customMap || '{}', sys.id);
          }

          atom.notifications.addSuccess(`${sys.id} API Connection Successful!`, {
            detail: `Mapped Result:\n${JSON.stringify(mapped, null, 2)}`,
            dismissable: true
          });

        } catch (e) {
          atom.notifications.addError(`${sys.id} Test Failed`, { detail: e.message, dismissable: true });
        }
      }
    }

    if (!testedAny) {
      atom.notifications.addWarning('No Custom APIs Configured', { detail: 'Please add a Custom API Endpoint in the settings first.' });
    }
  }
};
