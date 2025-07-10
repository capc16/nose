# 📊 Guía de Pruebas - Panel del Coordinador

Esta guía te ayudará a probar las nuevas funcionalidades del **Panel del Coordinador** para visualizar sesiones y generar estadísticas.

## 🔧 Configuración Inicial

### Variables de Entorno en Postman
```
BASE_URL: http://localhost:3000
COORDINATOR_TOKEN: (se obtendrá después del login)
```

### Autenticación
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "correo": "coordinador@test.com",
  "contraseña": "password123"
}
```

**⚠️ Importante:** Guarda el `access_token` en la variable `COORDINATOR_TOKEN`

---

## 📋 VISUALIZACIÓN DE SESIONES

### 1. Ver Todas las Sesiones (Sin Filtros)

```http
GET {{BASE_URL}}/coordinadores/sesiones
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

**Respuesta esperada:**
```json
{
  "data": [
    {
      "id": 1,
      "estudianteId": 3,
      "tutorId": 2,
      "materiaId": 1,
      "fecha": "2024-12-20T00:00:00.000Z",
      "hora": "14:30",
      "estado": "completada",
      "descripcion": "Sesión de cálculo diferencial",
      "notas_tutor": "Excelente progreso del estudiante",
      "calificacion": 5,
      "comentario_estudiante": "Muy buena explicación",
      "estudiante": {
        "id": 3,
        "usuario": {
          "nombre": "Juan Pérez",
          "correo": "estudiante@test.com"
        },
        "carrera": "Ingeniería de Sistemas",
        "semestre": 5
      },
      "tutor": {
        "id": 2,
        "usuario": {
          "nombre": "María García",
          "correo": "tutor@test.com"
        },
        "profesion": "Ingeniera Matemática"
      },
      "materia": {
        "id": 1,
        "nombre": "Cálculo Diferencial",
        "codigo": "MAT101"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### 2. Filtrar por Tutor

```http
GET {{BASE_URL}}/coordinadores/sesiones?tutor_id=2
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

### 3. Filtrar por Materia

```http
GET {{BASE_URL}}/coordinadores/sesiones?materia_id=1
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

### 4. Filtrar por Estado

```http
GET {{BASE_URL}}/coordinadores/sesiones?estado=completada
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

### 5. Filtrar por Rango de Fechas

```http
GET {{BASE_URL}}/coordinadores/sesiones?fecha_inicio=2024-12-01&fecha_fin=2024-12-31
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

### 6. Filtros Combinados con Paginación

```http
GET {{BASE_URL}}/coordinadores/sesiones?tutor_id=2&estado=completada&page=1&limit=5
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

---

## 📈 ESTADÍSTICAS

### 1. Estadísticas Completas

```http
GET {{BASE_URL}}/coordinadores/estadisticas
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

**Respuesta esperada:**
```json
{
  "generales": {
    "total_sesiones": 25,
    "sesiones_completadas": 18,
    "sesiones_agendadas": 5,
    "sesiones_canceladas": 2,
    "total_tutores_activos": 4,
    "total_estudiantes_activos": 12,
    "total_materias": 6,
    "calificacion_promedio_general": 4.35,
    "sesiones_por_mes": [
      {
        "mes": "2024-12",
        "total": 8,
        "completadas": 6
      },
      {
        "mes": "2024-11",
        "total": 12,
        "completadas": 10
      }
    ]
  },
  "por_tutor": [
    {
      "tutor_id": 2,
      "tutor_nombre": "María García",
      "tutor_profesion": "Ingeniera Matemática",
      "materia_nombre": "Cálculo Diferencial",
      "total_sesiones": 12,
      "sesiones_completadas": 10,
      "sesiones_agendadas": 2,
      "sesiones_canceladas": 0,
      "calificacion_promedio": 4.5,
      "total_estudiantes_atendidos": 8
    }
  ],
  "por_materia": [
    {
      "materia_id": 1,
      "materia_nombre": "Cálculo Diferencial",
      "materia_codigo": "MAT101",
      "total_sesiones": 15,
      "sesiones_completadas": 12,
      "sesiones_agendadas": 3,
      "sesiones_canceladas": 0,
      "total_tutores": 2,
      "total_estudiantes": 10,
      "calificacion_promedio": 4.4
    }
  ]
}
```

### 2. Solo Estadísticas por Tutor

```http
GET {{BASE_URL}}/coordinadores/estadisticas/tutores
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

