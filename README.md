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
# hướng dẫn tạo một component mới
- đầu tiên vào App.js để khai báo route mình muốn tạo, kèm theo component mà mình muốn render, ví dụ Đức trích câu lệnh sau ở trong App.js:
    * <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
    * giải thích:
        - Route cũng là một thẻ
        - path là đường link của route đó, ở ví dụ thì path là {path.SYSTEM}, không phải là dạng cú pháp /.../.../... tại vì nó đã được tham chiếu ở file constant.js và đoạn lệnh đó là 
        export const path = {
            HOME: '/',
            LOGIN: '/login',
            LOG_OUT: '/logout',
            SYSTEM: '/system'   //đây chính nó
        };
        hàm này đã export ra cho những file khác rằng nếu ghi path.SYSTEM thì sẽ được hiểu là đường link /system, tất nhiên ở đâu muốn sử dụng thì cũng cần import
        - tiếp theo là component mà đường link này sẽ render ra, tên của component chính là userIsAuthenticated, đây là một component đặc biệt vì nó cần phải xác thực là đã có ai đăng nhập vào chưa thì mới render, nhưng những component đơn giản như homePage, có thể truy cập mà không cần phải đăng nhập thì đoạn lệnh trên có thể là <Route path={path.HOMEPAGE} component={homePage} />, với component homePage được import từ trong containers
- tiếp theo là tạo component homePage trong containers, có thể tạo thêm thư mục trong đó để chứa cả file .js và .scss (file .scss sẽ cho mn code theo class cha con, class con ở trong class cha chứ không như file .css thông thường)
- ở trong một component, sẽ có:
    * class
    * trong class có
        - constructor: khai báo state của component
        - hàm componentDidMount
        - hàm componentDidUpdate
        - hàm render
        - và các hàm xử lý sự kiện
        - vòng đời của một component như sau:
            * render -> componentDidMount -> componentDidUpdate -> render
            * và mỗi khi state của component bị thay đổi, component đó sẽ được render lại
    * mapStateToProps để lấy dữ liệu từ redux
    * mapDispatchToProps để có thể sử dụng hàm mà lấy dữ liệu từ backend để lưu vào redux
