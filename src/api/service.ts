import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { API_URL, DOMAIN_URL } from '@env';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { RootState } from '@store/store';
import { getVersion, isPinOrFingerprintSet } from 'react-native-device-info';
import { SERVICE_DEBUG } from './constant';

interface BaseQueryArgs {
    baseUrl: string;
    timeout?: number;
    headers?: AxiosRequestConfig['headers'];
}
interface QueryArgs {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    header?: AxiosRequestConfig['headers'];
}
const axiosBaseQuery =
    (args: BaseQueryArgs): BaseQueryFn<QueryArgs, any, unknown> =>
    async (queryArg, api) => {
        const { baseUrl, timeout, headers } = args;
        const { url, method, data, params, header } = queryArg;
        const { getState, endpoint } = api;

        var newHeader: AxiosRequestConfig['headers'] = headers ?? {};
        var token = (getState() as RootState).auth.token;
        if (token) newHeader['token'] = token;
        if (header) newHeader = Object.assign(newHeader, header);

        if (SERVICE_DEBUG.includes(endpoint)) {
            console.group('SERVICE: ' + endpoint);
            console.info('request', {
                url: baseUrl + url,
                params,
                header: newHeader,
            });
            console.groupEnd();
        }
        try {
            const res = await axios({
                url: baseUrl + url,
                method: endpoint.includes('fetch') ? 'get' : method,
                data,
                params,
                headers: newHeader,
                timeout,
            });

            if (SERVICE_DEBUG.includes(endpoint)) {
                console.info('response', res.data.result);
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
    endpoints: build => ({}),
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
    endpoints: build => ({}),
});
