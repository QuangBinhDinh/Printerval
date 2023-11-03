import { useEffect } from 'react';
import {
    useFetchProductInfoQuery,
    useLazyFetchBoughtTogetherQuery,
    useLazyFetchProductShippingQuery,
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

    useEffect(() => {
        if (result)
            fetchShipFee({
                id: productId,
                sku: result.product.sku,
                quantity: 1,
            });

        fetchBoughtTogether(productId);
    }, [result]);

    return {
        detail: result?.product,
        category: result?.category,
        shipResult,
        seller: result?.product?.user,
        boughtTogether: res1?.result,
    };
};
