# Préstamos Lab — 0902-22-7467

Aplicación React + TypeScript para consultar el inventario del laboratorio universitario y registrar/devolver préstamos. La información se guarda en una API REST local con `json-server`.

Repositorio público: [github.com/cligorriaf-sketch/gestor-prestamos-lab](https://github.com/cligorriaf-sketch/gestor-prestamos-lab)

Documentación completa de la entrega: `Documentacion_Prestamos_Lab_0902-22-7467_Final.docx`.
PDF final para entregar en Canvas: `Documentacion_Prestamos_Lab_0902-22-7467_Final.pdf`.

## Variante implementada

- Carné: `0902-22-7467` (último dígito: **7**).
- Categorías: **Monitor, Teclado y Mouse**.
- Máximo de préstamo: **5 días**.
- Regla adicional: el encabezado muestra la cantidad de préstamos activos vencidos.

## Requisitos

- Node.js 20.19+ o 22.12+.
- npm.

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. (Opcional) Copia `.env.example` como `.env` para cambiar la URL de la API. El valor local predeterminado es `http://localhost:3001`.

3. En una terminal, inicia la API:

   ```bash
   npm run api
   ```

   La API queda disponible en `http://localhost:3001`; `db.json` contiene los equipos y préstamos iniciales. `json-server` persiste los cambios directamente en ese archivo.

4. En otra terminal, inicia React:

   ```bash
   npm run dev
   ```

5. Abre la URL que Vite muestra en la terminal (normalmente `http://localhost:5173`).

Para comprobar la API se puede abrir `http://localhost:3001/equipos` o `http://localhost:3001/prestamos?devuelto=false`.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el frontend en modo desarrollo |
| `npm run api` | Inicia `json-server` en el puerto 3001 |
| `npm run build` | Comprueba TypeScript y genera el build de producción |
| `npm run lint` | Ejecuta Oxlint |
| `npm run preview` | Sirve localmente el build de producción |

## Funcionalidad

- Inventario con tarjetas tipadas, disponibilidad y filtros combinables por categoría y nombre.
- Formulario controlado con validación de solicitante, carné `0000-00-00000` y fecha límite dentro del máximo de 5 días.
- Préstamos activos ordenados por fecha límite; vencidos resaltados y con acción para devolver equipo.
- Carga mediante `useEffect`, indicador de carga, mensajes de error/reintento y escrituras REST tipadas.
- El contador de vencidos se deriva de los préstamos activos, sin duplicarlo en estado.

## Respuestas de reflexión

1. **¿Por qué no conviene usar el índice como `key` si la lista cambia?** React puede asociar el estado o el DOM de una fila al elemento equivocado después de insertar, borrar o reordenar elementos. Una clave estable como el `id` permite identificar cada equipo correctamente.
2. **¿Qué problema aparece al modificar directamente un arreglo de estado?** React puede no detectar el cambio porque la referencia del arreglo permanece igual; además, mutar el estado hace más difícil predecir y depurar actualizaciones. Crear un arreglo nuevo permite que React renderice de forma consistente.
3. **¿Qué ocurre si se omite el arreglo de dependencias en un `useEffect` con `fetch` y actualización de estado?** El efecto se ejecuta después de cada render. Como actualizar el estado provoca otro render, puede iniciar solicitudes repetidas y producir un ciclo de peticiones.

## Evidencia de entrega

Los datos iniciales incluyen un préstamo vencido para que se pueda verificar la fila resaltada y el contador del encabezado. Para volver a capturar el estado de error, detén `json-server` y recarga la página; el botón **Reintentar** aparecerá junto al mensaje. El PDF final de Canvas reúne la portada, el enlace público, las capturas y las respuestas de reflexión.
