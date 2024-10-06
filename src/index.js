const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const colors = require("colors");

function getFolderSize(folderPath) {
  let totalSize = 0;
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      totalSize += getFolderSize(itemPath);
    }
  }
  return totalSize;
}

function scanNodeModules(startPath, quickScan = false) {
  let nodeModulesFolders = [];

  const scanDirectory = (dir) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (process.exitRequested) {
        break;
      }
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        if (item === "node_modules") {
          const folderSize = quickScan ? 0 : getFolderSize(itemPath);
          nodeModulesFolders.push({
            path: itemPath,
            size: folderSize,
            mtime: stats.mtime,
          });
        } else {
          scanDirectory(itemPath);
        }
      }
    }
  };

  process.exitRequested = false;
  process.on("SIGINT", () => {
    process.exitRequested = true;
  });

  scanDirectory(startPath);

  return nodeModulesFolders;
}

function formatSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

async function showSelectionMenu(nodeModulesFolders, sortBy) {
  if (sortBy) {
    nodeModulesFolders.sort((a, b) => {
      if (sortBy === "mtime") {
        return b.mtime - a.mtime;
      } else {
        return b.size - a.size;
      }
    });
  }
  //   Verificar tamaño en nueva version
  console.log("\nCarpetas node_modules encontradas:\n".green);

  const choices = nodeModulesFolders.map((folder, index) => ({
    name: `${index + 1}. ${folder.path.yellow} - ${formatSize(
      folder.size
    )} - Modificado: ${folder.mtime.toLocaleDateString()}`,
    value: folder.path,
  }));

  const { foldersToDelete } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "foldersToDelete",
      message: "Selecciona las carpetas node_modules que deseas eliminar:",
      choices,
    },
  ]);

  if (foldersToDelete.length === 0) {
    console.log("No se seleccionaron carpetas para eliminar.".red);
    return;
  }

  const { confirmDelete } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmDelete",
      message:
        "¿Estás seguro de que deseas eliminar las carpetas seleccionadas?",
    },
  ]);

  if (confirmDelete) {
    let totalFreedSpace = 0;
    foldersToDelete.forEach((folderPath) => {
      const folder = nodeModulesFolders.find((f) => f.path === folderPath);
      if (folder) {
        fs.rmdirSync(folder.path, { recursive: true });
        totalFreedSpace += folder.size;
        console.log(`Eliminada carpeta: ${folder.path.red}`);
      }
    });
    console.log(`Espacio total liberado: ${formatSize(totalFreedSpace).green}`);
  } else {
    console.log("Eliminación cancelada.".yellow);
  }
}

module.exports = {
  scanNodeModules,
  showSelectionMenu,
  formatSize,
};
