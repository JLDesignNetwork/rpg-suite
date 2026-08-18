const UNIVERSAL_SHEET = `<h1 align="center">{{ system_meta.name }}</h1>

## Character: {{ name }}

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% if class %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.class_label }}:</b> {{ class }}</p>{% endif %}
{% if level %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.level_label }}:</b> {{ level }}</p>{% endif %}
{% if max_exp %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>EXP:</b> {{ current_exp }} / {{ max_exp }}</p>{% endif %}
{% if max_hp %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.health_metric_label }}:</b> {{ current_hp }} / {{ max_hp }}</p>{% endif %}
{% if "hunger" in unique_blocks %}
<p style="break-inside: avoid; margin-bottom: 10px;"><b>Hunger:</b> {{ hunger }}</p>
{% endif %}
{% if "humanity" in unique_blocks %}
<p style="break-inside: avoid; margin-bottom: 10px;"><b>Humanity:</b> {{ humanity }}</p>
{% endif %}
</div>

## Combat

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% if ac %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>{{ system_meta.ac_label }}:</b> {{ ac }}
</div>{% endif %}
{% if init %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Initiative:</b> {{ init }}
</div>{% endif %}
{% if speed %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>{{ system_meta.speed_label }}:</b> {{ speed }}
</div>{% endif %}
</div>

## Attributes

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% for stat in attributes %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>{{ stat.name }}:</b> {{ stat.score_formatted }}
</div>
{% endfor %}</div>

## Skills

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% for skill in skills_payload %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>{{ skill.name }} ({{ skill.governing_stat }}):</b> +{{ skill.base_mod }}
</div>
{% endfor %}</div>

{% if "cyberware_tracker" in unique_blocks %}
## Cyberware

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Name:</b> <br>
<b>Effect:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Name:</b> <br>
<b>Effect:</b> 
</div>
</div>
{% endif %}
{% if "spellcasting" in unique_blocks %}
## Spellcasting

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Spell Name:</b> <br>
<b>Level:</b> <br>
<b>Casting Time:</b> <br>
<b>Duration:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Spell Name:</b> <br>
<b>Level:</b> <br>
<b>Casting Time:</b> <br>
<b>Duration:</b> 
</div>
</div>
{% endif %}
{% if "powers" in unique_blocks %}
## Powers

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Power Name:</b> <br>
<b>Action:</b> <br>
<b>Effect:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Power Name:</b> <br>
<b>Action:</b> <br>
<b>Effect:</b> 
</div>
</div>
{% endif %}
{% if "wargear" in unique_blocks %}
## Wargear

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Weapon:</b> <br>
<b>Damage:</b> <br>
<b>AP / Range:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Weapon:</b> <br>
<b>Damage:</b> <br>
<b>AP / Range:</b> 
</div>
</div>
{% endif %}

## Equipment

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Item:</b> <br>
<b>Weight / Value:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Item:</b> <br>
<b>Weight / Value:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Item:</b> <br>
<b>Weight / Value:</b> 
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Item:</b> <br>
<b>Weight / Value:</b> 
</div>
</div>

## Background & History

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Background:</b><br>
{{ background }}
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>History:</b><br>
- 
</div>
</div>
`;

const UNIVERSAL_NPC = `<h1 align="center">{{ system_meta.name }} NPC</h1>

## Character: {{ name }}

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% if class %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.class_label }}:</b> {{ class }}</p>{% endif %}
{% if current_hp %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.health_metric_label }}:</b> {{ current_hp }}</p>{% endif %}
{% if ac %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.ac_label }}:</b> {{ ac }}</p>{% endif %}
{% if speed %}<p style="break-inside: avoid; margin-bottom: 10px;"><b>{{ system_meta.speed_label }}:</b> {{ speed }}</p>{% endif %}
</div>

## Attributes

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
{% for stat in attributes %}<div style="break-inside: avoid; margin-bottom: 15px;">
<b>{{ stat.name }}:</b> {{ stat.score_formatted }}
</div>
{% endfor %}</div>

## Actions / Attacks

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>Unarmed Strike:</b><br>
+0 to hit, 1d6 damage.
</div>
</div>
`;

const SHARED = {
  TRACKER: `# Initiative Tracker

<div style="columns: 4; column-gap: 20px; column-rule: 1px solid rgba(0,0,0,0.2); text-wrap: pretty; background-color:rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.5); margin-bottom: 30px;">
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>[Init] Name:</b><br>
<b>HP:</b>  / <br>
<b>Notes:</b>
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>[Init] Name:</b><br>
<b>HP:</b>  / <br>
<b>Notes:</b>
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>[Init] Name:</b><br>
<b>HP:</b>  / <br>
<b>Notes:</b>
</div>
<div style="break-inside: avoid; margin-bottom: 15px;">
<b>[Init] Name:</b><br>
<b>HP:</b>  / <br>
<b>Notes:</b>
</div>
</div>
`
};

module.exports = {
  UNIVERSAL_SHEET,
  UNIVERSAL_NPC,
  SHARED
};
