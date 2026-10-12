# RecoHR — mô phỏng

Prototype giao diện mới của RecoHR (web + app), cùng ngôn ngữ thiết kế với Sales Hub.

Xem trực tiếp: https://dungnt1702.github.io/reco-demo/recohr/

## Các màn

| Tệp | Màn |
|---|---|
| `index.html` | Danh sách màn, mở bản web hoặc bản app |
| `khung-app.html?p=<màn>` | Xem một màn trong khung iPhone 390 × 844 |
| `dang-nhap.html` | Đăng nhập (số điện thoại / email + mật khẩu, quên mật khẩu qua email) |
| `trang-chu.html` | Trang chủ: thẻ "Hôm nay", thao tác nhanh, số liệu tháng, đơn chờ duyệt, tin nội bộ |
| `cham-cong.html` | Chấm công: vùng chấm trên bản đồ, chụp ảnh xác nhận, chấm công tiếp khách |
| `bang-cong.html` | Bảng công tháng, chi tiết từng ngày |
| `don-tu.html` | Đơn từ: số phép, lọc loại đơn, tạo đơn |
| `phe-duyet.html` | Phê duyệt cấp 1: duyệt / từ chối / chuyển tiếp, duyệt hàng loạt, hoàn tác |
| `nhan-su.html` | Danh bạ + tình trạng công hôm nay |

## Quy ước

- Mỗi màn là một trang responsive: từ 1024px là giao diện web (menu ngang), dưới 1024px là giao diện app (dock dưới, nút chấm công nổi).
- `assets/hr.css` giữ nguyên token của `sales-hub/assets/reco.css` (màu, phông, bo góc, bóng) và thêm màu trạng thái công (`--leave`, `--wfh`). Phông và ảnh dùng chung từ `../sales-hub/assets/`.
- `assets/hr.js` dựng thanh trên, dock, icon, tab, hộp thoại, toast. Dựng DOM bằng API, không dùng `innerHTML`.
- Chỉ dùng đường dẫn tương đối. GitHub Pages phục vụ repo dưới `/reco-demo/`, nên đường dẫn tuyệt đối dạng `/assets/...` sẽ hỏng.
- Tên, ảnh, email (`@reco.demo`) và số liệu đều là mô phỏng. Ngày demo cố định là thứ Hai 12/10/2026.
