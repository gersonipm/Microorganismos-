/* ===== PREGUNTAS =====
   n = dificultad (1 fácil, 2 media, 3 difícil)
   o = opciones; la PRIMERA (o[0]) es siempre la correcta, el juego las mezcla.
   Tema: Microorganismos de interés industrial y médico / MicroMundo. */
const PREGUNTAS = [
  { n: 1, p: "¿Cuál es el objetivo principal del proyecto de ciencia ciudadana MicroMundo?", o: ["Descubrir nuevos antibióticos a partir de microorganismos del suelo", "Crear plásticos biodegradables en laboratorios", "Modificar genéticamente insectos para la agricultura", "Estudiar la geología de las capas terrestres"] },
  { n: 1, p: "¿Qué microorganismo unicelular procariota se aísla y analiza habitualmente en las muestras de suelo en MicroMundo?", o: ["Bacterias", "Levaduras", "Algas microscópicas", "Protozoos ciliados"] },
  { n: 1, p: "En la microbiología industrial, ¿qué microorganismo se emplea comúnmente en procesos de fermentación para hacer pan o cerveza?", o: ["Saccharomyces cerevisiae (levadura)", "Escherichia coli patógena", "Staphylococcus aureus", "Salmonella enterica"] },
  { n: 1, p: "¿Cómo se le llama comúnmente al conjunto de técnicas que evitan la contaminación por microorganismos patógenos en el laboratorio?", o: ["Técnica aséptica", "Técnica de centrifugación", "Proceso de pasteurización", "Tinción diferencial"] },

  { n: 2, p: "¿Qué indica la formación de un 'halo de inhibición' alrededor de una colonia bacteriana del suelo en una placa de Petri?", o: ["Que produce sustancias con capacidad antimicrobiana o antibiótica", "Que la bacteria está absorbiendo todo el colorante del medio", "Que la muestra de suelo está completamente contaminada por hongos", "Que ha ocurrido un error térmico en la incubación"] },
  { n: 2, p: "¿Qué grupo principal de bacterias del suelo destaca en microbiología por producir la gran mayoría de los antibióticos naturales conocidos?", o: ["Actinobacterias (ej. Streptomyces)", "Cianobacterias fotosintéticas", "Bacterias ácido lácticas", "Enterobacterias intestinales"] },
  { n: 2, p: "¿Qué proceso industrial utiliza microorganismos para transformar materia orgánica en ausencia de oxígeno, generando biocombustibles como el biogás?", o: ["Fermentación anaerobia / Metanogénesis", "Respiración aerobia celular", "Pasteurización térmica", "Filtración por membrana esterilizante"] },
  { n: 2, p: "¿Qué tipo de tinción compuesta se utiliza frecuentemente en el laboratorio para clasificar bacterias según las propiedades de su pared celular?", o: ["Tinción de Gram", "Tinción de Wright", "Tinción con azul de metileno simple", "Tinción fluorescente de ADN"] },

  { n: 3, p: "¿Cuál es el principal mecanismo genético por el cual las bacterias adquieren resistencia a los antibióticos de forma horizontal en el ambiente?", o: ["Transferencia de plásmidos por conjugación, transformación o transducción", "Mutaciones espontáneas por radiación ultravioleta únicamente", "Duplicación directa de su material nuclear por mitosis", "Intercambio pasivo de orgánulos celulares internos"] },
  { n: 3, p: "En la producción biotecnológica a gran escala, ¿qué nombre recibe el recipiente o tanque equipado para controlar variables y cultivar microorganismos de forma óptima?", o: ["Biorreactor o fermentador", "Autoclave de esterilización", "Centrífuga industrial de flujo continuo", "Cabina de flujo laminar"] },
  { n: 3, p: "¿Qué describe el término 'cepa' (strain) dentro de la microbiología aplicada e industrial?", o: ["Una variante genética o descendencia pura derivada de un único aislamiento microbiológico", "El instrumento metálico estéril utilizado para sembrar en estrías", "El desecho biológico sólido generado tras la incubación", "Una fase específica dentro de la curva de crecimiento exponencial"] },
  { n: 3, p: "¿Qué enzima de origen microbiano revolucionó la tecnología de biología molecular permitiendo la técnica de la Reacción en Cadena de la Polimerasa (PCR)?", o: ["Taq polimerasa (extraída de Thermus aquaticus)", "Amilasa bacteriana termorresistente", "Penicilina deshidrogenasa", "Lactasa de hongos filamentosos"] }
];

/* ===== LABERINTO ===== */
const N = 1, E = 2, S = 4, W = 8;                      // bits de pasillos abiertos
const DIR = { [N]: [0, -1, S], [E]: [1, 0, W], [S]: [0, 1, N], [W]: [-1, 0, E] };
const $ = id => document.getElementById(id);
const canvas = $("lienzo"), ctx = canvas.getContext("2d");

const juego = { nivel: 1, cols: 0, rows: 0, grid: [], x: 0, y: 0, base: 0, total: 0, restante: 0, fin: 0, activo: false, usadas: new Set(), mejor: 1 };

