import { User } from '@type/common';

export interface ShippingAddressArgs {
    full_name: string;
    phone: string | number;
    zip_code: string;
    country_id: number | string;
    province_id: number | string;
    city_name: string;
    optional_address: string;
    address: string;
    id?: number | string;
}

export interface OrderProduct {
    id: number;
    image_url: string;
    configurations: string;
    name: string;
    price: string;
    product_id: number;
    quantity: number;
}

export interface OrderItemResponse {
    id: number;
    amount: string;
    code: string;

    customer: User;
    created_at: string;

    city_name: string;

    status: string;

    items: OrderProduct[];
}
