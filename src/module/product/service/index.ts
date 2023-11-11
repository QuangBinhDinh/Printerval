import { api, domainApi } from '@api/service';
import { Product, ProductReview, ResponseMeta } from '@type/common';
import { ProdInfoResponse, ShippingInfo, ProdShippingArgs, ProductReviewArgs, ProductReportArgs } from './type';
import qs from 'query-string';
import { isEqual } from 'lodash';
import { DynamicObject } from '@type/base';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchProductInfo: build.query<{ status: string; result: ProdInfoResponse }, number>({
            query: productId => ({ url: `product/view/${productId}&dt=${Date.now()}` }),
            //transformResponse: response => response.result,
        }),

        fetchProductReview: build.query<
            { status: string; result: ProductReview[]; meta: ResponseMeta },
            { targetId: number; pageId?: number; pageSize: number; dt?: number }
        >({
            query: args => {
                var newArgs = Object.assign(
                    {
                        withChildren: 1,
                        withImages: 0,
                        isParent: 1,
                        status: 'ACTIVE',
                        'order[is_pin]': 'desc',
                        'order[sort_id]': 'desc',
                        'order[created_at]': 'desc',
                    },
                    args,
                );
                return { url: `comment`, params: newArgs };
            },
            serializeQueryArgs: ({ queryArgs }) => {
                const { targetId, pageSize, dt } = queryArgs;
                return `fetchProductReview${qs.stringify({ targetId, pageSize, dt })}`;
            },
            merge: (curCache, newData) => {
                // chỉ merge data trả về khi load more (page_id >=1)
                if (newData.result?.length > 0) {
                    var merged = curCache.result.concat(newData.result);
                    curCache.result = merged;
                    curCache.meta = newData.meta;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return !isEqual(currentArg, previousArg);
            },
        }),

        fetchProductStar: build.query<
            { status: string; result: { rating: number; count: number; percent: number }[] },
            number
        >({
            query: productId => ({
                url: `comment/rating-count`,
                params: {
                    dt: Date.now(),
                    targetId: productId,
                    status: 'ACTIVE',
                },
            }),
        }),

        fetchAlsoLike: build.query<{ result: Product[] }, number>({
            query: product_id => ({ url: 'mobile/related-product', params: { product_id, dt: Date.now() } }),
        }),
    }),
});

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        fetchBoughtTogether: build.query<{ status: string; result: Product[] }, number>({
            query: productId => ({
                url: `bought-together/mobile/find`,
                params: {
                    dt: Date.now(),
                    product_id: productId,
                    limit: 3,
                },
            }),
        }),

        fetchProductShipping: build.query<{ countryName: string; result: ShippingInfo }, ProdShippingArgs>({
            query: args => ({ url: 'shipping/info', params: { ...args, dt: Date.now() } }),
        }),

        fetchDesignAvailable: build.query<{ status: string; result: Product[] }, number>({
            query: product_id => ({ url: `pod/also-available/find?product_id=${product_id}&dt=${Date.now()}` }),
        }),
        fetchStyleGuide: build.query<
            { status: string; result: string },
            { product_id: number; style_id: number; type_id: number }
        >({
            query: args => ({ url: 'module/get-style-info', params: args }),
        }),
        fetchColorGuide: build.query<{ status: string; result: { [x: string]: string } }, number>({
            query: product_id => ({ url: 'service/pod/color-guide-url', params: { product_id, dt: Date.now() } }),
        }),

        postProductReview: build.mutation<{ status: string }, ProductReviewArgs>({
            query: body => ({ url: 'reviews/store-comments', method: 'post', body: { comments: [body] } }),
        }),

        postProductReport: build.mutation<{ status: string }, ProductReportArgs>({
            query: body => ({ url: 'report/content', method: 'post', body }),
        }),
    }),
});

export const {
    useFetchProductInfoQuery,
    useLazyFetchProductReviewQuery,
    useFetchProductReviewQuery,
    useLazyFetchProductStarQuery,
    useLazyFetchAlsoLikeQuery,
} = extendedApi;

export const {
    useFetchColorGuideQuery,
    useLazyFetchBoughtTogetherQuery,
    useLazyFetchDesignAvailableQuery,
    useLazyFetchProductShippingQuery,
    useFetchStyleGuideQuery,
    usePostProductReviewMutation,
    usePostProductReportMutation,
} = extendedDomain;
