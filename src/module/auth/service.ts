import { api, domainApi } from '@api/service';
import { OrderBody, OrderResponseSuccess } from '@checkout/type';
import { User } from '@type/common';

export interface LoginArgs {
    email: string;
    password: string;
    deviceId: string;
    fcm_token?: string;
}

export interface LoginSocialArgs {
    email: string;
    full_name?: string;
    type: string;
    token: string;
    deviceId: string;
    fcm_token?: string;
}

export interface RegisterArgs {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        createOrder: build.mutation<OrderResponseSuccess, OrderBody>({
            query: body => ({
                url: 'api/order?service_token=megaads@123',
                method: 'post',
                body,
                header: { token: body.token_user_query },
            }),
        }),
    }),
});

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        postLogin: build.mutation<{ access_token: string; customer: User }, LoginArgs>({
            query: args => ({ url: 'user/stateless-sign-in', method: 'post', body: args }),
        }),
        postLoginSocial: build.mutation<{ access_token: string; customer: User; message: string }, LoginSocialArgs>({
            query: args => ({ url: 'user/social/stateless-login', method: 'post', body: args }),
        }),
        createAccount: build.mutation<{ status: string }, RegisterArgs>({
            query: args => ({ url: 'user/stateless-sign-up', method: 'post', body: args }),
        }),
    }),
});

export const {
    usePostLoginMutation,
    usePostLoginSocialMutation,
    useCreateAccountMutation,
    endpoints: authDomain,
} = extendedDomain;

export const { useCreateOrderMutation } = extendedApi;
