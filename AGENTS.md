# Agent rules — reco-demo

Canonical ship policy: `dev-guides/ai-agent-guidelines/cursor-agents/git-shipper.md` and `dev-guides/ai-agent-guidelines/agent-working-rules.md` (mục RECO).

## Layout
- Repo đổi tên từ `reco-sales-hub-demo` thành `reco-demo` (12/10/2026) để chứa demo của nhiều hệ thống RECO.
- `index.html` ở gốc chỉ là cổng chọn hệ thống. Gốc chỉ giữ cổng, README, `security-check.ps1` và cấu hình agent — **không** đặt màn demo ở gốc.
- `sales-hub/` — toàn bộ demo RECO Data-SalesHub (gd01, gd02, assets, tools, `build-artifact.mjs`, `check-all.ps1`, `shot.ps1`). Các script chạy từ chính thư mục này.
- `recohr/` — demo riêng cho RecoHR.
- Chỉ dùng đường dẫn tương đối: Pages phục vụ dưới `/reco-demo/`.

## Language
- User communication: Vietnamese
- Code, comments, commits: English

## Git / ship
- Live demo is GitHub Pages: `https://dungnt1702.github.io/reco-demo/` (Sales Hub: `/reco-demo/sales-hub/`, RecoHR: `/reco-demo/recohr/`) — it serves **`main` only**.
- When the user says **ship đi** (or `@ship`) for this demo: rebase onto `origin/main`, commit, **`git push origin main`** (no force). Do **not** leave work on an unmerged feature-branch PR.
- Account: `dungnt1702`.

## Quality gate — local only (repo không có CI)
- Runner bắt buộc `~/.claude/hooks/quality-gate.js` (`dev-guides/ai-agent-guidelines/quality-gates.md`) đọc `.quality-gates.json`: tầng `commit` (Gitleaks file staged, tự chạy qua git hook) và `pr` (Gitleaks toàn repo, cần khi merge PR vào `main`). Không có nhánh bảo vệ — luồng push thẳng `main` giữ nguyên.
- Repo không có `package.json`/npm toolchain — các trang là HTML/JS tĩnh, deploy = push thẳng `main` lên GitHub Pages, không qua bước build/bundle nào (trừ `build-artifact.mjs`, chỉ dùng riêng để đóng gói bản demo cho Claude Artifact).
- Trước khi push, chạy `.\security-check.ps1` (gitleaks + semgrep, cả hai cài global trên máy dev, không thêm dependency vào repo):
  - **Gitleaks** (secret scan): không có false positive nào tại lần chạy đầu (18/09/2026) — không cần `.gitleaks.toml`. Leak thật xuất hiện sau này → KHÔNG tự sửa, báo cho user.
  - **Semgrep** (`--config auto`, quét `sales-hub/{assets,gd01,gd02,tools}/ sales-hub/build-artifact.mjs recohr/`): baseline hiện có 8 finding legacy trong `sales-hub/assets/reco.js` (raw-html-concat dòng 255/279/326/364/1347, non-literal-regexp dòng 1209, eval-with-expression + unsafe-format-string dòng 1862-1863) — tồn tại từ trước khi cài tool, KHÔNG tự sửa hàng loạt ngoài phạm vi task đang làm; chỉ chặn finding MỚI phát sinh ở code thay đổi.
- **Không cài Biome/Knip**: repo không có `package.json`, không có ES module (`import`/`export`) hay bundler — không có gì để Knip phân tích dependency graph, và Biome sẽ đòi dựng cả một npm toolchain mới chỉ để lint vài file JS tĩnh, không tương xứng với repo ship-thẳng-main không pipeline.
- **Không áp dụng**: dependency-cruiser (không có kiến trúc phân tầng), Trivy (không container/VPS), Schemathesis (không OpenAPI), Playwright E2E thật (chỉ là các trang `_check-*.html` tự chấm bằng Chrome headless qua `check-all.ps1`, không phải flow nghiệp vụ thật).
