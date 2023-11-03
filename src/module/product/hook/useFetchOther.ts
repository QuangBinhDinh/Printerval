import { useEffect } from 'react';
import {
    useFetchProductInfoQuery,
    useLazyFetchBoughtTogetherQuery,
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
        }
    }, [result]);

    return {
        detail: result?.product,
        category: result?.category,
        shipResult,
        seller: result?.product?.user,
        boughtTogether: res1?.result,

        ratingDashboard: res2?.result,

        reviewRes: res3,
    };
};
