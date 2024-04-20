let currentCellCoordinates = {};
let hasBacktracked = false;
const msgBox = document.getElementById('message-box');

function handleSolveBtnClick() {
  msgBox.textContent = '';
  msgBox.classList.remove('msg-success', 'msg-error');

  // Step 1: Put all cells into 2D array
  const puzzleRows = document.querySelectorAll('.puzzle .row');
  let puzzle = [];
  puzzleRows.forEach((row) => {
    let parsedRow = row.querySelectorAll('.cell');
    puzzle.push(parsedRow);
  });

  // Step 2: Check that puzzle can be solved as submitted.
  // Specifically, a puzzle is solvable if:
  //   - No box, row, or column contains the same value twice
  //   - All values are numbers in the range 1-9
  let { isSolvable, message, isSolved } = checkPuzzle(puzzle);

  if (!isSolvable) {
    msgBox.classList.add('msg-error');
    msgBox.textContent = message;
    return;
  } else if (isSolved) {
    msgBox.classList.add('msg-success');
    msgBox.textContent = message;
  }

  // Step 3: Solve puzzle
  // Initially, I'll do this wth brute-force by trying each number 1-9 in each cell.
  // Next, I'll improve by eliminating the need to backtrack.
  // Finally, I'll optimize.
  while (!isSolved) {
    if (isSolvable && !hasBacktracked) {
      currentCellCoordinates = findNextNull(puzzle);
      const { x, y } = currentCellCoordinates;
      puzzle[x][y].classList.add('generated');
      puzzle[x][y].value = 1;
      ({ isSolvable, message, isSolved } = checkPuzzle(puzzle));
    } else {
      if (hasBacktracked) {
        hasBacktracked = false;
      }
      if (currentCellCoordinates.hasOwnProperty('x') && currentCellCoordinates.hasOwnProperty('y')) {
        const { x, y } = currentCellCoordinates;
        if (x < 0) {
          isSolved = true;
          message = 'Puzzle can not be solved';
          isSolvable = false;
        } else {
          currentCellCoordinates = incrementPuzzleValues(puzzle, x, y);
          ({ isSolvable, message, isSolved } = checkPuzzle(puzzle));
        }
      }
    }
  }

  msgBox.classList.remove('msg-success', 'msg-error');
  msgBox.classList.add(isSolvable ? 'msg-success' : 'msg-error');
  msgBox.textContent = message;
}

function checkSection(cells) {
  let foundValues = [];

  for (let cell of cells) {
    cell.classList.remove('invalid');
    if (cell.value) {
      if (
        isNaN(Number(cell.value)) ||
        Number(cell.value) === 0 ||
        foundValues.includes(cell.value)
      ) {
        cell.classList.add('invalid');
        return false;
      } else {
        foundValues.push(cell.value);
      }
    }
  }

  return true;
}

function checkPuzzle(puzzle) {
  const rows = puzzle;
  let isSolvable = true;
  let message = '';
  let isSolved = false;

  // Check that each row contains valid values and no duplicates
  for (let i = 0; i < rows.length && isSolvable; i++) {
    isSolvable = checkSection(rows[i]);
    if (!isSolvable) {
      message = `Row ${i + 1} contains an invalid value`;
      return { isSolvable, message, isSolved };
    }
  }

  const columns = [];

  // Translate rows into columns
  rows.forEach((row) => {
    row.forEach((cell, index) => {
      if (!columns[index]) {
        columns[index] = [];
      }
      columns[index].push(cell);
    });
  });

  // Check that each column contains valid values and no duplicates
  for (let i = 0; i < columns.length && isSolvable; i++) {
    isSolvable = checkSection(columns[i]);
    if (!isSolvable) {
      message = `Column ${i + 1} contains an invalid value`;
      return { isSolvable, message, isSolved };
    }
  }

  const boxes = [];

  // Translate rows into 3x3 'boxes'
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const boxIndex =
        Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
      if (!boxes[boxIndex]) {
        boxes[boxIndex] = [];
      }
      boxes[boxIndex].push(cell);
    });
  });

  // Check that each box contains valid values and no duplicates
  for (let i = 0; i < boxes.length && isSolvable; i++) {
    isSolvable = checkSection(boxes[i]);
    if (!isSolvable) {
      message = `Box ${i + 1} contains an invalid value`;
      return { isSolvable, message, isSolved };
    }
  }

  // If the puzzle is still solvable after checking all rows, columns, and boxes,
  // return a success message
  message = 'Puzzle is solvable';

  // Finally, check if all cells contain a value. If they do and all previous checks
  // passed, then that means the puzzle must be solved.
  for (let i = 0; i < rows.length && !isSolved; i++) {
    for (let j = 0; j < rows[i].length && !isSolved; j++) {
      if (!rows[i][j].value) {
        isSolved = false;
        return { isSolvable, message, isSolved };
      }
    }
  }
  isSolved = true;
  message = 'Congratulations. The puzzle is now solved!';
  return { isSolvable, message, isSolved };
}

function findNextNull(puzzle) {
  for (let x = 0; x < puzzle.length; x++) {
    for (let y = 0; y < puzzle[x].length; y++) {
      if (!puzzle[x][y].value) {
        return { x, y };
      }
    }
  }
}

function findPreviousCell(puzzle, x, y) {
  hasBacktracked = true;

  let result = { x, y };
  let found = false;
  while (!found) {
    if (result.y > 0) {
      result = { x: result.x, y: result.y - 1 };
    } else {
      result = { x: result.x - 1, y: 8 };
    }
    if (
      result.x < 0 ||
      [...puzzle[result.x][result.y].classList].includes('generated')
    ) {
      found = true;
    }
  }
  return result;
}

function incrementPuzzleValues(puzzle, x, y) {
  if (puzzle[x][y].value < 9) {
    puzzle[x][y].value++;
    return { x, y };
  } else {
    puzzle[x][y].value = '';
    return findPreviousCell(puzzle, x, y);
  }
}
