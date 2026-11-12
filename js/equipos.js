(() => {
  const filtroCliente = new URLSearchParams(location.search).get('cliente') || '';
  $('#content').innerHTML = `<div class="toolbar"><input type="search" id="q" placeholder="Buscar por cliente, marca o modelo…" aria-label="Buscar equipo"><button class="btn primary" id="nuevo">+ Registrar equipo</button></div><div id="chip"></div><section class="card"><div id="lista"></div></section>`;
  function render() {
    const q = $('#q').value.toLowerCase();
    const c = Store.find('clientes', filtroCliente);
    $('#chip').innerHTML = c ? `<p class="chip">Cliente: ${esc(c.nombre)} · <a href="equipos.html">Quitar filtro</a></p>` : '';
    const rows = Store.db.equipos.filter(e => (!filtroCliente || e.clienteId === filtroCliente) &&
      `${e.id} ${Store.find('clientes', e.clienteId).nombre} ${e.marca} ${e.modelo} ${e.tipo}`.toLowerCase().includes(q));
    $('#lista').innerHTML = table([
      ['ID', e => e.id], ['Cliente', e => { const cl = Store.find('clientes', e.clienteId); return `<a href="clientes.html?id=${cl.id}">${esc(cl.nombre)}</a>`; }],
      ['Marca', e => esc(e.marca)], ['Tipo', e => e.tipo], ['Modelo', e => esc(e.modelo)], ['Ingreso', e => fmtDate(e.ingreso)],
      ['Estado', e => badge(Q.estadoEquipo(e.id))],
      ['Servicio asociado', e => { const s = Q.ultimoServicio(e.id); return s ? `<button class="link" data-ver="${s.id}">${s.id} · ${s.tipo}</button>` : '—'; }],
      ['', e => `<a class="btn sm" href="servicios.html?nuevo=1&equipo=${e.id}">Nuevo servicio</a>`]], rows, 'No se encontraron equipos.');
  }
  $('#q').oninput = render;
  $('#nuevo').onclick = () => openForm('Registrar equipo', [
    field('Cliente', 'clienteId', 'text', { options: Store.db.clientes.map(c => [c.id, c.nombre]), value: filtroCliente }),
    field('Tipo de equipo', 'tipo', 'text', { options: TIPOS_EQUIPO }), field('Marca', 'marca'), field('Modelo', 'modelo'),
    field('Fecha de ingreso', 'ingreso', 'date', { value: new Date().toISOString().slice(0, 10) })],
    d => { Store.db.equipos.push({ id: Store.nextId('equipos', 'E', 3), ...d }); changed(); toast('Equipo registrado'); });
  App.render = render; render();
})();
