import { Nullable } from './base';

export interface Product {
    id: number;
    sku: string;
    name: string;
    price: string;
    high_price: string;
    display_price: string;
    display_high_price: string;
    image_url: string;
    rating_count: number;
    rating_value: number;
    user: Seller;
    attributes: {
        multiple_design: any;
        double_sided: any;
        is_custom_design: any;

        /**
         * Input nhập ảnh custom
         */
        custom_design_image: Nullable<{ name: string }[]>;

        /**
         * Input nhập text option
         */
        custom_design_text: Nullable<string[]>;

        /**
         * Option chọn design
         */
        custom_design_option: Nullable<{ title: string; values: string[] }[]>;
    };

    variant_default: {
        /**
         * ID của variant default
         */
        id: number;

        /**
         * Variant name của biến thể
         */
        product_name: string;

        price: string;
        high_price: string;
        display_price: string;
        display_high_price: string;
        image_url: string;
    }[];
}

export interface Seller {
    id: number;
    name: string;
    email: string | null;
    image_avatar: string | null;
}

export interface ProductReview {
    id: number;
    full_name: string;
    email: string;
    title: string;
    content: string;
    target_id: number;
    status: string;
    created_at: string;
    images: string;
    rating: number;
}

export interface User {
    id: number;
    username: string | null;
    full_name: string;
    phone: string;
    image_url: string;
    email: string;
    api_token: string;
    customerId: string;
    token: string;
    gender: string;
    status: string;
}

export interface ResponseMeta {
    page_id: number;
    page_size: number;
    total_count: number;
    has_next: true;
}

export interface Post {
    id: number;
    name: string;
    description: string;
    content: string;
    image_url: string;
    updated_at: string;
    created_at: string;
    url: string;
}

export interface Slug {
    id: number;
    slug: string;

    /**
     * Phân loại slug (tag, category)
     */
    type: 'tag' | 'category' | 'color';

    /**
     * Priority lớn hơn sẽ ưu tiên navigate đến màn tương ứng
     */
    priority: number;

    /**
     * Tag/Category ID cần được navigate đến
     */
    target_id: number;
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    product_sku_id: number;
    price: number;
    quantity: number;
    configurations: string;
    created_at: string;
    updated_at: string;
    discount: number;
    product_name: string;
    image_url: string;
    display_price: string;
    high_price: string;
    name_variant: string;

    is_valid_buy_design: 0 | 1;

    is_include_design_fee: 0 | 1;

    is_custom_design: 0 | 1;
}
