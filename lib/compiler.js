function resolvePath(obj, path) {
  if (!path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (current[part] !== undefined) {
      current = current[part];
    } else if (typeof current === 'object') {
      const lowerPart = part.toLowerCase();
      const key = Object.keys(current).find(k => k.toLowerCase() === lowerPart);
      if (key) {
        current = current[key];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return current;
}

function compileTemplate(template, context) {
  // 1. Process {% for item in array %} ... {% endfor %}
  // Use a regex that allows newlines inside the block
  const forRegex = /\{%\s*for\s+(\w+)\s+in\s+([\w.]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;
  template = template.replace(forRegex, (match, itemVar, arrayPath, blockContent) => {
    const array = resolvePath(context, arrayPath);
    if (!Array.isArray(array)) return '';

    return array.map(item => {
      // Create a new context where the loop variable is accessible
      const loopContext = { ...context, [itemVar]: item };
      // Recursively compile the inner block (in case there are inner variables)
      return compileTemplate(blockContent, loopContext);
    }).join('');
  });

  // 2. Process {% if condition %} ... {% endif %}
  // Condition can be "variable" or '"string" in array'
  const ifRegex = /\{%\s*if\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g;
  template = template.replace(ifRegex, (match, conditionStr, blockContent) => {
    conditionStr = conditionStr.trim();
    let isTrue = false;

    // Check for '"value" in array' syntax
    const inMatch = conditionStr.match(/^"([^"]+)"\s+in\s+([\w.]+)$/);
    if (inMatch) {
      const value = inMatch[1];
      const array = resolvePath(context, inMatch[2]);
      if (Array.isArray(array) && array.includes(value)) {
        isTrue = true;
      }
    } else {
      // Simple boolean check for variable
      const val = resolvePath(context, conditionStr);
      if (val && val !== false && val !== 0 && val !== '') {
        isTrue = true;
      }
    }

    if (isTrue) {
      return compileTemplate(blockContent, context);
    } else {
      return '';
    }
  });

  // 3. Process {{ variable }} or {{ object.property }}
  const varRegex = /\{\{\s*([\w.]+)\s*\}\}/g;
  template = template.replace(varRegex, (match, path) => {
    const val = resolvePath(context, path);
    return val !== undefined && val !== null ? String(val) : '';
  });

  return template;
}

module.exports = { compileTemplate };
