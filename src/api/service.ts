import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { API_URL, DOMAIN_URL } from '@env';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { RootState } from '@store/store';
import { getVersion, isPinOrFingerprintSet } from 'react-native-device-info';
import { SERVICE_DEBUG } from './constant';
import { Country, Slug } from '@type/common';

const GLOBAL_URL = 'https://glob.api.printerval.com/';

interface BaseQueryArgs {
    baseUrl: string;
    timeout?: number;
    headers?: AxiosRequestConfig['headers'];
}
interface QueryArgs {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    header?: AxiosRequestConfig['headers'];
}
const axiosBaseQuery =
    (args: BaseQueryArgs): BaseQueryFn<QueryArgs, any, unknown> =>
    async (queryArg, api) => {
        const { baseUrl, timeout, headers } = args;
        const { url, method, body, params, header } = queryArg;
        const { getState, endpoint } = api;

        var newHeader: AxiosRequestConfig['headers'] = headers ?? {};
        var token = (getState() as RootState).auth.accessToken;
        if (token) newHeader['token'] = token;
        if (header) newHeader = Object.assign(newHeader, header);

        if (SERVICE_DEBUG.includes(endpoint)) {
            console.group('SERVICE: ' + endpoint);
            console.info('request', {
                url: baseUrl + url,
                params,
                header: newHeader,
                body,
            });
            console.groupEnd();
        }
        try {
            const res = await axios({
                url: baseUrl + url,
                method: endpoint.includes('fetch') ? 'get' : method,
                data: body,
                params,
                headers: newHeader,
                timeout,
            });

            if (SERVICE_DEBUG.includes(endpoint)) {
                console.info('response', res);
            }
            if (res.data.status == 'successful') return { data: res.data };
            else
                return {
                    error: {
                        status: 'ServerErr',
                        message: res.data.message ?? JSON.stringify(res.data),
                    },
                };
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            console.info('Axios Error', err);
            return {
                error: {
                    status: err.response?.status,
                    message: err.response?.data || err.message,
                },
            };
        }
    };

export const api = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({
        baseUrl: API_URL,
        timeout: 15000,
        headers: {
            'User-Agent': `printervalApp/${getVersion()}`,
        },
    }),
    endpoints: build => ({
        fetchSlug: build.query<{ result: Slug[] }, string>({
            query: keyword => ({ url: `slug_manager?filters=slug=${keyword}` }),
        }),
        fetchPaymentConfig: build.query<{ stripe: any; paypal: any; sa: any }, void>({
            query: () => ({ url: `payment-info?token=megaads@123456` }),
            transformResponse: res => res.result,
        }),
        fetchCountries: build.query<Country[], void>({
            query: () => ({ url: `country?page_size=-1&embeds=provinces` }),
            transformResponse: res => res.result,
        }),
    }),
    tagTypes: ['Cart', 'CartCheckout'],
});

export const domainApi = createApi({
    reducerPath: 'domainApi',
    baseQuery: axiosBaseQuery({
        baseUrl: DOMAIN_URL,
        timeout: 15000,
        headers: {
            'User-Agent': `printervalApp/${getVersion()}`,
        },
    }),
    endpoints: build => ({
        postImage: build.mutation<{ status: string; upload: string[] }, any>({
            query: args => {
                var body = new FormData();
                body.append('upload', args);
                body.append('type', 'default');

                return {
                    url: 'printerval-central/upload',
                    method: 'post',
                    header: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body,
                };
            },
        }),
    }),
    tagTypes: ['Address'],
});

export const globalApi = createApi({
    reducerPath: 'globalApi',
    baseQuery: axiosBaseQuery({
        baseUrl: GLOBAL_URL,
        timeout: 15000,
        headers: {
            'User-Agent': `printervalApp/${getVersion()}`,
        },
    }),
    endpoints: build => ({}),
});

export const { useLazyFetchSlugQuery, useLazyFetchPaymentConfigQuery, useLazyFetchCountriesQuery } = api;
export const { usePostImageMutation } = domainApi;

/**
 * Handle error response của Printerval, trả về 1 message duy nhất
 *
 * Có thể còn nhiều case khác nữa
 * @param err
 * @returns
 */
export const getErrorMessage = (err: any) => {
    let errMsg = 'Unknown error';

    var message = err.message;
    if (!!message) {
        if (Array.isArray(message)) {
            errMsg = JSON.stringify(message[0]);
        } else if (typeof message == 'object') {
            var valueList = Object.values(message);
            if (valueList.length > 0) {
                errMsg = JSON.stringify(valueList[0]);
            }
        } else if (typeof message == 'string') {
            errMsg = message;
        }
    } else errMsg = JSON.stringify(err);
    return errMsg.slice(0, 150);
};
