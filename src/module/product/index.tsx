import React, { useEffect, useState } from 'react';
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
import { SCREEN_WIDTH } from '@util/index';
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

const DetailProduct = () => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
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
    } = useFetchOther(variantReady);

    const [quantity, setQuantity] = useState<string>('1');
    const [printBack, setPrintback] = useState<boolean>(false);

    const scrollY = useSharedValue(0);
    const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        //console.log(nativeEvent.contentOffset.y);
        scrollY.value = nativeEvent.contentOffset.y;
    };

    useEffect(() => {
        if (detail && variantReady) {
            // lưu lại lịch sử sp đã xem
            //chỉ lưu 1 số thông tin cơ bản (tránh dung lượng cache cao)
            var { id, name, image_url, display_high_price, display_price } = detail;
            dispatch(category.actions.setProdHistory({ id, name, image_url, display_high_price, display_price }));
        }
    }, [detail]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 6 + insets.top / 1.5 }}>
            <AnimatedHeader title={productName} scrollY={scrollY} />

            {!!detail && variantReady ? (
                <KeyboardAwareScrollView style={{ flex: 1 }} onScroll={onScroll} scrollEventThrottle={6}>
                    <FastImage
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                        source={{ uri: cdnImage(detail?.image_url, 630, 630) }}
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
                    />

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

                    <SellerInfo seller={seller} />

                    <DeliverySection data={shipResult?.result} country={shipResult?.countryName || ''} />

                    <BoughtTogether data={boughtTogether} currentProd={detail} />

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
                    <View style={{ height: 30 }} />
                </KeyboardAwareScrollView>
            ) : (
                <LoadingProduct />
            )}
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
