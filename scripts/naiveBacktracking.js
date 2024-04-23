// Naive backtracking solve technique (AI algorithm)
// This technique is used to solve a class of problems called "Constraint Satisfaction Problems" or "CSPs".
// For this technique, we will use the graph data sctructure, in which each sudoku cell will be a 'node',
// and any inequality constraints between two related cells (e.g., two cells in the same row) will be the 'edges'.

const VARIABLES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const CONSTRAINTS = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'C'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'E'],
  ['C', 'F'],
  ['D', 'E'],
  ['E', 'F'],
  ['E', 'G'],
  ['F', 'G']
];

function naiveBacktracking() {
  // Clear any existing on-screen messages
  msgBox.classList.remove('msg-success', 'msg-error');
  msgBox.textContent = '';

  // Remove button focus
  document.activeElement.blur();

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

  console.log(backtrack([]));
}

function backtrack(assignment) {
  // Check if assignment is complete
  if (assignment.length === VARIABLES.length) {
    return assignment;
  }

  // Try a new variable
  const newVar = selectUnassignedVariable(assignment);
  for (let value in ['Monday', 'Tuesday', 'Wednesday']) {
    const newAssignment = [...assignment];
    newAssignment[newVar] = value;
    if (consistent(newAssignment)) {
      // result = backtrack(newAssignment);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}

function selectUnassignedVariable(assignment) {
  for (let i = 0; i < VARIABLES.length; i++) {
    if (!assignment.includes(VARIABLES[i])) {
      return VARIABLES[i];
    }
  }
  return null;
}

function consistent(assignment) {
  for (let i = 0; i < CONSTRAINTS.length; i++) {
    const [x, y] = CONSTRAINTS[i];

    // Only consider arcs where both are assigned
    if (!assignment.includes(x) || !assignment.includes(y)) {
      continue;
    }
  
    // If both have same value, then not consistent
    if (assignment[x] === assignment[y]) {
      return false;
    }
  }

  // If nothing inconsistent, then assignment is consistent
  return true;
}