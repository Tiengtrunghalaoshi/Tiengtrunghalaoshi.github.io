/**
 * ============================================================
 * HALAOSHI HSK — SUBMIT HELPER
 * ============================================================
 * File này dùng chung cho MỌI file bài học (HSK1 → HSK6).
 * Chỉ cần thêm 1 dòng vào file bài học:
 *   <script src="../assets/submit-helper.js"></script>
 * (đường dẫn "../assets/" tuỳ vị trí file bài học so với thư mục assets)
 *
 * Sau đó trong code chấm điểm của bài học, gọi:
 *   HalaoshiNopBai.submit({
 *     capDo: 'HSK1',
 *     baiHoc: 'Bài 14',
 *     diem: 8,
 *     tongDiem: 10,
 *     chiTiet: 'Từ vựng: 4/5, Ngữ pháp: 4/5'   // tuỳ chọn
 *   });
 * ============================================================
 */

const HalaoshiNopBai = (function () {

  // ⚠️ DÁN LINK APPS SCRIPT CỦA CÔ VÀO ĐÂY (sau khi Deploy xong)
  const SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  const STORAGE_KEY = 'halaoshi_hocsinh_info';

  function getHocSinhInfo() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function saveHocSinhInfo(info) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch (e) { /* ignore */ }
  }

  // Hỏi tên + lớp học sinh (chỉ hỏi 1 lần, lần sau tự nhớ)
  function hoiThongTinHocSinh() {
    return new Promise((resolve) => {
      let info = getHocSinhInfo();
      if (info && info.hoTen) {
        resolve(info);
        return;
      }
      const hoTen = prompt('Em vui lòng nhập họ tên:');
      const lop = prompt('Em học lớp nào?') || '';
      info = { hoTen: hoTen || 'Không rõ tên', lop };
      saveHocSinhInfo(info);
      resolve(info);
    });
  }

  // Cho phép đổi lại tên/lớp nếu nhập sai
  function doiThongTinHocSinh() {
    localStorage.removeItem(STORAGE_KEY);
    return hoiThongTinHocSinh();
  }

  async function submit({ capDo, baiHoc, diem, tongDiem, chiTiet = '' }) {
    if (SCRIPT_URL.indexOf('PASTE_YOUR') !== -1) {
      console.warn('[HalaoshiNopBai] Chưa cấu hình SCRIPT_URL trong submit-helper.js');
      alert('Chức năng nộp bài chưa được cấu hình. Vui lòng báo cho giáo viên.');
      return { ok: false, reason: 'not_configured' };
    }

    const info = await hoiThongTinHocSinh();

    const payload = {
      hoTen: info.hoTen,
      lop: info.lop,
      capDo,
      baiHoc,
      diem,
      tongDiem,
      chiTiet
    };

    try {
      // no-cors: Apps Script không trả về header CORS cho phép đọc response,
      // nhưng request vẫn được gửi và Sheet vẫn ghi nhận bình thường.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      return { ok: true, info };
    } catch (err) {
      console.error('[HalaoshiNopBai] Lỗi khi nộp bài:', err);
      return { ok: false, reason: 'network_error', error: err };
    }
  }

  return {
    submit,
    hoiThongTinHocSinh,
    doiThongTinHocSinh,
    getHocSinhInfo
  };
})();
