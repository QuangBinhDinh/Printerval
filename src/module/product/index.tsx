import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, NativeScrollEvent, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import { useRoute } from '@react-navigation/native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import FastImage from 'react-native-fast-image';
import { cdnImage } from '@util/cdnImage';
import ProductTitle from './component/ProductTitle';
import ProductFeature from './component/ProductFeature';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import { TextNormal, TextSemiBold } from '@components/text';
import { useFetchOther } from './hook/useFetchOther';
import SellerInfo from './component/SellerInfo';
import { useSharedValue } from 'react-native-reanimated';
import DeliverySection from './component/DeliverySection';
import BoughtTogether from './component/BoughtTogether';
import LoadingProduct from './component/LoadingProduct';
import AnimatedHeader from './component/AnimatedHeader';
import ReviewSection from './component/ReviewSection';
import ProductRow from '@components/product/ProductRow';
import ProductTwoRow from '@components/product/ProductTwoRow';
import RelateTag from './component/RelateTag';
import { useAppDispatch, useAppSelector } from '@store/hook';
import category from '@category/reducer';
import { useVariant } from './hook/useVariant';
import VariantSection from './component/VariantSection';
import Quantity from './component/VariantSection/Quantity';
import AddToCartView from './component/AddToCartView';
import { DynamicObject } from '@type/base';
import CustomizeSection from './component/CustomizeSection';
import { ErrorField, ProductTogether } from '@type/product';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import InvisibleLoad from '@components/loading/InvisibleLoad';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { api } from '@api/service';
import Gallery from './component/Gallery';

