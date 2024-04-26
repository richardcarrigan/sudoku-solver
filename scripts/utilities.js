const defaultPuzzleSize = 9

function buildPuzzle(
  solveBtnClickHandler, width = defaultPuzzleSize,
  height = defaultPuzzleSize
) {
  const puzzleEl = document.getElementById('puzzle');

  for (let i = 0; i < height; i++) {
    const row = document.createElement('section');
    row.classList.add('row');
    puzzleEl.appendChild(row);

    for (let j = 0; j < width; j++) {
      const cell = document.createElement('input');
      cell.classList.add('cell');
      cell.maxLength = 1;
      row.appendChild(cell);
    }
  }

  const solveBtn = document.getElementById('solve-button');
  solveBtn.addEventListener('click', solveBtnClickHandler);
}

function checkPuzzle(puzzle) {
  const rows = [...puzzle];
  const columns = [];
  const boxes = [];
  let isSolvable = true;
  let isSolved = false;
  let error;

  // Check that each row contains valid values and no duplicates
  for (let i = 0; i < rows.length && isSolvable; i++) {
    isSolvable = checkSection(rows[i]);
    if (!isSolvable) {
      error = {
        row: i,
      };
      return { isSolvable, isSolved, error };
    }
  }

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
      error = {
        column: i,
      };
      return { isSolvable, isSolved, error };
    }
  }

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
      error = {
        box: i
      }
      return { isSolvable, isSolved, error };
    }
  }

  // Finally, check if all cells contain a value.
  // If they do and all previous checks passed,
  // then that means the puzzle must be solved.
  for (let i = 0; i < rows.length && !isSolved; i++) {
    for (let j = 0; j < rows[i].length && !isSolved; j++) {
      if (!rows[i][j].value) {
        return { isSolvable, isSolved };
      }
    }
  }
  isSolved = true;

  return { isSolvable, isSolved };
}

function checkSection(cells) {
  let foundValues = [];

  for (let cell of cells) {
    cell.classList.remove('invalid');
    if (cell.value) {
      if (isNaN(Number(cell.value)) || Number(cell.value) === 0 || foundValues.includes(cell.value)) {
        cell.classList.add('invalid');
        return false;
      } else {
        foundValues.push(cell.value);
      }
    }
  }

  return true;
}

function displayMessage(messageType, message) {
  const msgBox = document.getElementById('message-box');

  msgBox.classList.remove('msg-success', 'msg-error');

  if (messageType === 'error') {
    msgBox.classList.add('msg-error');
  } else if (messageType === 'success') {
    msgBox.classList.add('msg-success');
  }

  msgBox.textContent = message;
}

function getPuzzle() {
  const puzzleRows = document.querySelectorAll('.puzzle .row');
  let puzzle = [];
  puzzleRows.forEach(row => {
    let parsedRow = row.querySelectorAll('.cell');
    puzzle.push(parsedRow);
  });

  return puzzle;
}
