let currentCellCoordinates = {};
let hasBacktracked = false;

function customCodeSolve() {
  document.activeElement.blur();
  msgBox.textContent = '';
  msgBox.classList.remove('msg-success', 'msg-error');

  // Step 1: Check that puzzle can be solved as submitted.
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

  // Step 2: Solve puzzle
  // Initially, I'll do this wth brute-force by trying each number 1-9 in each cell.
  // Next, I'll improve by eliminating the need to backtrack.
  // Finally, I'll optimize.
  let moveCounter = 0;

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
      if (
        currentCellCoordinates.hasOwnProperty('x') &&
        currentCellCoordinates.hasOwnProperty('y')
      ) {
        const { x, y } = currentCellCoordinates;
        if (x < 0) {
          isSolved = true;
          message = 'Puzzle can not be solved';
          isSolvable = false;
        } else {
          moveCounter++;
          currentCellCoordinates = incrementPuzzleValues(puzzle, x, y);
          ({ isSolvable, message, isSolved } = checkPuzzle(puzzle));
        }
      }
    }
  }

  console.log(`Solving this puzzle using custom code took ${moveCounter} moves.`);

  msgBox.classList.remove('msg-success', 'msg-error');
  msgBox.classList.add(isSolvable ? 'msg-success' : 'msg-error');
  msgBox.textContent = message;
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
