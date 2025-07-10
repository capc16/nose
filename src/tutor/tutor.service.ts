@@ .. @@
  async asignarMateria(tutorId: number, dto: AsignarMateriaDto): Promise<Tutor> {
  const tutor = await this.tutorRepo.findOne({
    where: { id: tutorId },
    relations: ['materia'],
  });

  if (!tutor) {
    throw new NotFoundException('Tutor no encontrado');
  }

  const materia = await this.materiaRepo.findOne({ where: { id: dto.materia_id } });
  if (!materia) {
    throw new NotFoundException('Materia no encontrada');
  }

  tutor.materia = materia;
  return this.tutorRepo.save(tutor);
  }

+  async findAll(): Promise<Tutor[]> {
+    return this.tutorRepo.find({
+      relations: ['usuario', 'materia'],
+      select: {
+        usuario: {
+          id: true,
+          nombre: true,
+          correo: true,
+        },
+      },
+    });
+  }
+
+  async findByMateria(materiaId: number): Promise<Tutor[]> {
+    return this.tutorRepo.find({
+      where: { materia: { id: materiaId } },
+      relations: ['usuario', 'materia'],
+      select: {
+        usuario: {
+          id: true,
+          nombre: true,
+          correo: true,
+        },
+      },
+    });
+  }

}