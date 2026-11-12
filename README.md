# ER Services – Sistema de Gestión de Servicio Técnico de Computadores

Prototipo web (frontend) de un proyecto académico de Ingeniería de Sistemas. Representa una empresa ficticia de servicio técnico de computadores en Norte de Santander, Colombia. Centraliza la información de **Cliente → Equipo → Servicio → Técnico → Estado → Valor**.

## Tecnologías
HTML5, CSS3 y JavaScript puro. **No usa librerías externas ni internet**: los gráficos están dibujados con SVG propio.

## Estructura
```
ER-Services/
├── index.html        Dashboard
├── clientes.html     Módulo Clientes (con detalle)
├── equipos.html      Módulo Equipos
├── servicios.html    Módulo Servicios (filtros, registro, detalle)
├── tecnicos.html     Módulo Técnicos
├── reportes.html     Reportes con filtro de fechas
├── css/styles.css    Estilos y diseño responsive
└── js/
    ├── data.js       Datos ficticios + capa de datos (Store y Q)
    ├── app.js        Sidebar, barra superior, modales, formularios, tablas y gráficos
    └── dashboard.js, clientes.js, equipos.js, servicios.js, tecnicos.js, reportes.js
```

## Cómo ejecutarlo
**Opción simple:** abra `index.html` con doble clic en su navegador.

**En VS Code:** `Archivo → Abrir carpeta…` y elija `ER-Services`. Opcionalmente instale la extensión **Live Server**, clic derecho sobre `index.html` → *Open with Live Server*. No necesita instalar nada más.

## Cómo usar el prototipo
1. Navegue con el menú lateral (en móvil, con el botón ☰).
2. **Clientes:** busque, cree un cliente y pulse *Ver detalle* para ver sus equipos y servicios.
3. **Equipos:** registre equipos y pulse *Nuevo servicio* en una fila.
4. **Servicios:** busque, filtre, registre un servicio, vea su detalle, cambie su estado o elimínelo.
5. **Técnicos:** cree técnicos y actívelos/desactívelos.
6. **Reportes:** filtre por rango de fechas.
7. Campana: servicios por atender. Perfil: permite **restablecer los datos de demostración**.

## Qué es simulado
- Sin login: el usuario "Administrador" es ficticio.
- Los datos se guardan en `localStorage` del navegador (no hay base de datos).
- Todos los datos son ficticios.
- Los ingresos suman solo los servicios en estado *Terminado*.

## Preparado para el futuro
`js/data.js` concentra el acceso a datos (`Store`). Para pasar a **Frontend → API → PostgreSQL**, basta reemplazar `Store` por llamadas `fetch()` a un backend. Posibles mejoras: autenticación, exportar reportes a PDF/Excel, historial por equipo y notificaciones al cliente.
