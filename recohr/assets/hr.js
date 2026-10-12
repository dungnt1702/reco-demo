/* RecoHR prototype — khung trang dùng chung (thanh trên, dock, icon, tab, hộp thoại, toast).
 * Dựng DOM bằng API, không dùng innerHTML. Mỗi trang khai báo <body data-page="..."> và gọi
 * các hành vi riêng qua thuộc tính data-*.
 */
(function () {
  'use strict';

  /* ---------- Icon (nét 24px, kiểu Lucide) ---------- */
  var ICONS = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    cal: 'M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M4 10h16 M8 2v4 M16 2v4',
    doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6',
    check: 'M9 12l2 2 4-4 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    tick: 'M5 12.5l4.5 4.5L19 7.5',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    user: 'M20 21a8 8 0 0 0-16 0 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
    bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
    plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
    laptop: 'M5 5h14a1 1 0 0 1 1 1v9H4V6a1 1 0 0 1 1-1z M2 19h20',
    alert: 'M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
    plus: 'M12 5v14 M5 12h14',
    x: 'M18 6 6 18 M6 6l12 12',
    chev: 'M9 18l6-6-6-6',
    chevl: 'M15 18l-6-6 6-6',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
    finger: 'M12 11v4 M8 11a4 4 0 0 1 8 0v2 M5 12a7 7 0 0 1 14 0 M16 15c0 3-1 5-2 6 M8 15c0 2 .5 4 1.5 5.5 M12 18v3',
    wifi: 'M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0 M12 19.5h.01 M2 9a15 15 0 0 1 20 0',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16 M16 9h2a2 2 0 0 1 2 2v10 M2 21h20 M8 7h4 M8 11h4 M8 15h4',
    cake: 'M4 21v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8 M2 21h20 M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1 4 .5 M12 7v4',
    megaphone: 'M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z M17 9a4 4 0 0 1 0 6',
    arrow: 'M5 12h14 M13 6l6 6-6 6',
    mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M3 7l9 6 9-6',
    phone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M11 18h2',
    monitor: 'M3 4h18v12H3z M8 21h8 M12 16v5',
    download: 'M12 3v12 M7 10l5 5 5-5 M5 21h14',
    note: 'M4 4h16v12H8l-4 4z M8 9h8 M8 12h5',
    org: 'M9 3h6v5H9z M2 16h6v5H2z M16 16h6v5h-6z M12 8v4 M5 16v-4h14v4',
    lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
    grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4'
  };
  var SVGNS = 'http://www.w3.org/2000/svg';

  function icon(name) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'i');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', ICONS[name] || ICONS.grid);
    svg.appendChild(p);
    return svg;
  }

  /* h('a.btn', {href: 'x'}, [children]) — dựng phần tử không qua innerHTML */
  function h(sel, attrs, kids) {
    var parts = sel.split('.');
    var el = document.createElement(parts[0] || 'div');
    if (parts.length > 1) el.className = parts.slice(1).join(' ');
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-i]').forEach(function (el) {
      el.replaceWith(icon(el.getAttribute('data-i')));
    });
  }

  /* ---------- Khung trang ---------- */
  var NAV = [
    { k: 'trang-chu', t: 'Trang chủ', i: 'home' },
    { k: 'cham-cong', t: 'Chấm công', i: 'finger' },
    { k: 'bang-cong', t: 'Bảng công', i: 'cal' },
    { k: 'don-tu', t: 'Đơn từ', i: 'doc' },
    { k: 'phe-duyet', t: 'Phê duyệt', i: 'check', count: 3 },
    { k: 'nhan-su', t: 'Nhân sự', i: 'users' }
  ];
  var DOCK = ['trang-chu', 'bang-cong', 'cham-cong', 'don-tu', 'phe-duyet'];

  function navLink(item, page, cls) {
    var a = h('a' + (cls ? '.' + cls : ''), { href: item.k + '.html' });
    if (item.k === page) a.setAttribute('aria-current', 'page');
    if (cls === 'fab') {
      a.appendChild(h('span.fab-ring', {}, [icon(item.i)]));
    } else {
      a.appendChild(icon(item.i));
    }
    a.appendChild(h('span', { text: item.t }));
    if (item.count) a.appendChild(h('span.count', { text: String(item.count), 'aria-label': item.count + ' chờ duyệt' }));
    return a;
  }

  function buildShell() {
    var body = document.body;
    var page = body.getAttribute('data-page');
    if (window.self !== window.top) body.classList.add('in-frame');
    if (body.getAttribute('data-shell') === 'gallery') return;

    var note = h('div.proto-note', {}, [
      'Prototype RecoHR — dữ liệu mô phỏng. ',
      h('a', { href: 'index.html', text: 'Danh sách màn' })
    ]);

    if (body.getAttribute('data-shell') === 'none') {
      body.insertBefore(note, body.firstChild);
      return;
    }

    var nav = h('nav.nav', { 'aria-label': 'Điều hướng chính' }, NAV.map(function (n) { return navLink(n, page); }));
    var bell = h('a.icon-btn', { href: '#', 'aria-label': 'Thông báo (2 mới)', 'data-toast': 'Thông báo: 2 mục mới — mô phỏng' }, [icon('bell'), h('span.dot')]);
    var me = h('a.me', { href: '#', 'aria-label': 'Tài khoản', 'data-toast': 'Menu tài khoản — mô phỏng' }, [
      h('span.avatar.sm', {}, [h('img', { src: '../sales-hub/assets/img/avatar-lan.jpg', alt: '' })]),
      h('span.who', {}, [h('b', { text: 'Nguyễn Thu Lan' }), h('span', { text: 'Trưởng nhóm kinh doanh' })])
    ]);
    var top = h('header.topbar', {}, [
      h('div.topbar-in', {}, [
        h('a.brand', { href: 'trang-chu.html' }, [h('b', { text: 'RECO' }), h('span', { text: 'HR' })]),
        nav,
        h('div.topbar-end', {}, [bell, me])
      ])
    ]);

    var dock = h('nav.dock', { 'aria-label': 'Điều hướng app' }, DOCK.map(function (k) {
      var item = NAV.filter(function (n) { return n.k === k; })[0];
      return navLink(item, page, k === 'cham-cong' ? 'fab' : '');
    }));

    body.insertBefore(top, body.firstChild);
    body.insertBefore(note, top);
    body.appendChild(dock);
  }

  /* ---------- Toast ---------- */
  var toastBox;
  function toast(msg, undo) {
    if (!toastBox) {
      toastBox = h('div.toasts', { role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(toastBox);
    }
    var t = h('div.toast', {}, [h('span', { text: msg })]);
    if (undo) {
      var b = h('button', { type: 'button', text: 'Hoàn tác' });
      b.addEventListener('click', function () { undo(); t.remove(); });
      t.appendChild(b);
    }
    toastBox.appendChild(t);
    setTimeout(function () { t.remove(); }, 4200);
  }

  /* ---------- Đồng hồ ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tickClocks() {
    var d = new Date();
    document.querySelectorAll('[data-clock]').forEach(function (el) {
      var withSec = el.getAttribute('data-clock') === 'sec';
      el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + (withSec ? ':' + pad(d.getSeconds()) : '');
    });
  }

  /* ---------- Tab lọc: [data-tabs] > button[data-filter], mục [data-type] trong [data-tab-target] ---------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (bar) {
      var target = document.getElementById(bar.getAttribute('data-tabs'));
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        bar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var f = btn.getAttribute('data-filter');
        var shown = 0;
        target.querySelectorAll('[data-type]:not([data-gone])').forEach(function (it) {
          var hit = f === 'all' || it.getAttribute('data-type').split(' ').indexOf(f) >= 0;
          it.hidden = !hit;
          if (hit) shown++;
        });
        var empty = target.querySelector('.empty-state');
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------- Hộp thoại ---------- */
  function initDialogs() {
    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) {
        e.preventDefault();
        var dlg = document.getElementById(open.getAttribute('data-open'));
        if (dlg && dlg.showModal) dlg.showModal();
      }
      var close = e.target.closest('[data-close]');
      if (close) { e.preventDefault(); close.closest('dialog').close(); }
      if (e.target.tagName === 'DIALOG') e.target.close();
      var tt = e.target.closest('[data-toast]');
      if (tt) { e.preventDefault(); toast(tt.getAttribute('data-toast')); }
    });
  }

  window.HR = { h: h, icon: icon, toast: toast, hydrateIcons: hydrateIcons, pad: pad };

  document.addEventListener('DOMContentLoaded', function () {
    buildShell();
    hydrateIcons();
    initTabs();
    initDialogs();
    tickClocks();
    setInterval(tickClocks, 1000);
  });
})();
