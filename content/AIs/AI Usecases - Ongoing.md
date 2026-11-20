---
publish: true
created: 2026-11-17
modified: 2026-11-19T04:30:21.092Z
---

Using agent to update the new Confluence pages based on the existing pages. I used my knowledge from my PMOS vault to fill in; the agent asked me questions about milestones and risks that it didn't know.

Results are great! It saved me 1 to 2 hours compared to doing it manually.

### 2026-11-17

> [!info] Usecase
> Đã yêu cầu chatGPT (Work mode) trỏ domain hiện tại `quangnd.com` với web blog cũ sang dùng `https://quangnd.github.io/mun-digital-garden/`.

ChatGPT tự tạo Tab group mới và yêu cầu tôi đăng nhập vào Github và DNS management (Netlify) để nó có thể cấu hình DNS và thay đổi baseUrl của repo `mun-digital-garden`. (vì máy đã đăng nhập sẵn nên nó tự mở luôn)

**Evidence**

![[Attachments/Pasted image 20261118091813.png]]

**Notes**

- ChatGPT biết đang điều khiển trang nào nhờ **tiêu đề, URL và mã định danh của tab**.
- Đọc cấu trúc trang để nhận biết các mục như **Custom domain**, **Save** hay **Enforce HTTPS**.
- Chụp màn hình tab, phân biệt tab Netlify DNS với tab GitHub Pages và kiểm tra kết quả sau mỗi thay đổi.
- Lưu ý là nếu ta Show password trong trình duyệt thì nó có thể capture được nhé.

Khá là cool 😎
