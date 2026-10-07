/* ==========================================================================
   MicroMundo · Lógica de la página principal (MicroMundo.html):
   microscopio, esquema interactivo, infografía y evaluación.
   ========================================================================== */

const $ = (s) => document.querySelector(s),
  sh = (a) =>
    a
      .map((x) => [Math.random(), x])
      .sort((p, q) => p[0] - q[0])
      .map((x) => x[1]);
const C = { v: '#9B7BF5', p: '#FF5C9A', a: '#F0B03A', t: '#3FD0BE' },
  GN = { B: 'Bacteria', H: 'Hongo', Y: 'Levadura' };
const O = [
  {
    n: 'Lactobacillus bulgaricus',
    g: 'B',
    t: 'b',
    c: 'v',
    s: 'Alimentos',
    u: 'Fermenta la lactosa a ácido láctico y da la textura al yogur.',
    q: 'Bacteria que fermenta la lactosa a ácido láctico para elaborar yogur',
  },
  {
    n: 'Streptococcus thermophilus',
    g: 'B',
    t: 'c',
    c: 'v',
    s: 'Alimentos',
    u: 'Acompaña a Lactobacillus en el yogur y acelera la acidificación de la leche.',
  },
  {
    n: 'Streptomyces',
    g: 'B',
    t: 'h',
    c: 'v',
    s: 'Salud',
    u: 'Bacterias filamentosas del suelo; producen estreptomicina y tetraciclina.',
    q: 'Bacteria filamentosa del suelo que produce estreptomicina y tetraciclina',
  },
  {
    n: 'Escherichia coli',
    g: 'B',
    t: 'b',
    c: 'p',
    s: 'Salud',
    u: 'Gram negativa. Modificada genéticamente fabrica insulina humana y hormona del crecimiento.',
    q: 'Bacteria Gram negativa que, al recibir el gen humano, fabrica insulina',
  },
  {
    n: 'Bacillus thuringiensis',
    g: 'B',
    t: 'b',
    c: 'v',
    s: 'Agricultura',
    u: 'Sus toxinas se usan como biopesticida contra larvas de insectos plaga.',
    q: 'Bacteria cuyas toxinas se usan como biopesticida',
  },
  {
    n: 'Corynebacterium glutamicum',
    g: 'B',
    t: 'b',
    c: 'v',
    s: 'Industria',
    u: 'Produce aminoácidos como glutamato y lisina a escala industrial.',
    q: 'Bacteria que produce glutamato y lisina a escala industrial',
  },
  {
    n: 'Penicillium chrysogenum',
    g: 'H',
    t: 'h',
    c: 'a',
    s: 'Salud',
    u: 'Fuente industrial de la penicilina, el primer antibiótico de uso masivo.',
    q: 'Hongo filamentoso fuente industrial de la penicilina',
  },
  {
    n: 'Aspergillus niger',
    g: 'H',
    t: 'h',
    c: 'a',
    s: 'Industria',
    u: 'Produce ácido cítrico y enzimas usadas en alimentos y bebidas.',
    q: 'Hongo filamentoso que produce ácido cítrico',
  },
  {
    n: 'Saccharomyces cerevisiae',
    g: 'Y',
    t: 'y',
    c: 't',
    s: 'Alimentos',
    u: 'Fermentación alcohólica para pan, cerveza y vino; también vacuna recombinante contra hepatitis B.',
    q: 'Levadura que esponja el pan y produce etanol por fermentación',
  },
  {
    n: 'Saccharomyces boulardii',
    g: 'Y',
    t: 'y',
    c: 't',
    s: 'Salud',
    u: 'Levadura probiótica usada en trastornos intestinales.',
    q: 'Levadura probiótica usada en trastornos intestinales',
  },
  {
    n: 'Pichia pastoris',
    g: 'Y',
    t: 'y',
    c: 't',
    s: 'Salud',
    u: 'Hospedero eficiente para producir proteínas recombinantes.',
    q: 'Levadura hospedera para producir proteínas recombinantes',
  },
  {
    n: 'Kluyveromyces lactis',
    g: 'Y',
    t: 'y',
    c: 't',
    s: 'Alimentos',
    u: 'Produce lactasa para elaborar leches sin lactosa.',
    q: 'Levadura que produce lactasa para leches sin lactosa',
  },
];

