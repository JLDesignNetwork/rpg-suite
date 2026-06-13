/**
 * @since 0.2.4
 * @version 1.0.0
 */

/**
 * Rolls a specified number of dice with given sides.
 * @param {number} dice - Number of dice to roll.
 * @param {number|string} sides - Number of sides, or 'F' for fate.
 * @param {boolean} usingFate - Whether to use Fate/Fudge logic (-1 to 1).
 * @returns {number} The total result of the rolls.
 */
const rollDice = (dice, sides, usingFate) => {
    let parsedDice = parseInt(dice, 10);
    if (isNaN(parsedDice)) parsedDice = 1;
    if (parsedDice < 0) parsedDice = 0;
    let safeDice = Math.min(parsedDice, 100);
    
    let safeSides = parseInt(sides, 10);
    if (isNaN(safeSides) || safeSides < 1) safeSides = 20;

    let total = 0;
    for (let i = 0; i < safeDice; i++) {
        if (usingFate) {
            total += Math.floor(Math.random() * 3) - 1;
        } else {
            total += Math.floor(Math.random() * safeSides) + 1;
        }
    }
    return total;
};

/**
 * Generates an array of ability scores using standard TTRPG methods.
 * @param {number} method - 3 (3d6) or 4 (4d6 drop lowest).
 * @param {number} count - Number of rolls per set for method 3.
 * @param {number} statCount - Number of stats to generate (default 6).
 * @returns {number[]} Array of generated ability scores.
 */
const stats = (method, count, statCount = 6) => {
    const multipleRolls = (method === 3 && count >= 1);
    const statsArray = [];
    let dev = `Stat generation using method ${method}d6`;

    switch(method) {
        case 3:
            if (count !== 0) {
                dev += `, ${count} times per set. Selecting the best score from each set.\n`;
            }
            if (multipleRolls) {
                for (let i = 0; i < statCount; i++) {
                    const arr = [];
                    for (let x = 0; x < count; x++) arr.push(rollDice(3, 6, false));
                    arr.sort((a, b) => b - a);
                    dev += `Set ${i + 1}: ${arr}\n`;
                    statsArray.push(arr[0]);
                }
            } else {
                for (let i = 0; i < statCount; i++) {
                    statsArray.push(rollDice(3, 6, false));
                }
            }
            dev += `Final stat array: ${statsArray}`;
            break;

        case 4:
            dev += `. Roll 1d6, 4 times per stat. Drop the worst d6 roll, tally the remaining 3.\n`;
            for (let i = 0; i < statCount; i++) {
                const arr = [];
                for (let x = 0; x < 4; x++) arr.push(rollDice(1, 6, false));
                arr.sort((a, b) => b - a);
                arr.pop();
                statsArray.push(arr.reduce((a, b) => a + b, 0));
                dev += `Best of set ${i + 1}: ${arr}\n`;
            }
            dev += `Final stat array: ${statsArray}`;
            break;
    }
    return statsArray;
};

module.exports = { rollDice, stats };
