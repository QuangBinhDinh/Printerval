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

export interface Country {
    id: number;
    iso: string;
    name: string;
    value: string;
    nicename: string;
    numcode: number;
    phonecode: number;
    has_postal_code: number;

    provinces: Province[];
}

export interface Province {
    id: number;
    name: string;
    country_id: number;
    value: string;
}

export interface ShippingAddress {
    address: string;
    city_name: string;
    country?: Nullable<Country>;
    country_id?: Nullable<number>;

    full_name: string;
    id: number;
    optional_address: string;
    phone: string | number;

    province?: Nullable<Province>;
    province_id?: Nullable<number>;
    zip_code: string;
}

export interface BillingAddress {
    name: string;
    address: string;
    country: string | number;
    country_name: string;
    state_name?: string;
    city_name: string;
    zip_code: string;
    optional_address?: string;
    //province: any;
}

export interface ShipInfo {
    /**
     *Id của item trong cart (thuộc 1 loại shipping)
     */
    cart_item_id: number[];

    key: string;

    /**
     *Cart list (1 loại ship)
     */
    cart_list: CartItem[];

    /**
     * Thông tin các loại hình thức ship
     */
    shipping_info: ShipMethod[];
}

/**
 * Thông tin phương thức ship
 */
export interface ShipMethod {
    apply_config_item: {
        [key: number]: {
            id: number;
            warehouse_config_id: number;
            default_adding_item: string;
            default_shipping_fee: string;
            fee_if_limit: string;
            fee_limit: string;
            tax: string;
            shipping_max_time: number;
            shipping_min_time: number;
        };
    };
    id: number;
    shipping_fee: number;
    shipping_max_time: number;
    shipping_min_time: number;
    name_shipping: string;
    type: string;
    location: string;

    /**
     * Thời gian dự kiến ship nhanh nhất
     */
    min_date: string;

    /**
     * Thời gian dự kiến ship muộn nhất
     */
    max_date: string;
}

export interface SizeGuide {
    id: number;
    parent_id: number;
    title: string;
    value: string;

    display_name: string;

    sizes: string[];

    sizes_data: {
        [x: string]: {
            cm: string[];
            inch: string[];
        };
    };

    dimensions: string[];

    infographics: string[];
}

export interface SizeData {
    [x: string]: {
        cm: string[];
        inch: string[];
    };
}
