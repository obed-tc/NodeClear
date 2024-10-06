const fs = require("fs");
const { showSelectionMenu, formatSize } = require("../src/index");
const inquirer = require("inquirer");

jest.mock("fs");

test("debería mostrar el menú de selección y eliminar las carpetas seleccionadas", async () => {
  inquirer.prompt = jest
    .fn()
    .mockResolvedValueOnce({
      foldersToDelete: ["/test/node_modules/package1"],
    })
    .mockResolvedValueOnce({
      confirmDelete: true,
    });

  const nodeModulesFolders = [
    {
      path: "/test/node_modules/package1",
      size: 200,
      mtime: new Date(),
    },
  ];

  await showSelectionMenu(nodeModulesFolders);

  expect(fs.rmdirSync).toHaveBeenCalledWith("/test/node_modules/package1", {
    recursive: true,
  });
});

test("debería formatear el tamaño correctamente", () => {
  expect(formatSize(1024)).toBe("1.00 KB");
  expect(formatSize(2048)).toBe("2.00 KB");
  expect(formatSize(0)).toBe("0 Bytes");
});
