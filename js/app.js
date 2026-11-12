/* Utilidades compartidas: layout, modales, formularios, tablas y gráficos. */
const NAV = [['index.html', 'Dashboard', 'dashboard'], ['clientes.html', 'Clientes', 'clientes'], ['equipos.html', 'Equipos', 'equipos'],
  ['servicios.html', 'Servicios', 'servicios'], ['tecnicos.html', 'Técnicos', 'tecnicos'], ['reportes.html', 'Reportes', 'reportes']];
const ICONS = {
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  clientes: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9',
  equipos: 'M3 5h18v11H3zM8 20h8M12 16v4',
  servicios: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  tecnicos: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  reportes: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  menu: 'M3 6h18M3 12h18M3 18h18'
};
const COLORS = { 'Terminado': '#16a34a', 'En proceso': '#2563eb', 'Pendiente': '#d97706' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const App = { render() {} };

const icon = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[n]}"/></svg>`;
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = v => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
const fmtDate = d => { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; };
const badge = e => `<span class="badge b-${e.toLowerCase().replace(/\s+/g, '-')}">${esc(e)}</span>`;
const contar = (list, key, cats) => cats.map(c => list.filter(s => s[key] === c).length);

/* ---------- Layout ---------- */
function initLayout() {
  const page = document.body.dataset.page;
  $('#sidebar').innerHTML = `<div class="brand"><span class="logo">ER</span>ER Services</div><nav>${NAV.map(([h, t, i]) => `<a href="${h}" class="${i === page ? 'active' : ''}">${icon(i)}${t}</a>`).join('')}</nav>`;
  const pend = Store.db.servicios.filter(s => s.estado !== 'Terminado');
  $('#topbar').innerHTML = `<button class="icon-btn menu-btn" id="menuBtn" aria-label="Abrir menú">${icon('menu')}</button><h1>${NAV.find(n => n[2] === page)[1]}</h1>
    <button class="icon-btn" id="notifBtn" aria-label="Notificaciones">${icon('bell')}<span class="dot">${pend.length}</span></button>
    <button class="user" id="userBtn"><span class="avatar">AD</span><span class="uname">Administrador</span></button>`;
  $('#menuBtn').onclick = () => document.body.classList.toggle('nav-open');
  $('#notifBtn').onclick = () => openModal('Servicios por atender', pend.length
    ? `<ul class="notes">${pend.map(Q.vista).map(s => `<li><span>${s.id} · ${esc(s.cliente)} · ${esc(s.tipo)}</span>${badge(s.estado)}<button class="btn sm" data-ver="${s.id}">Ver</button></li>`).join('')}</ul>`
    : '<p class="empty">No hay servicios pendientes.</p>');
  $('#userBtn').onclick = () => {
    openModal('Perfil', `<dl class="detail"><dt>Usuario</dt><dd>Administrador ER Services</dd><dt>Rol</dt><dd>Administrador (simulado)</dd><dt>Sede</dt><dd>Norte de Santander, Colombia</dd></dl>
      <p class="muted">Los datos se guardan en este navegador (localStorage). Puede volver a los datos de demostración.</p>
      <div class="form-actions"><button class="btn ghost" data-close>Cerrar</button><button class="btn danger" id="reset">Restablecer datos</button></div>`);
    $('#reset').onclick = () => Store.reset();
  };
}
function changed() { Store.save(); initLayout(); App.render(); }

/* ---------- Modales y avisos ---------- */
function openModal(title, html) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="overlay"><div class="modal" role="dialog" aria-modal="true"><header><h2>${title}</h2><button class="icon-btn" data-close aria-label="Cerrar">✕</button></header><div class="modal-body">${html}</div></div></div>`;
  root.onclick = e => { if (e.target.closest('[data-close]') || e.target.classList.contains('overlay')) closeModal(); };
  return $('.modal-body', root);
}
const closeModal = () => { $('#modal-root').innerHTML = ''; };
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Formularios ---------- */
const optHtml = (options, value = '') => '<option value="">Seleccione…</option>' + options.map(o => {
  const [v, l] = Array.isArray(o) ? o : [o, o];
  return `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(l)}</option>`;
}).join('');
function field(label, name, type = 'text', { options, value = '', required = true } = {}) {
  const req = required ? ' required' : '';
  const input = options ? `<select name="${name}"${req}>${optHtml(options, value)}</select>`
    : type === 'textarea' ? `<textarea name="${name}" rows="3"${req}>${esc(value)}</textarea>`
    : `<input name="${name}" type="${type}" value="${esc(value)}"${req}${type === 'number' ? ' min="0" step="1000"' : ''}>`;
  return `<label class="fld${type === 'textarea' ? ' full' : ''}">${label}${input}</label>`;
}
function openForm(title, fields, onSave) {
  const body = openModal(title, `<form class="form-grid">${fields.join('')}<div class="form-actions"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="submit" class="btn primary">Guardar</button></div></form>`);
  const form = $('form', body);
  form.onsubmit = e => { e.preventDefault(); onSave(Object.fromEntries(new FormData(form))); closeModal(); };
  return form;
}

/* ---------- Tablas ---------- */
function table(cols, rows, empty = 'Sin registros.') {
  if (!rows.length) return `<p class="empty">${empty}</p>`;
  return `<div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const btnVer = s => `<button class="btn sm" data-ver="${s.id}">Ver</button>`;