try { juego.mejor = Number(localStorage.getItem("laberinto-mejor")) || 1; } catch (e) {}
$("mejor").textContent = juego.mejor;

function generar(cols, rows) {
  const grid = new Array(cols * rows).fill(0);
  const visto = new Array(cols * rows).fill(false);
  const pila = [[0, 0]];
  visto[0] = true;
  while (pila.length) {
    const [x, y] = pila[pila.length - 1];
    const vecinos = [N, E, S, W].filter(d => {
      const nx = x + DIR[d][0], ny = y + DIR[d][1];
      return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !visto[ny * cols + nx];
    });
    if (!vecinos.length) { pila.pop(); continue; }
    const d = vecinos[Math.floor(Math.random() * vecinos.length)];
    const nx = x + DIR[d][0], ny = y + DIR[d][1];
    grid[y * cols + x] |= d;
    grid[ny * cols + nx] |= DIR[d][2];
    visto[ny * cols + nx] = true;
    pila.push([nx, ny]);
  }
  return grid;
}

// Busca la casilla con el camino más largo desde el inicio (así la salida queda lo más lejos posible)
function salidaLejana(grid, cols) {
  const dist = new Array(grid.length).fill(-1);
  const cola = [0];
  dist[0] = 0;
  let ultimo = 0;
  for (let k = 0; k < cola.length; k++) {
    const i = cola[k];
    ultimo = i;
    const x = i % cols, y = Math.floor(i / cols);
    for (const d of [N, E, S, W]) {
      if (!(grid[i] & d)) continue;
      const j = (y + DIR[d][1]) * cols + (x + DIR[d][0]);
      if (dist[j] < 0) { dist[j] = dist[i] + 1; cola.push(j); }
    }
  }
  return [ultimo % cols, Math.floor(ultimo / cols)];
}

function nuevoNivel() {
  const n = juego.nivel;
  juego.cols = Math.min(14 + n * 2, 40);                // más grande cada nivel
  juego.rows = Math.min(10 + n * 2, 28);
  juego.grid = generar(juego.cols, juego.rows);
  [juego.ex, juego.ey] = salidaLejana(juego.grid, juego.cols);
  juego.x = 0; juego.y = 0;
  const factor = Math.max(0.14, 0.30 - 0.02 * n);       // menos tiempo por casilla cada nivel
  juego.base = Math.round(juego.cols * juego.rows * factor);
  juego.total = juego.base;
  juego.restante = juego.base;
  juego.fin = performance.now() + juego.base * 1000;
  juego.activo = true;
  $("nivel").textContent = n;
  ocultarPanel();
  dibujar();
}

