function solvePuzzle() {
  // Step 1: Collect all user-entered values
  let values = [];
  const puzzle = document.getElementById('puzzle');
  const boxes = puzzle.querySelectorAll('.box');
  boxes.forEach(box => {
    let boxValues = [];
    const cells = box.querySelectorAll('.cell');
    cells.forEach(cell => {
      boxValues.push(cell.value);
    });
    values.push(boxValues);
  });
  console.log(values);

  // Step 2: Check that puzzle can be solved. Specifically, a puzzle is solvable if:
  // - No box, row, or column contains the same value twice
  // - All values are numbers in the range 1-9

  let isSolvable = true;

  // Step 2A: Check that each box is solvable
  values.forEach((box, index) => {
    if (isSolvable) {
      console.log(`checking box ${index}...`);
      if (!checkSolvable(box)) {
        console.log('puzzle is not solvable');
        isSolvable = false;
      }
      console.log(`box ${index} checked`);
    }
  });

  // Step 3: Solve puzzle
  // Initially, I'll do this wth brute-force by trying each number 1-9 in each cell.
  // Next, I'll improve by eliminating the need to backtrack.
  // Finally, I'll optimize.
  console.log('Solved!');
}

function checkSolvable(values) {
  let foundValues = [];

  for (let value of values) {
    if (value !== '') {
      if (foundValues.includes(value)) {
        return false;
      } else {
        foundValues.push(value);
      }
    }
  }

  return true;
}
