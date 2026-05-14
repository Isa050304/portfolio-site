document.addEventListener("DOMContentLoaded", function () {
  // Mensaje bonito al cargar la página
  console.log("Welcome Isa 💜 your portfolio is live!");

  // Animación simple: fade-in al cargar
  const sections = document.querySelectorAll("section");

  sections.forEach((section, index) => {
    section.style.opacity = 0;
    section.style.transform = "translateY(20px)";

    setTimeout(() => {
      section.style.transition = "all 0.6s ease";
      section.style.opacity = 1;
      section.style.transform = "translateY(0)";
    }, 200 * index);
  });
});