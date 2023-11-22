import { domainApi } from '@api/service';
import { ShippingAddress } from '@type/common';

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        //dùng 1 lần khi user mới login , để set default address nếu chưa có
        fetchAddressFirstTime: build.query<ShippingAddress[], string>({
            query: accessToken => ({ url: `user/api/address-book?api_token=${accessToken}&dt=${Date.now()}` }),
            transformResponse: res => res.result,
        }),

        fetchAddressBook: build.query<ShippingAddress[], string>({
            query: accessToken => ({ url: `user/api/address-book?api_token=${accessToken}&dt=${Date.now()}` }),
            providesTags: ['Address'],
            transformResponse: res => res.result,
        }),
    }),
});

export const {
    useFetchAddressBookQuery,
    useLazyFetchAddressBookQuery,
    useLazyFetchAddressFirstTimeQuery,
    endpoints: userDomain,
} = extendedDomain;
