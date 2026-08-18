# 🎲 Dice Engine Configuration

> **Document:** `docs/dice_engine.md`  
> **Author:** Jeff Langdon (JL Design Network)  

This section controls the behavior of the internal mathematical engine whenever you select text or trigger a dice command in Pulsar.

---

## 1. Dice Roll Defaults

- **Default Dice / Default Sides / Default Modifier:**
  - *Action:* These three fields govern what happens if you trigger the roller without highlighting valid syntax. It falls back to rolling `[Default Dice]d[Default Sides] + [Default Modifier]`. By default, this is a standard `1d20 + 0`.

---

## 2. Stat Generation Methods

- **Default Generation Method (`stats`):**
  - *Default:* `4` (4d6 drop lowest)
  - *Method 3:* Rolls strict `3d6`.
  - *Method 4:* Rolls `4d6` and drops the single lowest die.
- **Stat Priority Map:**
  - *Description:* A JSON mapping that teaches the engine which ability scores matter most for specific classes.
  - *Action:* When you run `gen:sheet{"class":"wizard","stats":4}`, the engine generates the stats, sorts them highest to lowest, and assigns them in the defined priority order. By default, Wizards prioritize `INT` and `CON`, while Fighters prioritize `STR` and `CON`.

---

## 3. Special Modes

- **Use Fate/Fudge Dice:**
  - *Default:* `false`
  - *Action:* Overrides the engine to roll using Fate/Fudge logic. All standard dice become Fate dice (rolling `-1`, `0`, or `+1`).
- **Verbose Mode:**
  - *Default:* `false`
  - *Action:* If enabled, the engine prints the raw command alongside the computed result (e.g. `18 (+5)` instead of just `18`).
