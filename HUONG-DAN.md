# Hướng dẫn dự án Web HSK — Tiếng Trung Halaoshi

## 1. Cấu trúc thư mục

```
hsk-web/
├── index.html                 ← Trang tổng, học sinh vào đây trước
├── apps-script-code.gs        ← Code dán vào Google Sheet (không đưa lên GitHub)
├── assets/
│   └── submit-helper.js       ← Script dùng chung để nộp điểm
├── hsk1/
│   ├── bai-01.html
│   ├── bai-06.html
│   └── ...
├── hsk2/  (trống, đang chờ nội dung)
├── hsk3/  (trống)
├── hsk4/  (trống)
├── hsk5/  (trống)
└── hsk6/
    ├── ngu-phap-hsk6-quyen-thuong.html
    └── ...
```

## 2. Cách thêm 1 bài học mới

1. Bỏ file HTML bài học vào đúng thư mục cấp độ (vd `hsk1/bai-16.html`).
2. Mở `index.html`, tìm object `lessonsData`, thêm 1 dòng vào đúng cấp độ:
   ```js
   { ten: 'Bài 16', file: 'hsk1/bai-16.html' },
   ```
3. Xong — không cần sửa gì khác, trang index tự hiện thẻ bài học mới.
4. Nếu bài đang làm dở, để `file: null` — thẻ sẽ hiện khoá 🔒 cho học sinh biết chưa mở.

## 3. Cách gắn tính năng "Nộp bài" vào 1 file bài học

Trong file bài học (vd `hsk1/bai-16.html`):

**Bước 1** — thêm dòng này trước thẻ đóng `</body>`:
```html
<script src="../assets/submit-helper.js"></script>
```
(Nếu file nằm trong thư mục con của `hsk1/`, đường dẫn `../assets/` phải trỏ đúng tới thư mục `assets` ở gốc dự án.)

**Bước 2** — trong hàm chấm điểm hiện có của bài học (tab điểm số),
gọi thêm:
```js
HalaoshiNopBai.submit({
  capDo: 'HSK1',
  baiHoc: 'Bài 16',
  diem: diemDatDuoc,      // số điểm học sinh đạt được
  tongDiem: tongSoDiem,   // tổng điểm tối đa của bài
  chiTiet: 'Từ vựng 4/5, Ngữ pháp 3/5'  // tuỳ chọn, có thể để trống ''
});
```
Lần đầu bấm nộp bài, hệ thống sẽ hỏi học sinh nhập họ tên + lớp
(chỉ hỏi 1 lần, các bài sau tự nhớ nhờ trình duyệt).

## 4. Cài đặt Google Sheet nhận điểm (làm 1 lần)

Làm theo hướng dẫn chi tiết ở đầu file `apps-script-code.gs`. Tóm tắt:

1. Tạo Google Sheet mới → Extensions → Apps Script → dán code → Deploy as Web App.
2. Copy link `.../exec` được cấp.
3. Dán link đó vào biến `SCRIPT_URL` trong `assets/submit-helper.js`.
4. Xong — mọi bài học dùng chung 1 Sheet, mỗi lần nộp bài là 1 dòng mới.

## 5. Đưa lên GitHub Pages

1. Tạo 1 repository mới trên GitHub, vd `hsk-halaoshi`.
2. Upload toàn bộ nội dung thư mục `hsk-web/` vào repo đó
   (**trừ** file `apps-script-code.gs` — file này chỉ dùng nội bộ,
   không cần thiết phải để trên GitHub, nhưng để cũng không sao vì
   không có thông tin nhạy cảm).
3. Vào Settings → Pages → chọn nhánh `main`, thư mục `/ (root)` → Save.
4. Sau vài phút, trang sẽ chạy ở địa chỉ:
   `https://<tên-tài-khoản-github>.github.io/hsk-halaoshi/`

## 6. Lưu ý quan trọng

- Mỗi khi sửa lại code Apps Script, phải **Deploy lại phiên bản mới**
  (Manage deployments → bút chì → New version) thì thay đổi mới có hiệu lực.
- `submit-helper.js` dùng `localStorage` để nhớ tên học sinh — chỉ hoạt động
  trên trình duyệt/thiết bị đó. Nếu học sinh đổi máy, sẽ được hỏi lại tên.
- File `.gs` không nên public thông tin Sheet ID hay link Sheet thật cho học sinh,
  chỉ cần học sinh dùng `index.html` là đủ.