const statCard = (l, v, i, sub) => `<article class="card stat"><span class="stat-ic">${icon(i)}</span><div><small>${l}</small><strong>${v}</strong>${sub ? `<em>${sub}</em>` : ''}</div></article>`;

/* ---------- Detalle de servicio (usado en varias pantallas) ---------- */
function showServicio(id) {
  const raw = Store.find('servicios', id); if (!raw) return;
  const s = Q.vista(raw);
  const rows = [['Cliente', `<a href="clientes.html?id=${s.clienteId}">${esc(s.cliente)}</a>`], ['Equipo', esc(s.equipo)], ['Tipo de servicio', s.tipo], ['Técnico', esc(s.tecnico)],
    ['Fecha de ingreso', fmtDate(s.fecha)], ['Estado', badge(s.estado)], ['Valor', money(s.valor)], ['Problema', esc(s.problema)], ['Observaciones', esc(s.observaciones || '—')]];
  openModal(`Servicio ${s.id}`, `<dl class="detail">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    <div class="actions"><label class="fld">Cambiar estado<select id="nuevoEstado">${ESTADOS.map(e => `<option${e === s.estado ? ' selected' : ''}>${e}</option>`).join('')}</select></label><button class="btn primary" id="btnEstado">Actualizar estado</button></div>`);
  $('#btnEstado').onclick = () => { raw.estado = $('#nuevoEstado').value; closeModal(); changed(); toast('Estado actualizado'); };
}
document.addEventListener('click', e => { const b = e.target.closest('[data-ver]'); if (b) showServicio(b.dataset.ver); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- Gráficos SVG (sin librerías) ---------- */
function barChart(el, labels, values) {
  const W = 520, H = 220, p = 28, max = Math.max(...values, 1), bw = (W - p * 2) / Math.max(values.length, 1);
  el.innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Servicios por mes">` + values.map((v, i) => {
    const h = (H - p * 2) * v / max, x = p + i * bw + bw * .2, cx = x + bw * .3;
    return `<rect class="bar" x="${x}" y="${H - p - h}" width="${bw * .6}" height="${h}" rx="4"/><text class="lbl" x="${cx}" y="${H - p - h - 6}" text-anchor="middle">${v}</text><text class="lbl" x="${cx}" y="${H - 8}" text-anchor="middle">${labels[i]}</text>`;
  }).join('') + '</svg>';
}
function donut(el, labels, values, colors) {
  const total = values.reduce((a, b) => a + b, 0), t = total || 1; let off = 0;
  const seg = values.map((v, i) => { const p = v / t * 100; const s = `<circle cx="21" cy="21" r="15.915" fill="none" stroke="${colors[i]}" stroke-width="6" stroke-dasharray="${p} ${100 - p}" stroke-dashoffset="${25 - off}"/>`; off += p; return s; }).join('');
  el.innerHTML = `<div class="donut"><svg viewBox="0 0 42 42" role="img" aria-label="Distribución">${seg}<text class="tot" x="21" y="23.5" text-anchor="middle">${total}</text></svg><ul class="legend">${labels.map((l, i) => `<li><i style="background:${colors[i]}"></i>${esc(l)}<b>${values[i]}</b></li>`).join('')}</ul></div>`;
}
function hbars(el, labels, values) {
  const max = Math.max(...values, 1);
  el.innerHTML = labels.map((l, i) => `<div class="hbar"><span>${esc(l)}</span><div class="track"><div class="fill" style="width:${values[i] / max * 100}%"></div></div><b>${values[i]}</b></div>`).join('');
}
const estadoDonut = (el, list) => { const cats = ESTADOS.slice().reverse(); donut(el, cats, contar(list, 'estado', cats), cats.map(e => COLORS[e])); };

initLayout();
$('.scrim').onclick = () => document.body.classList.remove('nav-open');
