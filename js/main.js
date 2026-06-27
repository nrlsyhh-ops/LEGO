const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const revealItems = document.querySelectorAll('.reveal');

const closeMenu = () => {
  navToggle?.classList.remove('is-open');
  navMenu?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('is-open');
  navMenu?.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) closeMenu();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const syncHeaderShadow = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 6);
};

syncHeaderShadow();
window.addEventListener('scroll', syncHeaderShadow, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const navSearchButton = document.querySelector('.icon-button--search');
const wishlistButton = document.querySelector('.icon-button[aria-label="Wishlist"]');
const shoppingBagButton = document.querySelector('.icon-button[aria-label="Shopping bag"]');

const popupOverlay = document.createElement('div');
popupOverlay.className = 'action-popup-overlay';
popupOverlay.setAttribute('aria-hidden', 'true');

popupOverlay.innerHTML = `
  <div class="action-popup" role="dialog" aria-modal="true" aria-labelledby="action-popup-title">
    <div class="action-popup__header">
      <h2 class="action-popup__title" id="action-popup-title"></h2>
      <button class="action-popup__close" type="button" aria-label="Close popup">×</button>
    </div>
    <div class="action-popup__body"></div>
  </div>
`;

document.body.appendChild(popupOverlay);

const popupTitle = popupOverlay.querySelector('.action-popup__title');
const popupBody = popupOverlay.querySelector('.action-popup__body');
const popupClose = popupOverlay.querySelector('.action-popup__close');

const closePopup = () => {
  popupOverlay.classList.remove('is-open');
  popupOverlay.setAttribute('aria-hidden', 'true');
};

const openPopup = (title, bodyHtml) => {
  popupTitle.textContent = title;
  popupBody.innerHTML = bodyHtml;
  popupOverlay.classList.add('is-open');
  popupOverlay.setAttribute('aria-hidden', 'false');

  const searchInput = popupBody.querySelector('input');
  if (searchInput) {
    searchInput.focus();
  } else {
    popupClose.focus();
  }
};

navSearchButton?.addEventListener('click', (event) => {
  event.preventDefault();

  openPopup(
    'Search products',
    `
      <form class="action-popup__search" role="search">
        <input
          type="search"
          name="product-search"
          placeholder="Search LEGO products..."
          aria-label="Search LEGO products"
        />
        <button type="submit">Search</button>
      </form>
    `
  );
});

wishlistButton?.addEventListener('click', (event) => {
  event.preventDefault();
  openPopup('Favourites', '<p>You haven’t added any favourites yet.</p>');
});

shoppingBagButton?.addEventListener('click', (event) => {
  event.preventDefault();
  openPopup('Shopping bag', '<p>You haven’t added anything in your bag yet. Your bag is empty.</p>');
});

popupClose?.addEventListener('click', closePopup);

popupOverlay.addEventListener('click', (event) => {
  if (event.target === popupOverlay) closePopup();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePopup();
});
