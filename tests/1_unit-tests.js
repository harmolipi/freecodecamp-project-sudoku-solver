const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver');
let solver = new Solver();

const puzzles = require('../controllers/puzzle-strings').puzzlesAndSolutions;

suite('UnitTests', function() {  
    test('Logic handles a valid puzzle string of 81 characters', () => {
        console.log(puzzleGrid);
        const validation = solver.validate(puzzles[0][0]);
        assert.deepEqual(validation, {});
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const puzzle = '##5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.deepEqual(solver.validate(puzzle), {error: 'Invalid characters in puzzle'});
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.deepEqual(solver.validate('123'), {error: 'Expected puzzle to be 81 characters long'});
    });

    test('Logic handles a valid row placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const rowPlacement = solver.canPlaceInRow(puzzleGrid, 0, '1');
        
    });
});
