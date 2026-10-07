/* ===== EFECTO DE LUCES LED Y BRILLOS DINÁMICOS ===== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Crear contenedor de luces LED ambientales en todo el marco de la página
  if (!document.querySelector(".marco-leds-ambientales")) {
    const marcoLeds = document.createElement("div");
    marcoLeds.className = "marco-leds-ambientales";
    marcoLeds.innerHTML = `
      <span class="led-orbe led-tl"></span>
      <span class="led-orbe led-tr"></span>
      <span class="led-orbe led-bl"></span>
      <span class="led-orbe led-br"></span>
    `;
    document.body.appendChild(marcoLeds);
  }

  // 2. Efecto de luz LED interactiva en botones (Sigue el cursor)
  const botones = document.querySelectorAll("button, .volver, a[class*='btn']");

  botones.forEach(btn => {
    if (!btn.classList.contains("btn-led")) {
      btn.classList.add("btn-led");
      const brillo = document.createElement("span");
      brillo.className = "led-brillo";
      btn.appendChild(brillo);
    }

    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty("--x-cursor", `${x}px`);
      btn.style.setProperty("--y-cursor", `${y}px`);
    });
  });
});