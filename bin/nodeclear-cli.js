#!/usr/bin/env node

const { scanNodeModules, showSelectionMenu } = require("../src/index");
const colors = require("colors");

function showBanner() {
  console.log(`

  ██████   █████              █████            █████████  ████                              
░░██████ ░░███              ░░███            ███░░░░░███░░███                              
 ░███░███ ░███   ██████   ███████   ██████  ███     ░░░  ░███   ██████   ██████   ████████ 
 ░███░░███░███  ███░░███ ███░░███  ███░░███░███          ░███  ███░░███ ░░░░░███ ░░███░░███
 ░███ ░░██████ ░███ ░███░███ ░███ ░███████ ░███          ░███ ░███████   ███████  ░███ ░░░ 
 ░███  ░░█████ ░███ ░███░███ ░███ ░███░░░  ░░███     ███ ░███ ░███░░░   ███░░███  ░███     
 █████  ░░█████░░██████ ░░████████░░██████  ░░█████████  █████░░██████ ░░████████ █████    
░░░░░    ░░░░░  ░░░░░░   ░░░░░░░░  ░░░░░░    ░░░░░░░░░  ░░░░░  ░░░░░░   ░░░░░░░░ ░░░░░

  `);
}

function showHelp() {
  console.log(`
Uso:
  nodeclear [opciones]

Opciones:
  -p, --path <ruta>            Especifica la ruta inicial para escanear las carpetas node_modules.
  -q, --quick                  Realiza un escaneo rápido sin calcular el tamaño de las carpetas.
  -s, --sort <modo>            Especifica el modo de ordenamiento: "time" o "size".
  -h, --help                   Muestra esta ayuda.

Si no se especifica ninguna opción, se escaneará la ruta actual.

Ejemplo:
  nodeclear --path /ruta/a/tu/proyecto --sort size
  nodeclear -q --sort time

Durante el escaneo:
  - Se mostrará una barra de progreso.
  - Puedes presionar Ctrl+C para detener el escaneo en cualquier momento.

Después del escaneo:
  - Selecciona las carpetas que deseas eliminar.
  - Se mostrará el espacio total liberado después de la eliminación.
`);
}

function processArguments() {
  const args = process.argv.slice(2);
  let startPath = process.cwd();
  let quickScan = false;
  let sortBy = null;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-p":
      case "--path":
        startPath = args[i + 1] || process.cwd();
        i++;
        break;
      case "-q":
      case "--quick":
        quickScan = true;
        break;
      case "-s":
      case "--sort":
        sortBy =
          args[i + 1] === "mtime" || args[i + 1] === "size"
            ? args[i + 1]
            : null;
        i++;
        break;
      case "-h":
      case "--help":
        showHelp();
        process.exit(0);
    }
  }

  if (!require("fs").existsSync(startPath)) {
    console.log("Error: La ruta proporcionada no existe.".red);
    process.exit(1);
  }

  return { startPath, quickScan, sortBy };
}

async function main() {
  showBanner();

  const { startPath, quickScan, sortBy } = processArguments();

  console.log(`Iniciando escaneo en la ruta: ${startPath.cyan}`);
  console.log(
    quickScan
      ? "Modo de escaneo rápido activado.".yellow
      : "Calculando tamaños de carpetas...".yellow
  );

  const nodeModulesFolders = scanNodeModules(startPath, quickScan);

  if (nodeModulesFolders.length === 0) {
    console.log("No se encontraron carpetas node_modules.".yellow);
    process.exit(0);
  }

  await showSelectionMenu(nodeModulesFolders, sortBy);
}

main().catch((error) => {
  console.error("Ha ocurrido un error:", error);
  process.exit(1);
});
