function handleSolveBtnClick() {
  const msgBox = document.getElementById('message-box');
  msgBox.textContent = '';
  msgBox.classList.remove('msg-success', 'msg-error');

  // Step 1: Collect all user-entered values
  let puzzle = [];
  const puzzleRows = document.querySelectorAll('.puzzle .row');
  puzzleRows.forEach((row) => {
    let rowValues = [];
    const cells = row.querySelectorAll('.cell');
    cells.forEach((cell) => {
      rowValues.push(cell.value === '' ? null : cell.value);
    });
    puzzle.push(rowValues);
  });

  // Step 2: Check that puzzle can be solved. Specifically, a puzzle is solvable if:
  // - No box, row, or column contains the same value twice
  // - All values are numbers in the range 1-9
  let { isSolvable, message, isSolved } = checkPuzzle(puzzle);

  msgBox.classList.add(isSolvable ? 'msg-success' : 'msg-error');
  msgBox.textContent = message;

  // Step 3: Solve puzzle
  // Initially, I'll do this wth brute-force by trying each number 1-9 in each cell.
  // Next, I'll improve by eliminating the need to backtrack.
  // Finally, I'll optimize.
  let resultPuzzle = puzzle;
  // while (isSolvable && !isSolved) {
  //   resultPuzzle = addNextValue(resultPuzzle);
  // }
}

function checkSection(values) {
  let foundValues = [];

  for (let value of values) {
    if (value !== null) {
      if (isNaN(Number(value)) || Number(value) === 0 || foundValues.includes(value)) {
        return false;
      } else {
        foundValues.push(value);
      }
    }
  }

  return true;
}

function checkPuzzle(puzzle) {
  const rows = puzzle;
  let isSolvable = true;
  let message = '';
  let isSolved = true;
  
  // Check that each row contains valid values and no duplicates
  for (let i = 0; i < rows.length && isSolvable; i++) {
    isSolvable = checkSection(rows[i]);
    if (!isSolvable) {
      message = `Row ${i + 1} contains an invalid value`;
    }
  }
  
  if (isSolvable) {
    const columns = [];

    // Translate rows into columns
    rows.forEach(row => {
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
      }
    }
  }
  
  if (isSolvable) {
    const boxes = [];

    // Translate rows into 3x3 'boxes'
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
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
      }
    }
  }

  // If the puzzle is still solvable after checking all rows, columns, and boxes,
  // return a success message
  if (isSolvable) {
    message = 'Puzzle is solvable';
  }

  // Finally, check if all cells contain a value. If they do and all previous checks
  // passed, then that means the puzzle must be solved.
  if (isSolvable) {
    for (let i = 0; i < rows.length && isSolved; i++) {
      for (let j = 0; j < rows[i].length && isSolved; j++) {
        if (rows[i][j] === null) {
          isSolved = false;
        } else {
          console.log(`${rows[i][j]} is a number`);
        }
      }
    }
  }

  if (isSolved) {
    message = 'Congratulations. The puzzle is now solved!';
  }

  return { isSolvable, message, isSolved };
}

function addNextValue(puzzle) {
  const updatedPuzzle = puzzle;

  return updatedPuzzle;
}