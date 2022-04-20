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

    checkRowPlacement(puzzleGrid, row, value) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[row][i] === value) {
                count += 1;
            }
        }
        return count === 1;
    }

    checkColPlacement(puzzleGrid, column, value) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[i][column] === value) {
                count += 1;
            }
        }
        return count === 1;
    }

    checkRegionPlacement(puzzleGrid, row, column, value) {
        let count = 0;
        const regionRow = Math.floor(row / 3) * 3;
        const regionColumn = Math.floor(column / 3) * 3;
        for (let i = regionRow; i < regionRow + 3; i++) {
            for (let j = regionColumn; j < regionColumn + 3; j++) {
                if (puzzleGrid[i][j] === value) {
                    count += 1;
                }
            }
        }
        return count === 1;
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
        const puzzleGrid = this.convertStringToArrayGrid(puzzleString);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const value = puzzleGrid[i][j];
                if (value === '.') {
                    return false;
                }
                if (!this.checkRowPlacement(puzzleGrid, i, value) ||
                    !this.checkColPlacement(puzzleGrid, j, value) ||
                    !this.checkRegionPlacement(puzzleGrid, i, j, value)
                ) {
                    return false;
                }
            }
        }
        return true;
    }
}

module.exports = SudokuSolver;