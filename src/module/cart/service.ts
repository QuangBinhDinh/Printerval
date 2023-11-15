import { api } from '@api/service';
import { CartItem } from '@type/common';
import { AddToCartBody } from './type';

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

        removeCartItem: build.mutation<any, number>({
            query: cartId => ({ url: 'cart/empty-cart', method: 'post', params: { ids: cartId } }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const { useAddToCartMutation, useFetchCartQuery, useUpdateQuantityMutation, useRemoveCartItemMutation } =
    extendedApi;
