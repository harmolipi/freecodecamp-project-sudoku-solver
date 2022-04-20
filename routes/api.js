'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {
    let solver = new SudokuSolver();

    app.route('/api/check').post((req, res) => {
        const puzzleString = req.body.puzzle;
        if (!puzzleString) return res.json({ error: 'Required field missing' });
        const solution = solver.check(puzzleString);
        return res.json({
            solution: solution,
        });
    });

    app.route('/api/solve').post((req, res) => {
        const puzzleString = req.body.puzzle;
        const result = solver.solve(puzzleString);
        res.json({
            result: result,
        });
    });
};