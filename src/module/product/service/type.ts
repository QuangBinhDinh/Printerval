import { Product } from '@type/common';

export interface ProdInfoResponse {
    product: Product;
    category: any;
    related: any;
    feature_tag: any;
    tags: any;
    sameStore: Product[];
}

export interface ProdShippingArgs {
    id: number;
    sku: string;
    quantity: number;
}

export interface ShippingInfo {
    [x: string]: {
        default_max_time: number;
        default_min_time: number;
        shipping_fee: number;
        location: string;
        delivery_max_time: number;
        delivery_min_time: number;
        name_shipping: string;
    };
}

export interface ProductReviewArgs {
    content: string;
    email: string;
    full_name: string;
    rating: string | number;
    status: string;
    /**
     * Id sản phẩm
     */
    target_id: number;
    title: string;
    /**
     * List url ảnh
     */
    images?: string;
}

export interface ProductReportArgs {
    product_id: number;
    content: string;
    email: string;
    report: string;
    name: string;
}

export interface TicketSendArgs {
    token_customer: number | string;
    title: string;
    email: string;
    content: string;
    files?: string;
    status: string;
    type: string;
    customer_name: string;
    token_ticket: string;
    order_code?: string;
}

export interface ProdConfigArgs {
    productId: number;
    productSkuId: number;
    quantity: number;
    configurations?: string;
}
