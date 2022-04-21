'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
    let solver = new SudokuSolver();

    app.route('/api/check').post((req, res) => {
        if (!req.body.puzzle || !req.body.coordinate || !req.body.value) return res.json({ error: 'Required field(s) missing' });
        const puzzleGrid = solver.convertStringToArrayGrid(req.body.puzzle);
        const coordinate = solver.convertCoordinateToIndices(req.body.coordinate);
        const value = req.body.value;
        const solution = solver.check(puzzleGrid, coordinate[0], coordinate[1], value);

        return res.json(solution);
    });

    app.route('/api/solve').post((req, res) => {
        const puzzleString = req.body.puzzle;
        // if (!puzzleString) return res.json({ error: 'Required field missing' });
        // if (!solver.validate(puzzleString))
        //     return res.json({ error: 'Invalid puzzle' });
        const puzzleGrid = solver.convertStringToArrayGrid(puzzleString);
        const solution = solver.convertArrayGridToString(
            solver.solve(puzzleGrid, 0, 0)
        );
        res.json({
            solution,
        });
    });
};