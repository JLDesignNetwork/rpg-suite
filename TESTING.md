# RPG-Suite Stability & Stress Testing Report

This document outlines the rigorous testing methodology and edge-case defenses implemented in the RPG-Suite `v1.0.0` engine.

## 1. Engine & Dice Rolling (`engine.js`)

The dice rolling engine parses raw text inputs via regex captures from `gen:` commands. It was stress-tested against the following vectors:

- **Extreme Range Injection:** Generating `100000d20` to test memory limits.
- **Negative Integer Exploits:** Passing `-5d20` to test for infinite loop freezes.
- **Typo/NaN Injections:** Passing non-numeric text.

### Defensive Results
- **Bounds Safe**: An internal mathematical clamp caps the maximum number of dice rolled per execution at `100` (`Math.min(parsedDice, 100)`), preventing user thread lockup.
- **Math Safe**: `NaN` checks correctly fallback, and negative calculations correctly floor to `0`.

## 2. Generator String Parsing & Unrolling (`rpg-suite.js`)

The generator engine unrolls compact tags (e.g., `Sorcerer-Paladin-Druid-random-3`) into distinct blocks. It also handles mapping lists of names (`name:Jeff-Patrick-Scott`). 

- **Asymmetric List Matching:** Mismatched lists (e.g., 6 generated NPCs but only 2 mapped names) were evaluated.
- **Absurd Iteration Flags:** Passing `random-10000` to lock the text buffer.

### Defensive Results
- **Bounds Safe**: Iteration ranges are explicitly clamped at a maximum of `50` generated blocks via `Math.min(item.qty || 1, 50)`.
- **List Mapping Safe**: Unrolled arrays that are shorter than the generated block quantity now gracefully fallback to the `Character Name` placeholder, guaranteeing no undefined outputs.

## 3. Scope Hoisting & Asynchronous Failures (`generators.js`)

The most critical test involved analyzing silent freezing occurrences inside the editor.

### Defensive Results
- **Block-Scope Corrections**: Lifted `className` initialization to the global function scope to prevent `ReferenceError`s during specific multi-flag combinations.
- **Sandbox Container**: The generation logic has been wrapped in a full `try/catch` block. Should any unexpected failure happen in production, a clean Markdown error message (`**Error Generating NPC/Sheet:** [Reason]`) is now explicitly inserted into the editor, immediately unblocking the asynchronous event loop and providing instant feedback.
