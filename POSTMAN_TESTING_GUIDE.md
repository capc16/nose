# 🧪 Guía de Pruebas con Postman - Sistema de Tutorías

Esta guía te ayudará a probar todas las funcionalidades del sistema de tutorías usando Postman.

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Configuración de Variables](#configuración-de-variables)
3. [Autenticación](#autenticación)
4. [Gestión de Usuarios](#gestión-de-usuarios)
5. [Gestión de Materias](#gestión-de-materias)
6. [Solicitudes de Tutoría](#solicitudes-de-tutoría)
7. [Sesiones de Tutoría](#sesiones-de-tutoría)
8. [Flujo Completo de Prueba](#flujo-completo-de-prueba)

---

## 🚀 Configuración Inicial

### 1. Configurar el Entorno
1. Abre Postman
2. Crea un nuevo **Environment** llamado "Sistema Tutorías"
3. Agrega las siguientes variables:

| Variable | Valor Inicial | Valor Actual |
|----------|---------------|--------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `token` | | (se llenará automáticamente) |
| `coordinador_id` | | (se llenará automáticamente) |
| `tutor_id` | | (se llenará automáticamente) |
| `estudiante_id` | | (se llenará automáticamente) |
| `materia_id` | | (se llenará automáticamente) |
| `solicitud_id` | | (se llenará automáticamente) |
| `sesion_id` | | (se llenará automáticamente) |

### 2. Configurar Headers Globales
En tu colección, agrega estos headers por defecto:
- `Content-Type`: `application/json`
- `Authorization`: `Bearer {{token}}`

---

## 🔐 Autenticación

### 1. Login
**POST** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "correo": "coordinador@test.com",
  "contraseña": "123456789"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.access_token);
    console.log("Token guardado:", response.access_token);
}
```

---

## 👥 Gestión de Usuarios

### 1. Crear Coordinador (Primer usuario del sistema)
**POST** `{{base_url}}/coordinadores`

**Headers:** (Sin Authorization para el primer coordinador)
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Juan Coordinador",
  "correo": "coordinador@test.com",
  "contraseña": "123456789",
  "cedula": "12345678",
  "departamento": "Sistemas",
  "extension_interna": "101"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("coordinador_id", response.id);
    console.log("Coordinador creado con ID:", response.id);
}
```

### 2. Crear Tutor
**POST** `{{base_url}}/tutores`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "nombre": "María Tutora",
  "correo": "tutor@test.com",
  "contraseña": "123456789",
  "cedula": "87654321",
  "profesion": "Ingeniera de Sistemas",
  "experiencia": "5 años enseñando programación",
  "telefono": "555-0123"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("tutor_id", response.id);
    console.log("Tutor creado con ID:", response.id);
}
```

### 3. Crear Estudiante
**POST** `{{base_url}}/estudiantes`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "nombre": "Carlos Estudiante",
  "correo": "estudiante@test.com",
  "contraseña": "123456789",
  "cedula": "11223344",
  "carrera": "Ingeniería de Sistemas",
  "semestre": 5,
  "telefono": "555-0456"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("estudiante_id", response.id);
    console.log("Estudiante creado con ID:", response.id);
}
```

---

## 📖 Gestión de Materias

### 1. Crear Materia
**POST** `{{base_url}}/materias`

**Body (JSON):**
```json
{
  "nombre": "Programación I",
  "codigo": "PROG001"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("materia_id", response.id);
    console.log("Materia creada con ID:", response.id);
}
```

### 2. Asignar Materia a Tutor
**PATCH** `{{base_url}}/tutores/{{tutor_id}}/asignar-materia`

**Body (JSON):**
```json
{
  "materia_id": {{materia_id}}
}
```

### 3. Listar Materias
**GET** `{{base_url}}/materias`

---

## 📝 Solicitudes de Tutoría

### 1. Login como Estudiante
**POST** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "correo": "estudiante@test.com",
  "contraseña": "123456789"
}
```

### 2. Crear Solicitud de Tutoría
**POST** `{{base_url}}/solicitudes-tutoria`

**Body (JSON):**
```json
{
  "tutor_id": {{tutor_id}},
  "materia_id": {{materia_id}},
  "fecha_deseada": "2024-12-25",
  "hora_deseada": "14:00",
  "descripcion": "Necesito ayuda con bucles y condicionales"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("solicitud_id", response.id);
    console.log("Solicitud creada con ID:", response.id);
}
```

### 3. Ver Mis Solicitudes (Estudiante)
**GET** `{{base_url}}/solicitudes-tutoria/mis-solicitudes`

### 4. Login como Tutor
**POST** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "correo": "tutor@test.com",
  "contraseña": "123456789"
}
```

### 5. Ver Solicitudes Asignadas (Tutor)
**GET** `{{base_url}}/solicitudes-tutoria/asignadas`

### 6. Responder Solicitud (Tutor)
**PATCH** `{{base_url}}/solicitudes-tutoria/{{solicitud_id}}/responder`

**Body (JSON) - Aceptar:**
```json
{
  "estado": "aceptada",
  "comentario_tutor": "Perfecto, nos vemos el martes a las 2 PM"
}
```

**Body (JSON) - Rechazar:**
```json
{
  "estado": "rechazada",
  "comentario_tutor": "Lo siento, no tengo disponibilidad en ese horario"
}
```

---

## 🎓 Sesiones de Tutoría

### 1. Ver Sesiones del Estudiante
**GET** `{{base_url}}/sesiones-tutoria/mis-sesiones`
(Logueado como estudiante)

### 2. Ver Sesiones del Tutor
**GET** `{{base_url}}/sesiones-tutoria/asignadas`
(Logueado como tutor)

### 3. Crear Sesión Directamente (Tutor)
**POST** `{{base_url}}/sesiones-tutoria`

**Body (JSON):**
```json
{
  "estudiante_id": {{estudiante_id}},
  "materia_id": {{materia_id}},
  "fecha": "2024-12-26",
  "hora": "15:00",
  "descripcion": "Sesión de repaso para el examen final"
}
```

**Script de Post-response:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("sesion_id", response.id);
    console.log("Sesión creada con ID:", response.id);
}
```

### 4. Completar Sesión (Tutor)
**PATCH** `{{base_url}}/sesiones-tutoria/{{sesion_id}}/completar`

**Body (JSON):**
```json
{
  "notas_tutor": "El estudiante mostró buen progreso. Repasamos bucles for y while. Recomiendo practicar más ejercicios."
}
```

### 5. Calificar Sesión (Estudiante)
**PATCH** `{{base_url}}/sesiones-tutoria/{{sesion_id}}/calificar`

**Body (JSON):**
```json
{
  "calificacion": 5,
  "comentario_estudiante": "Excelente explicación, muy claro y paciente. Recomiendo 100%"
}
```

### 6. Ver Detalle de Sesión
**GET** `{{base_url}}/sesiones-tutoria/{{sesion_id}}`

---

## 🔄 Flujo Completo de Prueba

### Paso 1: Configuración Inicial
1. ✅ Crear coordinador (sin token)
2. ✅ Login como coordinador
3. ✅ Crear materia
4. ✅ Crear tutor
5. ✅ Crear estudiante
6. ✅ Asignar materia al tutor

### Paso 2: Proceso de Solicitud
7. ✅ Login como estudiante
8. ✅ Crear solicitud de tutoría
9. ✅ Ver mis solicitudes (estudiante)
10. ✅ Login como tutor
11. ✅ Ver solicitudes asignadas
12. ✅ Aceptar solicitud (se crea sesión automáticamente)

### Paso 3: Gestión de Sesiones
13. ✅ Ver sesiones futuras (tutor)
14. ✅ Ver sesiones futuras (estudiante)
15. ✅ Completar sesión (tutor)
16. ✅ Login como estudiante
17. ✅ Calificar sesión (estudiante)
18. ✅ Ver sesiones pasadas

---

## 🛠️ Scripts Útiles para Postman

### Script para Guardar Token Automáticamente
Agrega este script en la pestaña **Tests** de tus requests de login:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    if (response.access_token) {
        pm.environment.set("token", response.access_token);
        console.log("✅ Token guardado exitosamente");
    }
}
```

### Script para Guardar IDs Automáticamente
Para requests que crean recursos:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    if (response.id) {
        // Cambia 'resource_id' por el nombre apropiado
        pm.environment.set("resource_id", response.id);
        console.log("✅ ID guardado:", response.id);
    }
}
```

---

## ⚠️ Errores Comunes y Soluciones

### 1. Error 401 - Unauthorized
**Causa:** Token expirado o inválido
**Solución:** Hacer login nuevamente

### 2. Error 403 - Forbidden
**Causa:** Usuario sin permisos para la acción
**Solución:** Verificar que estés logueado con el rol correcto

### 3. Error 404 - Not Found
**Causa:** Recurso no existe o ID incorrecto
**Solución:** Verificar que los IDs en las variables sean correctos

### 4. Error 400 - Bad Request
**Causa:** Datos de entrada inválidos
**Solución:** Revisar el formato del JSON y campos requeridos

---

## 📊 Colección de Postman Recomendada

Organiza tus requests en carpetas:

```
📁 Sistema de Tutorías
├── 📁 Auth
│   └── Login
├── 📁 Usuarios
│   ├── Crear Coordinador
│   ├── Crear Tutor
│   ├── Crear Estudiante
│   └── Ver Perfil
├── 📁 Materias
│   ├── Crear Materia
│   ├── Listar Materias
│   └── Asignar a Tutor
├── 📁 Solicitudes
│   ├── Crear Solicitud
│   ├── Mis Solicitudes
│   ├── Solicitudes Asignadas
│   └── Responder Solicitud
└── 📁 Sesiones
    ├── Crear Sesión
    ├── Mis Sesiones
    ├── Sesiones Asignadas
    ├── Completar Sesión
    ├── Calificar Sesión
    └── Ver Detalle
```

---

## 🎯 Casos de Prueba Específicos

### Caso 1: Flujo Exitoso Completo
1. Crear todos los usuarios y recursos
2. Solicitud → Aceptación → Sesión → Completar → Calificar

### Caso 2: Solicitud Rechazada
1. Crear solicitud
2. Rechazar solicitud
3. Verificar que no se crea sesión

### Caso 3: Validaciones de Seguridad
1. Intentar crear recursos sin permisos
2. Intentar acceder a recursos de otros usuarios
3. Usar tokens expirados

### Caso 4: Validaciones de Datos
1. Enviar datos incompletos
2. Usar formatos de fecha/hora incorrectos
3. Calificaciones fuera de rango (1-5)

---

¡Con esta guía podrás probar todas las funcionalidades del sistema de tutorías de manera sistemática y completa! 🚀