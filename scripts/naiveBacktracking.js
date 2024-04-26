buildPuzzle(solveBtnClickHandler); // from 'utilities.js'

function solveBtnClickHandler() {
  document.activeElement.blur();
  const puzzle = getPuzzle(); // from 'utilities.js'

  const { isSolvable, isSolved, error } = checkPuzzle(puzzle);

  if (error) {
    if (error.hasOwnProperty('row')) {
      displayMessage('error', `Row ${error.row} contains an invalid value`);
    } else if (error.hasOwnProperty('column')) {
      displayMessage('error', `Column ${error.column} contains an invalid value`);
    } else if (error.hasOwnProperty('box')) {
      displayMessage('error', `Box ${error.box} contains an invalid value`);
    }
  } else if(isSolved) {
    displayMessage('success', `Congratulations. The puzzlie is already solved!`);
  } else if (isSolvable) {
    displayMessage('success', `Puzzle is solvable`);
  }
}
