# El jardín y la cosecha — informe de revisión

## Alcance y fuentes

Se resolvieron los cinco ejercicios solicitados. Los originales del profesor permanecen intactos. Base: `master`, commit `c454a887b2608275e032e920da196b546c677dca`.

Se consultaron los diez archivos `.gbs` originales:

- `01_dos_cuadrados.gbs`: descomposición en subtareas y caso borde.
- `03_alternativa_condicional.gbs`: `if`, Booleanos y `while`.
- `03_ejemplo_parametros.gbs`: parámetros y contratos.
- `03_ejercicio5_BIBLIOTECA.gbs`: poner una cantidad mediante `repeat`.
- `03_ejercicio5_p1.gbs`: procedimientos auxiliares y posiciones.
- `04_batalla.gbs`: funciones de consulta y representación del dominio.
- `05_clase_recorridos.gbs`: las tres subtareas de recorrido reutilizadas.
- `05_clase_recorridos_ejercicio.gbs`: estructura de recorrido y búsqueda.
- `05_ecualizador.gbs`: recorrer una columna dentro de una función.
- `Ejercicios_Integradores/06_primer-parcial-algoritmos-2025.gbs`: búsqueda dirigida, contadores, `choose` y recorrido completo.

También se extrajo y leyó `primer_parcial_algoritmos_2C2026.pdf`, sección 3. Esto aclaró que el ejercicio 2 incluye cualquier estado de crecimiento, no solamente tres verdes.

