# 🧪 Guía de Pruebas en Postman - Sesiones y Solicitudes de Tutoría

Esta guía te ayudará a probar las funcionalidades de **Solicitudes de Tutoría** y **Sesiones de Tutoría** usando Postman.

## 📋 Requisitos Previos

1. **Servidor ejecutándose**: `npm run start:dev`
2. **Base de datos configurada** con datos de prueba
3. **Postman instalado**

## 🔧 Configuración Inicial en Postman

### 1. Variables de Entorno
Crea una nueva colección y configura estas variables:

```
BASE_URL: http://localhost:3000
STUDENT_TOKEN: (se obtendrá después del login)
TUTOR_TOKEN: (se obtendrá después del login)
COORDINATOR_TOKEN: (se obtendrá después del login)
```

### 2. Datos de Prueba Necesarios

Antes de probar, necesitas tener en la base de datos:
- ✅ Un coordinador registrado
- ✅ Un tutor registrado con materia asignada
- ✅ Un estudiante registrado
- ✅ Al menos una materia creada

---

## 🚀 Flujo de Pruebas Completo

### PASO 1: Autenticación

#### 1.1 Login como Estudiante
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "correo": "estudiante@test.com",
  "contraseña": "password123"
}
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Importante:** Copia el `access_token` y guárdalo en la variable `STUDENT_TOKEN`

#### 1.2 Login como Tutor
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "correo": "tutor@test.com",
  "contraseña": "password123"
}
```

**⚠️ Importante:** Guarda el token en `TUTOR_TOKEN`

---

## 📝 SOLICITUDES DE TUTORÍA

### 2.1 Crear Solicitud (Como Estudiante)

```http
POST {{BASE_URL}}/solicitudes-tutoria
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{
  "tutor_id": 2,
  "materia_id": 1,
  "fecha_deseada": "2024-12-20",
  "hora_deseada": "14:30",
  "descripcion": "Necesito ayuda con cálculo diferencial, específicamente con límites y derivadas"
}
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "estudianteId": 3,
  "tutorId": 2,
  "materiaId": 1,
  "fecha_deseada": "2024-12-20T00:00:00.000Z",
  "hora_deseada": "14:30",
  "descripcion": "Necesito ayuda con cálculo diferencial...",
  "estado": "pendiente",
  "comentario_tutor": null,
  "fechaCreacion": "2024-12-15T10:30:00.000Z"
}
```

### 2.2 Ver Mis Solicitudes (Como Estudiante)

```http
GET {{BASE_URL}}/solicitudes-tutoria/mis-solicitudes
Authorization: Bearer {{STUDENT_TOKEN}}
```

### 2.3 Ver Solicitudes Asignadas (Como Tutor)

```http
GET {{BASE_URL}}/solicitudes-tutoria/asignadas
Authorization: Bearer {{TUTOR_TOKEN}}
```

**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "estudianteId": 3,
    "tutorId": 2,
    "materiaId": 1,
    "fecha_deseada": "2024-12-20T00:00:00.000Z",
    "hora_deseada": "14:30",
    "descripcion": "Necesito ayuda con cálculo diferencial...",
    "estado": "pendiente",
    "estudiante": {
      "id": 3,
      "usuario": {
        "nombre": "Juan Pérez",
        "correo": "estudiante@test.com"
      },
      "carrera": "Ingeniería de Sistemas"
    },
    "materia": {
      "id": 1,
      "nombre": "Cálculo Diferencial",
      "codigo": "MAT101"
    }
  }
]
```

### 2.4 Responder Solicitud - ACEPTAR (Como Tutor)

```http
PATCH {{BASE_URL}}/solicitudes-tutoria/1/responder
Authorization: Bearer {{TUTOR_TOKEN}}
Content-Type: application/json

{
  "estado": "aceptada",
  "comentario_tutor": "Perfecto, nos vemos el viernes a las 2:30 PM. Trae tus apuntes de límites."
}
```

### 2.5 Responder Solicitud - RECHAZAR (Como Tutor)

```http
PATCH {{BASE_URL}}/solicitudes-tutoria/1/responder
Authorization: Bearer {{TUTOR_TOKEN}}
Content-Type: application/json

{
  "estado": "rechazada",
  "comentario_tutor": "Lo siento, no tengo disponibilidad en ese horario. ¿Podrías proponer otro día?"
}
```

### 2.6 Ver Detalle de Solicitud

```http
GET {{BASE_URL}}/solicitudes-tutoria/1
Authorization: Bearer {{STUDENT_TOKEN}}
```

---

## 🎓 SESIONES DE TUTORÍA

### 3.1 Crear Sesión Directamente (Como Tutor)

```http
POST {{BASE_URL}}/sesiones-tutoria
Authorization: Bearer {{TUTOR_TOKEN}}
Content-Type: application/json

{
  "estudiante_id": 3,
  "materia_id": 1,
  "fecha": "2024-12-18",
  "hora": "16:00",
  "descripcion": "Sesión de repaso para el examen final"
}
```

