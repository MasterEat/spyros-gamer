(function () {
  'use strict';

  var routes = {
    '/': { page: 'home', file: 'index.html' },
    '/gaming': { page: 'gaming', file: 'gaming/index.html' },
    '/roblox': { page: 'roblox', file: 'roblox/index.html' },
    '/basketball': { page: 'basketball', file: 'basketball/index.html' },
    '/fun-zone': { page: 'fun-zone', file: 'fun-zone/index.html' },
    '/blog': { page: 'blog', file: 'blog/index.html' },
    '/about': { page: 'about', file: 'about/index.html' }
  };

  var header = document.querySelector('.site-header');
  var main = document.querySelector('main');
  if (!header || !main) return;

  /* The script URL is stable whether the site is hosted at / or /spyros-gamer/. */
  var baseUrl = new URL('../', document.currentScript.src);
  var initialMarkup = main.innerHTML;
  var initialTitle = document.title;
  var cache = { '/': { markup: initialMarkup, title: initialTitle } };
  var toggle = header.querySelector('.menu-toggle');
  var menu = header.querySelector('.mobile-nav');

  function normalizedRoute() {
    var route = location.hash.slice(1).replace(/\/+$/, '') || '/';
    return routes[route] ? route : '/';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.querySelector('.material-symbols-outlined').textContent = 'menu';
  }

  function setActivePage(page) {
    document.body.dataset.page = page;
    header.querySelectorAll('[data-page-link]').forEach(function (link) {
      if (link.dataset.pageLink === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function showRoute(route, content) {
    main.innerHTML = content.markup;
    document.title = content.title;
    setActivePage(routes[route].page);
    closeMenu();
    window.scrollTo(0, 0);
  }

  async function renderRoute() {
    var route = normalizedRoute();
    if (location.hash !== '#' + route) history.replaceState(null, '', '#' + route);
    if (cache[route]) {
      showRoute(route, cache[route]);
      return;
    }

    main.setAttribute('aria-busy', 'true');
    try {
      var response = await fetch(new URL(routes[route].file, baseUrl));
      if (!response.ok) throw new Error('Unable to load route: ' + response.status);
      var pageDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
      var pageMain = pageDocument.querySelector('main');
      if (!pageMain) throw new Error('Route has no main content');
      cache[route] = { markup: pageMain.innerHTML, title: pageDocument.title };
      showRoute(route, cache[route]);
    } catch (error) {
      main.innerHTML = '<section class="route-error"><h1>Page unavailable</h1><p>Please check your connection and try again.</p></section>';
      console.error(error);
    } finally {
      main.removeAttribute('aria-busy');
    }
  }

  toggle.addEventListener('click', function () {
    var opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    toggle.querySelector('.material-symbols-outlined').textContent = opening ? 'close' : 'menu';
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener('hashchange', renderRoute);

  renderRoute();
})();
