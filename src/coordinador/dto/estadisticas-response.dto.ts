export class EstadisticasTutorDto {
  tutor_id: number;
  tutor_nombre: string;
  tutor_profesion: string;
  materia_nombre: string;
  total_sesiones: number;
  sesiones_completadas: number;
  sesiones_agendadas: number;
  sesiones_canceladas: number;
  calificacion_promedio: number | null;
  total_estudiantes_atendidos: number;
}

export class EstadisticasMateriaDto {
  materia_id: number;
  materia_nombre: string;
  materia_codigo: string;
  total_sesiones: number;
  sesiones_completadas: number;
  sesiones_agendadas: number;
  sesiones_canceladas: number;
  total_tutores: number;
  total_estudiantes: number;
  calificacion_promedio: number | null;
}

export class EstadisticasGeneralesDto {
  total_sesiones: number;
  sesiones_completadas: number;
  sesiones_agendadas: number;
  sesiones_canceladas: number;
  total_tutores_activos: number;
  total_estudiantes_activos: number;
  total_materias: number;
  calificacion_promedio_general: number | null;
  sesiones_por_mes: {
    mes: string;
    total: number;
    completadas: number;
  }[];
}

export class EstadisticasCompletasDto {
  generales: EstadisticasGeneralesDto;
  por_tutor: EstadisticasTutorDto[];
  por_materia: EstadisticasMateriaDto[];
}