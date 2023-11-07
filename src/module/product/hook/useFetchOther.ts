import { useEffect, useMemo } from 'react';
import {
    useFetchProductInfoQuery,
    useLazyFetchAlsoLikeQuery,
    useLazyFetchBoughtTogetherQuery,
    useLazyFetchDesignAvailableQuery,
    useLazyFetchProductReviewQuery,
    useLazyFetchProductShippingQuery,
    useLazyFetchProductStarQuery,
} from '@product/service';
import { useRoute } from '@react-navigation/native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import { useAppSelector } from '@store/hook';
import { Product } from '@type/common';

export const useFetchOther = (variantReady: boolean) => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const { data: { result } = {} } = useFetchProductInfoQuery(productId);

    const invalidPrintBack = useAppSelector(state => state.config.invalidPrintBack);

    const [fetchShipFee, { data: shipResult }] = useLazyFetchProductShippingQuery();
    const [fetchBoughtTogether, { data: res1 }] = useLazyFetchBoughtTogetherQuery();
    const [fetchRating, { data: res2 }] = useLazyFetchProductStarQuery();
    const [fetchReview, { data: res3 }] = useLazyFetchProductReviewQuery();
    const [fetchAvailable, { data: res4 }] = useLazyFetchDesignAvailableQuery();
    const [fetchAlsoLike, { data: res5 }] = useLazyFetchAlsoLikeQuery();

    const showPrintBack = useMemo(() => {
        if (!result || !invalidPrintBack) return false;

        let pass = false;
        let isInvalidPrintBack = false;
        let isShirt = false;
        const prod = result.product;
        const category = result.category;

        var jsonBreadcrumb = JSON.parse(category.breadcrumb);
        var filter = jsonBreadcrumb.filter((item: any) => item.id == 6);
        if (filter.length > 0) {
            isShirt = true;
        }

        if (invalidPrintBack.includes(category.id.toString())) {
            isInvalidPrintBack = true;
        }

        if (
            isShirt &&
            !isInvalidPrintBack &&
            !prod.attributes.multiple_design &&
            !prod.attributes.double_sided &&
            !prod.attributes.is_custom_design
        ) {
            pass = true;
        }

        return pass;
    }, [result, invalidPrintBack]);

    useEffect(() => {
        if (result && variantReady) {
            fetchShipFee({
                id: productId,
                sku: result.product.sku,
                quantity: 1,
            });

            fetchBoughtTogether(productId);
            fetchRating(productId);
            fetchReview({
                targetId: productId,
                pageSize: 3,
                dt: Date.now(),
            });

            fetchAvailable(productId);
            fetchAlsoLike(productId);
        }
    }, [result, variantReady]);

    return {
        detail: result?.product,
        prodCategory: result?.category,
        shipResult,
        seller: result?.product?.user,
        boughtTogether: res1?.result,
        ratingDashboard: res2?.result,
        reviewRes: res3,

        designAvailable: res4?.result,
        alsoLikeProd: res5?.result,
        moreProducts: result?.sameStore,

        relateTag: result?.tags,

        showPrintBack: showPrintBack,
    };
};
