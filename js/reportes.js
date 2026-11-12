(() => {
  $('#content').innerHTML = `<div class="toolbar"><label class="fld">Desde<input type="date" id="desde"></label><label class="fld">Hasta<input type="date" id="hasta"></label><button class="btn ghost" id="limpiar">Limpiar filtros</button></div>
    <section class="grid stats" id="kpis"></section>
    <section class="grid charts3"><article class="card"><h2>Servicios por tipo</h2><div id="rTipo"></div></article><article class="card"><h2>Servicios por estado</h2><div id="rEstado"></div></article><article class="card"><h2>Servicios por técnico</h2><div id="rTecnico"></div></article></section>
    <section class="card"><h2>Detalle del período</h2><div id="rTabla"></div></section>`;
  function render() {
    const d = $('#desde').value, h = $('#hasta').value;
    const list = Store.db.servicios.filter(s => (!d || s.fecha >= d) && (!h || s.fecha <= h)).map(Q.vista).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const term = list.filter(s => s.estado === 'Terminado');
    $('#kpis').innerHTML = statCard('Servicios realizados', list.length, 'servicios') + statCard('Servicios terminados', term.length, 'tecnicos') +
      statCard('Ingresos', money(term.reduce((a, s) => a + s.valor, 0)), 'reportes', 'Servicios terminados');
    hbars($('#rTipo'), TIPOS, contar(list, 'tipo', TIPOS));
    estadoDonut($('#rEstado'), list);
    const tec = Store.db.tecnicos;
    hbars($('#rTecnico'), tec.map(t => t.nombre), tec.map(t => list.filter(s => s.tecnicoId === t.id).length));
    $('#rTabla').innerHTML = table([['ID', s => s.id], ['Cliente', s => esc(s.cliente)], ['Servicio', s => s.tipo], ['Técnico', s => esc(s.tecnico)], ['Fecha', s => fmtDate(s.fecha)],
      ['Estado', s => badge(s.estado)], ['Valor', s => money(s.valor)]], list, 'No hay servicios en el rango seleccionado.');
  }
  ['desde', 'hasta'].forEach(id => $('#' + id).addEventListener('input', render));
  $('#limpiar').onclick = () => { $('#desde').value = ''; $('#hasta').value = ''; render(); };
  App.render = render; render();
})();
