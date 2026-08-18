const { stats } = require('./engine.js');

class MathEngine {
  constructor(systemData) {
    this.systemData = systemData;
  }

  generateStats(args) {
    let method = parseInt(args.method || args.m, 10);
    let sets = parseInt(args.sets || args.s, 10);
    const defaultMethod = this.systemData.defaultMethod || 4;

    if (isNaN(method) || method < 1) method = defaultMethod;
    if (isNaN(sets) || sets < 0) sets = 0;
    
    let diceCount = this.systemData.diceCount;
    if (diceCount === undefined && this.systemData.attributes) {
      diceCount = this.systemData.attributes.length;
    }
    if (diceCount === undefined) diceCount = 6;

    if (diceCount === 0) {
      return Array(this.systemData.stats ? this.systemData.stats.length : 6).fill(0);
    }

    const options = {
      pool: args.pool !== undefined ? args.pool : (this.systemData.point_buy?.default_pool || this.systemData.point_pool?.pool),
      base: args.base !== undefined ? args.base : this.systemData.point_pool?.base,
      min: args.min !== undefined ? args.min : this.systemData.point_pool?.min,
      max: args.max !== undefined ? args.max : this.systemData.point_pool?.max,
      cost_table: this.systemData.point_buy?.cost_table
    };

    if (args._preAssignedSum !== undefined && options.pool) {
      options.pool -= args._preAssignedSum;
    }
    if (args._preAssignedCount !== undefined) {
      diceCount -= args._preAssignedCount;
    }
    if (diceCount <= 0) return [];

    return stats(method, sets, diceCount, options).sort((a, b) => b - a);
  }

  formatStat(score) {
    return score.toString();
  }
}

class D20MathEngine extends MathEngine {
  formatStat(score) {
    const mod = Math.floor((score - 10) / 2);
    const sign = mod >= 0 ? '+' : '';
    // Just return the modifier for the template
    return `${sign}${mod}`;
  }
}

class CyberpunkMathEngine extends MathEngine {
  // Uses base formatStat
}

class W40KMathEngine extends MathEngine {
  // Uses base formatStat
}

class RiftsMathEngine extends MathEngine {
  // Uses base formatStat
}

class D100MathEngine extends MathEngine {
  // Uses base formatStat
}

class VTMMathEngine extends MathEngine {
  // Uses base formatStat
}

class GameMath {
  constructor(systemKey, systemData) {
    this.key = systemKey;
    this.data = systemData;
    this.engine = this._createEngine();
  }

  _createEngine() {
    const engineType = this.data.engine || 'default';
    switch (engineType) {
      case 'd20':
        return new D20MathEngine(this.data);
      case 'cyberpunk':
        return new CyberpunkMathEngine(this.data);
      case 'w40k':
        return new W40KMathEngine(this.data);
      case 'rifts':
        return new RiftsMathEngine(this.data);
      case 'd100':
        return new D100MathEngine(this.data);
      case 'vtm':
        return new VTMMathEngine(this.data);
      default:
        return new MathEngine(this.data);
    }
  }

  generateStats(args) {
    return this.engine.generateStats(args);
  }

  formatStat(score) {
    return this.engine.formatStat(score);
  }
}

module.exports = {
  GameMath,
  MathEngine,
  D20MathEngine,
  CyberpunkMathEngine,
  W40KMathEngine,
  RiftsMathEngine,
  D100MathEngine,
  VTMMathEngine
};
