const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver');
let solver = new Solver();

const puzzles = require('../controllers/puzzle-strings').puzzlesAndSolutions;

suite('UnitTests', function() {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        const validation = solver.validate(puzzles[0][0]);
        assert.deepEqual(validation, {});
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const puzzle =
            '##5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        assert.deepEqual(solver.validate(puzzle), {
            error: 'Invalid characters in puzzle',
        });
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.deepEqual(solver.validate('123'), {
            error: 'Expected puzzle to be 81 characters long',
        });
    });

    test('Logic handles a valid row placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const rowPlacement = solver.canPlaceInRow(puzzleGrid, 0, '3');
        assert.isTrue(rowPlacement, 'Can place valid value in row');
    });

    test('Logic handles an invalid row placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const rowPlacement = solver.canPlaceInRow(puzzleGrid, 0, '1');
        assert.isFalse(rowPlacement, 'Cannot place invalid value in row');
    });

    test('Logic handles a valid column placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const columnPlacement = solver.canPlaceInColumn(puzzleGrid, 1, '3');
        assert.isTrue(columnPlacement, 'Can place valid value in column');
    });

    test('Logic handles an invalid column placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const columnPlacement = solver.canPlaceInColumn(puzzleGrid, 1, '9');
        assert.isFalse(columnPlacement, 'Cannot place invalid value in column');
    });

    test('Logic handles a valid region placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const regionPlacement = solver.canPlaceInRegion(puzzleGrid, 0, 1, '3');
        assert.isTrue(regionPlacement, 'Can place valid value in region');
    });

    test('Logic handles an invalid region placement', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const regionPlacement = solver.canPlaceInRegion(puzzleGrid, 0, 1, '5');
        assert.isFalse(regionPlacement, 'Cannot place invalid value in region');
    });

    test('Valid puzzle strings pass the solver', () => {
        const puzzleString = puzzles[0][0];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const solution = solver.solve(puzzleGrid);
        assert.notProperty(solution, 'error', 'Does not return an error');
    });

    test('Invalid puzzle strings fail the solver', () => {
        const puzzleString = '123';
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const solution = solver.solve(puzzleGrid);
        assert.property(solution, 'error', 'Returns an error');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const puzzleString = puzzles[0][0];
        const puzzleSolution = puzzles[0][1];
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const solutionGrid = solver.solve(puzzleGrid);
        const solutionString = solver.convertArrayGridToString(solutionGrid);
        assert.equal(solutionString, puzzleSolution, 'Solution is correct');
    });
});