/* Trang so sánh "Hiện tại / Đề xuất" — dựng khung thiết bị và đọc kết quả đo màn đầu.
 *
 * Mỗi ô `[data-frame]` khai báo: data-src (trang khung), data-v (cu | moi), data-w, data-h,
 * data-scale (tỉ lệ tối đa, mặc định 1). Trang khung tự đo các phần tử mang `data-fold` rồi
 * gửi về bằng postMessage — cách này chạy cả khi mở thẳng file:// (iframe khác origin).
 * Nút `[data-tt]` đổi trạng thái màn của mọi khung cùng lúc và ghi vào URL (?tt=…).
 */
(function () {
  'use strict';

  var cells = [].slice.call(document.querySelectorAll('[data-frame]'));
  var pills = [].slice.call(document.querySelectorAll('[data-tt]'));

  function currentState() {
    var want = new URLSearchParams(location.search).get('tt');
    var known = pills.map(function (p) { return p.getAttribute('data-tt'); });
    return known.indexOf(want) >= 0 ? want : (known[0] || '');
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function frameUrl(cell, tt) {
    return cell.getAttribute('data-src') + '?v=' + encodeURIComponent(cell.getAttribute('data-v')) +
      '&tt=' + encodeURIComponent(tt);
  }

  function fit(cell) {
    var w = Number(cell.getAttribute('data-w')), h = Number(cell.getAttribute('data-h'));
    var max = Number(cell.getAttribute('data-scale') || 1);
    var room = cell.clientWidth;
    var s = Math.min(max, room / w);
    cell._stage.style.width = Math.round(w * s) + 'px';
    cell._stage.style.height = Math.round(h * s) + 'px';
    cell._frame.style.transform = 'scale(' + s + ')';
  }

  function paintWaiting(list) {
    list.textContent = '';
    list.appendChild(el('li', 'wait', 'Đang đo màn đầu…'));
  }

  cells.forEach(function (cell) {
    var w = cell.getAttribute('data-w'), h = cell.getAttribute('data-h');
    var isNew = cell.getAttribute('data-v') === 'moi';
    var head = el('div', 'cmp-cell-head');
    head.appendChild(el('span', 'cmp-tag' + (isNew ? ' is-new' : ''), isNew ? 'Đề xuất' : 'Hiện tại'));
    head.appendChild(el('span', 'cmp-size', w + ' × ' + h + (cell.getAttribute('data-note') ? ' · ' + cell.getAttribute('data-note') : '')));
    var stage = el('div', 'cmp-stage');
    var frame = document.createElement('iframe');
    frame.width = w;
    frame.height = h;
    frame.loading = 'lazy';
    frame.title = (isNew ? 'Đề xuất' : 'Hiện tại') + ' ở khung ' + w + ' × ' + h;
    stage.appendChild(frame);
    var list = el('ul', 'cmp-fold');
    list.setAttribute('aria-live', 'polite');
    cell.appendChild(head);
    cell.appendChild(stage);
    cell.appendChild(list);
    cell._stage = stage;
    cell._frame = frame;
    cell._list = list;
    fit(cell);
  });

  function load(tt) {
    cells.forEach(function (cell) {
      paintWaiting(cell._list);
      cell._frame.src = frameUrl(cell, tt);
    });
    pills.forEach(function (p) {
      p.setAttribute('aria-pressed', String(p.getAttribute('data-tt') === tt));
    });
  }

  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      var tt = p.getAttribute('data-tt');
      var url = new URL(location.href);
      url.searchParams.set('tt', tt);
      history.replaceState(null, '', url);
      load(tt);
    });
  });

  window.addEventListener('message', function (e) { // nosemgrep: insufficient-postmessage-origin-validation (origin checked below)
    /* Chỉ nhận từ trang khung cùng nguồn và đúng một khung đã dựng. Mở bằng file:// thì origin
       của khung là "null" hoặc "file://" tuỳ trình duyệt. */
    var local = location.protocol === 'file:' && (e.origin === 'null' || e.origin === 'file://');
    if (e.origin !== location.origin && !local) return;
    var data = e.data;
    if (!data || data.type !== 'reco-fold' || !Array.isArray(data.items)) return;
    var cell = cells.filter(function (c) { return c._frame.contentWindow === e.source; })[0];
    if (!cell) return;
    var list = cell._list;
    list.textContent = '';
    data.items.forEach(function (it) {
      var li = el('li');
      li.appendChild(el('span', 'st ' + (it.inView ? 'ok' : 'bad'),
        it.inView ? 'Trong màn đầu' : 'Ngoài màn đầu'));
      li.appendChild(el('span', '', it.label + ' — y = ' + it.y + ' px' + (it.inView ? '' : ' (màn cao ' + data.vh + ')')));
      list.appendChild(li);
    });
  });

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) {
      entries.forEach(function (en) { fit(en.target); });
    });
    cells.forEach(function (c) { ro.observe(c); });
  } else {
    window.addEventListener('resize', function () { cells.forEach(fit); });
  }

  load(currentState());
})();
