# printervalApp

Welcome to binhchili's git repo. Đọc kỹ hướng dẫn sử dụng trước khi dùng !!!

### Requirement + Install : 
    Node version 18.6.0. Run npm install . Nếu lỗi run npm install --force <br/>
    Hiện tại app có 1 lib tự config trong node_module nếu không sẽ bị crash app (react-native-scrollable-tab-view), 
    sẽ gây crash khi vào màn Order ở phần User. Contact để được hướng dẫn  <br/>
    <br/>
    Chạy giả lập trên android :<br/>
        - Install android 12.0, 11.0<br/>
        - Install CMake 3.18.1 (SDK tools)<br/>
    Chạy trên XCode: version 13.2 or higher <br/>

### NOTE: Fix 1 số thư viện trong node modules
    React Native Fast Image : Sửa lại file podspec theo link bug này https://github.com/DylanVann/react-native-fast-image/issues/943
    React Native Apps Flyer: Cài lại version mới nhất. Link bug : https://github.com/AppsFlyerSDK/appsflyer-android-app/issues/20
    
### Cấu trúc thư mục src :
```
    - API: cấu hình DOMAIN, axios, các hàm chung get, post , middleware, blah blah, ...
    - Assets: lưu trữ animation, image (png , svg ,...)
    - Components
    - Constants
    - Modules: folder chứa các màn hình cùng làm 1 chức năng trong app 
    - Navigation: react navigation của app , xử lý routing 
    - Store: redux store ,
    - Styles: define các màu , font 
    - Util: hàm tiện ích 
```
    
Trong folder modules chứa các folder con . Mỗi folder con này thường gồm các thành phần chung sau :
```
    - index.js/tsx : Main file dùng để export, chứa UI của màn hình chính chức năng 
    - component: File lưu trữ các componen con dùng trong module (cân nhắc chuyển sang folder sau này )
    - service: File lưu trữ các hàm api ( bao gồm middleware )
    - reducer: Lưu trữ thông tin (state) của module 
    - Custom hook ( use...) : Các hàm logic cho UI , xử lý data khi call api (chỉ tách ra khi quá dài hay nhiều data)
```
### Addtional note: 
Giải thích về cách tổ chức redux store của app :
```
    Src có 1 folder store, bao gồm các file sau:
    - index.js: RootStore - export cho Provider ( ở file App.js bên ngoài )
    - middleware: Các middleware của redux-thunk. Hiện tại chỉ có 1 middleware log ra thời gian xử lý các action dispatch (có thể bỏ)
    - reducers: RootReducer, state chung của toàn bộ app, lưu trữ các reducer nhỏ hơn 
    - 1 số reducer dùng chung : ApiReducer, ThemeReducer, CountryReducer 
```

Giải thích về cách dispatch 1 action trong store (để biết rõ hơn search redux-thunk) .Có 2 loại dispatch :
```
    1. Dispatch 1 action thông thường 
    - Thông tin các action này sẽ được lưu trữ ở file reducer của từng module (vào folder module để xem thêm)
    - 1 file reducer sẽ được tạo bảo hàm createSlice (đọc thêm redux-thunk), bao gồm initialState, các hàm để set state (được export )
    - Sử dùng các hàm : 
        const dispatch = useDispatch();
        const {action1, action2 } = cart.actions //import cart từ reducer 
        dispatch(action1(param)) // dispatch action 

    2. Dispatch 1 action để call api (dispatch async function)
    - Các hàm để call api trong file service của module.
    - Sử dụng các hàm được define(createGet, createPost, ....) để tạo 1 hàm trả về 1 async function 
    - Gọi dispatch call api
        import {service1} from './service' 
        dispatch(service1(params))
```
   
   Muốn biết các hàm middleware trong phần này xử lý như thế nào, đọc file src/api/dispatch.js hay contact binhchili để được hương dẫn <br/>

Cách check log khi dispatch action :
```
    - Khi đang debug trên giả lập android , nhấn tổ hợp (MAC) cmd + D , nhấn open Debugger sẽ mở Chrome 
    - 1 action call api sẽ có 3 status : 
        BEGIN_fetch_sth: bắt đầu call api, sẽ log ra url sắp call + param (xem trong payload của action)
        fetch_sth_SUCCESS: call api thành công ,sẽ log ra data trả về (điều kiện thành công khi data.status = 'success')
        fetch_sth_FAIL: không thoả mãn điều kiện trên 
    - 1 action set thông thường chỉ log ra 1 dòng SET_doing_sth , bao gồm payload 
    - Check action and reducer của API trong folder: src/store/api 
```

### Codepush command
```
    IOS:
    appcenter codepush release-react -a binhchili/Printerval -d Staging -t '*'
    appcenter codepush release-react -a binhchili/Printerval -d Production -t '>=1.6' (latest version)

    ANDROID:
    appcenter codepush release-react -a binhchili/Printerval-1 -d Staging -t '*'
    appcenter codepush release-react -a binhchili/Printerval-1 -d Production -t '>=1.6'
```
<br/>
<br/>
Credit by binhchili <br/>
Contact:  <br/>
    - dragonlava99@gmail.com (Skype)  <br/>
    - g4.terminator@gmail.com 



 
