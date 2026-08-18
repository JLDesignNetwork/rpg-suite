# Contributing to RPG Suite

Thank you for contributing to **RPG Suite**! Please review the guidelines below.

---

## 1. Engine Invariants

1. **System Agnosticism:** Do not hardcode game mechanics directly into the core roller; add system profiles to `lib/systems.js`.
2. **Deterministic Tests:** Ensure all math and generator functions accept testable overrides or mocks for Jest.
3. **Generational Task Tracking:** All work items must be recorded in `.dev/2606/backlog.json`.
4. **GVS Versioning:** All release tags adhere strictly to GVS format (`[YYMM].[SUBVERSION].[REVISION]-[TAG]`).
