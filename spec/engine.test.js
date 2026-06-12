/**
 * @since 0.2.4
 * @version 0.2.5
 */

const { rollDice, stats } = require('../lib/engine');

describe('Dice Engine', () => {
    describe('rollDice', () => {
        test('rolls basic dice within expected range', () => {
            const result = rollDice(1, 20, false);
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(20);
        });

        test('rolls fate dice within expected range', () => {
            const result = rollDice(1, 'F', true);
            expect(result).toBeGreaterThanOrEqual(-1);
            expect(result).toBeLessThanOrEqual(1);
        });
        
        test('multiple dice sum correctly', () => {
            const result = rollDice(5, 6, false);
            expect(result).toBeGreaterThanOrEqual(5);
            expect(result).toBeLessThanOrEqual(30);
        });
    });

    describe('stats generation', () => {
        test('method 3 generates 6 stats within range (3d6)', () => {
            const pool = stats(3, 1);
            expect(pool.length).toBe(6);
            pool.forEach(stat => {
                expect(stat).toBeGreaterThanOrEqual(3);
                expect(stat).toBeLessThanOrEqual(18);
            });
        });

        test('method 4 generates 6 stats within range (4d6 drop lowest)', () => {
            const pool = stats(4, 0);
            expect(pool.length).toBe(6);
            pool.forEach(stat => {
                expect(stat).toBeGreaterThanOrEqual(3);
                expect(stat).toBeLessThanOrEqual(18);
            });
        });
    });
});