/* Campo de microscopio */
const cv = $('#cv'),
  cx = cv.getContext('2d'),
  RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
let W = 0,
  sel = -1,
  hov = -1;
const P = O.map(() => {
  const a = Math.random() * 6.28,
    r = Math.sqrt(Math.random()) * 0.34;
  return {
    x: 0.5 + Math.cos(a) * r,
    y: 0.5 + Math.sin(a) * r,
    a: Math.random() * 6.28,
    vx: (Math.random() - 0.5) * 7e-4,
    vy: (Math.random() - 0.5) * 7e-4,
    va: (Math.random() - 0.5) * 0.004,
    p: Math.random() * 6,
  };
});
function rs() {
  const d = devicePixelRatio || 1;
  W = cv.clientWidth;
  cv.width = cv.height = W * d;
  cx.setTransform(d, 0, 0, d, 0, 0);
  draw();
}
function org(o, p, r) {
  cx.save();
  cx.translate(p.x * W, p.y * W);
  cx.rotate(p.a);
  cx.fillStyle = cx.strokeStyle = C[o.c];
  cx.lineWidth = r * 0.3;
  cx.lineCap = 'round';
  if (o.t == 'b') {
    cx.beginPath();
    cx.roundRect(-r * 1.1, -r * 0.42, r * 2.2, r * 0.84, r * 0.42);
    cx.fill();
  } else if (o.t == 'c') {
    for (let k = -1; k <= 1; k++) {
      cx.beginPath();
      cx.arc(k * r * 0.8, 0, r * 0.42, 0, 7);
      cx.fill();
    }
  } else if (o.t == 'y') {
    cx.beginPath();
    cx.arc(0, 0, r * 0.8, 0, 7);
    cx.fill();
    cx.beginPath();
    cx.arc(r * 0.95, -r * 0.45, r * 0.4, 0, 7);
    cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.28)';
    cx.beginPath();
    cx.arc(-r * 0.1, 0, r * 0.25, 0, 7);
    cx.fill();
  } else {
    cx.beginPath();
    for (let k = -12; k <= 12; k++) {
      const x = k * r * 0.12,
        y = Math.sin(k * 0.5 + p.p) * r * 0.35;
      k == -12 ? cx.moveTo(x, y) : cx.lineTo(x, y);
    }
    cx.stroke();
    cx.lineWidth = r * 0.2;
    cx.beginPath();
    cx.moveTo(0, Math.sin(p.p) * r * 0.35);
    cx.lineTo(r * 0.5, -r * 0.9);
    cx.stroke();
  }
  cx.restore();
}
function draw() {
  const g = cx.createRadialGradient(W / 2, W / 2, W * 0.08, W / 2, W / 2, W / 2);
  g.addColorStop(0, '#2c1b63');
  g.addColorStop(1, '#0b0820');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, W);
  cx.strokeStyle = 'rgba(255,255,255,.08)';
  cx.lineWidth = 1;
  cx.beginPath();
  cx.moveTo(W / 2, 0);
  cx.lineTo(W / 2, W);
  cx.moveTo(0, W / 2);
  cx.lineTo(W, W / 2);
  cx.stroke();
  const r = W * 0.048;
  P.forEach((p, i) => {
    if (!RM) {
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      p.p += 0.01;
      if (Math.hypot(p.x - 0.5, p.y - 0.5) > 0.38) {
        p.vx = (0.5 - p.x) * 0.0012;
        p.vy = (0.5 - p.y) * 0.0012;
      }
    }
    org(O[i], p, r);
    if (i == sel || i == hov) {
      cx.strokeStyle = '#fff';
      cx.lineWidth = 1.5;
      cx.beginPath();
      cx.arc(p.x * W, p.y * W, r * 1.7, 0, 7);
      cx.stroke();
      cx.fillStyle = '#fff';
      cx.font = 'italic ' + W * 0.04 + 'px "Instrument Serif",Georgia,serif';
      cx.textAlign = 'center';
      cx.fillText(O[i].n, Math.min(Math.max(p.x * W, W * 0.25), W * 0.75), p.y * W - r * 2);
    }
  });
  cx.strokeStyle = cx.fillStyle = 'rgba(255,255,255,.75)';
  cx.lineWidth = 2;
  cx.beginPath();
  cx.moveTo(W * 0.36, W * 0.9);
  cx.lineTo(W * 0.5, W * 0.9);
  cx.stroke();
  cx.font = W * 0.028 + 'px Figtree,sans-serif';
  cx.textAlign = 'center';
  cx.fillText('10 µm · ×1000', W * 0.43, W * 0.94);
}
(function L() {
  draw();
  if (!RM) requestAnimationFrame(L);
})();
function near(e) {
  const b = cv.getBoundingClientRect(),
    x = (e.clientX - b.left) / b.width,
    y = (e.clientY - b.top) / b.height;
  let m = -1,
    d = 0.085;
  P.forEach((p, i) => {
    const k = Math.hypot(p.x - x, p.y - y);
    if (k < d) {
      d = k;
      m = i;
    }
  });
  return m;
}
cv.onpointermove = (e) => {
  hov = near(e);
  cv.style.cursor = hov >= 0 ? 'pointer' : 'default';
};
cv.onpointerdown = (e) => {
  const i = near(e);
  if (i >= 0) pick(i);
};
cv.onpointerleave = () => (hov = -1);
function pick(i) {
  sel = i;
  const o = O[i];
  $('#fic').dataset.g = o.g;
  $('#fic').innerHTML =
    '<h3>' +
    o.n +
    '</h3><span class="tg">' +
    GN[o.g] +
    '</span><span class="tg">' +
    o.s +
    '</span><p class="fic__text">' +
    o.u +
    '</p>';
  [...$('#chips').children].forEach((b, k) => b.setAttribute('aria-pressed', k == i));
}
O.forEach((o, i) => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.textContent = o.n;
  b.setAttribute('aria-pressed', 'false');
  b.onclick = () => pick(i);
  $('#chips').appendChild(b);
});
addEventListener('resize', rs);
rs();

