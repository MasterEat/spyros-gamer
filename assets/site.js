(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var page = document.body.dataset.page || 'home';
  header.querySelectorAll('[data-page-link]').forEach(function (link) {
    if (link.dataset.pageLink === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  var toggle = header.querySelector('.menu-toggle');
  var menu = header.querySelector('.mobile-nav');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.material-symbols-outlined').textContent = 'menu';
  }

  toggle.addEventListener('click', function () {
    var opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.querySelector('.material-symbols-outlined').textContent = opening ? 'close' : 'menu';
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });
})();
