import { api, domainApi } from '@api/service';
import { CartItem } from '@type/common';
import { AddToCartBody, AllToCartBody } from './type';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        addToCart: build.mutation<any, AddToCartBody>({
            query: body => ({ url: 'cart/add-to-cart', method: 'post', body }),
            invalidatesTags: ['Cart'],
        }),

        fetchCart: build.query<{ items: CartItem[]; sub_total: string }, { token: string; customerId: number }>({
            query: args => ({ url: 'mobile/get-cart-item', params: { ...args, dt: Date.now() } }),
            providesTags: ['Cart'],
        }),

        updateQuantity: build.mutation<any, { id: number; quantity: number }>({
            query: args => ({ url: 'cart/update-cart-item', method: 'post', params: args }),
            invalidatesTags: ['Cart'],
        }),

        updateCartConfig: build.mutation<any, { id: number; quantity: number; configurations: string }>({
            query: args => ({ url: 'cart/update-cart-item', method: 'post', params: args }),
            invalidatesTags: ['Cart'],
        }),

        removeCartItem: build.mutation<any, number>({
            query: cartId => ({ url: 'cart/empty-cart', method: 'post', params: { ids: cartId } }),
            invalidatesTags: ['Cart'],
        }),
        //query này sẽ k trigger invalidate tag, dùng trong trường hợp change item
        removeCartV2: build.mutation<any, number>({
            query: cartId => ({ url: 'cart/empty-cart', method: 'post', params: { ids: cartId } }),
        }),
    }),
});

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        getPreviewDesign: build.mutation<
            { product_id: number; design_url: string }[],
            { product_id: number; product_sku_id: number }[]
        >({
            query: body => ({ url: '/service/pod/preview-design', method: 'post', body: { data: body } }),
            transformResponse: res => res.result,
        }),

        addAllToCart: build.mutation<any, AllToCartBody>({
            query: body => ({ url: 'bought-together/add-all-to-cart', method: 'post', body }),
        }),
    }),
});

export const {
    useAddToCartMutation,
    useFetchCartQuery,
    useLazyFetchCartQuery,
    useUpdateQuantityMutation,
    useRemoveCartItemMutation,
    useRemoveCartV2Mutation,
    useUpdateCartConfigMutation,
} = extendedApi;

export const { useGetPreviewDesignMutation, useAddAllToCartMutation } = extendedDomain;
