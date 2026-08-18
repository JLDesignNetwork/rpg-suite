# 🛡️ Systems & Custom Templates

> **Document:** `docs/systems_templates.md`  
> **Author:** Jeff Langdon (JL Design Network)  

The engine comes with built-in multi-column HTML/Markdown layouts for character sheets and NPCs across various systems:
- **D&D 5e, D&D 4e, D&D 3.5**
- **Cyberpunk Red**
- **Warhammer 40K**
- **Rifts / Megaverse**

---

## 1. Custom Templates Overrides

- **Custom Character Sheet (`.md` / `.html`) & Custom NPC Sheet (`.md` / `.html`):**
  - *Action:* Provide the absolute path to a template file on your computer. When you run `gen:sheet{"system":"dnd-5e"}`, the engine uses your file instead of the bundled default.
  - *Validation:* If you provide a path that doesn't exist, **the engine safely falls back to the built-in default template without crashing.**

---

## 2. User-Defined REST API Mapping

- **Endpoint URL:**
  - *Usage:* You can paste the URL of **any REST API**. Include `{name}` in the URL as a placeholder for server-side lookup, or omit it to download an entire static array for client-side search.
  - *Validation:* Requires valid URL syntax (`http://` or `https://`). If the API endpoint fails or 404s, **the engine catches the error and safely falls back to your offline local data.**
- **Dot-Notation JSON Mapper:**
  - Map external API keys (`unit_data.stats.health`) to internal keys (`hp`, `ac`, `speed`, `str`) using dot-notation:

```json
{
  "hp": "unit_data.stats.health",
  "ac": "unit_data.stats.armor",
  "speed": "unit_data.speed"
}
```
