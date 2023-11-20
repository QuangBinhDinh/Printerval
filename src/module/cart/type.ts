export interface AddToCartBody {
    productId: string | number;
    productSkuId?: string | number | null;
    customerToken: string;
    customerId?: string | number;
    quantity: number | string;
    configurations?: string;
}

export interface AllToCartBody {
    data: { productId: number; productSkuId: number; quantity: number; configurations?: string }[];
    productId: number;
    token: string;
    customerId: number;
}
