function solvePuzzle() {
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
  console.log('Solved!');
  console.log(values);
}
