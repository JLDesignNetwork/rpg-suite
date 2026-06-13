# RPG Suite Configuration Wiki

Welcome to the **RPG Suite Wiki**! This document serves as a comprehensive guide to configuring every aspect of the RPG Suite Pulsar extension. Because the engine is designed to be system-agnostic, there are numerous settings that control how data is generated, routed, and mapped.

You can access these settings by navigating to **Settings > Packages > rpg-suite** inside Pulsar.

---

## 🎲 1. Dice Engine
This section controls the behavior of the internal mathematical engine whenever you select text or trigger a dice command.

### Dice Roll Defaults
- **Default Dice / Default Sides / Default Modifier:**
  - *Action:* These three fields govern what happens if you accidentally trigger the roller without highlighting valid syntax. It will fall back to rolling `[Default Dice]d[Default Sides] + [Default Modifier]`. By default, this is a standard `1d20 + 0`.

### Stat Generation
- **Default Generation Method:**
  - *Default:* `4` (4d6 drop lowest)
  - *Action:* Controls what happens when you type `stats`. Method `3` rolls strict 3d6. Method `4` rolls 4d6 and drops the lowest die.
- **Stat Priority Map:**
  - *Description:* A JSON string that teaches the engine which ability scores matter most for specific classes.
  - *Action:* When you run a command like `gen:sheet{"class":"wizard","stats":4}`, the engine generates the stats, sorts them highest to lowest, and assigns them exactly in the order defined in this JSON. By default, Wizards prioritize `INT` and `CON`, while Fighters prioritize `STR` and `CON`.

### Additional Settings
- **Use Fate/Fudge Dice:**
  - *Default:* `false`
  - *Action:* Force overrides the entire engine to roll using Fate/Fudge logic. All standard dice become Fate dice (rolling exactly `-1`, `0`, or `1`). Useful if your table exclusively plays Fate-based systems.
- **Verbose Mode:** 
  - *Default:* `false`
  - *Action:* If enabled, the engine will print the raw command you used next to the result (e.g., `18 (+5)` instead of just `18`).

---

## 🛡️ 2. Systems
The engine comes with built-in Markdown layouts for character sheets and NPCs across various systems. However, you can completely override them by pointing the engine to your own `.md` files or custom REST APIs.

*Each supported system (Cyberpunk Red, D&D 5e, Rifts, Warhammer 40K) has its own nested section.*

### Custom Templates
- **Custom Character Sheet (.md) & Custom NPC Sheet (.md):**
  - *Action:* Provide the **absolute path** to a `.md` file on your computer. When you run `gen:sheet{"system":"dnd-5e"}`, the engine will use your file instead of the bundled default.
  - *Validation:* The settings menu requires strings ending in `.md`. If you provide a path that doesn't exist, **the engine will safely fall back to the built-in default template without crashing.**

### User-Defined API
- **Endpoint URL:**
  - *Usage:* You can paste the URL of **any REST API**. You must include `{name}` in the URL as a placeholder for server-side search, or omit it to download an entire static array and perform client-side searches!
  - *Validation:* The settings menu requires valid URL syntax (`http://` or `https://`). If the API endpoint fails or 404s, **the engine will catch the error and safely fall back to your offline local data.**
- **JSON Map:**
  - *Usage:* Because every API on the internet returns differently structured JSON, teach the engine how to read an API using this mapper object. Write a simple JSON object that maps the RPG Suite's internal keys (`hp`, `ac`, `speed`, `str`) to the API's keys using **dot-notation**.

*Example API Payload:*
```json
{
  "unit_data": {
    "stats": { "health": 21, "armor": 17 },
    "speed": "30 ft"
  }
}
```
*Example JSON Map:*
```json
{"hp": "unit_data.stats.health", "ac": "unit_data.stats.armor", "speed": "unit_data.speed"}
```

---

## ⚙️ 3. Additional Configuration
This section dictates exactly where the engine goes to find monster stat blocks for `gen:encounter` and `gen:npc` commands.

### API Settings
- **API Selection (`apiSource`):**
  - *User-defined APIs only:* Disables the Open5e fallback completely.
  - *User-defined APIs + Open5e fallback (Default):* If your custom API fails, it will attempt to fetch from Open5e.
- **Database Selection (`dataSource`):**
  - *Built-in Defaults Only:* Ignores your custom databases and APIs. Only uses the Open5e API and the bundled `assets/monsters.json`.
  - *Custom User Data Only:* Ignores the internet and bundled assets. Exclusively uses the Custom APIs and Custom JSON databases you define.
  - *Use All Available Sources (Default):* The engine sequentially attempts Custom APIs -> Open5e API -> Custom Local DB -> Bundled Local DB until it finds a match.
- **Custom Monsters Database (.json):**
  - *Action:* Provide the absolute path to a custom `.json` file containing your own homebrew monsters. The engine merges this database into its internal fallback database during generation.
- **Initiative Tracker Template (.md):**
  - *Action:* Provide the absolute path to a `.md` file to override the default initiative tracker template.

---

## ⌨️ 4. Custom Keybindings
RPG Suite registers commands like `rpg-suite:roll` to default keybindings (e.g., `ctrl-r`). 

Because Pulsar (and Atom) uses a centralized native Keymap manager, **you do not set keybindings inside the package's configuration menu.**

To set your own custom keybind:
1. Open Pulsar Settings (`ctrl-,` or `cmd-,`).
2. Navigate to the **Keybindings** tab on the left.
3. Click the **"your keymap file"** link at the top of the pane (this opens `keymap.cson`).
4. Add your custom binding to override the default. For example:
```cson
'atom-workspace':
  'ctrl-alt-r': 'rpg-suite:roll'
```
5. Save the file. Your custom hotkey is now instantly active!
