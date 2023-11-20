import { useEffect, useMemo } from 'react';
import {
    useFetchColorGuideQuery,
    useFetchProductInfoQuery,
    useLazyFetchAlsoLikeQuery,
    useLazyFetchBoughtTogetherQuery,
    useLazyFetchDesignAvailableQuery,
    useLazyFetchProductBySellerQuery,
    useLazyFetchProductReviewQuery,
    useLazyFetchProductShippingQuery,
    useLazyFetchProductStarQuery,
} from '@product/service';
import { useRoute } from '@react-navigation/native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import { useAppSelector } from '@store/hook';
import { Product } from '@type/common';
import { DynamicObject, Nullable } from '@type/base';
import { CustomAttribute } from '@type/product';

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
    const [fetchProductBySeller, { data: res6 }] = useLazyFetchProductBySellerQuery();

    const { data: { result: colorObj } = {} } = useFetchColorGuideQuery(productId);

    const isShirt = useMemo(() => {
        if (!result) return false;
        var breadcrumb = JSON.parse(result.category.breadcrumb);
        return breadcrumb.filter((item: any) => item.id == 6).length > 0;
    }, [result]);

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

    const customConfig = useMemo(() => {
        if (!result?.product) return null;

        let data: Partial<CustomAttribute> = {};
        var custom_design_image = result.product.attributes.custom_design_image;
        if (custom_design_image) data.custom_design_image = custom_design_image;

        var custom_design_option = result.product.attributes.custom_design_option;
        if (custom_design_option) data.custom_design_option = custom_design_option;

        var custom_design_text = result.product.attributes.custom_design_text;
        if (custom_design_text) data.custom_design_text = custom_design_text;

        return data;
    }, [result]);

    const initialConfig = useMemo(() => {
        if (!customConfig) return null;

        const { custom_design_image, custom_design_option, custom_design_text } = customConfig;
        let data: DynamicObject = {};

        custom_design_image?.forEach(obj => {
            var imageKey = obj.name;
            data[imageKey] = '';
        });

        custom_design_option?.forEach(opt => {
            var optKey = opt.title;
            data[optKey] = opt.values[0] || ''; // lấy phần tử đầu tiên option , có thể gây crash !!
        });

        custom_design_text?.forEach((text: any) => {
            data[text] = '';
        });

        return data;
    }, [customConfig]);

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
            fetchProductBySeller({ product_id: productId, user_id: result.product?.user?.id || -1 });
        }
    }, [result, variantReady]);

    return {
        detail: result?.product,
        prodCategory: result?.category,
        shipResult,
        seller: result?.product?.user,
        boughtTogether: res1,
        ratingDashboard: res2?.result,
        reviewRes: res3,

        designAvailable: res4?.result,
        alsoLikeProd: res5?.result,

        /**
         * Sp thuộc cùng gian hàng seller này
         */
        moreProducts: res6?.result,

        relateTag: result?.tags,

        /**
         * Sp này có show option chọn print back hay không
         */
        showPrintBack: showPrintBack,

        /**
         * Thông tin các field custom + option custom
         */
        customConfig,

        /**
         * Config ban đầu, cũng là data gửi lên khi add to cart
         */
        initialConfig,

        /**
         * Product này có phải là T-Shirt không
         */
        isShirt,

        /**
         * Object của color guide, mỗi property có dạng sizeId-typeID-colorId, value là image_url của color guide ứng với bộ 3 ID đó
         */
        colorObj,
    };
};