/* Esquema */
const S = [
  [
    'Cepa',
    'Selección de la cepa',
    'Se elige un microorganismo de alto rendimiento, a menudo mejorado por mutación o ingeniería genética, y se conserva en un banco de cepas.',
  ],
  [
    'Inóculo',
    'Preparación del inóculo',
    'La cepa se multiplica en volúmenes pequeños hasta tener suficiente biomasa activa para sembrar el biorreactor.',
  ],
  [
    'Fermentación',
    'Cultivo en biorreactor',
    'El medio aporta carbono, nitrógeno y sales; se controlan pH, temperatura, oxígeno y agitación para maximizar la producción.',
  ],
  [
    'Recuperación',
    'Separación y purificación',
    'Centrifugación, filtración y cromatografía separan el producto de las células y del medio.',
  ],
  [
    'Producto',
    'Formulación y control de calidad',
    'El producto se formula, se prueba su pureza y actividad, y se envasa para su uso médico o industrial.',
  ],
];
S.forEach((s, i) => {
  const b = document.createElement('button');
  b.innerHTML = '<i>' + (i + 1) + '</i>' + s[0];
  b.onclick = () => st(i);
  $('#steps').appendChild(b);
});
function st(i) {
  [...$('#steps').children].forEach((b, k) => b.setAttribute('aria-current', k == i));
  $('#tr').style.width = ((i + 1) / S.length) * 100 + '%';
  $('#pn').innerHTML = '<h3>' + S[i][1] + '</h3><p>' + S[i][2] + '</p>';
}
st(0);

