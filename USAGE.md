# RPG Suite Usage Guide

This guide provides detailed examples on how to use the RPG Suite to its full potential inside the Pulsar text editor.

## Inline Dice Rolling

RPG Suite features a built-in mathematical engine capable of evaluating complex dice equations. To roll dice, type your equation anywhere, select or place your cursor on the text, and hit the RPG Suite Roll command (Default: `<kbd>Ctrl+R</kbd>`).

- `1d20` ➔ `1d20  |  14 (1d20)`
- `2d8+5` ➔ `2d8+5  |  16 (2d8+5)`
- `4dF+2` ➔ `4dF+2  |  3 (4dF+2)` *(Supports Fate/Fudge dice!)*
- `+5` ➔ `+5  |  18 (+5)` *(Implicit 1d20 roll!)*
- `-9` ➔ `-9  |  2 (-9)` *(Implicit 1d20 roll!)*

## Stat Pool Generation

You can quickly generate standard ability score pools for new characters.
- **Method 3:** Roll 3d6 six times.
  - Type `stats:3` ➔ `Ability Score Pool:  13 (+1) | 11 (+0) | 10 (+0) |  9 (-1) |  8 (-1) |  7 (-2) (stats:3)`
- **Method 4:** Roll 4d6 (drop the lowest) six times.
  - Type `stats:4` ➔ `Ability Score Pool:  16 (+3) | 14 (+2) | 13 (+1) | 12 (+1) | 11 (+0) |  8 (-1) (stats:4)`
- **Multiple Sets:** Append `-X` to generate X sets and automatically keep the highest array!
  - Type `stats:3-5` ➔ Rolls five separate sets of 3d6 and keeps the absolute best set!

## Markdown Generators & Smart Arguments

RPG Suite can dynamically scaffold entire Markdown templates for character sheets, NPCs, and initiative trackers. You can trigger this via the **UI Menu** (`Packages > RPG Suite > Generate...`) or via **Smart Generator Commands**.

### Smart Generator Commands

**Basic Commands:**
- `gen:sheet` ➔ Generates a blank Character Sheet.
- `gen:npc` ➔ Generates a basic Monster/NPC Stat Block skeleton.
- `gen:tracker` ➔ Generates an empty Initiative Tracker.
- `gen:encounter` ➔ Generates a Combat Encounter (Initiative Tracker + Auto-populated Monster Stats).

You can pass arguments to these generators by appending them in curly braces `{}`. Multiple arguments are separated by commas.

---

### Command Examples: Easy to Complex

#### `gen:sheet` (Character Sheets)
- **Easy:** `gen:sheet`
  *(Generates a blank generic character sheet)*
- **Medium:** `gen:sheet{"system":"cyberpunk","class":"solo"}`
  *(Generates a Cyberpunk RED sheet, rolls stats optimized for a Solo, and builds a 40+ skill table with auto-calculated attribute modifiers!)*
- **Complex:** `gen:sheet{"system":"dnd-5e","class":"wizard","name":"Gandalf","stats":4,"background":"sage","alignment":"neutral-good"}`
  *(Generates a D&D 5e sheet for Gandalf, rolls 4d6-drop-lowest for stats, prioritizes INT and CON for the Wizard class, and pre-fills all biography fields!)*

#### `gen:npc` (Monsters & NPCs)
- **Easy:** `gen:npc`
  *(Generates a blank NPC stat block)*
- **Medium:** `gen:npc{"name":"Goblin Boss","ac":17,"hp":21,"speed":30,"alignment":"chaotic evil"}`
  *(Generates an NPC block and pre-fills the combat stats)*
- **Complex:** `gen:npc{"system":"w40k","name":"Chaos Cultist","str":12,"dex":14,"int":8,"faction":"Chaos"}`
  *(Generates a Warhammer 40k NPC block, injects exact stats to bypass the rolling engine, auto-calculates the modifiers (e.g., +2 for 14 DEX), and populates any custom `{{FACTION}}` tags in your template!)*

#### `gen:tracker` (Initiative Trackers)
- **Easy:** `gen:tracker`
  *(Generates a blank 5-slot initiative tracker)*
- **Complex:** `gen:tracker{"system":"dnd-5e","env":"dungeon","adv":"players"}`
  *(Generates a tracker and automatically prints the tactical environment and advantage conditions at the top)*

#### `gen:encounter` (Combat Encounters)
The `gen:encounter` command uses a dual-hybrid database. If your system is `dnd-5e`, it automatically fetches monster stats from the massive **Open5e Public API**. If you're offline or using a different system, it seamlessly falls back to the bundled offline database (or your own custom database).

- **Easy (Implicit Default):** `gen:encounter{"system":"dnd-5e","monsters":"bandit"}`
  *(Generates an encounter with exactly 1 Bandit, fetching its full stat block from the Open5e API)*
