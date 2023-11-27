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
