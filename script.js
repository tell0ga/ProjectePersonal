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

const panelYouTube = document.querySelector('#youtube-stats');
const temasComparacion = document.querySelector('.topics');
const notaComparacion = document.querySelector('.method');
const periodoDatos = document.querySelector('#periodo-datos');
const periodoComparacion = periodoDatos.textContent;

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
    descripcion: 'Mi historial de música en YouTube durante un año.',
    estado: 'YouTube · Historial filtrado',
    enlace: 'Ver análisis de YouTube ',
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
const iniciarDisco = tocadiscos.querySelector('.start-record');
const analisis = document.querySelector('#analisis');
const soportePortada = document.createElement('div');
soportePortada.className = 'turntable-home';
tocadiscos.before(soportePortada);
soportePortada.append(tocadiscos);

const soporteAnalisis = document.createElement('div');
soporteAnalisis.className = 'turntable-dock';
soporteAnalisis.hidden = true;
analisis.append(soporteAnalisis);

let fotogramaTransicion;
const discoEnPlato = tocadiscos.querySelector('.playing-record');
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
let vuelo;
let seleccion = 'comparacion';
let reproducirAlCargar = false;

function ponerDisco(nombre) {
  if (seleccion === nombre) return;

  const disco = document.querySelector('[data-vinilo="' + nombre + '"] .record');
  const origen = disco.getBoundingClientRect();

  vuelo?.remove();
  vuelo = null;
  tocadiscos.classList.remove('is-loading');
  tocadiscos.classList.remove('is-started');
  iniciarDisco.setAttribute('aria-label', 'Reproducir disco');
  tocadiscos.dataset.playing = nombre;
  iniciarDisco.disabled = false;

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
  iniciarDisco.disabled = true;

  const movimiento = discoVolador.animate([
    { transform: 'translate(0, 0) scale(1)' },
    { transform: 'translate(' + (destino.left - origen.left) + 'px, ' +
      (destino.top - origen.top) + 'px) scale(' + destino.width / origen.width + ')' },
  ], { duration: 760, easing: 'cubic-bezier(.42, 0, .2, 1)', fill: 'forwards' });

  movimiento.onfinish = () => {
    discoVolador.remove();
    if (vuelo === discoVolador) {
      vuelo = null;
      tocadiscos.classList.remove('is-loading');
      iniciarDisco.disabled = false;
      if (reproducirAlCargar) {
        reproducirAlCargar = false;
        reproducirDisco();
      }
    }
  };
}

function mostrarVista(nombre) {
  const vista = vistas[nombre];
  document.body.dataset.view = nombre;
  tituloAnalisis.textContent = vista.titulo;
  descripcionAnalisis.textContent = vista.descripcion;
  estadoDatos.textContent = vista.estado;
  const esYouTube = nombre === 'casa';
  panelYouTube.hidden = !(esYouTube && seleccion === 'casa' &&
    tocadiscos.classList.contains('is-started'));
  temasComparacion.hidden = esYouTube;
  notaComparacion.hidden = esYouTube;
  periodoDatos.textContent = esYouTube ? '1 nov 2025 a 1 nov 2026' : periodoComparacion;
  if (vista.temas) {
    descripciones.forEach((parrafo, indice) => {
      parrafo.textContent = vista.temas[indice];
    });
  }
}

