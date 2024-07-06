const mobileNavCta = document.querySelector(`.mobile-nav-cta`);
const mobileNavLinks = document.querySelector(`.mobile-nav-links`);

mobileNavCta.addEventListener(`click`, function onMobileNavCtaClicked() {
  mobileNavCta.classList.toggle(`menu-closed`);
  mobileNavLinks.classList.toggle(`menu-closed`);
});
