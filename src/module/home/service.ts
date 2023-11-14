import { api, domainApi, globalApi } from '@api/service';
import { Post, ResponseMeta } from '@type/common';

export interface ExploreTag {
    image_url: string;
    tag_name: string;
    url: string;
}
const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchHomeBanner: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=slide' }),
            transformResponse: res => {
                let banner: any[] = [];
                var obj = res.result[0];

                if (obj) {
                    banner = JSON.parse(obj.value).slides;
                }
                return banner;
            },
        }),

        fetchExploreTrend: build.query<ExploreTag[], void>({
            query: () => ({ url: 'option?filters=key=home_tags' }),
            transformResponse: res => {
                let banner: any[] = [];
                var obj = res.result[0];

                if (obj) {
                    banner = JSON.parse(obj.value);
                }
                return banner;
            },
        }),

        fetchPopularDesign: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=design-box-popular-tags-data' }),
        }),
        fetchCategoryBanner: build.query<any, void>({
            query: () => ({ url: 'category/home-banner?limit=6' }),
        }),
    }),
});

const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        fetchExploreProd: build.query<any, void>({
            query: () => ({ url: 'product/recommendation' }),
        }),

        //api bị lỗi , cần fix lại
        browsingHistory: build.mutation<any, { product_id: number; token: string }>({
            query: body => ({
                url: 'browsing-history/asyn-get-history?ignore_localization=1',
                method: 'post',
                body: { url: 'https://printerval.com/', ...body },
            }),
        }),
    }),
});

const globalDomain = globalApi.injectEndpoints({
    endpoints: build => ({
        fetchPrintervalPost: build.query<{ meta: ResponseMeta; result: Post[] }, void>({
            query: () => ({ url: 'post' }),
        }),
        fetchPostById: build.query<{ meta: ResponseMeta; result: Post[] }, number>({
            query: id => ({ url: `post?filters=id=${id}` }),
        }),
    }),
});

export const {
    useFetchHomeBannerQuery,
    useFetchExploreTrendQuery,
    useFetchPopularDesignQuery,
    useFetchCategoryBannerQuery,
} = extendedApi;

export const { useFetchExploreProdQuery, useBrowsingHistoryMutation } = extendedDomain;

export const { useLazyFetchPrintervalPostQuery, useLazyFetchPostByIdQuery } = globalDomain;
