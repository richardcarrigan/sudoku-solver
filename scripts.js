function solvePuzzle() {
  // Step 1: Collect all user-entered values
  let puzzle = [];
  const puzzleRows = document.querySelectorAll('.puzzle .row');
  puzzleRows.forEach(row => {
    let rowValues = [];
    const cells = row.querySelectorAll('.cell');
    cells.forEach(cell => {
      rowValues.push(cell.value === '' ? null : cell.value);
    });
    puzzle.push(rowValues);
  });
  console.log(puzzle);

  // Step 2: Check that puzzle can be solved. Specifically, a puzzle is solvable if:
  // - No box, row, or column contains the same value twice
  // - All values are numbers in the range 1-9

  let isSolvable = true;

  // Check that each row is solvable
  for (let i = 0; i < puzzle.length && isSolvable; i++) {
    isSolvable = checkSolvable(puzzle[i]);
    if (isSolvable) {
      console.log(`row ${i} is solvable`);
    } else {
      console.log(`row ${i} is NOT solvable`);
    }
  }

  // Check that each column is solvable
  for (let i = 0; i < puzzle.length && isSolvable; i++) {
    const column = [];

    for (let j = 0; j < puzzle.length; j++) {
      column.push(puzzle[j][i]);
    }

    isSolvable = checkSolvable(column);
    if (isSolvable) {
      console.log(`column ${i} is solvable`);
    } else {
      console.log(`column ${i} is NOT solvable`);
    }
  }

  // Check that each 'box' is solvable
  if (isSolvable) {
    const boxes = [];
    puzzle.forEach(() => boxes.push([]));
    for (let i = 0; i < puzzle.length && isSolvable; i++) {
      for (let j = 0; j < puzzle.length; j++) {
        boxes[(Math.floor(i / 3) * 3) + Math.floor(j /3)].push(puzzle[i][j]);
      }
    }

    for (let i = 0; i < boxes.length && isSolvable; i++) {
      isSolvable = checkSolvable(boxes[i]);
      if (isSolvable) {
        console.log(`box ${i} is solvable`);
      } else {
        console.log(`box ${i} is NOT solvable`);
      }
    }
  }

  // Step 3: Solve puzzle
  // Initially, I'll do this wth brute-force by trying each number 1-9 in each cell.
  // Next, I'll improve by eliminating the need to backtrack.
  // Finally, I'll optimize.
  console.log('Solved!');
}

function checkSolvable(values) {
  let foundValues = [];

  for (let value of values) {
    if (value !== null) {
      if (isNaN(Number(value)) || Number(value) === 0) {
        console.log(`${value} is not a valid cell value.`);
        return false;
      }
      if (foundValues.includes(value)) {
        console.log(`found duplicate ${value}`);
        return false;
      } else {
        foundValues.push(value);
      }
    }
  }

  return true;
}
