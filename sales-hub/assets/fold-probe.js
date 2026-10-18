/* Đo "màn đầu" cho trang khung của bản so sánh đề xuất (assets/compare.js).
 *
 * Phần tử mang `data-fold="Nhãn"` được đo vị trí trên trang (y tính từ đầu trang, chưa cuộn).
 * Nhiều phần tử cùng nhãn thì lấy phần tử đang hiện và nằm cao nhất. Phần tử nằm trong khối
 * `[data-fixed]` (thanh dính đáy) đo theo khung nhìn. Thứ tự nhãn theo `data-fold-labels` của body.
 * Kết quả gửi lên trang cha bằng postMessage; mở riêng trang khung thì không làm gì thêm.
 */
(function () {
  'use strict';
  if (window.parent === window) return;

  function visible(n) {
    if (n.closest('[hidden]')) return false;
    /* Nội dung của <details> đang đóng vẫn có hộp layout trong Chrome — không tính là đang hiện. */
    var shut = n.closest('details:not([open])');
    if (shut && !n.closest('summary')) return false;
    var r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function measure() {
    var vh = window.innerHeight;
    var order = (document.body.getAttribute('data-fold-labels') || '').split('|').filter(Boolean);
    var best = {};
    [].slice.call(document.querySelectorAll('[data-fold]')).forEach(function (n) {
      if (!visible(n)) return;
      var label = n.getAttribute('data-fold');
      var r = n.getBoundingClientRect();
      var fixed = !!n.closest('[data-fixed]');
      var top = Math.round(fixed ? r.top : r.top + window.scrollY);
      var bottom = Math.round(fixed ? r.bottom : r.bottom + window.scrollY);
      if (!best[label] || top < best[label].y) {
        best[label] = { label: label, y: top, inView: top >= 0 && bottom <= vh };
      }
      if (order.indexOf(label) < 0) order.push(label);
    });
    var items = order.filter(function (l) { return best[l]; }).map(function (l) { return best[l]; });
    /* Chỉ là số đo bố cục, không có dữ liệu. Mở bằng file:// thì trang không có origin dùng được
       — khi đó postMessage chỉ nhận '*'; trên GitHub Pages gửi đúng origin của trang. */
    var target = location.protocol === 'file:' ? '*' : location.origin;
    window.parent.postMessage({ type: 'reco-fold', vh: vh, items: items }, target); // nosemgrep: wildcard-postmessage-configuration
  }

  var timer = 0;
  function soon() {
    clearTimeout(timer);
    timer = setTimeout(measure, 60);
  }

  window.addEventListener('load', soon);
  window.addEventListener('resize', soon);
  document.addEventListener('toggle', soon, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  window.recoFoldMeasure = soon;
})();
