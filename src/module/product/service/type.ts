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
