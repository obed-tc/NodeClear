# NodeClear



NodeClear es una biblioteca de línea de comandos que te ayuda a gestionar y limpiar tus carpetas `node_modules` en proyectos. Permite escanear, seleccionar y eliminar las carpetas que no son necesarias, liberando espacio en disco y manteniendo tu proyecto ordenado.

## Instalación

Puedes instalar NodeClear fácilmente usando npm. Ejecuta el siguiente comando en tu terminal:

```bash
npm install -g nodeclear
```

## Uso
### Comando Básico
Para utilizar NodeClear, simplemente ejecuta el siguiente comando en la raíz de tu proyecto:

```
nodeclear [opciones]
```

### Opciones

- `-p, --path <ruta>`: Especifica la ruta inicial para escanear las carpetas `node_modules`.
- `-q, --quick`: Realiza un escaneo rápido sin calcular el tamaño de las carpetas.
- `-s, --sort <modo>`: Especifica el modo de ordenamiento: `"time"` o `"size"`.
- `-h, --help`: Muestra la ayuda.

### Ejemplos

1. Escanear la carpeta actual y ordenar por tamaño:

   ```bash
   nodeclear --sort size
   ```
2. Realizar un escaneo rápido en una ruta específica:


    ```
    nodeclear --path /ruta/a/tu/proyecto -q
    ```


## Funcionamiento

Durante el escaneo:

- Se mostrará una barra de progreso.
- Puedes presionar `Ctrl+C` para detener el escaneo en cualquier momento.

Después del escaneo:

- Selecciona las carpetas que deseas eliminar.
- Se mostrará el espacio total liberado después de la eliminación.


### Ejemplos

1. Escanear la carpeta actual y ordenar por tamaño:

   nodeclear --sort size

2. Realizar un escaneo rápido en una ruta específica:

   nodeclear --path /ruta/a/tu/proyecto -q

## Contribuciones

Si deseas contribuir a `nodeclear`, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva`).
3. Realiza tus cambios y prueba que todo funcione.
4. Haz un commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`).
5. Envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Autor

* Obed-TC

