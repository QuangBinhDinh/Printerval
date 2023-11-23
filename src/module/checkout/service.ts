import { api, domainApi } from '@api/service';
import { CartItem, ShipInfo } from '@type/common';
import { ShippingInfoArgs } from './type';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchCartCheckout: build.query<{ items: CartItem[]; sub_total: string }, { token: string; customerId: number }>(
            {
                query: args => ({ url: 'mobile/get-cart-item', params: { ...args, dt: Date.now() } }),
                keepUnusedDataFor: 0,
            },
        ),
        fetchShippingInfo: build.query<ShipInfo[], ShippingInfoArgs>({
            query: args => ({ url: 'shipping-fee/item/info', params: { ...args, dt: Date.now() } }),
            keepUnusedDataFor: 0,
            transformResponse: res => res.result,
        }),
    }),
});

export const {
    useLazyFetchCartCheckoutQuery,
    useLazyFetchShippingInfoQuery,
    endpoints: checkoutEndpoint,
} = extendedApi;
