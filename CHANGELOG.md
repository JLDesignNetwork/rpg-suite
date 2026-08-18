# Changelog - JLDN RPG Suite

All notable changes to the **RPG Suite** Pulsar package will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to the [JLDN Generational Versioning Schema (GVS)](https://github.com/JLDesignNetwork/Generational-Versioning-Schema).

## [2606.2.0-s] - 2026-08-18

### Added
- **In-Repo Documentation Wiki (`docs/`)**: Migrated 100% of the GitHub wiki into version-controlled `docs/` (`docs/index.md`, `docs/architecture.md`, `docs/usage.md`, `docs/dice_engine.md`, `docs/systems_templates.md`, `docs/configuration.md`, `docs/keybindings.md`).
- **Generational Development Hub (`.dev/`)**: Established root `.dev/` generational hub containing `ROADMAP.md`, `backlog.json`, `2606/backlog.json`, and `2606/ideas.json`.
- **GitHub Governance Suite**: Scaffolded `.github/FUNDING.yml`, `.github/SECURITY.md`, `.github/CONTRIBUTING.md`, `.github/CODE_OF_CONDUCT.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/copilot-instructions.md`, structured `.github/ISSUE_TEMPLATE/` forms, and automated CI workflows (`ci.yml`, `codeql.yml`).

### Changed
- **Test Alignment**: Aligned `spec/generators.test.js` to match the enhanced multi-column HTML template layouts (100% test suite passing).
- **Package Metadata**: Standardized package naming and GVS versioning `2606.2.0-s`.

## [2606.1.5-s] - 2026-06-13

### Added
- Demo GIFs and asset restructure.
- Multi-column HTML layout blocks for NPC stat blocks and character sheets.

## [2606.1.0-s] - 2026-06-12

### Added
- Initial genesis build: System-agnostic dice math engine, stat prioritizer, and Pulsar command palette integration.