### 3.2 Ver Mis Sesiones (Como Estudiante)

```http
GET {{BASE_URL}}/sesiones-tutoria/mis-sesiones
Authorization: Bearer {{STUDENT_TOKEN}}
```

**Respuesta esperada:**
```json
{
  "futuras": [
    {
      "id": 1,
      "estudianteId": 3,
      "tutorId": 2,
      "materiaId": 1,
      "fecha": "2024-12-20T00:00:00.000Z",
      "hora": "14:30",
      "estado": "agendada",
      "tutor": {
        "id": 2,
        "usuario": {
          "nombre": "María García",
          "correo": "tutor@test.com"
        },
        "profesion": "Ingeniera Matemática"
      },
      "materia": {
        "nombre": "Cálculo Diferencial",
        "codigo": "MAT101"
      }
    }
  ],
  "pasadas": []
}
```

### 3.3 Ver Sesiones Asignadas (Como Tutor)

```http
GET {{BASE_URL}}/sesiones-tutoria/asignadas
Authorization: Bearer {{TUTOR_TOKEN}}
```

### 3.4 Completar Sesión (Como Tutor)

```http
PATCH {{BASE_URL}}/sesiones-tutoria/1/completar
Authorization: Bearer {{TUTOR_TOKEN}}
Content-Type: application/json

{
  "notas_tutor": "Excelente sesión. El estudiante comprendió bien los conceptos de límites. Recomiendo practicar más ejercicios de derivadas para la próxima clase."
}
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "estado": "completada",
  "notas_tutor": "Excelente sesión. El estudiante comprendió bien...",
  "fechaActualizacion": "2024-12-15T18:30:00.000Z"
}
```

### 3.5 Calificar Sesión (Como Estudiante)

```http
PATCH {{BASE_URL}}/sesiones-tutoria/1/calificar
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{
  "calificacion": 5,
  "comentario_estudiante": "Excelente tutor, muy paciente y explica muy bien. Definitivamente recomendado."
}
```

### 3.6 Ver Detalle de Sesión

```http
GET {{BASE_URL}}/sesiones-tutoria/1
Authorization: Bearer {{STUDENT_TOKEN}}
```

---

## 🔄 Flujo Completo de Prueba

### Escenario: "Solicitud → Aceptación → Sesión → Calificación"

1. **Estudiante crea solicitud** → `POST /solicitudes-tutoria`
2. **Tutor ve solicitudes** → `GET /solicitudes-tutoria/asignadas`
3. **Tutor acepta solicitud** → `PATCH /solicitudes-tutoria/{id}/responder`
4. **Se crea automáticamente la sesión** 📅
5. **Estudiante ve sus sesiones** → `GET /sesiones-tutoria/mis-sesiones`
6. **Tutor ve sesiones asignadas** → `GET /sesiones-tutoria/asignadas`
7. **Tutor completa la sesión** → `PATCH /sesiones-tutoria/{id}/completar`
8. **Estudiante califica la sesión** → `PATCH /sesiones-tutoria/{id}/calificar`

---

## ⚠️ Errores Comunes y Soluciones

### 🔴 Error 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solución:** Verifica que el token esté incluido en el header `Authorization: Bearer {token}`

### 🔴 Error 403 - Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```
**Solución:** Estás usando el rol incorrecto. Verifica que uses el token del rol apropiado.

### 🔴 Error 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "Tutor no encontrado"
}
```
**Solución:** Verifica que los IDs en tu request existan en la base de datos.

### 🔴 Error 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": "No se puede solicitar tutoría para fechas pasadas"
}
```
**Solución:** Usa fechas futuras en tus solicitudes.

---

## 📊 Estados y Transiciones

### Estados de Solicitud:
- `pendiente` → `aceptada` → Crea sesión automáticamente
- `pendiente` → `rechazada` → No se crea sesión

### Estados de Sesión:
- `agendada` → `completada` (por tutor)
- `completada` → Puede ser calificada (por estudiante)

---

## 🎯 Casos de Prueba Recomendados

1. ✅ **Flujo exitoso completo**
2. ✅ **Solicitud rechazada**
3. ✅ **Intento de calificar sesión no completada**
4. ✅ **Intento de completar sesión de otro tutor**
5. ✅ **Solicitud con fecha pasada**
6. ✅ **Calificación fuera del rango (1-5)**

---

## 🔧 Tips para Postman

1. **Usa variables** para los tokens y IDs
2. **Crea una colección** con todas las requests organizadas
3. **Usa Tests** para validar respuestas automáticamente
4. **Guarda ejemplos** de respuestas exitosas
5. **Organiza por carpetas**: Solicitudes / Sesiones / Auth

¡Listo para probar! 🚀