# ⌨️ Custom Keybindings in Pulsar

> **Document:** `docs/keybindings.md`  
> **Author:** Jeff Langdon (JL Design Network)  

RPG Suite registers commands like `rpg-suite:roll` to default keybindings (e.g. `ctrl-r` or `cmd-r`).

---

## Configuring Custom Keymaps

Because Pulsar (and Atom) uses a centralized native Keymap manager, you customize keybindings in your global `keymap.cson` file:

1. Open Pulsar Settings (`ctrl-,` or `cmd-,`).
2. Navigate to the **Keybindings** tab on the left.
3. Click the **"your keymap file"** link at the top (opens `~/.pulsar/keymap.cson`).
4. Add your custom hotkey binding:

```cson
'atom-workspace':
  'ctrl-alt-r': 'rpg-suite:roll'
  'ctrl-alt-s': 'rpg-suite:gen-sheet-dnd5e'
  'ctrl-alt-n': 'rpg-suite:gen-npc-dnd5e'
  'ctrl-alt-i': 'rpg-suite:gen-tracker'
```

5. Save the file. Your custom hotkeys are instantly active across the workspace!
