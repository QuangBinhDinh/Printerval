# printervalApp

Welcome to binhchili's git repo. Đọc kỹ hướng dẫn sử dụng trước khi dùng !!!

## Requirement + Install
Node version 18.6.0. Run yarn install
IOS install `cd ios && pod install``
Mac chip M dùng lệnh `cd ios && arch -x86_64 pod install`

Chạy giả lập trên android :
- Install android 12.0, 11.0
- Install CMake 3.18.1 (SDK tools)

Chạy trên XCode: version 14.0 or higher 

Install xong, 1 số lib trong node-modules cần đc fix lại :
- react-native-scrollable-tab-view: File `index.js` bỏ hàm `getNode()`
- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image/issues/943): nếu bị crash thì fix theo link 
   
## Knowledge requirement
- React & React native & Functional components
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Redux store](https://redux.js.org/introduction/getting-started)
- [Formik](https://formik.org/docs/api/useFormik) & [Yup validation](https://github.com/jquense/yup)
- [Slice function](https://redux.js.org/usage/migrating-to-modern-redux#reducers-and-actions-with-createslice)
- [RTK Query](https://redux.js.org/redux-toolkit/overview)
    
## Cấu trúc thư mục src :
- api: Thông tin config axios, constant request, debug, etc
- assets: Bao gồm ảnh (.png, .svg, etc), font, animation, etc 
- components: Các component cơ bản/reuse của app 
- constant: Hằng số 
- module: App được xây dựng dựa vào module, mỗi module sẽ phục vụ 1 chức năng cụ thể. 1 module có thể gồm nhiều screen, nhiều component khác
- navigation: Cấu trúc navigation(luồng đi) của app 
- store: Nơi lưu trữ redux store, config store + middleware 
- styles: Các styles dùng trong app 
- types: Kiểu dữ liệu được dùng nhiều
- util: Function hay sử dụng chung 

## Cấu trúc của 1 module 
1 module app gồm các thành phần cơ bản sau: 

- File `index.tsx`: Màn hình chính của module đó 
- Folder `component` : Các component được sử dụng cho module đó 
- File `service.ts` : Các service (query, mutation) được dùng cho module, giải thích sau 
- File `reducer.ts`: Lưu trữ các state dùng cho toàn bộ module (chỉ tạo khi thây cần thiết)
- File `type.ts`: Kiểu dữ liêu dùng cho module, thường là các kiểu response, request của query trong `service.ts`

Nếu module đó có nhiều screen liên quan, 1 folder `screen` nên được tạo 

    
## RTK Query: 
Trước khi hiểu về luồng call endpoint của app , đọc guide về [RTK Query](https://redux.js.org/redux-toolkit/overview) này

File `api/service.ts` tạo ra các domain để gọi endpoint tới. Hiện tại app đang call tới 3 domain => 3 base query được tạo 
Để hiểu thêm về cách xử lý data trả về success/error, đọc hàm `axiosBaseQuery`. Có thời gian thì có thể custom lại để optimal hơn 

File `api/constant.ts` sẽ có 1 trường `SERVICE_DEBUG`. Nếu muốn log ra dữ liệu trả về từ query nào thì điền vào mảng 

Mỗi module thường có file `service.ts` để inject endpoint vào. Muốn callendpoint nào thì sử dụng các hook đã được build sẵn từ đó ra 

Có 2 kiểu query được sử dụng 
- `useFetchSomethingQuerry`: đơn giản là fetch data ngay khi component mount và trả về result 
- `useLazyFetchSomethingQuerry`: Promise function , trả về data để tự xử lý. Dùng cho lazy load

1 số trường hợp sau khi fetch api cần set data vào redux store (user cart, etc, ...) thì dùng matching trong reducer để hứng data trả về
Example: `cart/reducer.ts`

Ngoài ra còn 1 số kĩ năng advanced về rtk query nữa sẽ hươngs dẫn sau 

## Sơ lược về các component hay sử dụng 
Folder `src/components` gồm sub folder sau 

- hooks: Các hook thường sử dụng. 
- input: Textinput sử dụng cho app. Có 2 loại input là text input và option input(`InputOption`). Đọc thêm về cách sử dụng input cũng như validate các trường ở file `CreateAddress.tsx`
- list: Swiper image hiển thị ảnh product 
- loading: Các component loading khi call api. Đặt component này ở màn bao quát toàn bộ screen 
- popup: Các popup thông báo dùng chung của app. Đã export thành các function để tiện sử dụng: `alertSuccess()`, `alertError()` , `showMessage()`
- product: Gồm các product card sử dụng trong các list hiển thị product. `DynamicCard` sẽ có height tuỳ biến dùng cho list dọc  còn `HorizonCard` dùng cho list ngang(`ProductRow`)
- text: Bắt buộc phải sử dụng text này do có sử dụng font cho app. Có 2 loại `TextNormal` và `TextSemiBold`. Chưa có kế hoạch thêm 
Ngoài ra còn 1 số text đặc biệt như `RadioText` dùng cho RadioButton 

- `FancyButton.tsx`: Button có animation khi nhấn đê tạo cảm giác. Có thể customize lại cho đẹp 
- `HeaderScreen.tsx`: Header dùng chung cho toàn bộ screen app 

1 số comp khác nữa tự khám phá


## Codepush command

IOS:
`appcenter codepush release-react -a binhchili/Printerval -d Staging -t '*'`
`appcenter codepush release-react -a binhchili/Printerval -d Production -t '>=1.6'` (latest version)

ANDROID:
`appcenter codepush release-react -a binhchili/Printerval-1 -d Staging -t '*'`
`appcenter codepush release-react -a binhchili/Printerval-1 -d Production -t '>=1.6'`

Credit by binhchili <br/>
Contact:  <br/>
    - dragonlava99@gmail.com (Skype)  <br/>
    - g4.terminator@gmail.com 



 
