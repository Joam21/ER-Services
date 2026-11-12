(() => {
  function render() {
    const { servicios, clientes, equipos } = Store.db;
    const ingresos = servicios.filter(s => s.estado === 'Terminado').reduce((a, s) => a + s.valor, 0);
    $('#content').innerHTML = `
      <section class="grid stats">${statCard('Clientes', clientes.length, 'clientes')}${statCard('Equipos atendidos', equipos.length, 'equipos')}${statCard('Servicios realizados', servicios.length, 'servicios')}${statCard('Ingresos', money(ingresos), 'reportes', 'Servicios terminados')}</section>
      <section class="grid charts">
        <article class="card span2"><h2>Servicios por mes</h2><div id="chMes"></div></article>
        <article class="card"><h2>Estado de servicios</h2><div id="chEst"></div></article>
        <article class="card wide"><h2>Tipos de servicio</h2><div id="chTipo"></div></article>
      </section>
      <section class="card"><div class="card-head"><h2>Servicios recientes</h2><a class="btn primary" href="servicios.html?nuevo=1">+ Registrar servicio</a></div><div id="recientes"></div></section>`;
    const porMes = {};
    servicios.forEach(s => { const k = s.fecha.slice(0, 7); porMes[k] = (porMes[k] || 0) + 1; });
    const ks = Object.keys(porMes).sort().slice(-6);
    barChart($('#chMes'), ks.map(k => MESES[+k.slice(5) - 1]), ks.map(k => porMes[k]));
    estadoDonut($('#chEst'), servicios);
    hbars($('#chTipo'), TIPOS, contar(servicios, 'tipo', TIPOS));
    const recientes = servicios.map(Q.vista).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6);
    $('#recientes').innerHTML = table([['Cliente', s => esc(s.cliente)], ['Equipo', s => esc(s.equipo)], ['Servicio', s => s.tipo], ['Técnico', s => esc(s.tecnico)],
      ['Fecha', s => fmtDate(s.fecha)], ['Estado', s => badge(s.estado)], ['Valor', s => money(s.valor)], ['Detalle', btnVer]], recientes);
  }
  App.render = render; render();
})();
