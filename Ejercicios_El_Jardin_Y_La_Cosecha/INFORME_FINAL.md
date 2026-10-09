# Finalización del parcial — Agustín Martinez

## Estado

Los seis ejercicios están completos: cinco obligatorios y la propuesta propia `cantidadDeLitrosEnPlantasPlagadas()`. El archivo único independiente es [algoritmos-primer-parcial-1C2026-martinez-agustin.gbs](algoritmos-primer-parcial-1C2026-martinez-agustin.gbs). Tiene un único `program`, 15 declaraciones de funciones/procedimientos sin duplicados y ninguna importación. Las soluciones individuales se conservan, incluida la propuesta propia en `06_propuesta_propia.gbs`.

## Revisión del PDF y cambios

Se volvió a extraer y leer el PDF original `primer_parcial_algoritmos_2C2026.pdf`: introducción, sección 3 y entrega. Se cotejó con el código de los cinco ejercicios y los ejemplos de clase identificados en `INFORME.md`.

| Ejercicio | Revisión contra la consigna |
|---|---|
| 1 — TratarPlagaConRiegoHacia_ | Busca la primera planta plagada estrictamente en la dirección dada, transfiere los azules y elimina la negra del destino. El primer movimiento está autorizado por la precondición de existencia; los restantes se controlan con puedeMover. |
| 2 — cantidadDePlantas | Cuenta un estado dado, no solamente plantas con 3 verdes. Dos parámetros separan crecimiento (1/3/5) y salud (Booleano). Recorre todas las celdas una vez. |
| 3 — cantidadDeSectoresSinCultivar | Cuenta columnas completas, no celdas vacías. Incluye ambos extremos de cada columna. La consulta auxiliar restaura el cabezal y permite continuar en la misma fila. |
| 4 — cantidadDePlantasPlagadas | Suma los tres estados plagados y excluye negras sin planta. No hay doble conteo. |
| 5 — IrAParcelaConFrutosMasAlSur | Recorre desde SO por filas Este/Norte. Exige una planta madura y desempata por Oeste dentro de la fila más al Sur. No exige salud, condición no pedida por el PDF. |

No se detectaron errores de lógica que exigieran cambiar los cinco algoritmos. Los cambios son la propuesta propia, la unificación eliminando declaraciones repetidas, el programa inicial de consulta segura y la documentación de invocaciones. Los originales del profesor no se modificaron.

Interpretaciones que permanecen explícitas, pues el PDF no las precisa: se traslada toda el agua del origen, se trata la plaga del destino y permanece la del origen; no hay dosis mínima. “Más al Sur-Oeste” se interpreta como prioridad Sur y luego Oeste. Son decisiones de modelado razonables, no garantías sobre la interpretación personal del docente. Con datos válidos y las precondiciones, los recorridos no salen del tablero. Un caso sin destino para el ejercicio 1 incumple su precondición; no se presenta como tratamiento válido. Sin frutos, el ejercicio 5 termina en NE, pero no satisface el propósito.

## Propuesta propia y justificación

Se mantuvo la propuesta del usuario. `cantidadDeLitrosEnPlantasPlagadas()` suma agua sólo en celdas con planta válida y plaga, incluyendo los tres estados. Excluye agua de plantas saludables y agua con negra sin planta. Devuelve cero si no hay agua en plantas plagadas.

Aporta una consulta distinta: una suma ponderada por litros, filtrada por dos condiciones, útil para planificar el riego de parcelas afectadas. Utiliza recorrido, acumulador, predicado y `choose`, ya vistos en clase. Su complejidad es apropiada para el nivel de los ejercicios; la evaluación de creatividad y la calificación corresponden al profesor. No se añadió una alternativa más compleja porque el PDF no exige optimización ni dosis, y esas reglas introducirían supuestos adicionales.

## Pruebas realmente ejecutadas

Intérprete oficial `gobstones-interpreter@2.0.0`, 9/10/2026:

- **37/37 casos sobre los archivos individuales**: 30 previos y 7 adicionales de litros.
- **37/37 casos sobre las declaraciones del archivo unificado**, cambiando sólo `program` para cada caso.
- **Una ejecución del archivo definitivo sin sustituir program** sobre `propuesta-mixta.gbb`: retorno 13, todas las bolitas y cabezal conservados.
- Chequeo de declaraciones únicas y un solo `program` fuera de comentarios.
- `git diff --check`: sin errores de espacios en los cambios revisados.

