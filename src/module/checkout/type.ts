export interface ShippingInfoArgs {
    location_id: string | number;
    token: string;
    customerId: number;
}

export interface ApplyCodeBody {
    code: string;
    amount: number;
    quantity: number;
    products: { price: number; id: number; quantity: number }[];
    phone: number | string;
    //email?: string;
    shipping_fee: number;
    shipping_type: string;
}

export interface OrderBody {
    name: string;
    zipcode: string;
    phone: string | number;
    /**
     * ID country
     */
    country: string | number;
    /**
     * ID state/province
     */
    province: string | number;
    /**
     * Tên state/province
     */
    state_name: string;
    city_name: string;
    optional_address: string;
    address: string;
    payment_type: 'stripe' | 'paypal';
    email: string;
    promotion_code: string;
    discount: number;
    tips: number;
    billingAddress: string;

    /**
     * JSON stringy của object configuration, gồm key là cart_id, value là id ship method
     */
    shippingConfiguration: string;

    currency_config: any;
    delivery_note: string;

    /**
     * Token generate dùng cho cart (không phải accessToken !!)
     */
    token_user_query: string;

    checkout_source: string;

    /**
     * Stringfy object thông tin người đc gift
     */
    giftInfo?: string;
}

export interface OrderResponseSuccess {
    status: string;
    order: {
        code: string;
        status: string;
    };
    redirect:
        | string
        | {
              payment_intent: string;
              redirect: string;
          };
}