### 3. Solo Estadísticas por Materia

```http
GET {{BASE_URL}}/coordinadores/estadisticas/materias
Authorization: Bearer {{COORDINATOR_TOKEN}}
```

---

## 🔍 CASOS DE USO PRÁCTICOS

### Caso 1: Monitorear Rendimiento de un Tutor Específico

```http
# 1. Ver todas las sesiones del tutor
GET {{BASE_URL}}/coordinadores/sesiones?tutor_id=2

# 2. Ver solo sesiones completadas del tutor
GET {{BASE_URL}}/coordinadores/sesiones?tutor_id=2&estado=completada

# 3. Ver estadísticas específicas del tutor
GET {{BASE_URL}}/coordinadores/estadisticas/tutores
```

### Caso 2: Analizar Demanda por Materia

```http
# 1. Ver sesiones de una materia específica
GET {{BASE_URL}}/coordinadores/sesiones?materia_id=1

# 2. Ver estadísticas por materia
GET {{BASE_URL}}/coordinadores/estadisticas/materias
```

### Caso 3: Reporte Mensual

```http
# 1. Sesiones del mes actual
GET {{BASE_URL}}/coordinadores/sesiones?fecha_inicio=2024-12-01&fecha_fin=2024-12-31

# 2. Estadísticas completas para el reporte
GET {{BASE_URL}}/coordinadores/estadisticas
```

### Caso 4: Identificar Problemas

```http
# 1. Ver sesiones canceladas
GET {{BASE_URL}}/coordinadores/sesiones?estado=cancelada

# 2. Ver tutores con bajo rendimiento (manualmente analizar estadísticas)
GET {{BASE_URL}}/coordinadores/estadisticas/tutores
```

---

## 📊 INTERPRETACIÓN DE ESTADÍSTICAS

### Estadísticas Generales
- **total_sesiones**: Total de sesiones programadas
- **sesiones_completadas**: Sesiones que se realizaron exitosamente
- **sesiones_agendadas**: Sesiones pendientes por realizar
- **sesiones_canceladas**: Sesiones que fueron canceladas
- **calificacion_promedio_general**: Promedio de todas las calificaciones (1-5)
- **sesiones_por_mes**: Tendencia mensual de sesiones

### Estadísticas por Tutor
- **total_estudiantes_atendidos**: Número único de estudiantes que ha atendido
- **calificacion_promedio**: Promedio de calificaciones recibidas
- **sesiones_completadas/total_sesiones**: Tasa de éxito del tutor

### Estadísticas por Materia
- **total_tutores**: Cuántos tutores enseñan esta materia
- **total_estudiantes**: Cuántos estudiantes han tomado tutorías de esta materia
- **calificacion_promedio**: Qué tan bien calificada está la materia

---

## 🎯 INDICADORES CLAVE DE RENDIMIENTO (KPIs)

### Para Evaluar Tutores:
1. **Tasa de Finalización**: `sesiones_completadas / total_sesiones`
2. **Calificación Promedio**: Debe ser > 4.0
3. **Estudiantes Atendidos**: Diversidad de estudiantes

### Para Evaluar Materias:
1. **Demanda**: `total_sesiones` por materia
2. **Satisfacción**: `calificacion_promedio` por materia
3. **Cobertura**: `total_tutores` disponibles

### Para el Sistema General:
1. **Utilización**: `sesiones_completadas / total_sesiones`
2. **Crecimiento**: Tendencia en `sesiones_por_mes`
3. **Satisfacción General**: `calificacion_promedio_general`

---

## ⚠️ NOTAS IMPORTANTES

1. **Paginación**: Por defecto muestra 10 resultados por página
2. **Filtros**: Se pueden combinar múltiples filtros
3. **Fechas**: Usar formato ISO (YYYY-MM-DD)
4. **Permisos**: Solo coordinadores pueden acceder a estos endpoints
5. **Performance**: Las estadísticas pueden tardar más en sistemas con muchos datos

---

## 🔧 Tips para el Coordinador

1. **Monitoreo Regular**: Revisar estadísticas semanalmente
2. **Identificar Tendencias**: Usar `sesiones_por_mes` para planificar
3. **Evaluar Tutores**: Combinar cantidad y calidad de sesiones
4. **Optimizar Recursos**: Asignar más tutores a materias con alta demanda
5. **Seguimiento**: Usar filtros para investigar problemas específicos

¡El panel del coordinador está listo para usar! 🚀