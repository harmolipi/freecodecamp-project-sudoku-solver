class SudokuSolver {
    validate(puzzleString, coordinate='', value='') {
        const validCoordinateTest = /^[A-I][1-9]$/i;
        const validCharTest = /^[1-9.]*$/;
        const validValueTest = /^[1-9]$/;

        if (coordinate.length > 0 && !validCoordinateTest.test(coordinate)) {
            return {error: 'Invalid coordinate'};
        }
        if (value.length > 0 && !validValueTest.test(value)) {
            return {error: 'Invalid value'};
        }
        if (puzzleString.length !== 81 ) {
            return {error: 'Expected puzzle to be 81 characters long'};
        } else if (!validCharTest.test(puzzleString)) {
            return {error: 'Invalid characters in puzzle'};
        }

        return {};
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

    convertCoordinateToIndices(coordinate) {
        const coordMap = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            G: 6,
            H: 7,
            I: 8,
        }

        return [coordMap[coordinate[0].toUpperCase()], String(Number(coordinate[1]) - 1)]
    }

    checkRowPlacement(puzzleGrid, row, value) {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[row][i] === String(value)) {
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

    canPlaceInRow(puzzleGrid, row, value) {
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[row][i] === value) {
                return false;
            }
        }
        return true;
    }

    canPlaceInColumn(puzzleGrid, column, value) {
        for (let i = 0; i < 9; i++) {
            if (puzzleGrid[i][column] === value) {
                return false;
            }
        }
        return true;
    }

    canPlaceInRegion(puzzleGrid, row, column, value) {
        const regionRow = Math.floor(row / 3) * 3;
        const regionColumn = Math.floor(column / 3) * 3;
        for (let i = regionRow; i < regionRow + 3; i++) {
            for (let j = regionColumn; j < regionColumn + 3; j++) {
                if (puzzleGrid[i][j] === value) {
                    return false;
                }
            }
        }
        return true;
    }

    safePlacement(puzzleGrid, row, column, value) {
        return(this.canPlaceInRow(puzzleGrid, row, value) &&
            this.canPlaceInColumn(puzzleGrid, column, value) &&
            this.canPlaceInRegion(puzzleGrid, row, column, value)
        );
    }

    solve(puzzleGrid, row = 0, column = 0) {
        const validation = this.validate(this.convertArrayGridToString(puzzleGrid));
        if (validation.error) {
            // console.log(puzzleGrid);
            return validation;
        }

        // Base case: at the end of the grid
        if (row === 9 - 1 && column == 9) {
            return true;
        }

        // At the end of the row, go to the next row
        if (column === 9) {
            row++;
            column = 0;
        }

        // If the current cell is not empty, go to the next cell
        if (puzzleGrid[row][column] !== '.') {
            return this.solve(puzzleGrid, row, column + 1);
        }

        for (let num = 1; num < 10; num++) {
            // Check if it's a valid placement
            if (this.safePlacement(puzzleGrid, row, column, String(num))) {
                // Place the number
                puzzleGrid[row][column] = String(num);

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

    check(puzzleGrid, row, column, value) {
        const conflict = [];
        let valid = true;
        
        if (!this.validate(this.convertArrayGridToString(puzzleGrid))) {
            valid = false;
        }

        // Normalize square in case number already placed
        puzzleGrid[row][column] = '.'

        if (!this.canPlaceInRow(puzzleGrid, row, value)) conflict.push('row');
        if (!this.canPlaceInColumn(puzzleGrid, column, value)) conflict.push('column');
        if (!this.canPlaceInRegion(puzzleGrid, row, column, value)) conflict.push('region');
        valid = conflict.length === 0;

        if (conflict.length === 0) return {valid};
        return {valid, conflict};
    }

    checkValidCompletedPuzzle(puzzleGrid) {
        if (!this.validate(this.convertArrayGridToString(puzzleGrid))) {
            return false;
        }
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