# RPG Suite Usage Guide

This guide provides detailed examples on how to use the RPG Suite to its full potential inside the Pulsar text editor.

## Inline Dice Rolling

RPG Suite features a built-in mathematical engine capable of evaluating complex dice equations. To roll dice, type your equation anywhere, select or place your cursor on the text, and hit the RPG Suite Roll command (Default: `<kbd>Ctrl+R</kbd>`).

- `1d20` ➔ `1d20  |  14 (1d20)`
- `2d8+5` ➔ `2d8+5  |  16 (2d8+5)`
- `4dF+2` ➔ `4dF+2  |  3 (4dF+2)` *(Supports Fate/Fudge dice!)*

## Stat Pool Generation

You can quickly generate standard ability score pools for new characters.
- **Method 3:** Roll 3d6 six times.
  - Type `stats:3` ➔ `Ability Score Pool:  13 (+1) | 11 (+0) | 10 (+0) |  9 (-1) |  8 (-1) |  7 (-2) (stats:3)`
- **Method 4:** Roll 4d6 (drop the lowest) six times.
  - Type `stats:4` ➔ `Ability Score Pool:  16 (+3) | 14 (+2) | 13 (+1) | 12 (+1) | 11 (+0) |  8 (-1) (stats:4)`

## Markdown Generators & Smart Arguments

RPG Suite can dynamically scaffold entire Markdown templates for character sheets, NPCs, and encounters. It does this through **Smart Generator Commands**.

**Basic Commands:**
- `gen:sheet` ➔ Generates a Character Sheet
- `gen:npc` ➔ Generates a Monster/NPC Stat Block
- `gen:encounter` ➔ Generates an Encounter Tracking Table

### Passing Arguments

You can heavily customize the generated templates by passing arguments inside curly braces `{}`.

**Syntax:** `gen:sheet{key:value, key:value}`

#### 1. Intelligent Stat Prioritization
If you want the engine to automatically roll and assign stats for a specific class, pass the `stats` and `class` arguments:
- `gen:sheet{stats:4, class:wizard}` 
  *Action:* Rolls 4d6-drop-lowest six times. Sorts the results highest-to-lowest, and assigns the highest numbers to Intelligence and Constitution (the default priorities for a Wizard)!

#### 2. Explicit Stat Overrides
If you are copying an existing monster and already know their stats, you can explicitly define them to bypass the rolling engine:
- `gen:npc{str:18, dex:14, int:8}`
  *Action:* Injects exactly those values into the generated NPC block, and calculates the `+4`, `+2`, and `-1` modifiers automatically!

#### 3. Built-in Placeholders
The default `gen:sheet` and `gen:npc` templates come with Several built-in tags that you can populate using arguments:

| Argument Key | Template Tag | Default Fallback |
| :--- | :--- | :--- |
| `name` | `{{NAME}}` | Character Name / NPC Name |
| `class` | `{{CLASS}}` | *(Empty)* |
| `level` | `{{LEVEL}}` | *(Empty)* |
| `background`| `{{BACKGROUND}}`| *(Empty)* |
| `alignment` | `{{ALIGNMENT}}`| unaligned |
| `ac` | `{{AC}}` | 10 |
| `hp` | `{{HP}}` | 4 (1d8) |
| `speed` | `{{SPEED}}` | 30 ft. |
| `init` | `{{INIT}}` | +0 |

**Example:**
`gen:npc{name:Goblin Boss, ac:17, hp:21, speed:30, alignment:chaotic evil}`
*Action:* Generates a fully populated Goblin Boss stat block instantly!

## Custom Templates & Dynamic Tags

If the default Markdown templates don't fit your game's ruleset, you can write your own! Go to **Settings > Packages > rpg-suite** and provide the absolute path to your custom `.md` file.

### Dynamic Tag Replacements

The RPG Suite parser is completely dynamic. You are **not** limited to the built-in placeholders listed above! You can invent your own tags simply by wrapping uppercase letters in double curly braces inside your custom template file.

**Example Custom Template (`custom-npc.md`):**
```markdown
# {{NAME}}
**Faction:** {{FACTION}}
**Threat Level:** {{THREAT}}
```

To populate those custom tags, just pass them as arguments exactly as you wrote them!

**Command:**
`gen:npc{name:Bandit, faction:Zhentarim, threat:High}`

*Result:*
```markdown
# Bandit
**Faction:** Zhentarim
**Threat Level:** High
```
