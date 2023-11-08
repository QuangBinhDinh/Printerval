import { api } from '@api/service';

export interface AddToCartBody {
    productId: string | number;
    productSkuId?: string | number | null;
    customerToken: string;
    customerId?: string | number;
    quantity: number | string;
    configurations?: string;
}

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        addToCart: build.mutation<any, AddToCartBody>({
            query: body => ({ url: 'cart/add-to-cart', method: 'post', body }),
        }),
    }),
});

export const { useAddToCartMutation } = extendedApi;
