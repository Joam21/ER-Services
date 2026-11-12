/* Datos ficticios y capa de acceso a datos.
   Para conectar un backend, reemplazar Store por llamadas fetch() a la API. */
const TIPOS = ['Mantenimiento preventivo', 'Mantenimiento correctivo', 'Formateo', 'Instalación de software', 'Diagnóstico'];
const ESTADOS = ['Pendiente', 'En proceso', 'Terminado'];
const TIPOS_EQUIPO = ['Portátil', 'PC de escritorio', 'All-in-One'];
const [PRE, COR, FMT, SW, DIA] = TIPOS;

const clientes = [
  ['C-001', 'Juan Pérez', '300 111 2201', 'juan.perez@example.com'],
  ['C-002', 'María Gómez', '300 111 2202', 'maria.gomez@example.com'],
  ['C-003', 'Andrés Torres', '300 111 2203', 'andres.torres@example.com'],
  ['C-004', 'Laura Martínez', '300 111 2204', 'laura.martinez@example.com'],
  ['C-005', 'Camilo Ortega', '300 111 2205', 'camilo.ortega@example.com'],
  ['C-006', 'Sofía Ramírez', '300 111 2206', 'sofia.ramirez@example.com'],
  ['C-007', 'Pedro Sánchez', '300 111 2207', 'pedro.sanchez@example.com'],
  ['C-008', 'Daniela Rojas', '300 111 2208', 'daniela.rojas@example.com']
].map(([id, nombre, telefono, correo]) => ({ id, nombre, telefono, correo }));

const tecnicos = [
  ['T-01', 'Carlos Rodríguez', 'Hardware y mantenimiento', '310 222 3301', 'Activo'],
  ['T-02', 'Ana Molina', 'Software y formateo', '310 222 3302', 'Activo'],
  ['T-03', 'Luis Herrera', 'Diagnóstico y redes', '310 222 3303', 'Activo'],
  ['T-04', 'Jorge Castillo', 'Portátiles', '310 222 3304', 'Inactivo']
].map(([id, nombre, especialidad, telefono, estado]) => ({ id, nombre, especialidad, telefono, estado }));

const equipos = [
  ['E-001', 'C-001', 'Lenovo', 'Portátil', 'IdeaPad 3', '2026-07-03'],
  ['E-002', 'C-001', 'HP', 'PC de escritorio', 'Pavilion TP01', '2026-04-09'],
  ['E-003', 'C-002', 'Dell', 'Portátil', 'Inspiron 15', '2026-06-21'],
  ['E-004', 'C-003', 'Asus', 'Portátil', 'VivoBook 14', '2026-06-10'],
  ['E-005', 'C-004', 'HP', 'All-in-One', '24-df', '2026-05-19'],
  ['E-006', 'C-005', 'Acer', 'Portátil', 'Aspire 5', '2026-05-08'],
  ['E-007', 'C-006', 'Lenovo', 'All-in-One', 'IdeaCentre 3', '2026-08-20'],
  ['E-008', 'C-007', 'Dell', 'PC de escritorio', 'OptiPlex 3080', '2026-04-22'],
  ['E-009', 'C-008', 'MSI', 'Portátil', 'Modern 14', '2026-08-05'],
  ['E-010', 'C-003', 'HP', 'PC de escritorio', 'ProDesk 400', '2026-07-25'],
  ['E-011', 'C-005', 'Dell', 'Portátil', 'Latitude 3420', '2026-07-14']
].map(([id, clienteId, marca, tipo, modelo, ingreso]) => ({ id, clienteId, marca, tipo, modelo, ingreso }));