/* Infografía */
$('#stat').textContent = O.length + ' especies · 3 grupos · 4 sectores de aplicación';
const SE = ['Todos', 'Alimentos', 'Salud', 'Agricultura', 'Industria'];
function cards(f) {
  $('#cards').innerHTML = O.filter((o) => f == 'Todos' || o.s == f)
    .map(
      (o) =>
        '<div class="cd cd--' +
        o.g +
        '"><b>' +
        o.n +
        '</b><span>' +
        GN[o.g] +
        ' · ' +
        o.s +
        '</span><br>' +
        o.u +
        '</div>',
    )
    .join('');
  [...$('#fil').children].forEach((b) => b.classList.toggle('on', b.textContent == f));
}
SE.forEach((s) => {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = s;
  b.onclick = () => cards(s);
  $('#fil').appendChild(b);
});
cards('Todos');

/* Evaluación */
const Q = [
  [
    '¿Qué par de bacterias se usa para elaborar yogur?',
    [
      'Lactobacillus bulgaricus y Streptococcus thermophilus',
      'Penicillium roqueforti y Aspergillus niger',
      'Bacillus thuringiensis y Streptomyces',
    ],
    0,
    'Ambas fermentan la lactosa y producen ácido láctico.',
  ],
  [
    '¿Qué microorganismo es la fuente industrial de la penicilina?',
    ['Aspergillus niger', 'Penicillium chrysogenum', 'Saccharomyces cerevisiae'],
    1,
    'Es un hongo filamentoso del género Penicillium.',
  ],
  [
    '¿Con qué se produce insulina humana recombinante?',
    ['Bacillus thuringiensis', 'Aspergillus oryzae', 'Escherichia coli modificada genéticamente'],
    2,
    'Se le inserta el gen humano de la insulina.',
  ],
  [
    'Bacillus thuringiensis se utiliza principalmente como:',
    ['Biopesticida', 'Probiótico', 'Productor de ácido cítrico'],
    0,
    'Sus toxinas eliminan larvas de ciertos insectos plaga.',
  ],
  [
    '¿Qué produce Saccharomyces cerevisiae en la fermentación alcohólica?',
    ['Ácido láctico y oxígeno', 'Etanol y CO₂', 'Penicilina y agua'],
    1,
    'El CO₂ esponja el pan; el etanol está presente en cerveza y vino.',
  ],
  [
    'Streptomyces es famoso por producir:',
    ['Ácido cítrico', 'Lactasa', 'Antibióticos como la estreptomicina'],
    2,
    'Este género aporta gran parte de los antibióticos conocidos.',
  ],
];
let ans = 0,
  ok = 0;
function buildQuiz() {
  ans = 0;
  ok = 0;
  $('#quiz').innerHTML = '';
  $('#qr').innerHTML = '';
  $('#qb').style.width = '0';
  Q.forEach((q, i) => {
    const d = document.createElement('div');
    d.className = 'qz';
    d.innerHTML = '<p>' + (i + 1) + '. ' + q[0] + '</p>';
    const fb = document.createElement('div');
    fb.className = 'fb';
    q[1].forEach((t, j) => {
      const b = document.createElement('button');
      b.className = 'op op--quiz';
      b.textContent = t;
      b.onclick = () => {
        const all = d.querySelectorAll('.op');
        all.forEach((x) => (x.disabled = true));
        all[q[2]].classList.add('ok');
        if (j == q[2]) {
          ok++;
          fb.textContent = '¡Correcto! ' + q[3];
        } else {
          b.classList.add('no');
          fb.textContent = 'Incorrecto. Respuesta: ' + q[1][q[2]] + '. ' + q[3];
        }
        ans++;
        $('#qb').style.width = (ans / Q.length) * 100 + '%';
        if (ans == Q.length)
          $('#qr').innerHTML =
            'Resultado: ' +
            ok +
            ' de ' +
            Q.length +
            (ok >= 5
              ? '. ¡Excelente!'
              : ok >= 3
                ? '. Buen avance, repasa el esquema.'
                : '. Repasa el contenido e inténtalo de nuevo.') +
            ' <button class="btn on" onclick="buildQuiz();location.hash=\'eva\'">Reintentar</button>';
      };
      d.appendChild(b);
    });
    d.appendChild(fb);
    $('#quiz').appendChild(d);
  });
}
buildQuiz();
