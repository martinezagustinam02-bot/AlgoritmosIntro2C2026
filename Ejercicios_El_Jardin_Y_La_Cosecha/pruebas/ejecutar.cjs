// Ejecutar: NODE_PATH=/ruta/node_modules node ejecutar.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { GobstonesInterpreterAPI } = require('gobstones-interpreter');
const interpreter = new GobstonesInterpreterAPI();
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json')));
function normalize(board) {
  return {...board, table: board.table.map(row => row.map(cell =>
    Object.fromEntries(['red', 'blue', 'green', 'black'].map(color => [color, cell[color] || 0]))))};
}
let passed = 0;
for (const c of cases) {
  const source = fs.readFileSync(path.join(__dirname, '..', `${String(c.ejercicio).padStart(2, '0')}_ejercicio.gbs`), 'utf8');
  const declarations = source.slice(source.indexOf('\n}\n') + 3);
  const result = interpreter.parse(`program {\n${c.llamada}\n}\n${declarations}`).program.interpret(structuredClone(c.tablero));
  if (typeof c.esperado === 'number') {
    assert.equal(result.returnValue.value, c.esperado, c.nombre);
    assert.deepEqual(normalize(result.finalBoard), normalize(c.tablero), `${c.nombre}: consulta conserva tablero y cabezal`);
  } else {
    assert.deepEqual(normalize(result.finalBoard), normalize(c.esperado), c.nombre);
  }
  console.log(`PASS ${c.nombre}`);
  passed++;
}
console.log(`${passed}/${cases.length} pruebas ejecutadas correctamente; intérprete ${require('gobstones-interpreter/package.json').version}`);