const addCartQuerySelector = createSelector(
    (state: RootState) => state.api.mutations,
    post => {
        var addToCart = Object.values(post).find(query => query?.endpointName == 'addToCart');
        return addToCart?.status || 'unknown';
    },
);
const DetailProduct = () => {
    const addingToCart = useSelector(addCartQuerySelector);

    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    const prodHistory = useAppSelector(state => state.category.productHistory);

    const {
        mappings,
        selectedVariant,
        displayOption,
        setSelectedTuple,
        variantPrice,
        gallery,
        variantReady,
        detailSelectVar,
        colIndex,
        prodNoVariant,
        description,
        default_variant_name,
    } = useVariant(productId, productName);

    const {
        detail,
        prodCategory,
        shipResult,
        seller,
        boughtTogether,
        ratingDashboard,
        reviewRes,
        designAvailable,
        moreProducts,
        alsoLikeProd,
        relateTag,
        showPrintBack,
        customConfig,
        initialConfig,
        isShirt,
        colorObj,
    } = useFetchOther(variantReady);

    const thisProd: ProductTogether = useMemo(() => {
        if (!detail) return null;

        return {
            id: detail.id,
            name: detail.name,
            image_url: detailSelectVar?.gallery[0] || detail.image_url,
            quantity: 1,
            price: detailSelectVar?.price || detail.price,
            high_price: detailSelectVar?.high_price || detail.high_price,
            display_price: detailSelectVar ? formatPrice(detailSelectVar.price) : detail.display_price,
            display_high_price: detailSelectVar ? formatPrice(detailSelectVar.high_price) : detail.display_high_price,

            productSku: detailSelectVar?.id || -1,
            variantName: default_variant_name,
        };
    }, [detail, detailSelectVar]);

    /**
     * Trả về ảnh color guide dựa vào biến thể đang được chọn
     */
    const selectedColorGuide = useMemo(() => {
        let image_url = '';
        if (
            selectedVariant &&
            colorObj &&
            !gallery &&
            colIndex >= 0 &&
            mappings &&
            Object.keys(displayOption).length > 0
        ) {
            //chỉ hiện color guide khi biến thể sp k có ảnh
            const color_guide_ids = Object.keys(colorObj); //list key bộ ID của color guide

            const filter = selectedVariant.slice(0, colIndex + 1); // chọn các variant trước color để lọc (type, style ,...)

            const selected_id = color_guide_ids.find(tuple => checkGuideTuple(tuple, filter)) ?? '0';
            image_url = colorObj[selected_id];
        }
        return image_url;
    }, [selectedVariant, colorObj, gallery, mappings, displayOption]);

    const prodGallery = gallery || (detail ? [detail.image_url] : []); // hiển thị list ảnh

    const [quantity, setQuantity] = useState<string>('1');
    const [printBack, setPrintback] = useState<boolean>(false);

    const [configuration, setConfiguration] = useState<DynamicObject | null>(null);
    useEffect(() => {
        if (initialConfig) setConfiguration(initialConfig);
    }, [initialConfig]);

    const [errors, setError] = useState<ErrorField | null>(null); //Hiển thị lỗi khi user chưa chọn variant require

    const scrollY = useSharedValue(0);
    const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        //console.log(nativeEvent.contentOffset.y);
        scrollY.value = nativeEvent.contentOffset.y;
    };
    /**
     * Hàm tính postion của customize input để scroll đến
     */
    const calculateOffset = useMemo(() => {
        var sizeOffset = 0;
        var textInputOffset = 0;
        var quantityOffset = 0;
        if (displayOption) {
            var offset = SCREEN_WIDTH + 110;
            for (const key of Object.keys(displayOption)) {
                offset = offset + 88;
            }
            sizeOffset = offset - 300;

            if (customConfig?.custom_design_option) {
                offset = offset + 88;
            }
            if (customConfig?.custom_design_image) {
                offset = offset + 170 * customConfig.custom_design_image.length;
            }
            offset = offset + 72;
            textInputOffset = offset - 300;
            quantityOffset = offset + 120 - 300;
        }
        return {
            sizeOffset,
            textInputOffset,
            quantityOffset,
        };
    }, [customConfig, displayOption, errors]);

    useEffect(() => {
        if (detail) {
            // lưu lại lịch sử sp đã xem
            //chỉ lưu 1 số thông tin cơ bản (tránh dung lượng cache cao)
            var { id, name, image_url, display_high_price, display_price } = detail;
            dispatch(category.actions.setProdHistory({ id, name, image_url, display_high_price, display_price }));
        }
    }, [detail]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 6 + insets.top / 1.5 }}>
            <InvisibleLoad visible={addingToCart == QueryStatus.pending} />
            <AnimatedHeader title={productName} scrollY={scrollY} />

            {!!detail && variantReady ? (
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    onScroll={onScroll}
                    scrollEventThrottle={6}
                    ref={scrollRef}
                    enableOnAndroid
                    enableResetScrollToCoords={false}
                >
                    {/* <FastImage
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                        source={{ uri: cdnImage(detail?.image_url, 630, 630) }}
                    /> */}
                    <Gallery
                        isShirt={isShirt}
                        colIndex={colIndex}
                        gallery={prodGallery}
                        selectedColorGuide={selectedColorGuide}
                    />

                    <ProductTitle detail={detail} category={prodCategory} title={productName} />

                    <VariantSection
                        detailVariant={detailSelectVar}
                        changeValue={setSelectedTuple}
                        options={displayOption}
                        selected={selectedVariant}
                        variantPrice={variantPrice}
                        mappings={mappings}
                        colIndex={colIndex}
                        errors={errors}
                    />

                    {!!customConfig && !!configuration && (
                        <CustomizeSection
                            currentConfig={configuration}
                            setConfig={setConfiguration}
                            customConfig={customConfig}
                            errors={errors}
                        />
                    )}

                    <Quantity
                        showPrintBack={showPrintBack}
                        isPrintBack={printBack}
                        changePrintBack={setPrintback}
                        quantityText={quantity}
                        changeQuantity={setQuantity}
                    />

                    <ProductFeature description={description} />

                    <View style={styles.guarantee}>
                        <Image style={{ height: 48, width: 48 }} source={require('@image/guarantee-logo.png')} />
                        <View style={{ flex: 1, paddingLeft: 12, justifyContent: 'center' }}>
                            <TextSemiBold style={{ fontSize: 13, lineHeight: 16, marginTop: 3 }}>
                                Don’t love it? We’ll fix it. For free.
                            </TextSemiBold>
                            <TextNormal style={{ fontSize: 13, color: lightColor.secondary }}>
                                Printerval Guarantee
                            </TextNormal>
                        </View>
                    </View>

                    <SellerInfo seller={seller} prodImg={detail?.image_url} />

                    <DeliverySection
                        data={shipResult?.result}
                        country={shipResult?.countryName || ''}
                        product={detail}
                    />

                    {!!boughtTogether && boughtTogether.length > 0 && !!thisProd && (
                        <BoughtTogether data={boughtTogether} currentProd={thisProd} />
                    )}

                    <ReviewSection
                        product={detail}
                        dashboard={ratingDashboard}
                        reviews={reviewRes?.result}
                        meta={reviewRes?.meta}
                    />

                    <ProductRow data={designAvailable} title="The design is also available on" />

                    <ProductTwoRow data={alsoLikeProd} title="You may also like" />

                    <ProductRow data={moreProducts} title={`More ${seller?.name}'s products`} />

                    <RelateTag data={relateTag} />

                    <ProductRow data={prodHistory.filter(i => i.id != productId)} title="Recently viewed" />

                    <View style={{ height: 90 }} />
                </KeyboardAwareScrollView>
            ) : (
                <LoadingProduct />
            )}

            <AddToCartView
                ref={scrollRef}
                detail={detail}
                detailVariant={detailSelectVar}
                configuration={configuration}
                printBack={printBack}
                quantity={quantity}
                hasCustomText={Object.keys(customConfig || {}).length > 0}
                errors={errors}
                setError={setError}
                inputs={selectedVariant}
                offset={calculateOffset}
                prodNoVariant={prodNoVariant}
            />
        </View>
    );
};

export default DetailProduct;

const styles = StyleSheet.create({
    header: {
        height: 48,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 200,
        position: 'absolute',
        top: 0,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
    },
    button: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guarantee: {
        alignSelf: 'center',
        width: SCREEN_WIDTH - 36,
        height: 64,
        borderRadius: 6,
        backgroundColor: '#FDEBD2',
        flexDirection: 'row',
        marginTop: 32,
        alignItems: 'center',
        paddingLeft: 12,
    },
});

/**
 * Kiểm tra xem bộ ID của color guide trùng với bộ ID đang được chọn không
 */
const checkGuideTuple = (tuple: string, input: any[]) => {
    const tupleArr = tuple.split('-');
    return input.every(id => tupleArr.includes(id.toString()));
};
