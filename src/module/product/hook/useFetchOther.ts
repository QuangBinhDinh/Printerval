import { useEffect } from 'react';
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

export const useFetchOther = () => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const { data: { result } = {} } = useFetchProductInfoQuery(productId);

    const [fetchShipFee, { data: shipResult }] = useLazyFetchProductShippingQuery();
    const [fetchBoughtTogether, { data: res1 }] = useLazyFetchBoughtTogetherQuery();
    const [fetchRating, { data: res2 }] = useLazyFetchProductStarQuery();
    const [fetchReview, { data: res3 }] = useLazyFetchProductReviewQuery();
    const [fetchAvailable, { data: res4 }] = useLazyFetchDesignAvailableQuery();
    const [fetchAlsoLike, { data: res5 }] = useLazyFetchAlsoLikeQuery();

    useEffect(() => {
        if (result) {
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
    }, [result]);

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
    };
};
