# JLDN RPG Suite — Package Architecture

> **Document:** `docs/architecture.md`  
> **Author:** Jeff Langdon (JL Design Network)  
> **Generation:** `2606`  

---

## 1. Engine & Subsystem Architecture

RPG Suite is modularized into discrete functional engines:

```
                            RPG SUITE TOPOLOGY
  ┌──────────────────────────────────────────────────────────────────┐
  │ lib/rpg-suite.js (Pulsar Package Entrypoint & Command Router)    │
  │   ├── lib/engine.js       (Dice Parser & Roll Evaluation)        │
  │   ├── lib/game_math.js    (System Math & Stat Probability Maps)  │
  │   ├── lib/generators.js   (Character & NPC Stat Block Builder)   │
  │   ├── lib/compiler.js     (Dynamic Template Token Replacer)      │
  │   ├── lib/systems.js      (System Definitions & Profiles)        │
  │   └── lib/encounters.js   (Monster Query & Table Builder)        │
  └──────────────────────────────────────────────────────────────────┘
```

1. **`engine.js`:** Pure mathematical regex parser capable of evaluating dice notations, modifiers, keep-highest/lowest, and Fate rolls.
2. **`game_math.js`:** Calculates ability modifiers, challenge ratings, proficiency bonuses, and stat distributions per system.
3. **`compiler.js`:** Renders HTML/Markdown templates by compiling placeholders with calculated context.
4. **`systems.js`:** Provides canonical system schemas for D&D 5e, D&D 4e, D&D 3.5, Cyberpunk Red, Warhammer 40K, and Rifts.
