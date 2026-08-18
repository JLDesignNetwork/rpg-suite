# ⚙️ Data Sources & Configuration

> **Document:** `docs/configuration.md`  
> **Author:** Jeff Langdon (JL Design Network)  

This section dictates how the engine resolves monster stat blocks and encounter data for `gen:encounter` and `gen:npc` commands.

---

## 1. Data Source Cascading

- **API Selection (`apiSource`):**
  - *User-defined APIs only:* Disables Open5e fallback completely.
  - *User-defined APIs + Open5e fallback (Default):* If your custom API fails, it attempts to fetch from Open5e.
- **Database Selection (`dataSource`):**
  - *Built-in Defaults Only:* Ignores custom databases and APIs; exclusively uses Open5e and bundled `assets/monsters.json`.
  - *Custom User Data Only:* Uses exclusively custom APIs and custom JSON databases.
  - *Use All Available Sources (Default):* Sequentially queries Custom APIs $\rightarrow$ Open5e API $\rightarrow$ Custom Local DB $\rightarrow$ Bundled Local DB until a match is found.

---

## 2. Local Database Overrides

- **Custom Monsters Database (`.json`):**
  - *Action:* Provide the absolute path to a custom `.json` file containing homebrew monsters. The engine merges this dataset into its fallback cache.
- **Initiative Tracker Template (`.md`):**
  - *Action:* Provide the absolute path to an override `.md` template.
