// Ejecutar: NODE_PATH=/ruta/node_modules node ejecutar.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { GobstonesInterpreterAPI } = require('gobstones-interpreter');
const interpreter = new GobstonesInterpreterAPI();
const unified = process.argv.includes('--unificado');
const cases = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json')));
function normalize(board) {
  return {...board, table: board.table.map(row => row.map(cell =>
    Object.fromEntries(['red', 'blue', 'green', 'black'].map(color => [color, cell[color] || 0]))))};
}
let passed = 0;
for (const c of cases) {
  const source = fs.readFileSync(path.join(__dirname, '..', unified ? 'algoritmos-primer-parcial-1C2026-martinez-agustin.gbs' : (c.ejercicio === 6 ? '06_propuesta_propia.gbs' : `${String(c.ejercicio).padStart(2, '0')}_ejercicio.gbs`)), 'utf8');
  const testSource = source.replace(/program\s*\{[^}]*\}/, `program {\n${c.llamada}\n}`);
  const result = interpreter.parse(testSource).program.interpret(structuredClone(c.tablero));
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

if (unified) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'algoritmos-primer-parcial-1C2026-martinez-agustin.gbs'), 'utf8');
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const names = [...withoutComments.matchAll(/(?:procedure|function)\s+(\w+)\s*\(/g)].map(m => m[1]);
  assert.equal(new Set(names).size, names.length, 'sin declaraciones duplicadas');
  assert.equal([...withoutComments.matchAll(/\bprogram\s*\{/g)].length, 1, 'único program');
  const demo = cases.find(c => c.nombre === 'propuesta-mixta');
  const result = interpreter.parse(source).program.interpret(structuredClone(demo.tablero));
  assert.equal(result.returnValue.value, 13, 'program inicial sin reemplazo');
  assert.deepEqual(normalize(result.finalBoard), normalize(demo.tablero));
  console.log('PASS archivo completo: único program, declaraciones únicas y program inicial = 13');
}