function dibujar() {
  const { cols, rows, grid, x, y } = juego;
  if (!cols) return;
  const disp = $("tablero").clientWidth || 600;
  const c = Math.max(8, Math.floor(Math.min(disp / cols, (innerHeight * 0.6) / rows)));
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = cols * c + "px";
  canvas.style.height = rows * c + "px";
  canvas.width = cols * c * dpr;
  canvas.height = rows * c * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const css = getComputedStyle(document.documentElement);
  const color = v => css.getPropertyValue(v).trim();

  ctx.clearRect(0, 0, cols * c, rows * c);
  ctx.fillStyle = color("--salida");
  ctx.fillRect(juego.ex * c + c * 0.2, juego.ey * c + c * 0.2, c * 0.6, c * 0.6);

  ctx.strokeStyle = color("--tinta");
  ctx.lineWidth = Math.max(2, c / 8);
  ctx.lineCap = "square";
  ctx.beginPath();
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const g = grid[j * cols + i], px = i * c, py = j * c;
      if (!(g & N)) { ctx.moveTo(px, py); ctx.lineTo(px + c, py); }
      if (!(g & W)) { ctx.moveTo(px, py); ctx.lineTo(px, py + c); }
      if (!(g & S)) { ctx.moveTo(px, py + c); ctx.lineTo(px + c, py + c); }
      if (!(g & E)) { ctx.moveTo(px + c, py); ctx.lineTo(px + c, py + c); }
    }
  }
  ctx.stroke();

  ctx.fillStyle = color("--jugador");
  ctx.beginPath();
  ctx.arc(x * c + c / 2, y * c + c / 2, c * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function mover(d) {
  if (!juego.activo) return;
  if (!(juego.grid[juego.y * juego.cols + juego.x] & d)) return;
  juego.x += DIR[d][0];
  juego.y += DIR[d][1];
  dibujar();
  if (juego.x === juego.ex && juego.y === juego.ey) ganarNivel();
}

/* ===== TIEMPO ===== */
setInterval(() => {
  if (!juego.activo) return;
  juego.restante = Math.max(0, (juego.fin - performance.now()) / 1000);
  actualizarHud();
  if (juego.restante <= 0) tiempoAgotado();
}, 100);

function actualizarHud() {
  const t = $("tiempo"), b = $("barra");
  t.textContent = Math.ceil(juego.restante) + " s";
  b.style.width = Math.min(100, (juego.restante / juego.total) * 100) + "%";
  const poco = juego.restante <= 10;
  t.classList.toggle("poco", poco);
  b.classList.toggle("poco", poco);
}

/* ===== PANEL (mensajes y preguntas) ===== */
function mostrarPanel({ titulo, texto = "", opciones = [], boton = null }) {
  $("pTitulo").textContent = titulo;
  $("pTexto").textContent = texto;
  const cont = $("pOpciones");
  cont.replaceChildren();
  opciones.forEach(({ t, fn }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t;
    b.addEventListener("click", fn);
    cont.appendChild(b);
  });
  const btn = $("pBoton");
  btn.hidden = !boton;
  if (boton) { btn.textContent = boton.t; btn.onclick = boton.fn; }
  $("panel").hidden = false;
  (boton ? btn : cont.firstElementChild)?.focus();
}
function ocultarPanel() { $("panel").hidden = true; }

/* ===== FLUJO DEL JUEGO ===== */
function ganarNivel() {
  juego.activo = false;
  if (juego.nivel >= juego.mejor) {
    juego.mejor = juego.nivel;
    try { localStorage.setItem("laberinto-mejor", juego.mejor); } catch (e) {}
    $("mejor").textContent = juego.mejor;
  }
  mostrarPanel({
    titulo: `Nivel ${juego.nivel} superado`,
    texto: `Te sobraron ${Math.ceil(juego.restante)} s. El siguiente laberinto es más grande y tiene menos tiempo por casilla.`,
    boton: { t: "Siguiente nivel", fn: () => { juego.nivel++; nuevoNivel(); } }
  });
}

function tiempoAgotado() {
  juego.activo = false;
  juego.restante = 0;
  actualizarHud();
  const tier = Math.min(3, 1 + Math.floor((juego.nivel - 1) / 3));       // dificultad de la pregunta
  const cantidad = Math.min(3, 1 + Math.floor((juego.nivel - 1) / 3));   // preguntas seguidas
  mostrarPanel({
    titulo: "Se acabó el tiempo",
    texto: cantidad === 1
      ? "Responde bien la pregunta para seguir intentando. Si fallas, pierdes."
      : `Responde bien las ${cantidad} preguntas para seguir intentando. Si fallas una, pierdes.`,
    boton: { t: "Responder", fn: () => preguntar(tier, cantidad, 1) }
  });
}

function preguntar(tier, cantidad, i) {
  let pool = PREGUNTAS.filter(q => q.n === tier && !juego.usadas.has(q));
  if (!pool.length) {
    PREGUNTAS.filter(q => q.n === tier).forEach(q => juego.usadas.delete(q));
    pool = PREGUNTAS.filter(q => q.n === tier);
  }
  const q = pool[Math.floor(Math.random() * pool.length)];
  juego.usadas.add(q);
  const opciones = q.o.map((t, k) => ({ t, ok: k === 0 })).sort(() => Math.random() - 0.5);

  mostrarPanel({
    titulo: `Pregunta ${i} de ${cantidad}`,
    texto: q.p,
    opciones: opciones.map(o => ({
      t: o.t,
      fn: () => o.ok
        ? (i < cantidad ? preguntar(tier, cantidad, i + 1) : continuar())
        : perder(q.o[0])
    }))
  });
}

function continuar() {
  const bonus = Math.max(10, Math.round(juego.base * 0.35));
  juego.total = bonus;
  juego.restante = bonus;
  juego.fin = performance.now() + bonus * 1000;
  ocultarPanel();
  juego.activo = true;
  actualizarHud();
}

function perder(correcta) {
  mostrarPanel({
    titulo: "Perdiste",
    texto: `La respuesta correcta era: ${correcta}. Llegaste al nivel ${juego.nivel}.`,
    boton: { t: "Jugar de nuevo", fn: () => { juego.nivel = 1; juego.usadas.clear(); nuevoNivel(); } }
  });
}

/* ===== CONTROLES ===== */
const TECLAS = { ArrowUp: N, w: N, W: N, ArrowRight: E, d: E, D: E, ArrowDown: S, s: S, S: S, ArrowLeft: W, a: W, A: W };
addEventListener("keydown", e => {
  const d = TECLAS[e.key];
  if (d && juego.activo) { e.preventDefault(); mover(d); }
});
document.querySelectorAll(".cruz button").forEach(b =>
  b.addEventListener("pointerdown", e => { e.preventDefault(); mover(Number(b.dataset.d)); })
);
addEventListener("resize", dibujar);

/* ===== INICIO ===== */
mostrarPanel({
  titulo: "Laberinto de preguntas: MicroMundo",
  texto: "Llega al cuadro amarillo antes de que se acabe el tiempo. Muévete con las flechas o WASD. Si el tiempo termina, responde preguntas de microbiología para seguir; si fallas, pierdes.",
  boton: { t: "Jugar", fn: () => { juego.nivel = 1; nuevoNivel(); } }
});