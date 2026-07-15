/**
 * ============================================================
 * HALAOSHI HSK — SCRIPT NHẬN ĐIỂM HỌC SINH
 * ============================================================
 * HƯỚNG DẪN CÀI ĐẶT (làm 1 lần duy nhất):
 *
 * 1. Tạo 1 Google Sheet mới (sheets.google.com > Blank spreadsheet).
 * 2. Trong Sheet, vào menu Extensions > Apps Script.
 * 3. Xoá hết code mẫu, dán TOÀN BỘ nội dung file này vào.
 * 4. Bấm biểu tượng Save (đĩa mềm).
 * 5. Bấm nút "Deploy" (góc trên phải) > "New deployment".
 * 6. Bấm biểu tượng bánh răng cạnh "Select type" > chọn "Web app".
 * 7. Điền:
 *    - Description: HSK Nop Bai
 *    - Execute as: Me (tài khoản của cô)
 *    - Who has access: Anyone
 * 8. Bấm "Deploy". Google sẽ hỏi cấp quyền (Authorize access) —
 *    chọn tài khoản Google của cô, bấm "Advanced" > "Go to (tên project) (unsafe)"
 *    > "Allow". (An toàn, đây là do Google cảnh báo script tự viết,
 *    không phải app lạ.)
 * 9. Sau khi deploy xong, Google cho ra 1 đường link dạng:
 *    https://script.google.com/macros/s/AKfycb.../exec
 *    → COPY link này, dán vào biến SCRIPT_URL trong file
 *    assets/submit-helper.js (ở dự án web).
 *
 * LƯU Ý: Mỗi khi cô SỬA lại code trong Apps Script (không phải lần đầu),
 * phải bấm Deploy > Manage deployments > biểu tượng bút chì > Version: New version > Deploy
 * thì thay đổi mới có hiệu lực (link URL vẫn giữ nguyên, không đổi).
 * ============================================================
 */

// Tên các cột trong Sheet — có thể đổi thứ tự/tên nếu muốn
const HEADERS = ['Thời gian', 'Họ tên HS', 'Lớp', 'Cấp độ', 'Bài học', 'Điểm', 'Tổng điểm', 'Chi tiết'];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Nếu Sheet đang trống, tự thêm dòng tiêu đề
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.hoTen || '',
      data.lop || '',
      data.capDo || '',
      data.baiHoc || '',
      data.diem !== undefined ? data.diem : '',
      data.tongDiem !== undefined ? data.tongDiem : '',
      data.chiTiet || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Dùng để test nhanh: mở link .../exec trên trình duyệt sẽ thấy chữ "OK"
function doGet(e) {
  return ContentService.createTextOutput('OK - HSK Nop Bai script đang chạy.');
}
