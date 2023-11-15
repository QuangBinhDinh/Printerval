export interface AddToCartBody {
    productId: string | number;
    productSkuId?: string | number | null;
    customerToken: string;
    customerId?: string | number;
    quantity: number | string;
    configurations?: string;
}
