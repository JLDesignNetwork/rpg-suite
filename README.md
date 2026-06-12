# RPG Suite

[![Package Version](https://img.shields.io/github/v/release/JLDesignNetwork/rpg-suite?style=flat-square)](https://web.pulsar-edit.dev/packages/rpg-suite)
[![Downloads](https://img.shields.io/github/downloads/JLDesignNetwork/rpg-suite/total?style=flat-square)](https://web.pulsar-edit.dev/packages/rpg-suite)
[![License](https://img.shields.io/github/license/JLDesignNetwork/rpg-suite?style=flat-square)](https://github.com/JLDesignNetwork/rpg-suite/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JLDesignNetwork/rpg-suite.svg?style=flat-square)](https://github.com/JLDesignNetwork/rpg-suite/issues)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jldesignnetwork)

A comprehensive Dungeon Master toolkit and inline dice-rolling engine for the [Pulsar Editor](https://pulsar-edit.dev/).

Transform your text editor into a full-scale TTRPG campaign manager. Generate stat blocks, roll complex dice equations, and scaffold character sheets directly inside your Markdown notes!

> 📖 **Check out the [Comprehensive Usage Guide](USAGE.md)** for a deep dive into advanced features, built-in template tags, and custom JSON-like argument parsing!

---

## Features

### 🎲 Inline Dice Rolling
Quickly roll dice anywhere in your document using the `RPG Suite: Roll Dice / Stats` command (Default: `<kbd>Ctrl+R</kbd>`).
- Select text like `2d20+5` and hit `<kbd>Ctrl+R</kbd>` to append the result to the line: `26`.
- Support for Fate/Fudge dice (e.g., `4dF+2`).

### 📊 Stat Pool Generation
Need to roll up a new character? Just type `stat:4` (for 4d6 drop lowest) or `stat:3` (for 3d6), highlight it, and hit `<kbd>Ctrl+R</kbd>`:
> `Ability Score Pool:  15 (+2) | 14 (+2) | 13 (+1) | 12 (+1) | 10 (+0) |  8 (-1)`

### 🧙‍♂️ Markdown Generators
Instantly inject TTRPG templates into your active document! 

Type a generator command anywhere in your text (e.g. `gen:sheet`, `gen:npc`, or `gen:encounter`), place your cursor on the text, and hit `<kbd>Ctrl+R</kbd>`. The router will automatically erase the command string and inject the full Markdown template!

### 🧠 Smart Router & Generator Arguments
Generators support passing inline JSON-style arguments to dynamically sculpt your templates and prioritize generated stat arrays based on standard D&D classes!

**Syntax:** `gen:sheet{key:val,key:val}`

- **Intelligent Stat Priority:** `gen:sheet{stats:4,class:paladin}` rolls 4d6-drop-lowest, sorts them from highest to lowest, and assigns the absolute best scores to STR and CHA, exactly as a Paladin would want!
- **Explicit Stat Overrides:** `gen:npc{str:18,dex:15}` will skip rolling and hardcode those specific scores into the generated table.
- **Dynamic Tag Replacements:** Pass any arbitrary property like `{name:Goblin,hp:14,ac:15}`. The engine will look for `{{NAME}}`, `{{HP}}`, and `{{AC}}` tags inside the Markdown template and instantly replace them with your values!

---

## ⚙️ Configuration & Customization

Don't play D&D 5e? Running a Sci-Fi game instead? No problem. 

RPG Suite allows you to completely override the default Markdown templates. Navigate to **Settings > Packages > rpg-suite** to define absolute file paths to your own custom `.md` templates:
- `Custom Character Sheet Template`
- `Custom NPC Stat Block Template`
- `Custom Encounter Table Template`

*(Note: The RPG Suite parser uses a fully dynamic placeholder engine. You can put **any** uppercase tag in your custom template (e.g. `{{FACTION}}`) and dynamically inject text into it by passing it as an argument: `gen:npc{faction:Zhentarim}`!)*

**Example Custom NPC Template (`my-npc.md`):**
```markdown
# {{NAME}} - The {{FACTION}} Operative
**STR:** {{STR}} | **DEX:** {{DEX}} | **CON:** {{CON}}
**INT:** {{INT}} | **WIS:** {{WIS}} | **CHA:** {{CHA}}
```

---

## Development & Testing

This project is built and maintained by **JLDesignNetwork**.

To run the mathematical test suites locally:
```bash
npm install
npm test
```