Referencia técnica primaria: [Gobstones Web](https://github.com/gobstones/gobstones-web) y [README del intérprete oficial](https://github.com/gobstones/gobstones-interpreter). Las pruebas comprobaron realmente la restauración del cabezal al retornar de funciones. Las soluciones no requieren Node ni bibliotecas externas; Node sólo sirve para reproducir las pruebas automatizadas.

## Modelo y decisiones

Tablero rectangular de al menos una celda. Una planta por celda, codificada con 1, 3 o 5 verdes; cero verdes significa ausencia de planta. Plaga: cero o una negra. Azules: cantidad no negativa de litros. Una negra aislada no cuenta como planta. Rojo no tiene significado agrícola.

1. **Riego** ([código](01_ejercicio.gbs)): guarda los litros, los retira del origen, avanza al menos una celda y busca la primera planta plagada en la dirección. Añade los litros al agua existente y retira la negra del destino. Conserva las plantas, el agua total y la plaga del origen. La dirección usual es Norte; el parámetro admite las cuatro direcciones. Se garantiza destino válido. Cero litros es admisible por interpretación literal; no se modela una dosis mínima.
2. **Plantas** ([código](02_ejercicio.gbs)): `cantidadDePlantas(estadoDeCrecimiento, conPlaga)` cuenta celdas coincidentes en todo el tablero. Un Número 1/3/5 selecciona el crecimiento y un Booleano selecciona la salud: `True` plagada, `False` saludable. Dos parámetros separan dos criterios independientes; no se usan colores para representar artificialmente la salud.
3. **Sectores** ([código](03_ejercicio.gbs)): recorre columnas de Oeste a Este. Una función auxiliar consulta toda la columna de Sur a Norte y aporta uno sólo cuando no hay plantas ni agua. Una marca negra sola no descalifica la columna según el texto del ejercicio.
4. **Plagadas** ([código](04_ejercicio.gbs)): suma los conteos de los estados 1, 3 y 5 con `True`. Cada planta pertenece a un único estado, por lo que no se cuenta dos veces.
5. **Frutos** ([código](05_ejercicio.gbs)): empieza en SO y busca por filas, de Oeste a Este y de Sur a Norte. Prioriza la fila más al Sur y desempata por Oeste. Exige al menos una planta madura. Si no existe, termina en NE sin salir del tablero, pero ese caso incumple el contrato. No filtra por salud porque el enunciado pide frutos maduros, sin agregar esa condición.

Cada archivo es autónomo e incluye su propio `program`, auxiliares y contratos. Las copias de auxiliares evitan importar archivos del profesor o cargar múltiples `program` a la vez. Se usan las técnicas vistas: procedimientos, funciones, variables, parámetros, `repeat`, `while`, `if`, `choose` y las primitivas existentes.

## Verificación ejecutada

El 9/10/2026 se ejecutaron **30/30 casos correctos** con `gobstones-interpreter` **2.0.0**, paquete oficial. Se interpretó el código real de cada solución reemplazando únicamente el `program` por la llamada del caso. El ejecutor compara todos los colores y el cabezal; normaliza colores ausentes a cero, porque el intérprete omite las cantidades cero en su salida.

- Ejercicio 1: Norte, Sur, Este, Oeste, destino más cercano frente a otro posterior, suma al agua preexistente y cero litros con destino adyacente.
- Ejercicio 2: seis combinaciones crecimiento/salud; jardines vacíos de 1x1, 1x4, 4x1 y 3x3.
- Ejercicio 3: columnas con planta en el extremo Norte, agua en el extremo Sur y negra aislada; las cuatro dimensiones anteriores.
- Ejercicio 4: jardín mixto con tres plantas plagadas y negra aislada; las cuatro dimensiones anteriores.
- Ejercicio 5: fruto en SO, prioridad Sur frente a Oeste, desempate Oeste, fruto únicamente en NE y tablero 1x1.

Todos los conteos conservaron tablero y cabezal. Todos los recorridos ejecutados terminaron sin salir de los límites.

**Gobstones Web:** se ejecutó además el cuerpo de la solución 3 en Gobstones Sr, sobre tablero vacío 4x4 con una planta creada en (1,2). La función devolvió 3, representado por tres rojas colocadas por el programa de prueba en (1,2). Cabezal final (1,2). La función no puso esas rojas: las puso el programa después del conteo. Evidencia visual adjunta a la entrega en Work. No se ejecutó en el navegador la batería completa de los cinco ejercicios; esa batería se ejecutó en el intérprete oficial local. Un primer pegado en el editor añadió texto al programa previo y dio error; se reemplazó el contenido completo y la ejecución posterior produjo el tablero esperado.

## Reproducir en Gobstones Web

1. Abrir [Gobstones Sr](https://gobstones.github.io/gobstones-sr/).
2. Abrir o pegar **un solo** `NN_ejercicio.gbs` completo.
3. Preparar el tablero inicial según un archivo `.gbb` de `pruebas/`. Si la interfaz permite importar GBB, cargarlo; si no, configurar dimensiones, bolitas y cabezal manualmente. Coordenadas: (0,0) es SO; x crece al Este, y al Norte.
4. Para el caso elegido, reemplazar únicamente el bloque `program` por `program { llamada }`, usando `llamada` de `pruebas/casos.json`. No borrar las declaraciones.
5. Ejecutar. Comparar con `esperado` del mismo JSON. Para consultas, si la interfaz no muestra el valor retornado, usar temporalmente `repeat(funcion(...)) { Poner(Rojo) }` y contar las rojas añadidas sobre una celda sin rojas. Eso es instrumentación de prueba, no parte de la función.
6. Reiniciar el tablero inicial antes de otro caso. Los procedimientos 1 y 5 requieren las precondiciones documentadas.

Cada caso incluye un `.gbb` inicial. En `casos.json`, la primera fila de `table` corresponde al Norte (formato del intérprete), a diferencia de las coordenadas GBB, que empiezan al Sur.

Pruebas automatizadas opcionales, sin instalar dependencias en la carpeta de las soluciones:

```bash
npm install --prefix /tmp/pruebas-gobstones gobstones-interpreter@2.0.0
NODE_PATH=/tmp/pruebas-gobstones/node_modules node Ejercicios_El_Jardin_Y_La_Cosecha/pruebas/ejecutar.cjs
```

## Dudas y límites antes de entregar al profesor

- Confirmar si el riego debe trasladar toda el agua, conservar la plaga del origen y admitir dosis cero: el PDF no precisa estos detalles. La implementación explicita la interpretación.
- Confirmar que “más al Sur-Oeste” significa prioridad Sur y luego Oeste. El nombre del procedimiento respalda esa elección; no se emplea distancia geométrica a la esquina.
- El PDF exige **además una propuesta propia resuelta** y **un archivo único** con nombre `algoritmos-primer-parcial-1C2026-apellido-nombre.gbs`. Esta misión solicitó cinco archivos separados: todavía falta preparar esos requisitos adicionales para la entrega académica completa. Como propuesta posible: calcular litros acumulados en parcelas plagadas para planificar el tratamiento.
- No se completó el formulario, no se envió correo académico y no se fusionará el PR. El trabajo queda para revisión del dueño.