Los conteos comparan resultado, todos los colores y cabezal. Los procedimientos comparan el tablero completo esperado y posición final. Los datos y resultados están en `pruebas/casos.json`, `RESULTADOS.txt` y `RESULTADOS_UNIFICADO.txt`; cada caso tiene tablero inicial GBB.

Los nuevos casos cubren: mezcla de tres estados con agua y plaga (13 litros), vacío 1x1 (0), única planta plagada 1x1 (9), columna 1x4 (11), fila 4x1 (16), plantas saludables y negra sin planta (0), plantas plagadas sin agua (0). Se probaron extremos y cabezales iniciales distintos de SO.

**Gobstones Web / Gobstones Sr:** se pegó el archivo completo y se ejecutó sin errores sobre un tablero vacío 4x4. La interfaz mostró Tablero final, conservando tablero vacío y cabezal; no mostró el número retornado, por lo que el retorno cero de ese caso se verifica en el intérprete, no por lectura de la interfaz. Luego se ejecutaron todas las mismas declaraciones del archivo final con un `program` de prueba que construye el jardín mixto y representa el resultado con rojas: **13 rojas en (2,1)**, cabezal final (2,1), verdes/azules/negras conservadas. El jardín tiene una fila vacía adicional al Norte porque el editor estaba en 4x4; el resultado esperado sigue siendo 13. Las rojas las añade el programa de prueba, nunca la función. Programa reproducible: `pruebas/prueba-web-unificado.gbs`. Evidencia visual adjunta a la respuesta en Work.

La batería completa se ejecutó en el intérprete oficial; no se afirma haber ejecutado los 37 casos en la interfaz web. La misión anterior también ejecutó en esa interfaz el conteo de sectores (3 columnas libres).

Reproducción automatizada opcional:

```bash
npm install --prefix /tmp/pruebas-gobstones gobstones-interpreter@2.0.0
NODE_PATH=/tmp/pruebas-gobstones/node_modules node Ejercicios_El_Jardin_Y_La_Cosecha/pruebas/ejecutar.cjs
NODE_PATH=/tmp/pruebas-gobstones/node_modules node Ejercicios_El_Jardin_Y_La_Cosecha/pruebas/ejecutar.cjs --unificado
```

## Descargar, revisar y entregar

1. En GitHub, abrir el archivo final y usar **Download raw file** (flecha de descarga). Conservar exactamente el nombre `algoritmos-primer-parcial-1C2026-martinez-agustin.gbs` y verificar que el navegador no haya añadido `.txt`.
2. Abrir [Gobstones Sr](https://gobstones.github.io/gobstones-sr/), cargar o pegar el archivo. El programa inicial consulta litros, sin modificar el jardín: tablero vacío válido devuelve 0; el GBB mixto devuelve 13. Si la interfaz no muestra retornos, el archivo `pruebas/prueba-web-unificado.gbs` permite ver las 13 rojas del caso mixto sobre un tablero inicial vacío 4x4.
3. Para revisar otros ejercicios, sustituir sólo el contenido de `program` por una de las llamadas documentadas al comienzo del archivo final. Respetar las precondiciones de riego y búsqueda de frutos. No cargar a la vez los archivos individuales.
4. Después de revisar, completar personalmente el formulario del PDF: https://forms.gle/PooMPKWgKrC3hctb6.
5. Enviar personalmente el archivo `.gbs` final a **javierpedro.garcia@unahur.edu.ar**, asunto **Primer parcial algoritmos**, cuerpo **Envío primer parcial luego de completar el formulario de entrega.**

El nombre conserva `1C2026` porque así lo exige literalmente el PDF, aunque el repositorio y el período sean 2C2026. Fecha límite indicada: **9 de octubre de 2026, 23:59**.

## Pendientes

No quedan requisitos de programación solicitados pendientes. Quedan la revisión personal del alumno, completar el formulario y enviar el correo con el archivo. La propuesta fue sugerida por el usuario y desarrollada con asistencia; conviene comprender el código y poder explicar sus decisiones. No se envió el trabajo ni se completó el formulario. PR #1 actualizado para revisión, sin fusionar con master.
