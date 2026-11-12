(() => {
  const params = new URLSearchParams(location.search);
  const f = { q: '', estado: '', tipo: '', tecnico: '', cliente: params.get('cliente') || '' };
  const hoy = new Date().toISOString().slice(0, 10);
  const opts = arr => arr.map(o => `<option>${o}</option>`).join('');
  $('#content').innerHTML = `<div class="toolbar">
    <input type="search" id="q" placeholder="Buscar por ID, cliente, equipo…" aria-label="Buscar servicio">
    <select id="fEstado" aria-label="Estado"><option value="">Todos los estados</option>${opts(ESTADOS)}</select>
    <select id="fTipo" aria-label="Tipo"><option value="">Todos los tipos</option>${opts(TIPOS)}</select>
    <select id="fTecnico" aria-label="Técnico"><option value="">Todos los técnicos</option>${Store.db.tecnicos.map(t => `<option value="${t.id}">${esc(t.nombre)}</option>`).join('')}</select>
    <button class="btn primary" id="nuevo">+ Registrar servicio</button></div><div id="chip"></div><section class="card"><div id="lista"></div></section>`;

  function render() {
    const cl = Store.find('clientes', f.cliente);
    $('#chip').innerHTML = cl ? `<p class="chip">Cliente: ${esc(cl.nombre)} · <a href="servicios.html">Quitar filtro</a></p>` : '';
    const rows = Store.db.servicios.map(Q.vista).filter(s => (!f.estado || s.estado === f.estado) && (!f.tipo || s.tipo === f.tipo) &&
      (!f.tecnico || s.tecnicoId === f.tecnico) && (!f.cliente || s.clienteId === f.cliente) &&
      (!f.q || `${s.id} ${s.cliente} ${s.equipo} ${s.tipo} ${s.tecnico}`.toLowerCase().includes(f.q))).sort((a, b) => b.fecha.localeCompare(a.fecha));
    $('#lista').innerHTML = table([['ID', s => s.id], ['Cliente', s => esc(s.cliente)], ['Equipo', s => esc(s.equipo)], ['Tipo', s => s.tipo], ['Técnico', s => esc(s.tecnico)],
      ['Fecha', s => fmtDate(s.fecha)], ['Estado', s => badge(s.estado)], ['Valor', s => money(s.valor)],
      ['Acciones', s => `${btnVer(s)}<button class="btn sm danger" data-del="${s.id}">Eliminar</button>`]], rows, 'No hay servicios con esos filtros.');
  }
  [['q', 'q'], ['fEstado', 'estado'], ['fTipo', 'tipo'], ['fTecnico', 'tecnico']].forEach(([id, k]) =>
    $('#' + id).addEventListener('input', e => { f[k] = k === 'q' ? e.target.value.toLowerCase() : e.target.value; render(); }));
  $('#content').addEventListener('click', e => {
    const b = e.target.closest('[data-del]');
    if (b && confirm(`¿Eliminar el servicio ${b.dataset.del}?`)) {
      Store.db.servicios = Store.db.servicios.filter(s => s.id !== b.dataset.del); changed(); toast('Servicio eliminado');
    }
  });

  function nuevoServicio(pre = {}) {
    const db = Store.db;
    const eqOpts = cid => db.equipos.filter(e => e.clienteId === cid).map(e => [e.id, `${e.marca} ${e.modelo}`]);
    const form = openForm('Registrar servicio', [
      field('Cliente', 'clienteId', 'text', { options: db.clientes.map(c => [c.id, c.nombre]), value: pre.clienteId }),
      field('Equipo', 'equipoId', 'text', { options: eqOpts(pre.clienteId), value: pre.equipoId }),
      field('Técnico', 'tecnicoId', 'text', { options: db.tecnicos.filter(t => t.estado === 'Activo').map(t => [t.id, t.nombre]) }),
      field('Tipo de servicio', 'tipo', 'text', { options: TIPOS }),
      field('Fecha de ingreso', 'fecha', 'date', { value: hoy }),
      field('Estado', 'estado', 'text', { options: ESTADOS, value: 'Pendiente' }),
      field('Valor (COP)', 'valor', 'number'),
      field('Descripción del problema', 'problema', 'textarea'),
      field('Observaciones', 'observaciones', 'textarea', { required: false }),
      '<p class="hint">Si el cliente no tiene equipos, regístrelos primero en el módulo Equipos.</p>'
    ], d => { db.servicios.push({ id: Store.nextId('servicios', 'S', 3), ...d, valor: +d.valor }); changed(); toast('Servicio guardado correctamente'); });
    form.elements.clienteId.onchange = () => { form.elements.equipoId.innerHTML = optHtml(eqOpts(form.elements.clienteId.value)); };
  }
  $('#nuevo').onclick = () => nuevoServicio();
  App.render = render; render();

  if (params.get('id')) showServicio(params.get('id'));
  if (params.get('nuevo')) { const e = Store.find('equipos', params.get('equipo')); nuevoServicio(e ? { equipoId: e.id, clienteId: e.clienteId } : {}); }
})();