const servicios = [
  ['S-001', 'E-001', PRE, 'T-01', '2026-09-24', 'En proceso', 80000, 'Equipo lento y con exceso de polvo'],
  ['S-002', 'E-002', SW, 'T-02', '2026-09-26', 'Pendiente', 50000, 'Instalar Office y antivirus'],
  ['S-003', 'E-003', COR, 'T-01', '2026-09-22', 'En proceso', 150000, 'No enciende, posible falla del cargador'],
  ['S-004', 'E-004', FMT, 'T-02', '2026-09-18', 'Terminado', 90000, 'Sistema operativo dañado'],
  ['S-005', 'E-005', DIA, 'T-03', '2026-09-15', 'Terminado', 40000, 'La pantalla se congela'],
  ['S-006', 'E-006', PRE, 'T-01', '2026-08-28', 'Terminado', 80000, 'Mantenimiento periódico'],
  ['S-007', 'E-007', COR, 'T-03', '2026-08-20', 'Terminado', 180000, 'Cambio de fuente de poder'],
  ['S-008', 'E-008', FMT, 'T-02', '2026-08-12', 'Terminado', 85000, 'Virus y lentitud extrema'],
  ['S-009', 'E-009', SW, 'T-02', '2026-08-05', 'Terminado', 60000, 'Instalación de programas de diseño'],
  ['S-010', 'E-010', PRE, 'T-01', '2026-07-25', 'Terminado', 70000, 'Limpieza interna y pasta térmica'],
  ['S-011', 'E-011', DIA, 'T-03', '2026-07-14', 'Terminado', 40000, 'Reinicios aleatorios'],
  ['S-012', 'E-001', FMT, 'T-02', '2026-07-03', 'Terminado', 90000, 'Reinstalar Windows'],
  ['S-013', 'E-003', PRE, 'T-04', '2026-06-21', 'Terminado', 75000, 'Mantenimiento periódico'],
  ['S-014', 'E-004', COR, 'T-04', '2026-06-10', 'Terminado', 200000, 'Cambio de pantalla'],
  ['S-015', 'E-005', SW, 'T-02', '2026-05-19', 'Terminado', 55000, 'Instalar suite ofimática'],
  ['S-016', 'E-006', DIA, 'T-03', '2026-05-08', 'Terminado', 40000, 'Sobrecalentamiento'],
  ['S-017', 'E-008', PRE, 'T-01', '2026-04-22', 'Terminado', 70000, 'Mantenimiento periódico'],
  ['S-018', 'E-002', COR, 'T-01', '2026-04-09', 'Terminado', 160000, 'Cambio de disco duro'],
  ['S-019', 'E-007', PRE, 'T-01', '2026-09-28', 'Pendiente', 80000, 'Limpieza preventiva programada']
].map(([id, equipoId, tipo, tecnicoId, fecha, estado, valor, problema]) => ({
  id, clienteId: equipos.find(e => e.id === equipoId).clienteId, equipoId, tipo, tecnicoId, fecha, estado, valor, problema, observaciones: ''
}));

const SEED = { clientes, tecnicos, equipos, servicios };

const Store = {
  key: 'erservices.v1',
  db: null,
  init() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(this.key)); } catch (e) { /* sin almacenamiento */ }
    this.db = saved || JSON.parse(JSON.stringify(SEED));
  },
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.db)); } catch (e) { /* modo memoria */ } },
  reset() { try { localStorage.removeItem(this.key); } catch (e) { /* nada */ } location.reload(); },
  find(col, id) { return this.db[col].find(r => r.id === id); },
  nextId(col, prefix, pad) {
    const n = Math.max(0, ...this.db[col].map(r => +r.id.split('-')[1])) + 1;
    return `${prefix}-${String(n).padStart(pad, '0')}`;
  }
};
Store.init();

const Q = {
  vista(s) {
    const c = Store.find('clientes', s.clienteId), e = Store.find('equipos', s.equipoId), t = Store.find('tecnicos', s.tecnicoId);
    return { ...s, cliente: c ? c.nombre : '—', equipo: e ? `${e.marca} ${e.modelo}` : '—', tecnico: t ? t.nombre : '—' };
  },
  equiposDe: cid => Store.db.equipos.filter(e => e.clienteId === cid),
  ultimoServicio: eid => Store.db.servicios.filter(s => s.equipoId === eid)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id))[0],
  estadoEquipo(eid) { const s = Q.ultimoServicio(eid); return s ? s.estado : 'Sin servicio'; }
};