function seleccionarVista(nombre) {
  if (nombre !== seleccion) {
    reproducirAlCargar = false;
    cancelAnimationFrame(fotogramaTransicion);
    tocadiscos.style.transform = '';
    analisis.style.minHeight = '';
  }

  if (nombre !== seleccion && tocadiscos.parentElement === soporteAnalisis) {
    soportePortada.append(tocadiscos);
    soporteAnalisis.hidden = true;
  }

  if (nombre === 'comparacion') {
    vuelo?.remove();
    vuelo = null;
    tocadiscos.classList.remove('is-loading');
    delete tocadiscos.dataset.playing;
    tocadiscos.classList.remove('is-started');
    iniciarDisco.setAttribute('aria-label', 'Reproducir disco');
    iniciarDisco.disabled = true;
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

function expulsarDisco() {
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

  const duracionRegreso = 680;
  const regreso = disco.animate([{ opacity: 0 }, { opacity: 0 }], duracionRegreso);
  const movimiento = discoVolador.animate([
    { transform: 'translate(0, 0) scale(1)' },
    { transform: 'translate(' + (destino.left - origen.left) + 'px, ' +
      (destino.top - origen.top) + 'px) scale(' + destino.width / origen.width + ')' },
  ], { duration: duracionRegreso, easing: 'cubic-bezier(.42, 0, .2, 1)', fill: 'forwards' });

  movimiento.onfinish = () => {
    discoVolador.remove();
    regreso.cancel();
    if (vuelo === discoVolador) vuelo = null;
  };
}

quitarDisco.addEventListener('click', () => {
  if (tocadiscos.parentElement !== soporteAnalisis) {
    expulsarDisco();
    return;
  }

  const origen = tocadiscos.getBoundingClientRect();
  analisis.style.minHeight = analisis.getBoundingClientRect().height + 'px';
  tocadiscos.classList.remove('is-started');
  iniciarDisco.setAttribute('aria-label', 'Reproducir disco');
  iniciarDisco.disabled = true;
  quitarDisco.disabled = true;
  soportePortada.append(tocadiscos);
  soporteAnalisis.hidden = true;

  deslizarTocadiscos(origen, soportePortada, 0, () => {
    analisis.style.minHeight = '';
    expulsarDisco();
    document.querySelector('#titulo').focus({ preventScroll: true });
  });
});
function reproducirDisco() {
  if (tocadiscos.classList.contains('is-loading')) {
    reproducirAlCargar = true;
    return;
  }

  if (iniciarDisco.disabled || tocadiscos.classList.contains('is-started')) return;

  iniciarDisco.setAttribute('aria-label', 'Detener disco');
  if (tocadiscos.parentElement === soporteAnalisis) {
    tocadiscos.classList.add('is-started');
    mostrarVista(seleccion);
    return;
  }

  const origen = tocadiscos.getBoundingClientRect();
  cancelAnimationFrame(fotogramaTransicion);

  tocadiscos.classList.add('is-started');
  tocadiscos.style.transform = '';
  soporteAnalisis.hidden = false;
  soporteAnalisis.append(tocadiscos);
  mostrarVista(seleccion);

  const scrollFinal = Math.max(0, Math.min(
    analisis.getBoundingClientRect().top + window.scrollY - 16,
    document.documentElement.scrollHeight - window.innerHeight,
  ));
  deslizarTocadiscos(origen, soporteAnalisis, scrollFinal, () => {
    analisis.focus({ preventScroll: true });
  });
}

iniciarDisco.addEventListener('click', () => {
  if (tocadiscos.classList.contains('is-started')) {
    tocadiscos.classList.remove('is-started');
    iniciarDisco.setAttribute('aria-label', 'Reproducir disco');
    return;
  }

  reproducirDisco();
});

enlaceAnalisis.addEventListener('click', (evento) => {
  if (seleccion === 'comparacion' || evento.ctrlKey || evento.metaKey ||
      evento.shiftKey || evento.altKey) return;

  if (tocadiscos.parentElement === soporteAnalisis) {
    reproducirDisco();
    return;
  }

  evento.preventDefault();
  reproducirDisco();
});

function deslizarTocadiscos(origen, soporte, scrollFinal, alTerminar) {
  cancelAnimationFrame(fotogramaTransicion);

  if (reducirMovimiento.matches) {
    window.scrollTo({ top: scrollFinal, behavior: 'instant' });
    alTerminar();
    return;
  }

  const scrollInicial = window.scrollY;
  const duracion = 1150;
  const inicio = performance.now();

  function deslizar(ahora) {
    const progreso = Math.min(1, Math.max(0, (ahora - inicio) / duracion));
    const avance = progreso * progreso * (3 - 2 * progreso);
    window.scrollTo({ top: scrollInicial + (scrollFinal - scrollInicial) * avance, behavior: 'instant' });

    const destino = soporte.getBoundingClientRect();
    const escala = 1 + (origen.width / destino.width - 1) * (1 - avance);
    const x = (origen.left - destino.left) * (1 - avance);
    const yFinal = destino.top + window.scrollY - scrollFinal;
    const y = origen.top + (yFinal - origen.top) * avance - destino.top;
    tocadiscos.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + escala + ')';

    if (progreso < 1) {
      fotogramaTransicion = requestAnimationFrame(deslizar);
    } else {
      tocadiscos.style.transform = '';
      alTerminar();
    }
  }

  deslizar(inicio);
}
