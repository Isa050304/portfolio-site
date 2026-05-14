// SIMPLE FADE IN

document.addEventListener("DOMContentLoaded", () => {

  const hero = document.querySelector(".hero-text");
  const cards = document.querySelectorAll(".coming-soon-card");

  hero.style.opacity = "0";
  hero.style.transform = "translateY(30px)";

  setTimeout(() => {
    hero.style.transition = "all 0.8s ease";
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  }, 200);

  cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.8s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 400 + (index * 200));

  });

});