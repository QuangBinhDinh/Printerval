import { User } from '@type/common';
import { Use } from 'react-native-svg';

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

export interface OrderDetail {
    amount: string;
    order: {
        //Billing address info
        billingAddress: {
            name: string;
            address: string;
            country: any;
            state_name: string;
            zip_code: string;
            city_name: string;
        };

        //Shipping address info
        state_name: string;
        city_name: string;
        note: string;
        delivery_address: string;
        country: any;
        zip_code: string;

        shipping_fee: string;
        shipping_info: string;
        shipping_type: string;
        payment_type: string;
        other_fee: string;

        transaction_fee: string;
        transaction_id: string;
        tips: string;
        discount: string;

        customer: User;
        created_at: string;
    };

    designByOrderItem: any[];
    items: OrderProduct[];
}
