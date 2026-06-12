# RPG Suite

A comprehensive Dungeon Master toolkit and inline dice-rolling engine for the [Pulsar Editor](https://pulsar-edit.dev/).

Transform your text editor into a full-scale TTRPG campaign manager. Generate stat blocks, roll complex dice equations, and scaffold character sheets directly inside your Markdown notes!

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
Accessible via the **Packages > RPG Suite** dropdown menu or the Command Palette, instantly inject TTRPG templates into your active document at your cursor's position:
- **Generate Character Sheet**: Scaffolds a complete Markdown character sheet with sections for stats, combat, features, and inventory.
- **Generate NPC Stat Block**: Scaffolds a monster manual style stat block. **Bonus**: The engine automatically pre-rolls and injects 6 random ability scores (and their numeric modifiers) into the template for you!
- **Generate Encounter Table**: Injects a clean Markdown table for tracking Initiative, Character Names, HP, and Conditions.

---

## ⚙️ Configuration & Customization

Don't play D&D 5e? Running a Sci-Fi game instead? No problem. 

RPG Suite allows you to completely override the default Markdown templates. Navigate to **Settings > Packages > rpg-suite** to define absolute file paths to your own custom `.md` templates:
- `Custom Character Sheet Template`
- `Custom NPC Stat Block Template`
- `Custom Encounter Table Template`

*(Note: If you use the `{{STR}}`, `{{DEX}}`, `{{CON}}`, `{{INT}}`, `{{WIS}}`, and `{{CHA}}` tags inside your custom NPC template, RPG Suite will still automatically parse and inject rolled stats for you!)*

---

## Development & Testing

This project is built and maintained by **JLDesignNetwork**.

To run the mathematical test suites locally:
```bash
npm install
npm test
```
