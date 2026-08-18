# AI Agent & Copilot Development Guidelines

> [!IMPORTANT]
> **Authoritative Rules:** Universal JLDN rules apply. Workspace-specific guidelines:
> - **Local Rules:** `.agents/AGENTS.md`
> - **Generational Hub:** `.dev/` (Active Gen: `2606`)

## Key Invariants
1. **Pulsar Compatibility:** Keep activation commands aligned with `package.json`.
2. **Deterministic Tests:** Never introduce non-deterministic tests without mocking random seeds.
3. **Generational Backlog:** Keep `.dev/2606/backlog.json` synchronized on every task resolution.
