# NIHONGO_ITSS_KOHI_TABI_FE
日本語　アイティエスエスのプロジェクトである　KOHI TABI と　言う。

# hướng dẫn cách chạy dự án này:
- tương tự như bên BE, NodeJS được sử dùng là ở phiên bản 14.18.0
- tạo một file .env với nội dung tương tự file .env.example, điền thông tin mình muốn vào
- xong thì nhấn npm install để cài những thư viện cần thiết và npm start để chạy thôi:))
# giải thích cấu trúc thư mục của dự án
- assets:
    * chứa những mục được public như ảnh, logo,...
- components:
    * chứa những components được code sẵn như component lịch, thanh cuộn ngang dọc, thanh navigator,...
    * nhưng Đức chả dùng cái này bao giờ vì giao diện nó hơi xấu:))
- containers:
    * chứa các component giao diện
- routes:
    * khai báo đường link các trang mà website này có
- services:
    * dùng axios để gọi api phía server
- store:
    * redux (một dạng lưu trạng thái của toàn bộ website như web đã được đăng nhập hay chưa, người dùng hiện tại của web là ai?)
- styles:
    * styles chung của web như title thì màu gì, kích cỡ của container so với toàn màn hình,...
- translations:
    * hỗ trợ đa ngôn ngữ
- utils:
    * không biết giải thích ntn:)) mn cx ko cần quan tâm đến thư mục này:))
- còn lại là các file môi trường và thư viện
