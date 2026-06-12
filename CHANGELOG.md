# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
