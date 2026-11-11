# Veterinaria Huellitas

Actividad sumativa de la Unidad 3 de Aplicaciones Web. Permite consultar citas,
registrar una nueva y confirmar las pendientes. Los datos se guardan en MySQL.
El punto de partida es https://github.com/arlinchc/appVeterinaria.

## Requisitos

- Node.js LTS con npm.
- MySQL Server en funcionamiento.

## Preparación

1. Ejecutar `database/veterinaria.sql` en un cliente de MySQL. Crea
   `veterinaria_db`, la tabla `citas` y cuatro citas de ejemplo. Está pensado
   para una instalación nueva; si la base ya existe, revisar su contenido primero.
2. Copiar `backend/.env.example` a `backend/.env` y completar la contraseña
   de MySQL. El archivo `.env` está excluido de Git.
3. Instalar las dependencias de la raíz con `npm ci` y repetir `npm ci`
   dentro de `backend`.

## Ejecución

En una terminal, dentro de `backend`, ejecutar `npm run dev`.
En otra terminal, en la raíz del proyecto, ejecutar `npm run dev`.
En PowerShell también se puede usar `npm.cmd` en lugar de `npm`.

- Aplicación: http://localhost:5173
- API: http://localhost:3000/api/citas
- Comprobación del servidor: http://localhost:3000/api/salud

## Comprobación

Registrar una cita desde el formulario, recargar y comprobar que permanece.
Confirmar una cita pendiente y comprobar que el estado también permanece.
Intentar registrar otra cita activa en la misma fecha y hora: debe mostrarse
el mensaje de horario ocupado. Los campos vacíos o inválidos deben rechazarse.

`npm run build` compila el frontend; el mismo comando dentro de `backend`
compila el servidor. `npm run lint`, desde la raíz, revisa el código TypeScript.

## Recorrido de una solicitud

React → servicio con fetch → ruta de Express → controlador → repositorio → MySQL.
La respuesta vuelve a React para actualizar la lista. El formulario utiliza
`POST /api/citas`, la consulta usa `GET /api/citas` y la confirmación utiliza
`PATCH /api/citas/:id/estado`.

El controlador valida los datos y aplica las reglas. El repositorio contiene
las consultas SQL parametrizadas. `asyncHandler` envía los errores asíncronos
al middleware central, que responde con un código HTTP y un mensaje visible.