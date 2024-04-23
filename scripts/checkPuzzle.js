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
