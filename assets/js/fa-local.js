(function () {
  var cache = {};

  function fetchSVGData(iconClass, callback) {
    if (cache[iconClass] !== undefined) { callback(cache[iconClass]); return; }
    fetch('assets/images/icons/' + iconClass + '.svg')
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'image/svg+xml');
        var svgEl = doc.querySelector('svg');
        var pathEl = doc.querySelector('path');
        if (!svgEl || !pathEl) { cache[iconClass] = null; callback(null); return; }
        cache[iconClass] = { v: svgEl.getAttribute('viewBox'), p: pathEl.getAttribute('d') };
        callback(cache[iconClass]);
      })
      .catch(function () { cache[iconClass] = null; callback(null); });
  }

  function makeSVG(data) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    svg.setAttribute('viewBox', data.v);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.fill = 'currentColor';
    svg.style.width = '1em';
    svg.style.height = '1em';
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', data.p);
    svg.appendChild(path);
    return svg;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('i[class]').forEach(function (el) {
      var classes = el.className.split(' ').filter(Boolean);
      var iconClass = classes.find(function (c) { return /^fa-/.test(c); });
      if (!iconClass) return;

      var span = document.createElement('span');
      span.classList.add('icon', 'icon-' + iconClass);
      classes.forEach(function (c) {
        if (!/^fa[srb]?l?d?$/.test(c) && !/^fa-/.test(c)) span.classList.add(c);
      });
      if (el.hasAttribute('aria-hidden')) {
        span.setAttribute('aria-hidden', el.getAttribute('aria-hidden'));
      }
      el.parentNode.replaceChild(span, el);

      fetchSVGData(iconClass, function (data) {
        if (data) span.appendChild(makeSVG(data));
      });
    });
  });
})();
