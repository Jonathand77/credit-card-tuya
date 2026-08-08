# **💳 Credit Card App - Guía de la Solución y Manual de Usuario**

---

## 🛠️ Stack tecnológico y Arquitectura

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Layered%20(Domain%20%2F%20Application%20%2F%20Api)-blue)
![Testing](https://img.shields.io/badge/Testing-xUnit%20%2B%20Vitest-25A162)
![Code Quality](https://img.shields.io/badge/Code%20Quality-ESLint%20%2B%20Clean%20Code-success)
![GitHub repo size](https://img.shields.io/github/repo-size/Jonathand77/credit-card-tuya)
![GitHub last commit](https://img.shields.io/github/last-commit/Jonathand77/credit-card-tuya)
![Languages](https://img.shields.io/github/languages/count/Jonathand77/credit-card-tuya)

## 👤 Autor

| 👨‍💻 Nombre | 📧 Correo | 🏫 Link directo al repositorio | 🐙 Usuario GitHub |
|---|---|---|---|
| **Jonathan David Fernandez Vargas** | jonathanfdez62@gmail.com | [Link](https://github.com/Jonathand77/credit-card-tuya) | [jonathand77](https://github.com/jonathand77) |

**Aplicación full stack para gestionar tarjetas de crédito, realizar pagos y consultar el historial de transacciones.**

---

## 1. 🔍 Introducción

Credit Card App es una aplicación completa de gestión financiera personal: permite registrarse e iniciar sesión, dar de alta tarjetas de crédito, realizar pagos con ellas, y consultar un historial de transacciones con facturas descargables en PDF. Todo respaldado por un panel de Dashboard con métricas reales calculadas a partir de los datos del usuario.

El backend está construido en **.NET 8** siguiendo una arquitectura por capas (Domain → Application → Api) con inversión de dependencias real: la lógica de negocio nunca depende de Entity Framework ni de detalles de infraestructura, solo de interfaces. El frontend está construido en **React 18 + TypeScript + Vite**, con un sistema de diseño propio (tokens de color, tipografía, animaciones) consistente en las cinco vistas de la aplicación.

## 2. ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de contar con:
- [Git](https://git-scm.com/)
- [.NET SDK 8](https://dotnet.microsoft.com/) (cualquier versión `8.0.1xx`; el repo fija la banda de features vía `global.json`)
- [Node.js](https://nodejs.org/) 18+ y npm
- Una cuenta en [Supabase](https://supabase.com/) (Postgres administrado) o cualquier instancia Postgres accesible
- Un navegador web moderno (Chrome, Edge, Firefox, etc.)

## 📦 Estructura del Proyecto

```
credit-card-tuya/
│
├── backend/
│   ├── CreditCard.Api/              # Capa de entrada: HTTP, DI, infraestructura
│   │   ├── Controllers/             # AuthController, CardsController, PaymentsController, TransactionsController
│   │   ├── DTOs/
│   │   ├── Infrastructure/          # AppDbContext + Repositories/ (Card, Transaction, User)
│   │   ├── Mapping/                 # Perfil de AutoMapper
│   │   ├── Middleware/              # ExceptionMiddleware (manejo global de errores)
│   │   ├── Migrations/              # Migraciones de EF Core
│   │   ├── Services/                # TokenService (implementación JWT)
│   │   ├── Validators/              # Reglas de FluentValidation
│   │   └── Program.cs
│   ├── CreditCard.Application/      # Lógica de negocio, sin dependencias de infraestructura
│   │   ├── Interfaces/              # ICardRepository, ITransactionRepository, IUserRepository, ITokenService
│   │   └── Services/                # CardService, PaymentService, TransactionService, AuthService
│   ├── CreditCard.Domain/           # Entidades puras, sin dependencias
│   │   └── Entities/                # User, CreditCard, Transaction
│   └── CreditCard.Tests/            # xUnit, con fakes en lugar de mocks
│       ├── Fakes/
│       └── Services/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/              # Navbar, Modal, ConfirmDialog, ErrorBoundary, CardForm, CardList, ETC
│       ├── context/                 # AuthContext (provider) + auth-context (hook, para Fast Refresh)
│       ├── lib/                     # toastStore (sistema de notificaciones)
│       ├── pages/                   # Login, Dashboard, Cards, Payments, History
│       ├── services/                # api.ts — cliente HTTP tipado hacia el backend
│       ├── styles/                  # base/ · layout/ · components/ · pages/
│       ├── utils/                   # invoicePdf.ts
│       └── App.tsx
│
├── assets/img/                      # Capturas de pantalla usadas en este README
├── CreditCardApp.sln
├── creditcard_migrations.sql        # Script SQL equivalente a las migraciones de EF
└── global.json                      # Fija la banda de features del SDK de .NET
```

---

## 3. 🖥️ Guía Paso a Paso para Levantar el Proyecto

### 3.1 Clonar el repositorio

```bash
git clone https://github.com/Jonathand77/credit-card-tuya.git
cd credit-card-tuya
```

### 3.2 Base de datos (Supabase / Postgres)

1. Crea un proyecto en [Supabase](https://supabase.com/) (o usa cualquier Postgres accesible).
2. Obtén la cadena de conexión (botón **Connect** en el dashboard → *Session pooler* o *Direct connection*).
3. Crea `backend/CreditCard.Api/appsettings.Development.json` (está en `.gitignore`, nunca se sube al repo) con este contenido:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<host>;Port=5432;Database=postgres;Username=<usuario>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true"
  },
  "Jwt": {
    "Key": "<clave-aleatoria-larga>",
    "Issuer": "CreditCardApi",
    "ExpiresMinutes": 60
  }
}
```

4. Aplica el esquema con las migraciones de EF Core (recomendado):

```bash
cd backend/CreditCard.Api
dotnet tool install --global dotnet-ef   # si no lo tienes
dotnet ef database update
```

   Alternativamente, puedes ejecutar `creditcard_migrations.sql` directamente contra la base de datos.

> **Modo rápido sin base de datos:** si solo quieres probar la app sin configurar Postgres, el backend cae automáticamente a una base de datos en memoria si no hay `ConnectionStrings:DefaultConnection`, o si defines `USE_INMEMORY=true` explícitamente.

### 3.3 Ejecutar el Backend

```bash
cd backend/CreditCard.Api
dotnet run --urls "http://localhost:5065"
```

La API queda disponible en `http://localhost:5065` (Swagger en `http://localhost:5065/swagger`).

### 3.4 Ejecutar el Frontend

Desde otra terminal, en la raíz del proyecto:

```bash
cd frontend
echo VITE_API_URL=http://127.0.0.1:5065 > .env
npm install
npm run dev
```

**Ya puedes abrir en el navegador:** `http://localhost:5173` (o `http://127.0.0.1:5173`, ambos orígenes están habilitados por CORS).

---

## 4. 🏗️ Arquitectura y Buenas Prácticas

- **Arquitectura en capas con inversión de dependencias real**: `CreditCard.Domain` no depende de nada; `CreditCard.Application` define interfaces (`ICardRepository`, `ITransactionRepository`, `IUserRepository`, `ITokenService`) y contiene los servicios de negocio (`CardService`, `PaymentService`, `TransactionService`, `AuthService`); `CreditCard.Api` implementa esas interfaces contra EF Core/Postgres y expone los controllers. Los cuatro controllers (`Auth`, `Cards`, `Payments`, `Transactions`) siguen exactamente el mismo patrón: Controller → Service → Repository.
- **DTOs + AutoMapper** para no exponer las entidades de dominio directamente en la API.
- **Validación con FluentValidation** (incluye validación de número de tarjeta por algoritmo de Luhn).
- **Middleware de manejo de errores global** (`ExceptionMiddleware`).
- **Nunca se guarda el número de tarjeta ni el CVV en texto plano**: se almacena un hash (BCrypt) y una versión enmascarada (`CardNumberMasked`, `Last4`) para mostrar en la UI.
- **Frontend tipado de punta a punta**: cero uso de `any` en todo el código de la aplicación (`services/api.ts` expone tipos como `CardItem`, `TransactionItem`, `AuthResponse` para cada respuesta del backend).
- **Manejo de sesión robusto**: si el token JWT expira o deja de ser válido, la app cierra la sesión localmente, muestra un aviso y redirige a `/login` automáticamente en cualquier vista.
- **Error Boundary** en el frontend: un error inesperado en una vista muestra una pantalla de recuperación en vez de dejar la aplicación en blanco.
- **Sistema de notificaciones (toasts) y modales propios**, con animaciones y sin dependencias externas.

## 5. 🚀 API REST — Endpoints

| Método | Endpoint | Descripción | Auth | Códigos de respuesta |
|---|---|---|:---:|---|
| `POST` | `/api/auth/register` | Registra un usuario nuevo | ❌ | `200`, `409` (usuario ya existe) |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve un JWT | ❌ | `200`, `401` (credenciales inválidas) |
| `GET` | `/api/cards` | Lista las tarjetas del usuario autenticado | ✅ | `200` |
| `GET` | `/api/cards/{id}` | Obtiene una tarjeta por id | ✅ | `200`, `404` |
| `POST` | `/api/cards` | Registra una tarjeta nueva | ✅ | `201`, `400` (validación) |
| `PUT` | `/api/cards/{id}` | Actualiza titular, vencimiento y límite | ✅ | `204`, `404` |
| `DELETE` | `/api/cards/{id}` | Elimina una tarjeta | ✅ | `204`, `404` |
| `POST` | `/api/payments` | Registra un pago (cargo) sobre una tarjeta | ✅ | `200`, `400` (excede el límite) |
| `GET` | `/api/transactions` | Historial paginado (`page`, `size`, `cardId` opcional) | ✅ | `200` |

Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.

## 6. 🎨 Frontend — Páginas y Componentes Clave

- **Login**: pantalla partida con panel de marca animado, íconos en los campos, mostrar/ocultar contraseña, y modal de registro.
- **Dashboard**: resumen con saldo total, disponible total, tarjetas y transacciones reales; gráfica de actividad calculada a partir de las últimas transacciones y accesos rápidos a las demás vistas.
- **Cards**: alta, edición y borrado de tarjetas (con confirmación mediante modal, no `confirm()` del navegador), barra de uso por tarjeta y resumen de límites.
- **Payments**: selección de tarjeta con vista previa en vivo, montos rápidos (25% / 50% / todo el disponible) y resumen del pago antes de confirmar.
- **History**: historial de transacciones con paginación ("cargar más"), y descarga de cada transacción como factura en PDF.

## 7. 🧪 Testing

**Backend** (xUnit, con fakes en memoria en vez de mocks):

```bash
dotnet test backend/CreditCard.Tests/CreditCard.Tests.csproj
```

Cubre las reglas de negocio de `PaymentService` (límite de crédito, montos inválidos, propiedad de la tarjeta) y `AuthService` (registro duplicado, credenciales inválidas, hasheo de contraseñas).

**Frontend** (Vitest + React Testing Library):

```bash
cd frontend
npm test        # tests unitarios de componentes
npm run lint     # ESLint (0 errores, 0 warnings)
npm run build    # build de producción
```

## 8. 🌐 Seguridad

- El número de tarjeta y el CVV nunca se guardan en texto plano (hash + enmascarado).
- Las contraseñas se guardan hasheadas con BCrypt.
- El JWT y la cadena de conexión se configuran vía variables de entorno / `appsettings.Development.json`, nunca hardcodeados ni versionados en el repo.
- CORS restringido explícitamente a los orígenes del frontend (no `AllowAnyOrigin`).
- Los mensajes de error de login no revelan si el usuario existe o no (mismo mensaje genérico para ambos casos).
- Expiración de sesión manejada de forma explícita: al vencer el JWT, la app cierra sesión y avisa al usuario en vez de fallar silenciosamente.

## 9. 📝 Manual de Usuario

1. Levanta el backend y el frontend siguiendo la guía paso a paso (sección 3).
2. Abre `http://localhost:5173` en el navegador.
3. Regístrate o inicia sesión.
4. Gestiona tus tarjetas: crear, editar y eliminar (con confirmación).
5. Realiza pagos usando cualquiera de tus tarjetas registradas.
6. Consulta el historial de transacciones y descarga la factura en PDF de cualquiera de ellas.
7. Revisa tus estadísticas generales en el Dashboard.

## 10. 📊 Próximos pasos

- Aumentar la cobertura de tests (actualmente cubre los servicios de negocio más críticos, falta cobertura de controllers y del resto de servicios de aplicación).
- Agregar tests end-to-end (Playwright/Cypress) para validar el flujo completo de un usuario real.
- Dividir `frontend/src/services/api.ts` por dominio (`authApi.ts`, `cardsApi.ts`, etc.) a medida que crezca.
- Code-splitting en el frontend (el bundle de producción ya supera los 500 KB en un solo chunk).
- Dark mode, rate limiting y caching.
- Pipeline de CI (build + lint + tests en cada push/PR).

---
## **Fin de la guía y manual de usuario.**
---
