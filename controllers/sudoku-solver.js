class SudokuSolver {
    validate(puzzleString) {
        const validCharTest = /^[0-9.]{81}$/;
        if (!validCharTest.test(puzzleString)) {
            return false;
        }
        return true;
    }

    convertStringToArrayGrid(puzzleString) {
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(puzzleString.substr(i * 9, 9).split(''));
        }
        return grid;
    }

    checkRowPlacement(puzzleString, row, column, value) {
        const rowString = puzzleString.substring(row * 9, row * 9 + 9);
        const rowValues = rowString.split('');
        if (rowValues.includes(value)) {
            return false;
        }
        return true;
    }

    checkColPlacement(puzzleString, row, column, value) {
        const colValues = puzzleString.split('').filter((_, i) => i % 9 === column);
        if (colValues.includes(value)) {
            return false;
        }
        return true;
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        const regionRow = Math.floor(row / 3) * 3;
        const regionCol = Math.floor(column / 3) * 3;
        const regionValues = puzzleString.split('').filter((_, i) => {
            const rowIndex = Math.floor(i / 9);
            const colIndex = i % 9;
            return (
                rowIndex >= regionRow &&
                rowIndex < regionRow + 3 &&
                colIndex >= regionCol &&
                colIndex < regionCol + 3
            );
        });
        if (regionValues.includes(value)) {
            return false;
        }
        return true;
    }

    solve(puzzleString) {
        if (!this.validate(puzzleString)) {
            return false;
        }
        const puzzleArray = puzzleString.split('');
        for (let i = 0; i < puzzleArray.length; i++) {
            const row = Math.floor(i / 9);
            const column = i % 9;
            const value = puzzleArray[i];
            if (value === '.') {
                for (let j = 1; j <= 9; j++) {
                    if (
                        this.checkRowPlacement(puzzleString, row, column, j) &&
                        this.checkColPlacement(puzzleString, row, column, j) &&
                        this.checkRegionPlacement(puzzleString, row, column, j)
                    ) {
                        puzzleArray[i] = j;
                        const solution = this.solve(puzzleArray.join(''));
                        if (solution) {
                            return solution;
                        }
                        puzzleArray[i] = '.';
                    }
                }
                return false;
            }
        }
        return puzzleArray.join('');
    }

    check(puzzleString) {
        if (!this.validate(puzzleString)) {
            return false;
        }
        const puzzleArray = puzzleString.split('');
        for (let i = 0; i < puzzleArray.length; i++) {
            const row = Math.floor(i / 9);
            const column = i % 9;
            const value = puzzleArray[i];
            if (value === '.') {
                return false;
            }
            if (!this.checkRowPlacement(puzzleString, row, column, value) ||
                !this.checkColPlacement(puzzleString, row, column, value) ||
                !this.checkRegionPlacement(puzzleString, row, column, value)
            ) {
                return false;
            }
        }
        return true;
    }
}

module.exports = SudokuSolver;