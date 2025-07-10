# 📚 Sistema de Tutorías - Documentación de API

## 🚀 Descripción General

Este sistema permite gestionar tutorías académicas con tres tipos de usuarios:
- **Estudiantes**: Pueden solicitar tutorías y calificar sesiones
- **Tutores**: Pueden aceptar/rechazar solicitudes y gestionar sesiones
- **Coordinadores**: Pueden crear usuarios y gestionar materias

## 🔧 Configuración Inicial

### Variables de Entorno
Crea un archivo `.env` con:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_tutorias
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=3000
```

### Instalación y Ejecución
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar en producción
npm run start:prod
```

## 🔐 Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "contraseña": "micontraseña"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Uso del Token
Incluye el token en todas las peticiones autenticadas:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 👥 Gestión de Usuarios

### Crear Coordinador
```http
POST /coordinadores
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@universidad.edu",
  "contraseña": "password123",
  "cedula": "12345678",
  "departamento": "Ingeniería",
  "extension_interna": "1234"
}
```

### Crear Tutor
```http
POST /tutores
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "nombre": "María García",
  "correo": "maria@universidad.edu",
  "contraseña": "password123",
  "cedula": "87654321",
  "profesion": "Ingeniera de Sistemas",
  "experiencia": "5 años enseñando programación",
  "telefono": "555-0123",
  "materia_id": 1
}
```

### Crear Estudiante
```http
POST /estudiantes
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "nombre": "Carlos López",
  "correo": "carlos@estudiante.edu",
  "contraseña": "password123",
  "cedula": "11223344",
  "carrera": "Ingeniería de Sistemas",
  "semestre": 5,
  "telefono": "555-0456"
}
```

## 📖 Gestión de Materias

### Listar Materias (Público)
```http
GET /materias
```

### Crear Materia
```http
POST /materias
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "nombre": "Programación I",
  "codigo": "PROG101"
}
```

### Actualizar Materia
```http
PATCH /materias/1
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "nombre": "Programación Básica"
}
```

## 👨‍🏫 Gestión de Tutores

### Listar Todos los Tutores (Público)
```http
GET /tutores
```

### Obtener Tutores por Materia
```http
GET /tutores/por-materia/1
```

### Asignar Materia a Tutor
```http
PATCH /tutores/1/asignar-materia
Authorization: Bearer {token_coordinador}
Content-Type: application/json

{
  "materia_id": 2
}
```

## 📝 Solicitudes de Tutoría

### Crear Solicitud (Estudiante)
```http
POST /solicitudes-tutoria
Authorization: Bearer {token_estudiante}
Content-Type: application/json

{
  "tutor_id": 1,
  "materia_id": 1,
  "fecha_deseada": "2024-02-15",
  "hora_deseada": "14:30",
  "descripcion": "Necesito ayuda con bucles y condicionales"
}
```

### Ver Mis Solicitudes (Estudiante)
```http
GET /solicitudes-tutoria/mis-solicitudes
Authorization: Bearer {token_estudiante}
```

### Ver Solicitudes Asignadas (Tutor)
```http
GET /solicitudes-tutoria/asignadas
Authorization: Bearer {token_tutor}
```

### Responder Solicitud (Tutor)
```http
PATCH /solicitudes-tutoria/1/responder
Authorization: Bearer {token_tutor}
Content-Type: application/json

{
  "estado": "aceptada",
  "comentario_tutor": "Perfecto, nos vemos el viernes a las 2:30 PM"
}
```

**Estados disponibles:**
- `"aceptada"` - Crea automáticamente una sesión agendada
- `"rechazada"` - Rechaza la solicitud

### Ver Detalle de Solicitud
```http
GET /solicitudes-tutoria/1
Authorization: Bearer {token}
```

## 🎓 Sesiones de Tutoría

### Crear Sesión Directamente (Tutor)
```http
POST /sesiones-tutoria
Authorization: Bearer {token_tutor}
Content-Type: application/json

{
  "estudiante_id": 1,
  "materia_id": 1,
  "fecha": "2024-02-20",
  "hora": "10:00",
  "descripcion": "Sesión de repaso para examen"
}
```

### Ver Mis Sesiones (Estudiante)
```http
GET /sesiones-tutoria/mis-sesiones
Authorization: Bearer {token_estudiante}
```

**Respuesta:**
```json
{
  "futuras": [
    {
      "id": 1,
      "fecha": "2024-02-15",
      "hora": "14:30",
      "estado": "agendada",
      "tutor": {
        "usuario": {
          "nombre": "María García"
        }
      },
      "materia": {
        "nombre": "Programación I"
      }
    }
  ],
  "pasadas": [
    {
      "id": 2,
      "fecha": "2024-01-20",
      "hora": "10:00",
      "estado": "completada",
      "calificacion": 5,
      "comentario_estudiante": "Excelente explicación"
    }
  ]
}
```

### Ver Sesiones Asignadas (Tutor)
```http
GET /sesiones-tutoria/asignadas
Authorization: Bearer {token_tutor}
```

### Completar Sesión (Tutor)
```http
PATCH /sesiones-tutoria/1/completar
Authorization: Bearer {token_tutor}
Content-Type: application/json

{
  "notas_tutor": "El estudiante comprendió bien los conceptos de bucles. Recomiendo practicar más con arrays."
}
```

