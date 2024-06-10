buildPuzzle(solveBtnClickHandler); // from 'utilities.js'

let counter = 0;

function solveBtnClickHandler() {
  document.activeElement.blur();
  const puzzle = getPuzzle(); // from 'utilities.js'

  const { isSolvable, isSolved, error } = checkPuzzle(puzzle);

  if (error) {
    if (error.hasOwnProperty('row')) {
      displayMessage('error', `Row ${error.row} contains an invalid value`);
      return;
    } else if (error.hasOwnProperty('column')) {
      displayMessage('error', `Column ${error.column} contains an invalid value`);
      return;
    } else if (error.hasOwnProperty('box')) {
      displayMessage('error', `Box ${error.box} contains an invalid value`);
      return;
    }
  } else if(isSolved) {
    displayMessage('success', `Congratulations. The puzzlie is already solved!`);
    return;
  } else if (isSolvable) {
    displayMessage('success', `Puzzle is solvable`);
  }

  const csp = formatPuzzleAsCSP(puzzle);

  let assignment = {};

  let result = backtrack(csp, assignment);

  if (result) {
    let resultIndex = 0;
    for (let row = 0; row < puzzle.length; row++) {
      for (let col = 0; col < puzzle[row].length; col++) {
        if (!puzzle[row][col].value) {
          puzzle[row][col].value = result[`cell${row}${col}`];
          puzzle[row][col].classList.add('generated');
        }
        resultIndex++;
      }
    }

    displayMessage('success', `Congratulations. The puzzle is solved!`);
  } else {
    displayMessage('error', `Puzzle is not solvable`);
  }

}

function backtrack(csp, assignment) {
  // If the number of assignments (Object.keys(assignment)) is the same as the number of variables,
  // then all cells have been assigned a value, which means the puzzle is solved.
  if (Object.keys(assignment).length === csp.variables.length) {
    console.log(`Solving this puzzle took ${counter} moves`);
    return assignment;
  }

  // Since the puzzle must be unsolved in order to reach this point, let's find the next empty cell
  let variable = findUnassignedVariable(csp, assignment);

  // For each possible value for that specific cell...
  for (let value of csp.domains[variable]) {
    // ...let's check if assigning this value would result in a still-solvable puzzle
    if (isConsistent(csp, variable, value, assignment)) {
      // Since the puzzle is still solvable, we can permanently assign this value to this cell
      assignment[variable] = value;
      console.log(counter);
      counter++;

      // Now we'll work on the next cell, or return the solved puzzle, or return `null` if the puzzle is unsolvable
      let result = backtrack(csp, assignment);

      // If we solved the puzzle, let's exit the recursion and return the solved puzzle
      if (result) {
        return result;
      }

      // If we discovered that adding this assignment *eventually* made the puzzle unsolvable, let's remove this value and try again with the next value
      delete assignment[variable];
    }
  }

  // If the puzzle was still not solved after trying all possible values, then it must be unsolvable
  return null;
}

function findUnassignedVariable(csp, assignment) {
  for (let variable of csp.variables) {
    if (!(variable in assignment)) {
      return variable;
    }
  }
  return null;
}

function formatPuzzleAsCSP(puzzle) {
  const variables = [];
  const domains = {};
  const constraints = [];

  puzzle.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      let variable = `cell${rowIndex}${colIndex}`;
      variables.push(variable);

      if (!cell.value) {
        domains[variable] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      } else {
        domains[variable] = [Number(cell.value)];
      }
    })
  });

  for (let i = 0; i < puzzle.length; i++) {
    constraints.push(new RowConstraint(i));
    constraints.push(new ColumnConstraint(i));
    constraints.push(new BoxConstraint(i));
  }

  return { variables, domains, constraints };
}

function isConsistent(csp, variable, value, assignment) {
  let tempAssignment = { ...assignment };
  tempAssignment[variable] = value;

  for (let constraint of csp.constraints) {
    if (!constraint.check(tempAssignment)) {
      return false;
    }
  }

  return true;
}

class RowConstraint {
  constructor(row) {
    this.row = row;
  }

  check(assignment) {
    let values = new Set();

    for (let col = 0; col < 9; col++) {
      let variable = `cell${this.row}${col}`;

      if (variable in assignment) {
        let value = assignment[variable];

        if (values.has(value)) {
          // If the value is already in the set, it's a duplicate, so the constraint is violated
          return false;
        }

        values.add(value);
      }
    }

    // If we've checked all variables and found no duplicates, the constraint is satisfied
    return true;
  }
}

class ColumnConstraint {
  constructor(column) {
    this.column = column;
  }

  check(assignment) {
    let values = new Set();

    for (let row = 0; row < 9; row++) {
      let variable = `cell${row}${this.column}`;

      if (variable in assignment) {
        let value = assignment[variable];

        if (values.has(value)) {
          // If the value is already in the set, it's a duplicate, so the constraint is violated
          return false;
        }

        values.add(value);
      }
    }

    // If we've checked all variables and found no duplicates, the constraint is satisfied
    return true;
  }
}

class BoxConstraint {
  constructor(box) {
    this.box = box;
  }

  check(assignment) {
    let values = new Set();

    let startRow = Math.floor(this.box / 3) * 3;
    let startCol = (this.box % 3) * 3;

    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        let variable = `cell${row}${col}`;
    
        if (variable in assignment) {
          let value = assignment[variable];
    
          if (values.has(value)) {
            // If the value is already in the set, it's a duplicate, so the constraint is violated
            return false;
          }
    
          values.add(value);
        }
      }
    }

    // If we've checked all variables and found no duplicates, the constraint is satisfied
    return true;
  }
}