- **Medium (The Explicit Roster):** `gen:encounter{"system":"dnd-5e","monsters":"dragon wyrmling (red)=1|ogre=2|goblin=5","loot":"true-2.5"}`
  *(Bypasses the random algorithm completely. Fetches the exact roster of 8 monsters and calculates total encounter loot, multiplied by 2.5x!)*
- **Medium (Alternative Systems):** `gen:encounter{"system":"cyberpunk","party":3,"level":2,"env":"urban","loot":true}`
  *(Because Cyberpunk doesn't use the Open5e API, this safely falls back to the local offline database to randomly generate an urban street gang)*
- **Complex (High-CR Override):** `gen:encounter{"system":"dnd-5e","cr":8,"env":"mountains","loot":false}`
  *(Forces the random engine to ignore party/level math and directly target a massive CR 8 encounter in the mountains. Disables auto-loot generation.)*
- **Extreme (Swarm Math):** `gen:encounter{"system":"dnd-5e","party":8,"level":1,"env":"underdark","adv":"monsters","loot":"true-5"}`
  *(Calculates the budget for a massive low-level party and cross-references it with the Underdark biome to build a balanced swarm. Monsters get tactical advantage, and loot is boosted by a massive 5x modifier!)*

---

### Passing Arguments Deep-Dive

You can heavily customize the generated templates by passing arguments inside curly braces `{}`. To avoid syntax errors, avoid putting spaces between keys and values, and use proper JSON syntax by wrapping strings in quotes `""`.

**Syntax:** `gen:sheet{"key":"value","key2":"value"}`

#### Built-in Placeholders
The default `gen:sheet` and `gen:npc` templates come with several built-in tags that you can populate using arguments:

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

#### Intelligent Stat Prioritization
If you want the engine to automatically roll and assign stats for a specific class, pass the `stats` and `class` arguments:
- `gen:sheet{"stats":4,"class":"wizard"}` 
  *Action:* Rolls 4d6-drop-lowest six times. Sorts the results highest-to-lowest, and assigns the highest numbers to Intelligence and Constitution (the default priorities for a Wizard)!

#### Explicit Stat Overrides
If you are copying an existing monster and already know their stats, you can explicitly define them to bypass the rolling engine:
- `gen:npc{"str":18,"dex":14,"int":8}`
  *Action:* Injects exactly those values into the generated NPC block, and calculates the `+4`, `+2`, and `-1` modifiers automatically!

#### Multi-System Generation & Auto-Skills
RPG Suite now supports multiple game systems out of the box! By passing the `system` (or `game`) argument, the engine will automatically generate the correct character sheet structure, inject a comprehensive, system-specific skill list, and auto-calculate mathematical modifiers specific to the universe.

**Supported Systems:**
- `dnd-5e`, `dnd-4e`, `dnd-3.5` (D&D variants)
- `cyberpunk` or `cp` (Cyberpunk RED)
- `w40k` (Warhammer 40k: Wrath & Glory)
- `rifts` (Palladium / Rifts)

**Example:**
`gen:sheet{"system":"cp","class":"solo"}`
*Action:* Generates a Cyberpunk character sheet, rolls stats optimized for a Solo, and dynamically builds a massive 40+ skill table with auto-calculated attribute modifiers based on the raw stat generation!

## Custom Database & API Configuration

By default, the engine uses a **Dual-Hybrid System**. It attempts to fetch stats from the massive **Open5e Public API**. If it fails, or if you request a non-D&D system (like Cyberpunk), it falls back to the local `assets/monsters.json` database.

You can completely override this behavior in **Settings > Packages > rpg-suite** under the **🌐 Data & API Routing** section:

### Custom API Endpoints
You can wire up your own REST APIs for any game system! Simply paste the URL and use `{name}` as the wildcard.
- *Example W40k URL:* `https://api.openhammer.com/v1/units?name={name}`

### Universal JSON Mappers
Since every public API returns differently structured JSON, you can write a simple JSON mapping object in the settings to tell the engine how to extract the stats. 
The mapper supports **dot-notation** for digging into nested objects and arrays!

*If an API returns:*
```json
{
  "unit_data": {
    "stats": { "health": 21, "armor": 17 },
    "speed": "30 ft"
  }
}
```
*You simply provide this JSON Mapper in the settings:*
```json
{"hp": "unit_data.stats.health", "ac": "unit_data.stats.armor", "speed": "unit_data.speed"}
```
The engine will instantly parse the API and map it to your generated templates!

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
`gen:npc{"name":"Bandit","faction":"Zhentarim","threat":"High"}`

*Result:*
```markdown
# Bandit
**Faction:** Zhentarim
**Threat Level:** High
```
