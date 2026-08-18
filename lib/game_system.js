const { stats } = require('./engine.js');
const TEMPLATES = require('./templates.js');

class Engine {
  constructor(systemData) {
    this.systemData = systemData;
  }

  generateStats(args) {
    let method = parseInt(args.method || args.m, 10);
    let sets = parseInt(args.sets || args.s, 10);
    const defaultMethod = this.systemData.defaultMethod || 4;

    if (isNaN(method) || method < 1) method = defaultMethod;
    if (isNaN(sets) || sets < 0) sets = 0;
    
    // For systems like Fate/Fudge that don't roll typical attributes
    if (this.systemData.diceCount === 0) {
      return Array(this.systemData.stats.length).fill(0);
    }

    return stats(method, sets, this.systemData.diceCount).sort((a, b) => b - a);
  }

  formatStat(score) {
    return score.toString();
  }

  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.DEFAULT,
      combat: TEMPLATES.COMBAT.DEFAULT,
      features: TEMPLATES.FEATURES.DEFAULT,
      npcHeader: TEMPLATES.NPC_HEADER.DEFAULT,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class D20Engine extends Engine {
  formatStat(score) {
    const mod = Math.floor((score - 10) / 2);
    const sign = mod >= 0 ? '+' : '';
    return `**${score}** *(Mod: ${sign}${mod})*`;
  }

  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.D20,
      combat: TEMPLATES.COMBAT.D20,
      features: TEMPLATES.FEATURES.D20,
      npcHeader: TEMPLATES.NPC_HEADER.D20,
      npcFooter: TEMPLATES.NPC_FOOTER.D20,
      shared: TEMPLATES.SHARED
    };
  }
}

class CyberpunkEngine extends Engine {
  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.CYBERPUNK,
      combat: TEMPLATES.COMBAT.CYBERPUNK,
      features: TEMPLATES.FEATURES.CYBERPUNK,
      npcHeader: TEMPLATES.NPC_HEADER.CYBERPUNK,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class W40KEngine extends Engine {
  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.W40K,
      combat: TEMPLATES.COMBAT.W40K,
      features: TEMPLATES.FEATURES.W40K,
      npcHeader: TEMPLATES.NPC_HEADER.W40K,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class RiftsEngine extends Engine {
  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.RIFTS,
      combat: TEMPLATES.COMBAT.RIFTS,
      features: TEMPLATES.FEATURES.RIFTS,
      npcHeader: TEMPLATES.NPC_HEADER.RIFTS,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class D100Engine extends Engine {
  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.COC,
      combat: TEMPLATES.COMBAT.DEFAULT, // Could be specific to CoC
      features: TEMPLATES.FEATURES.DEFAULT,
      npcHeader: TEMPLATES.NPC_HEADER.DEFAULT,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class VTMEngine extends Engine {
  getTemplates() {
    return {
      core: TEMPLATES.CORE_INFO.VTM,
      combat: TEMPLATES.COMBAT.VTM,
      features: TEMPLATES.FEATURES.DEFAULT,
      npcHeader: TEMPLATES.NPC_HEADER.DEFAULT,
      npcFooter: TEMPLATES.NPC_FOOTER.DEFAULT,
      shared: TEMPLATES.SHARED
    };
  }
}

class GameSystem {
  constructor(systemKey, systemData) {
    this.key = systemKey;
    this.data = systemData;
    this.engine = this._createEngine();
  }

  _createEngine() {
    const engineType = this.data.engine || 'default';
    switch (engineType) {
      case 'd20':
        return new D20Engine(this.data);
      case 'cyberpunk':
        return new CyberpunkEngine(this.data);
      case 'w40k':
        return new W40KEngine(this.data);
      case 'rifts':
        return new RiftsEngine(this.data);
      case 'd100':
        return new D100Engine(this.data);
      case 'vtm':
        return new VTMEngine(this.data);
      default:
        return new Engine(this.data);
    }
  }

  generateStats(args) {
    return this.engine.generateStats(args);
  }

  formatStat(score) {
    return this.engine.formatStat(score);
  }

  getTemplates() {
    return this.engine.getTemplates();
  }
}

module.exports = {
  GameSystem,
  Engine,
  D20Engine,
  CyberpunkEngine,
  W40KEngine,
  RiftsEngine,
  D100Engine,
  VTMEngine
};