### Calificar Sesión (Estudiante)
```http
PATCH /sesiones-tutoria/1/calificar
Authorization: Bearer {token_estudiante}
Content-Type: application/json

{
  "calificacion": 5,
  "comentario_estudiante": "Excelente tutor, explicó muy bien todos los conceptos. Muy recomendado."
}
```

**Calificación:** Número del 1 al 5 (1 = Muy malo, 5 = Excelente)

### Ver Detalle de Sesión
```http
GET /sesiones-tutoria/1
Authorization: Bearer {token}
```

## 👤 Perfil de Usuario

### Ver Mi Perfil
```http
GET /{tipo}/perfil
Authorization: Bearer {token}
```

Donde `{tipo}` puede ser:
- `estudiantes/perfil`
- `tutores/perfil`
- `coordinadores/perfil`

### Actualizar Mi Perfil
```http
PATCH /{tipo}/perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "telefono": "555-9999"
}
```

## 🔄 Flujo Completo de Tutoría

### 1. Preparación (Coordinador)
```bash
# 1. Crear materias
POST /materias
{
  "nombre": "Programación I",
  "codigo": "PROG101"
}

# 2. Crear tutor
POST /tutores
{
  "nombre": "María García",
  "correo": "maria@universidad.edu",
  "contraseña": "password123",
  "cedula": "87654321",
  "profesion": "Ingeniera de Sistemas",
  "experiencia": "5 años enseñando",
  "telefono": "555-0123",
  "materia_id": 1
}

# 3. Crear estudiante
POST /estudiantes
{
  "nombre": "Carlos López",
  "correo": "carlos@estudiante.edu",
  "contraseña": "password123",
  "cedula": "11223344",
  "carrera": "Ingeniería de Sistemas",
  "semestre": 5,
  "telefono": "555-0456"
}
```

### 2. Solicitud (Estudiante)
```bash
# 1. Ver tutores disponibles
GET /tutores/por-materia/1

# 2. Crear solicitud
POST /solicitudes-tutoria
{
  "tutor_id": 1,
  "materia_id": 1,
  "fecha_deseada": "2024-02-15",
  "hora_deseada": "14:30",
  "descripcion": "Necesito ayuda con bucles"
}
```

### 3. Gestión (Tutor)
```bash
# 1. Ver solicitudes asignadas
GET /solicitudes-tutoria/asignadas

# 2. Aceptar solicitud
PATCH /solicitudes-tutoria/1/responder
{
  "estado": "aceptada",
  "comentario_tutor": "Perfecto, nos vemos el viernes"
}

# 3. Ver sesiones programadas
GET /sesiones-tutoria/asignadas

# 4. Completar sesión después de la tutoría
PATCH /sesiones-tutoria/1/completar
{
  "notas_tutor": "Estudiante comprendió bien los conceptos"
}
```

### 4. Evaluación (Estudiante)
```bash
# 1. Ver sesiones completadas
GET /sesiones-tutoria/mis-sesiones

# 2. Calificar sesión
PATCH /sesiones-tutoria/1/calificar
{
  "calificacion": 5,
  "comentario_estudiante": "Excelente explicación"
}
```

## ⚠️ Códigos de Error Comunes

### 400 Bad Request
- Datos de entrada inválidos
- Fecha en el pasado
- Sesión ya calificada
- Tutor no asignado a la materia

### 401 Unauthorized
- Token inválido o expirado
- Credenciales incorrectas

### 403 Forbidden
- Sin permisos para la acción
- Rol incorrecto

### 404 Not Found
- Usuario, materia, solicitud o sesión no encontrada

### Ejemplo de respuesta de error:
```json
{
  "statusCode": 400,
  "message": "No se puede solicitar tutoría para fechas pasadas",
  "error": "Bad Request"
}
```

## 📊 Estados del Sistema

### Estados de Solicitud
- `pendiente` - Recién creada, esperando respuesta del tutor
- `aceptada` - Tutor aceptó, se crea sesión automáticamente
- `rechazada` - Tutor rechazó la solicitud

### Estados de Sesión
- `agendada` - Sesión programada, pendiente de realizarse
- `completada` - Tutor marcó como completada
- `cancelada` - Sesión cancelada

## 🛡️ Seguridad

- Todas las contraseñas se almacenan hasheadas con bcrypt
- JWT tokens con expiración de 1 día
- Validación de roles en cada endpoint
- Validación de datos de entrada con class-validator
- Logging automático de todas las peticiones

## 📱 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "estudiante@ejemplo.com",
    "contraseña": "password123"
  }'
```

### Crear Solicitud
```bash
curl -X POST http://localhost:3000/solicitudes-tutoria \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tutor_id": 1,
    "materia_id": 1,
    "fecha_deseada": "2024-02-15",
    "hora_deseada": "14:30",
    "descripcion": "Necesito ayuda con bucles"
  }'
```

## 🎯 Casos de Uso Típicos

### Para Estudiantes:
1. Hacer login
2. Ver tutores disponibles por materia
3. Crear solicitud de tutoría
4. Ver estado de mis solicitudes
5. Ver mis sesiones futuras y pasadas
6. Calificar sesiones completadas

### Para Tutores:
1. Hacer login
2. Ver solicitudes asignadas
3. Aceptar o rechazar solicitudes
4. Ver sesiones programadas
5. Completar sesiones con notas
6. Crear sesiones directamente

### Para Coordinadores:
1. Hacer login
2. Crear materias
3. Crear tutores y estudiantes
4. Asignar materias a tutores
5. Gestionar el sistema

¡El sistema está listo para usar! 🚀