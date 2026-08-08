# **🎫 Registro de Tickets - Mesa de Ayuda**

---

## 🛠️ Stack tecnologico y Arquitectura

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-REST%20API-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Layered%20(DB%20%2F%20API%20%2F%20UI)-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Jonathand77/registro-tickets)
![GitHub last commit](https://img.shields.io/github/last-commit/Jonathand77/registro-tickets)
![Languages](https://img.shields.io/github/languages/count/Jonathand77/registro-tickets)

## 👤 Autor

| 👨‍💻 Nombre | 📧 Correo | 🏫 Link directo al repositorio | 🐙 Usuario GitHub |
|---|---|---|---|
| **Jonathan David Fernandez Vargas** | jonathanfdez62@gmail.com | [LinkRepositorio](https://github.com/Jonathand77/registro-tickets) | [jonathand77](https://github.com/jonathand77) |

**Desarrollo de una aplicación de mesa de ayuda para registrar, listar y priorizar tickets de soporte.**

---

## 1. 🔍 Introducción
Este proyecto resuelve el caso de una mesa de ayuda que necesita registrar incidencias y priorizar las que continúan abiertas.
La solución implementa una arquitectura por capas: **base de datos** (MySQL), **API REST** (Node.js + Express) y **frontend** (React + Vite), comunicadas mediante peticiones HTTP en formato JSON.
Las consultas a la base de datos usan sentencias parametrizadas para evitar inyección SQL, y el frontend consume la API de forma asíncrona sin recargar la página.

## 2. ⚙️ Requisitos Previos
Antes de comenzar, asegúrate de contar con:
- Git
- [Node.js](https://nodejs.org/) v18 o superior (incluye npm)
- MySQL Server 8.0 o superior, corriendo localmente
- Un navegador web (Chrome, Edge, Firefox, etc.)
- Un editor de código como Visual Studio Code (opcional)

## 📦 Estructura del Proyecto

```
registro-tickets/
├──  RAÍZ
│   ├── .gitignore
│   ├── .git/
│   ├── database/
│   │   ├── 01_schema.sql
│   │   ├── 02_seed.sql
│   │   └── 03_queries.sql
│   ├── backend/
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── src/
│   │       ├── app.js
│   │       ├── server.js
│   │       ├── config/db.js
│   │       ├── controllers/tickets.controller.js
│   │       ├── routes/tickets.routes.js
│   │       └── middlewares/errorHandler.js
│   ├── frontend/
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.jsx
│   │       ├── App.jsx
│   │       ├── api/ticketsApi.js
│   │       ├── hooks/useTickets.js
│   │       ├── constants/tickets.js
│   │       └── components/
│   │           ├── Header.jsx
│   │           ├── TicketForm.jsx
│   │           ├── FilterBar.jsx
│   │           ├── TicketList.jsx
│   │           ├── TicketCard.jsx
│   │           └── Badge.jsx
│   └── README.md
```

---

## 3. 🖥️ Guía Paso a Paso para Levantar el Proyecto
### 3.1 Clonar el repositorio

```bash
git clone https://github.com/Jonathand77/registro-tickets.git
cd registro-tickets
```

### 3.2 Levantar la Base de Datos

**⚠️ Nota:** Este proyecto no requiere Docker, se conecta contra un MySQL local ya instalado.

Ejecuta los scripts en orden contra tu servidor MySQL (te pedirá la contraseña del usuario indicado):

```bash
mysql -u root -p < database/01_schema.sql
mysql -u root -p < database/02_seed.sql
```

**Esto creará:**
- La base de datos `registro_tickets`
- La tabla `tickets` con sus restricciones (`CHECK` de `estado` y `severidad`) e índices
- 7 registros de ejemplo

Opcionalmente, `database/03_queries.sql` contiene las consultas de verificación (tickets abiertos priorizados y conteo por estado).

### 3.3 Ejecutar el Backend

```bash
cd backend
npm install
copy .env.example .env    # en Windows (o: cp .env.example .env)
```

Edita `.env` con las credenciales de tu MySQL local (`DB_USER`, `DB_PASSWORD`, etc.) y luego levanta el servidor:

```bash
npm run dev
```

La API quedará disponible en `http://localhost:4000/api/tickets`.

### 3.4 Ejecutar el Frontend

Desde otra terminal, en la raíz del proyecto:

```bash
cd frontend
npm install
copy .env.example .env    # en Windows (o: cp .env.example .env)
npm run dev
```

**Ya puedes abrir en el navegador y utilizar la aplicación:**
`http://localhost:5173`

---

## 4. 🗄️ Modelo de Datos y Buenas Prácticas
### 4.1 Tabla `tickets`
| Campo | Tipo | Restricción |
|---|---|---|
| `id` | INT (PK) | Autogenerado |
| `asunto` | VARCHAR(120) | Obligatorio |
| `estado` | VARCHAR(20) | `ABIERTO` o `CERRADO` (`CHECK`) |
| `severidad` | VARCHAR(10) | `BAJA`, `MEDIA` o `ALTA` (`CHECK`) |
| `fecha_creacion` | DATETIME | Por defecto la fecha/hora actual |

### 4.2 Buenas Prácticas y Arquitectura
- **Separación de responsabilidades (backend)**: rutas (`routes/`), lógica de negocio (`controllers/`), conexión a datos (`config/db.js`), manejo de errores (`middlewares/`).
- **Seguridad**: consultas parametrizadas con `mysql2` (sin concatenar strings), evitando inyección SQL.
- **Validación**: campos obligatorios validados en el backend, con respuestas HTTP 200/201 (éxito), 400 (validación) y 500 (error interno).
- **Separación de responsabilidades (frontend)**: cliente HTTP (`api/`), estado y efectos (`hooks/`), componentes de presentación (`components/`), valores compartidos (`constants/`).
- **Mantenibilidad visual**: paleta de colores institucional centralizada en variables CSS (`index.css`).

## 5. 🚀 API REST - Endpoints
| Método | Endpoint | Descripción | Códigos de respuesta |
|---|---|---|---|
| `GET` | `/api/tickets` | Lista todos los tickets | `200` |
| `GET` | `/api/tickets?estado=ABIERTO\|CERRADO` | Filtra por estado | `200`, `400` (estado inválido) |
| `POST` | `/api/tickets` | Registra un nuevo ticket | `201`, `400` (validación), `500` (error servidor) |

## 6. 🎨 Frontend - React + Vite
### 6.1 Funcionalidades
- Formulario de registro con validaciones básicas (asunto obligatorio, máximo 120 caracteres, severidad requerida).
- Listado de tickets en tarjetas, consumiendo la API en tiempo real.
- Filtro por estado con botón para limpiarlo.
- Mensajes de carga, error (con reintento) y estado vacío.
- Tras registrar un ticket, el formulario se limpia y el listado se actualiza sin recargar la página.

### 6.2 Componentes clave
- **Header**: identidad de la mesa de ayuda.
- **TicketForm**: alta de tickets con validación y feedback de éxito/error.
- **FilterBar**: filtro por estado y conteo de resultados.
- **TicketList / TicketCard**: presentación de los tickets con badges de estado y severidad.

---
## **Fin de la guía y manual de usuario.**
---
