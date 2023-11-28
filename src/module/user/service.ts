import { api, domainApi } from '@api/service';
import { ShippingAddress } from '@type/common';
import { OrderItemResponse, ShippingAddressArgs } from './type';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchOrderHistory: build.query<OrderItemResponse[], { accessToken: string; locale: string }>({
            query: args => ({
                url: 'customer/get-my-order',
                params: { locale: args.locale, dt: Date.now() },
                header: { token: args.accessToken },
            }),
            transformResponse: res => res.result?.filter((i: any) => i.payment_status == 'PAID'),
            keepUnusedDataFor: 1,
        }),

        trackingOrder: build.mutation<any, { email: string; orderId: string }>({
            query: body => ({ url: 'track-order', method: 'post', body }),
        }),
    }),
});

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        //dùng 1 lần khi user mới login , để set default address nếu chưa có
        fetchAddressFirstTime: build.query<ShippingAddress[], string>({
            query: accessToken => ({ url: `user/api/address-book?api_token=${accessToken}&dt=${Date.now()}` }),
            transformResponse: res => res.result,
        }),

        fetchAddressBook: build.query<ShippingAddress[], string>({
            query: accessToken => ({ url: `user/api/address-book?api_token=${accessToken}&dt=${Date.now()}` }),
            //providesTags: ['Address'],
            transformResponse: res => res.result,
        }),

        postAddress: build.mutation<any, { address: ShippingAddressArgs; api_token: string }>({
            query: body => ({
                url: `user/api/address-book?api_token=${body.api_token}`,
                method: 'post',
                body: body.address,
            }),
            //invalidatesTags: ['Address'],
        }),

        deleteAddress: build.mutation<any, { id: number; api_token: string }>({
            query: args => ({
                url: `user/api/address-book`,
                method: 'delete',
                params: args,
            }),
            //invalidatesTags: ['Address'],
        }),
    }),
});

export const { useFetchOrderHistoryQuery, useTrackingOrderMutation } = extendedApi;

export const {
    useFetchAddressBookQuery,
    useLazyFetchAddressBookQuery,
    useLazyFetchAddressFirstTimeQuery,
    usePostAddressMutation,
    useDeleteAddressMutation,
    endpoints: userDomain,
} = extendedDomain;
