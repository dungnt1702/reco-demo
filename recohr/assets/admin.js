/* RecoHR Admin prototype — khung quản trị: thanh bên, thanh trên, command palette (Ctrl+K).
 * Nhóm menu bám MENU_GROUPS + MENU_3_LEVEL trong recohr-web/config/urls.py.
 * Dùng HR.h / HR.icon / HR.toast từ hr.js (nạp trước). Không dùng innerHTML.
 */
(function () {
  'use strict';
  var h, icon;

  var MENU = [
    { g: 'Tổng quan', i: 'grid', items: [['tong-quan', 'Bảng điều khiển', 'quan-tri.html']] },
    { g: 'Quản lý nhân sự', i: 'users', items: [
      ['tai-khoan', 'Tài khoản người dùng', 'qt-tai-khoan.html', '48'],
      ['', 'Văn phòng & phòng ban'], ['', 'Hợp đồng lao động', '', '3', 'hot'],
      ['', 'Duyệt thay đổi hồ sơ', '', '2', 'hot'], ['', 'Loại nhân sự & chức danh'], ['', 'Tuyển dụng']] },
    { g: 'Chấm công & điểm danh', i: 'finger', items: [
      ['', 'Địa điểm chấm công'], ['', 'Ca làm việc & phân ca'], ['', 'Quy tắc chấm công'], ['', 'Vi phạm & phạt công']] },
    { g: 'Đơn từ', i: 'doc', items: [
      ['', 'Loại vắng mặt & luồng duyệt'], ['', 'Công tác'], ['', 'Chính sách & chỉ thị WFH']] },
    { g: 'Phê duyệt & thông báo', i: 'bell', items: [
      ['', 'Quy trình phê duyệt'], ['', 'Cấu hình thông báo'], ['', 'Quản lý email']] },
    { g: 'Nội dung & sự kiện', i: 'megaphone', items: [['', 'Tin nội bộ'], ['', 'Sự kiện']] },
    { g: 'Hỗ trợ & hướng dẫn', i: 'help', items: [['', 'Hướng dẫn sử dụng'], ['', 'Câu hỏi thường gặp'], ['', 'Yêu cầu hỗ trợ', '', '4'], ['', 'Góp ý người dùng']] },
    { g: 'Cấu hình & hệ thống', i: 'gear', items: [
      ['vai-tro', 'Vai trò & phân quyền', 'qt-vai-tro.html'],
      ['cau-hinh', 'Module & cấu hình', 'qt-cau-hinh.html'],
      ['nhat-ky', 'Nhật ký kiểm toán', 'qt-nhat-ky.html'],
      ['', 'Tích hợp Sales Hub'], ['', 'Bảo mật: phiên & 2FA'], ['', 'Tác vụ tự động']] }
  ];

  function buildSide(page) {
    var scroll = h('div.side-scroll');
    MENU.forEach(function (grp, gi) {
      var hasCurrent = grp.items.some(function (it) { return it[0] === page; });
      var wrap = h('div.side-group', { 'aria-expanded': String(hasCurrent || gi < 3) });
      var btn = h('button', { type: 'button' }, [icon(grp.i), h('span', { text: grp.g }), (function () { var c = icon('chev'); c.classList.add('chev'); return c; })()]);
      btn.addEventListener('click', function () { wrap.setAttribute('aria-expanded', String(wrap.getAttribute('aria-expanded') !== 'true')); });
      var ul = h('ul');
      grp.items.forEach(function (it) {
        var a = h('a', { href: it[2] || '#' }, [h('span', { text: it[1] })]);
        if (!it[2]) a.setAttribute('data-toast', it[1] + ' — chưa có trong bản demo');
        if (it[0] && it[0] === page) a.setAttribute('aria-current', 'page');
        if (it[3]) a.appendChild(h('span.n' + (it[4] ? '.hot' : ''), { text: it[3] }));
        ul.appendChild(h('li', {}, [a]));
      });
      wrap.appendChild(btn);
      wrap.appendChild(ul);
      scroll.appendChild(wrap);
    });
    var side = h('aside.side-nav', { id: 'side', 'aria-label': 'Menu quản trị' }, [
      h('div.side-head', {}, [h('a.brand', { href: 'quan-tri.html' }, [h('b', { text: 'RECO' }), h('span', { text: 'HR' })]), h('span.tag', { text: 'Quản trị' })]),
      h('button.side-search', { type: 'button', 'data-palette': '' }, [icon('search'), h('span', { text: 'Tìm nhanh…' }), h('kbd', { text: 'Ctrl K' })]),
      scroll,
      h('div.side-foot', {}, [
        h('a', { href: 'trang-chu.html' }, [icon('home'), h('span', { text: 'Về trang nhân viên' })]),
        h('a', { href: 'index.html' }, [icon('grid'), h('span', { text: 'Danh sách màn demo' })])
      ])
    ]);
    return side;
  }

  function buildTop(crumbs) {
    var c = h('nav.crumbs', { 'aria-label': 'Vị trí' });
    crumbs.forEach(function (cr, i) {
      if (i) c.appendChild(icon('chev'));
      var last = i === crumbs.length - 1;
      var el = last ? h('b', { text: cr[0] }) : h('a', { href: cr[1] || 'quan-tri.html', text: cr[0] });
      if (!last && i > 0) el.classList.add('c-mid');
      c.appendChild(el);
    });
    var burger = h('button.icon-btn.burger', { type: 'button', 'aria-label': 'Mở menu', 'aria-controls': 'side' }, [icon('grid')]);
    return h('header.adm-top', {}, [
      burger, c,
      h('div.end', {}, [
        h('button.icon-btn', { type: 'button', 'aria-label': 'Tìm nhanh (Ctrl K)', 'data-palette': '' }, [icon('search')]),
        h('a.icon-btn', { href: '#', 'aria-label': 'Thông báo hệ thống', 'data-toast': 'Trung tâm thông báo — mô phỏng' }, [icon('bell'), h('span.dot')]),
        h('a.me', { href: '#', 'data-toast': 'Menu tài khoản — mô phỏng' }, [
          h('span.avatar.sm', {}, [h('img', { src: '../sales-hub/assets/img/avatar-thuha.jpg', alt: '' })]),
          h('span.who', {}, [h('b', { text: 'Đỗ Thu Hà' }), h('span', { text: 'Quản trị hệ thống' })])
        ])
      ])
    ]);
  }

  function buildPalette() {
    var all = [];
    MENU.forEach(function (g) { g.items.forEach(function (it) { all.push({ t: it[1], g: g.g, href: it[2] }); }); });
    [['Nguyễn Thu Lan', 'Tài khoản', 'qt-tai-khoan-sua.html'], ['Thêm tài khoản mới', 'Thao tác', 'qt-tai-khoan-sua.html'],
     ['Xuất danh sách tài khoản (Excel)', 'Thao tác', ''], ['Bật/tắt cờ tính năng', 'Thao tác', 'qt-cau-hinh.html#co']].forEach(function (x) {
      all.push({ t: x[0], g: x[1], href: x[2] });
    });
    var input = h('input', { type: 'search', placeholder: 'Gõ để tìm trang, người, thao tác…', 'aria-label': 'Tìm nhanh' });
    var list = h('ul', { role: 'listbox' });
    var dlg = h('dialog.palette', { 'aria-label': 'Tìm nhanh' }, [h('div.pin', {}, [icon('search'), input, h('kbd', { text: 'Esc' })]), list]);
    function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase(); }
    function render() {
      while (list.firstChild) list.removeChild(list.firstChild);
      var q = norm(input.value.trim());
      var hits = all.filter(function (x) { return !q || norm(x.t + ' ' + x.g).indexOf(q) >= 0; }).slice(0, 12);
      if (!hits.length) list.appendChild(h('li.ph', { text: 'Không có kết quả' }));
      hits.forEach(function (x, i) {
        var a = h('a' + (i === 0 ? '.on' : ''), { href: x.href || '#' }, [icon(x.g === 'Tài khoản' ? 'user' : x.g === 'Thao tác' ? 'arrow' : 'doc'), h('b', { text: x.t }), h('span', { text: x.g })]);
        if (!x.href) a.setAttribute('data-toast', x.t + ' — mô phỏng');
        list.appendChild(h('li', {}, [a]));
      });
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var a = list.querySelector('a.on'); if (a) a.click(); }
    });
    document.body.appendChild(dlg);
    function open() { input.value = ''; render(); dlg.showModal(); input.focus(); }
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-palette]')) { e.preventDefault(); open(); }
      if (e.target === dlg) dlg.close();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    h = HR.h; icon = HR.icon;
    var body = document.body;
    var page = body.getAttribute('data-page');
    var crumbs = JSON.parse(body.getAttribute('data-crumbs') || '[["Quản trị"]]');
    var main = document.querySelector('main.adm-body');
    var side = buildSide(page);
    var scrim = h('div.side-scrim', { hidden: '' });
    var col = h('div.adm-main', {}, [buildTop(crumbs)]);
    main.parentNode.insertBefore(h('div.adm', {}, [side, col]), main);
    col.appendChild(main);
    body.appendChild(scrim);
    body.insertBefore(h('div.proto-note', {}, ['Prototype RecoHR Admin — dữ liệu mô phỏng. ', h('a', { href: 'index.html', text: 'Danh sách màn' })]), body.firstChild);
    function toggle(on) { side.classList.toggle('open', on); scrim.hidden = !on; }
    col.querySelector('.burger').addEventListener('click', function () { toggle(true); });
    scrim.addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    buildPalette();
    HR.hydrateIcons();
  });
})();
