class SudokuSolver {
    validate(puzzleString) {
        const validCharTest = /^[0-9.]{81}$/;
        if (!validCharTest.test(puzzleString)) {
            return false;
        }
        return true;
    }

    checkRowPlacement(puzzleString, row, column, value) {}

    checkColPlacement(puzzleString, row, column, value) {}

    checkRegionPlacement(puzzleString, row, column, value) {}

    solve(puzzleString) {}
}

module.exports = SudokuSolver;