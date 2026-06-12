<div align="center">
  <h1>🎲 RPG Dice</h1>
  <p><strong>A Modern Dice Rolling & Stat Generation Engine for Pulsar</strong></p>
  
  [![Version](https://img.shields.io/badge/version-0.2.4-blue.svg)](#)
  [![Engine](https://img.shields.io/badge/engine-Pulsar-purple.svg)](#)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](#)
</div>

---

> **Official JLDesignNetwork Fork**
> This package has been mathematically decoupled, tested via Jest, and completely modernized from its original Atom framework. 
> *Original concept and legacy codebase created by [akstuhl/rpg-dice](https://github.com/akstuhl/rpg-dice).*

---

## 🌟 Overview

`rpg-dice` transforms your Pulsar text editor into an absolute powerhouse for tabletop RPGs. Whether you're drafting campaign notes, building out a homebrew bestiary, or playing a text-based campaign, you can instantly execute complex dice rolls and mathematically accurate ability score generation directly inside your text buffer!

<div align="center">
  <img src="https://raw.githubusercontent.com/akstuhl/rpg-dice/main/asset/demo.gif" alt="Demo GIF">
</div>

## ⚡ How to Roll

Simply type a standard RPG dice notation anywhere in your document, select the text, and hit <kbd>Ctrl+R</kbd> (or trigger the `rpg-dice:roll` command). The mathematical result is instantly calculated and elegantly appended to the end of your current line!

### Standard Rolls
*   `1d20` ➔ ` | 14`
*   `2d6+3` ➔ ` | 11`
*   `1d100` ➔ ` | 87`

### Fate / Fudge Systems
Need to roll Fate dice? Just use an `F` instead of a number!
*   `4df` ➔ ` |  2`

> **Note**: Critical Successes and Critical Failures are dynamically detected! Rolling a natural maximum adds a 🌟, and rolling a natural minimum adds a 💣!

## 🛡️ Ability Score Generation

Rolling a brand new character? `rpg-dice` has built-in, TTRPG-standard stat generation arrays!

Type the word `STATS` on an empty line, highlight it, and hit <kbd>Ctrl+R</kbd>.
*   **Method 3 (`STATS:3`)**: Rolls `3d6` per stat multiple times and picks the best array based on your config.
*   **Method 4 (`STATS:4`)**: The classic **4d6 drop the lowest**. Rolls four six-sided dice, drops the lowest result, and tallies the remaining three.

```text
STATS:4
Ability Score Pool:    11 (+0) | 14 (+2) | 16 (+3) |  9 (-1) | 13 (+1) | 18 (+4)
```

## ⚙️ Configuration

`rpg-dice` allows you to fully customize default behaviors in the Pulsar settings:
*   **Default Die Sides**: The default type of die if none is specified (e.g., `20` for d20s).
*   **Default Number of Dice**: How many dice to roll if you leave the quantity blank.
*   **Fate Dice**: Force all rolls to use Fate/Fudge logic (-1 to 1).
*   **Verbose Output**: Appends the mathematical breakdown to the result: `23 (5d8+2)`.
*   **Stat Generation Rules**: Configure whether `STATS` defaults to Method 3 or Method 4.

---
<div align="center">
  Maintained by <strong>JLDesignNetwork</strong> | MIT Licensed
</div>
