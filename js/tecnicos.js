(() => {
  $('#content').innerHTML = `<div class="toolbar"><span style="flex:1"></span><button class="btn primary" id="nuevo">+ Nuevo técnico</button></div><section class="card"><div id="lista"></div></section>`;
  function render() {
    $('#lista').innerHTML = table([['ID', t => t.id], ['Nombre', t => esc(t.nombre)], ['Especialidad', t => esc(t.especialidad)], ['Teléfono', t => esc(t.telefono)],
      ['Servicios realizados', t => Store.db.servicios.filter(s => s.tecnicoId === t.id && s.estado === 'Terminado').length],
      ['Estado', t => badge(t.estado)],
      ['', t => `<button class="btn sm" data-toggle="${t.id}">${t.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button><a class="btn sm" href="servicios.html">Ver servicios</a>`]], Store.db.tecnicos);
  }
  $('#content').addEventListener('click', e => {
    const b = e.target.closest('[data-toggle]'); if (!b) return;
    const t = Store.find('tecnicos', b.dataset.toggle); t.estado = t.estado === 'Activo' ? 'Inactivo' : 'Activo';
    changed(); toast(`Técnico ${t.estado.toLowerCase()}`);
  });
  $('#nuevo').onclick = () => openForm('Nuevo técnico', [field('Nombre completo', 'nombre'), field('Especialidad', 'especialidad'), field('Teléfono', 'telefono', 'tel'),
    field('Estado', 'estado', 'text', { options: ['Activo', 'Inactivo'], value: 'Activo' })],
    d => { Store.db.tecnicos.push({ id: Store.nextId('tecnicos', 'T', 2), ...d }); changed(); toast('Técnico registrado'); });
  App.render = render; render();
})();
