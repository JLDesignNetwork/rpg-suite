# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-13
### Added
- **Mass NPC Unrolling**: The `name` argument now supports hyphen-separated arrays (`name:Jeff-Bob`), mapping explicitly provided names to generated NPCs, with robust fallbacks to default names if the array length doesn't match the NPC count.
- **Engine Bulletproofing**: Implemented mathematical boundary constraints across the suite:
  - Hardcapped the dice engine to a maximum of 100 iterations per execution, preventing user thread lockups on extreme numbers.
  - Hardcapped the unrolling loops to a maximum of 50 NPC generation blocks.

### Fixed
- Fixed a block-scoping `ReferenceError` involving `className` that was causing the process to hang silently when generating random classes.
- Added comprehensive `try/catch` wrappers to the core templating injection sequence. Any critical failure will now abort the hanging process and cleanly output the exact error message into the editor.

## [0.9.0] - 2026-06-13
### Added
- **API Encounter Generator (`gen:encounter`):** A smart, dual-hybrid engine that intelligently builds combat encounters.
  - Queries public APIs (like Open5e) for D&D 5e monsters, with a seamless offline fallback.
  - Automatically calculates Target CR based on party level (`party:4,level:3`).
  - Allows requesting specific monsters (`monsters:goblin=3|orc=1`).
  - Generates both an Initiative Tracker table and Quick Stats blocks.
- **Offline Monster Database:** Included a core `monsters.json` database and added a new setting (`rpg-suite.customTemplates.monstersDB`) to point to custom offline databases.

## [0.8.0] - 2026-06-12
### Added
- **Multi-System UI Menus:** Replaced the generic generator commands in the main menu with comprehensive submenus for every supported game system. You can now point-and-click to generate Sheets and NPCs for Cyberpunk, Warhammer, Rifts, and all editions of D&D without typing any hotkeys!

## [0.6.0] - 2026-06-12
### Added
- **Multi-System Support:** The Markdown Generators now natively support generating characters for different universes using the `system` argument. Supported systems: `dnd-5e`, `dnd-4e`, `dnd-3.5`, `cyberpunk`, `w40k`, `rifts`.
- **Dynamic Skills Engine:** Built massive built-in skill dictionaries for each system (over 200 distinct skills). When generating a sheet, it automatically maps out the full skills table with mathematical modifiers auto-calculated based on the generated stats.
- **System-Specific Math:** Implemented custom algorithm mappings for each system's stat modifiers: base-10 stat division for D&D, percentage accumulation for Palladium/Rifts, and raw carry-over for Cyberpunk/W40k.
- **Granular Custom Templates:** Overhauled the Settings menu to allow independent custom template paths for Sheets, NPCs, and Trackers across all systems.

### Changed
- **Renamed `gen:encounter` to `gen:tracker`** to clarify its purpose as an Initiative Tracker rather than a random monster spawner.

## [0.5.1] - 2026-06-12
### Fixed
- Hotfixed a critical regex parsing bug so the parser accepts tags containing periods (like `dnd-3.5`).

## [0.5.0] - 2026-06-12
### Added
- Overhauled all system default templates to professional Markdown table-based layouts. 

## [0.4.0] - 2026-06-12
### Added
- Upgraded the generator's template strings to parse and inject structured `Background` and `History` elements out-of-the-box.

## [0.3.0] - 2026-06-12
### Added
- Complete expansion into a Dungeon Master toolkit with Markdown generators (`gen:sheet`, `gen:npc`, `gen:encounter`).
- Added Smart Router argument parser to intercept JSON-like parameters (e.g. `{stats:4,class:paladin,level:12,hp:58,ac:21,name:Jeff}`).
- Implemented Intelligent Stat Distribution that mathematically sorts generated rolls and assigns them to the highest priority stats defined by standard D&D classes.
- Added a Dynamic Argument Replacement engine enabling any arbitrary text property to be parsed and injected into `{{TAG}}` placeholders inside Markdown templates.

### Changed
- Rebranded and renamed the entire package repository from `rpg-dice` to `rpg-suite`.
- Stripped aggressive bracket-matcher routing from the core UI binding to support seamless JSON string interpolation.

## [0.2.5] - 2026-06-12
### Fixed
- Fixed a bug where dangling colons generated unintended ghost dice rolls by injecting custom Regular Expression word boundaries (`/[a-zA-Z0-9:\+\-]+/`) to bypass default editor punctuation breaks.

### Changed
- Synchronized `bracket-matcher` to strictly `await` asynchronous UI selections.

## [0.2.4] - 2026-06-12
### Added
- Extracted statistical math logic and dice rolling into pure `engine.js`.
- Introduced Jest unit testing for all mathematical algorithms.

### Changed
- Branched legacy Atom package to JLDesignNetwork.
- Formally decoupled mathematical algorithms from editor UI bindings.
- Upgraded package `engines` target to strictly support `pulsar` natively.

## [0.2.3] - Legacy
### Fixed
- Corrected command name in menus and readme.

## [0.2.1] - Legacy
### Added
- Added ability to roll Fate/Fudge-style dice using 'F' in place of sides specifier.

## [0.2.0] - Legacy
### Added
- Merged pull request from JLDesignNetwork adding stat generation features and refining roll results output.
- Added `verbose` setting to retain roll info appended alongside result like in 0.1 versions.

## [0.1.0] - Legacy
### Added
- Added basic functionality for generating dice rolls using selected text for guidance and appending results to end of line.
