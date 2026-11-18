const temas = document.querySelectorAll('.topics details');

temas.forEach((tema) => {
  tema.addEventListener('toggle', () => {
    if (tema.open) {
      temas.forEach((otroTema) => {
        if (otroTema !== tema) {
          otroTema.open = false;
        }
      });
    }
  });
});

const selectores = document.querySelectorAll('.view-switch button');
const vinilos = document.querySelectorAll('[data-vinilo]');
const tituloAnalisis = document.querySelector('#pregunta');
const descripcionAnalisis = document.querySelector('.analysis-heading div p');
const estadoDatos = document.querySelector('#estado-datos');
const enlaceAnalisis = document.querySelector('.cover .button');
const descripciones = document.querySelectorAll('.topics details p');

const vistas = {
  comparacion: {
    titulo: tituloAnalisis.textContent,
    descripcion: descripcionAnalisis.textContent,
    estado: estadoDatos.textContent,
    enlace: enlaceAnalisis.firstChild.textContent,
    temas: Array.from(descripciones, (parrafo) => parrafo.textContent),
  },
  casa: {
    titulo: 'En casa · YouTube',
    descripcion: '680 reproducciones en el historial de ejemplo.',
    estado: 'YouTube · Datos ficticios',
    enlace: 'Ver análisis de YouTube ',
    temas: ['Hora punta: 22:00.', 'Artista más escuchado: Sade.', 'Género principal: soul.', 'Ambiente predominante: tranquilo.'],
  },
  calle: {
    titulo: 'En la calle · Spotify',
    descripcion: '940 reproducciones en el historial de ejemplo.',
    estado: 'Spotify · Datos ficticios',
    enlace: 'Ver análisis de Spotify ',
    temas: ['Hora punta: 08:00.', 'Artista más escuchado: Justice.', 'Género principal: electrónica.', 'Ambiente predominante: enérgico.'],
  },
};

const tocadiscos = document.querySelector('.turntable');
const quitarDisco = tocadiscos.querySelector('.eject-record');
const discoEnPlato = tocadiscos.querySelector('.playing-record');
const panelEscucha = document.querySelector('.now-playing');
const resumenVisible = document.createElement('span');
panelEscucha.append(resumenVisible);

for (const nombre of ['casa', 'calle']) {
  const reserva = document.createElement('span');
  reserva.className = 'now-playing-reserve';
  reserva.setAttribute('aria-hidden', 'true');
  reserva.textContent = resumenDisco(nombre);
  panelEscucha.append(reserva);
}

function resumenDisco(nombre) {
  const vista = vistas[nombre];
  return vista.estado + ' · ' + vista.temas.slice(0, 3).join(' ');
}
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
let vuelo;
let seleccion = 'comparacion';

function ponerDisco(nombre) {
  if (seleccion === nombre) return;

  const disco = document.querySelector('[data-vinilo="' + nombre + '"] .record');
  const origen = disco.getBoundingClientRect();

  vuelo?.remove();
  vuelo = null;
  tocadiscos.classList.remove('is-loading');
  tocadiscos.dataset.playing = nombre;
  resumenVisible.textContent = resumenDisco(nombre);

  if (reducirMovimiento.matches || !disco.animate) return;

  const destino = discoEnPlato.getBoundingClientRect();
  const discoVolador = document.createElement('span');
  discoVolador.className = 'record flying-record';
  discoVolador.dataset.disco = nombre;
  discoVolador.style.left = origen.left + 'px';
  discoVolador.style.top = origen.top + 'px';
  discoVolador.style.width = origen.width + 'px';
  document.body.append(discoVolador);
  vuelo = discoVolador;
  tocadiscos.classList.add('is-loading');

  const movimiento = discoVolador.animate([
    { transform: 'translate(0, 0) scale(1)' },
    { transform: 'translate(' + (destino.left - origen.left) + 'px, ' +
      (destino.top - origen.top) + 'px) scale(' + destino.width / origen.width + ')' },
  ], { duration: 540, easing: 'cubic-bezier(.22,.75,.24,1)' });

  movimiento.onfinish = () => {
    discoVolador.remove();
    if (vuelo === discoVolador) {
      vuelo = null;
      tocadiscos.classList.remove('is-loading');
    }
  };
}

function mostrarVista(nombre) {
  const vista = vistas[nombre];
  document.body.dataset.view = nombre;
  tituloAnalisis.textContent = vista.titulo;
  descripcionAnalisis.textContent = vista.descripcion;
  estadoDatos.textContent = vista.estado;
  descripciones.forEach((parrafo, indice) => {
    parrafo.textContent = vista.temas[indice];
  });
}

function seleccionarVista(nombre) {
  if (nombre === 'comparacion') {
    vuelo?.remove();
    vuelo = null;
    tocadiscos.classList.remove('is-loading');
    delete tocadiscos.dataset.playing;
    resumenVisible.textContent = '';
  } else {
    ponerDisco(nombre);
  }

  quitarDisco.disabled = nombre === 'comparacion';
  seleccion = nombre;
  enlaceAnalisis.firstChild.textContent = vistas[nombre].enlace;
  selectores.forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.view === nombre));
  });
  vinilos.forEach((vinilo) => {
    vinilo.setAttribute('aria-pressed', String(vinilo.dataset.vinilo === nombre));
  });
  mostrarVista(nombre);
}

selectores.forEach((boton) => {
  boton.addEventListener('click', () => seleccionarVista(boton.dataset.view));
});

vinilos.forEach((vinilo) => {
  const nombre = vinilo.dataset.vinilo;
  vinilo.addEventListener('pointerenter', (evento) => {
    if (evento.pointerType === 'mouse') mostrarVista(nombre);
  });
  vinilo.addEventListener('pointerleave', () => mostrarVista(seleccion));
  vinilo.addEventListener('click', () => seleccionarVista(nombre));
});

quitarDisco.addEventListener('click', () => {
  const nombre = seleccion;
  const disco = document.querySelector('[data-vinilo="' + nombre + '"] .record');
  const origen = (vuelo || discoEnPlato).getBoundingClientRect();

  seleccionarVista('comparacion');
  if (reducirMovimiento.matches || !disco.animate) return;

  const destino = disco.getBoundingClientRect();
  const discoVolador = document.createElement('span');
  discoVolador.className = 'record flying-record';
  discoVolador.dataset.disco = nombre;
  discoVolador.style.left = origen.left + 'px';
  discoVolador.style.top = origen.top + 'px';
  discoVolador.style.width = origen.width + 'px';
  document.body.append(discoVolador);
  vuelo = discoVolador;

  const regreso = disco.animate([{ opacity: 0 }, { opacity: 0 }], 480);
  const movimiento = discoVolador.animate([
    { transform: 'translate(0, 0) scale(1)' },
    { transform: 'translate(' + (destino.left - origen.left) + 'px, ' +
      (destino.top - origen.top) + 'px) scale(' + destino.width / origen.width + ')' },
  ], { duration: 480, easing: 'cubic-bezier(.22,.75,.24,1)' });

  movimiento.onfinish = () => {
    discoVolador.remove();
    regreso.cancel();
    if (vuelo === discoVolador) vuelo = null;
  };
});