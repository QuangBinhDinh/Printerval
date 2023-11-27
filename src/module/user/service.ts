import { domainApi } from '@api/service';
import { ShippingAddress } from '@type/common';
import { ShippingAddressArgs } from './type';

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

export const {
    useFetchAddressBookQuery,
    useLazyFetchAddressBookQuery,
    useLazyFetchAddressFirstTimeQuery,
    usePostAddressMutation,
    useDeleteAddressMutation,
    endpoints: userDomain,
} = extendedDomain;
