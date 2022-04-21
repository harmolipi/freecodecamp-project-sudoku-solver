'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
    let solver = new SudokuSolver();

    app.route('/api/check').post((req, res) => {
        if (!req.body.puzzle || !req.body.coordinate || !req.body.value)
            return res.json({ error: 'Required field(s) missing' });

        const validation = solver.validate(
            req.body.puzzle,
            req.body.coordinate,
            req.body.value
        );
        if (validation.error) return res.json(validation);

        const puzzleGrid = solver.convertStringToArrayGrid(req.body.puzzle);
        const coordinate = solver.convertCoordinateToIndices(req.body.coordinate);
        const value = req.body.value;

        const solution = solver.check(
            puzzleGrid,
            coordinate[0],
            coordinate[1],
            value
        );

        return res.json(solution);
    });

    app.route('/api/solve').post((req, res) => {
        if (!req.body.puzzle) return res.json({ error: 'Required field missing' });

        const validation = solver.validate(req.body.puzzle);
        if (validation.error) return res.json(validation);

        const puzzleGrid = solver.convertStringToArrayGrid(req.body.puzzle);
        const solution = solver.solve(puzzleGrid);

        if (!solver.checkValidCompletedPuzzle(puzzleGrid))
            return res.json({ error: 'Puzzle cannot be solved' });

        res.json({
            solution: solver.convertArrayGridToString(solution),
        });
    });
};