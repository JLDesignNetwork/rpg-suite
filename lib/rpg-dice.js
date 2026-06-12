/**
 * @since 0.1.0
 * @version 0.2.5
 */

const { CompositeDisposable } = require('atom');
const { rollDice, stats } = require('./engine');

module.exports = {
    subscriptions: null,

    config: {
        defaultDieSides: {
            title: 'Default Die Sides',
            description: 'This is the number of sides per die.',
            type: 'integer',
            default: 20
        },

        defaultDiceCount: {
            title: 'Default Number of Dice',
            description: 'This is the number of dice used for the roll.',
            type: 'integer',
            default: 1
        },

        fateDice: {
            title: 'Use Fate/Fudge Dice',
            description: 'By default, use dice in the Fate/Fudge style (results can be -1, 0, or 1). While this setting is turned on, the Default Die Sides setting is ignored.',
            type: 'boolean',
            default: false
        },

        statsDSGM: {
            title: 'Default Stat Gen Method',
            description: 'The preferred method for generating ability stats. Accepted values are 3 or 4. Method 3 rolls 3d6 for each ability, a number of times based on the default roll count setting above and returns the best totals from each set. Method 4 rolls 1d6, 4 times per ability, drops the lowest roll, then tallies the remaining 3 rolls.',
            type: 'integer',
            default: 3
        },

        statsDRC: {
            title: 'Default Roll Count',
            description: 'This setting only applies for stat generation using method 3, and is the number of 3d6 rolls to make per stat.',
            type: 'integer',
            default: 3
        },

        verbose: {
            title: 'Verbose',
            description: 'Append dice and modifier info to (non-stat) roll results, for instance: 23 (5d8+2)',
            type: 'boolean',
            default: false
        }
    },

    activate() {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'rpg-dice:roll': () => this.roll()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    async roll() {
        const editor = atom.workspace.getActiveTextEditor();
        const regex = [
            /^\(?(?:(?<dice>\d+)?d(?<sides>\d+|f))? *(?:(?<sign>[\+-])* *(?<modifier>\d+)?)? *\)?$/i,
            /^\(?(?:STATS?)(?::(?<method>\d)(?:-(?<count>\d+))?)?\)?$/i
        ];
        
        let dice = atom.config.get('rpg-dice.defaultDiceCount');
        let fateDice = atom.config.get('rpg-dice.fateDice');
        let sides = fateDice ? 'F' : atom.config.get('rpg-dice.defaultDieSides');
        let sign = '+';
        let mod = 0;
        let method = atom.config.get('rpg-dice.statsDSGM');
        let count = atom.config.get('rpg-dice.statsDRC');
        let type, roll, res, output;

        if (editor) {
            let selection = editor.getSelectedText();
            if (selection.length < 1) {
                const cursor = editor.getLastCursor();
                if (cursor) {
                    // Custom word boundary that doesn't break on colons, plus, or minus signs
                    const wordRange = cursor.getCurrentWordBufferRange({ wordRegex: /[a-zA-Z0-9:\+\-]+/ });
                    if (wordRange) editor.setSelectedBufferRange(wordRange);
                }
                
                await atom.commands.dispatch(atom.views.getView(editor), 'bracket-matcher:select-inside-brackets');
                selection = editor.getSelectedText();
            }
            
            let range = editor.getSelectedBufferRange();
            let matches;

            if ((matches = selection.match(regex[0]))) {
                if (typeof matches.groups.dice !== 'undefined') dice = parseInt(matches.groups.dice);
                if (typeof matches.groups.sides !== 'undefined') {
                    let sidesMatch = matches.groups.sides;
                    if (sidesMatch === 'f' || sidesMatch === 'F') {
                        fateDice = true;
                        sides = 'F';
                    } else {
                        sides = parseInt(matches.groups.sides);
                        fateDice = false;
                    }
                }
                if (typeof matches.groups.sign !== 'undefined') sign = matches.groups.sign;
                if (typeof matches.groups.modifier !== 'undefined') mod = parseInt(matches.groups.modifier);
                
                mod = (sign === '-' ? mod * -1 : mod);
                roll = rollDice(dice, sides, fateDice);
                res = roll + mod;
                type = (sides === 20 ? 'check' : 'damage');
                
                editor.moveToEndOfLine();
                output = ' | ';

                let failComp = dice;
                if (fateDice) failComp *= -1;
                let critComp = dice;
                if (!fateDice) critComp *= sides;
                
                if (roll === failComp) output += '💣';
                else if (roll === critComp) output += '🌟';
                else output += ' ';

                output += `${res.toString().padStart(2)}`;
                if (atom.config.get('rpg-dice.verbose')) {
                    output += ` (${dice}d${sides}${sign === '+' ? '+' : ''}${mod})`;
                }
                output = output.padStart(5);

            } else if ((matches = selection.match(regex[1]))) {
                if (typeof matches.groups.method !== 'undefined' && [3, 4].includes(parseInt(matches.groups.method))) {
                    method = parseInt(matches.groups.method);
                }
                if (typeof matches.groups.count !== 'undefined') {
                    count = parseInt(matches.groups.count);
                }
                if (method === 4) count = 0;
                
                let statRolls = stats(method, count);
                let s = statRolls.map(r => {
                    let m = Math.floor((r - 10) / 2);
                    m = (m >= 0) ? '+' + m : m;
                    return `${r.toString().padStart(2)} (${m.toString().padStart(2)})`;
                });

                let startColumn = range.start.column - 1;
                let endColumn = range.end.column + 1;
                editor.setSelectedBufferRange([[range.start.row, startColumn], [range.end.row, endColumn]]);
                output = `Ability Score Pool:`;
                output += s.join(' | ').padStart(59);
                
            } else {
                output = `Cannot determine a suitable use for '${selection}'.\n`;
            }

            editor.insertText(output);
            if (['check', 'damage'].includes(type)) {
                editor.setSelectedBufferRange([[range.start.row, range.start.column], [range.end.row, range.end.column]]);
            }
        }
    }
};
