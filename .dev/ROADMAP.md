# JLDN RPG Suite Strategic Roadmap

> **Project:** JLDN RPG Suite (Pulsar IDE Package)  
> **Generation Epoch:** `2606` (Genesis: June 2026)  
> **Author:** Jeff Langdon (JL Design Network)  
> **Status:** Active TTRPG IDE Plugin Standard  

---

## Strategic Vision

**RPG Suite** is a comprehensive, system-agnostic Dungeon Master toolkit and Dice Rolling engine built for the **Pulsar** text editor. It provides inline dice parsing, pre-rolled character sheets, multi-column HTML stat block generators, dynamic encounter tables, and custom REST API data routing.

```
                      JLDN RPG SUITE GENERATIONAL ROADMAP
  ┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
  │ Generation 2606        │       │ Generation 2608        │       │ Future Horizons        │
  │ Pulsar Package Core    │ ───>  │ Standalone CLI / SDK   │ ───>  │ VS Code Extension Port │
  │ Multi-System Engine    │       │ VTT JSON-RPC Adapter   │       │ Language Server (LSP)  │
  └────────────────────────┘       └────────────────────────┘       └────────────────────────┘
```

---

## Generational Backlogs & Horizons

### Generation 2606 (Active Baseline)
- [x] **Inline Dice Rolling Engine:** Dynamic regex math parser (`1d20+5`, `4d6kh3`, Fate dice).
- [x] **Multi-System Character Generators:** D&D 5e, D&D 4e, D&D 3.5, Cyberpunk Red, Warhammer 40K, Rifts.
- [x] **Initiative & Encounter Tracker:** Interactive multi-column tracking tables.
- [x] **In-Repo Documentation Hub:** Full migration of GitHub wiki into version-controlled `docs/`.
- [x] **Orange Team Legacy Modernization:** Full baseline scaffolding, CI test automation, and CodeQL security suite.

### Generation 2608+ (Future Tooling)
- [ ] **Standalone CLI Binary (`@jldn/rpg-cli`):** Terminal dice roller and sheet generator for non-editor workflows.
- [ ] **Language Server Protocol (LSP):** Real-time dice linting and stat auto-completion in Markdown/YAML.
