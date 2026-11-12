(() => {
  let selected = new URLSearchParams(location.search).get('id');
  $('#content').innerHTML = `<div class="toolbar"><input type="search" id="q" placeholder="Buscar por nombre, teléfono o correo…" aria-label="Buscar cliente"><button class="btn primary" id="nuevo">+ Nuevo cliente</button></div>
    <section class="card"><div id="lista"></div></section><section id="detalle"></section>`;

  function renderDetalle() {
    const c = Store.find('clientes', selected);
    if (!c) { $('#detalle').innerHTML = ''; return; }
    const sv = Store.db.servicios.filter(s => s.clienteId === c.id).map(Q.vista).sort((a, b) => b.fecha.localeCompare(a.fecha));
    $('#detalle').innerHTML = `<article class="card"><div class="card-head"><h2>${esc(c.nombre)} <small>${c.id}</small></h2>
      <div><a class="btn" href="equipos.html?cliente=${c.id}">Ver en Equipos</a> <a class="btn" href="servicios.html?cliente=${c.id}">Ver en Servicios</a></div></div>
      <p class="muted">${esc(c.telefono)} · ${esc(c.correo)}</p>
      <h3>Equipos</h3>${table([['ID', e => e.id], ['Equipo', e => `${esc(e.marca)} ${esc(e.modelo)}`], ['Tipo', e => e.tipo], ['Estado', e => badge(Q.estadoEquipo(e.id))]], Q.equiposDe(c.id), 'Este cliente aún no tiene equipos.')}
      <h3>Historial de servicios</h3>${table([['ID', s => s.id], ['Equipo', s => esc(s.equipo)], ['Servicio', s => s.tipo], ['Fecha', s => fmtDate(s.fecha)], ['Estado', s => badge(s.estado)], ['Valor', s => money(s.valor)], ['', btnVer]], sv, 'Sin servicios registrados.')}</article>`;
  }
  function render() {
    const q = $('#q').value.toLowerCase();
    const rows = Store.db.clientes.filter(c => `${c.id} ${c.nombre} ${c.telefono} ${c.correo}`.toLowerCase().includes(q));
    $('#lista').innerHTML = table([['ID', c => c.id], ['Nombre', c => esc(c.nombre)], ['Teléfono', c => esc(c.telefono)], ['Correo', c => esc(c.correo)],
      ['Equipos', c => Q.equiposDe(c.id).length], ['', c => `<button class="btn sm" data-sel="${c.id}">Ver detalle</button>`]], rows, 'No se encontraron clientes.');
    renderDetalle();
  }
  $('#q').oninput = render;
  $('#content').addEventListener('click', e => {
    const b = e.target.closest('[data-sel]');
    if (b) { selected = b.dataset.sel; renderDetalle(); $('#detalle').scrollIntoView({ behavior: 'smooth' }); }
  });
  $('#nuevo').onclick = () => openForm('Nuevo cliente', [field('Nombre completo', 'nombre'), field('Teléfono', 'telefono', 'tel'), field('Correo', 'correo', 'email')],
    d => { Store.db.clientes.push({ id: Store.nextId('clientes', 'C', 3), ...d }); changed(); toast('Cliente registrado'); });
  App.render = render; render();
  if (selected) $('#detalle').scrollIntoView();
})();
