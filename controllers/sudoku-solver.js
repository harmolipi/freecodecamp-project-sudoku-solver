class SudokuSolver {
    validate(puzzleString) {
        const validCharTest = /^[1-9.]{81}$/;
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

    convertArrayGridToString(puzzleGrid) {
        if (!puzzleGrid) {
            return false;
        }
        let puzzleString = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                puzzleString += puzzleGrid[i][j];
            }
        }
        return puzzleString;
    }

    checkRowPlacement(puzzleGrid, row, value) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[row][i] === value) {
                count += 1;
            }
        }
        console.log('row placement is', count >= 1);
        return count >= 1;
    }

    checkColPlacement(puzzleGrid, column, value) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[i][column] === value) {
                count += 1;
            }
        }
        console.log('column placement is', count >= 1);
        return count >= 1;
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
        console.log('region placement is', count >= 1);
        return count >= 1;
    }

    safePlacement(puzzleGrid, row, column, value) {
        return (!this.checkRowPlacement(puzzleGrid, row, value) &&
            !this.checkColPlacement(puzzleGrid, column, value) &&
            !this.checkRegionPlacement(puzzleGrid, row, column, value)
        );
    }

    solve(puzzleGrid, row, column) {
        console.log('checking', row, column);
        // Base case: at the end of the grid
        if (row === 9 - 1 && column == 9) {
            console.log('returning end of grid');
            return true;
        }

        // At the end of the row, go to the next row
        if (column === 9) {
            console.log('returning next row');
            row++;
            column = 0;
        }

        // If the current cell is not empty, go to the next cell
        if (puzzleGrid[row][column] !== '.') {
            console.log('returning next cell');
            return this.solve(puzzleGrid, row, column + 1);
        }

        for (let num = 1; num < 10; num++) {
            console.log('checking', num);
            // Check if it's a valid placement
            if (this.safePlacement(puzzleGrid, row, column, num)) {
                // Place the number
                puzzleGrid[row][column] = `${num}`;

                // Go to the next cell
                if (this.solve(puzzleGrid, row, column + 1)) {
                    return puzzleGrid;
                }
            }

            // Remove the number if we're wrong, so we can try a different one
            puzzleGrid[row][column] = '.';
        }
        return false;
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