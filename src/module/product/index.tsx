import { Icon } from '@rneui/base';
import React, { useEffect } from 'react';
import { Image, NativeScrollEvent, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import { ShareIcon } from '@assets/svg';
import { useRoute } from '@react-navigation/native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import FastImage from 'react-native-fast-image';
import { cdnImage } from '@util/cdnImage';
import { goBack } from '@navigation/service';
import ProductTitle from './component/ProductTitle';
import ProductFeature from './component/ProductFeature';
import { SCREEN_WIDTH } from '@util/index';
import { TextNormal, TextSemiBold } from '@components/text';
import { useFetchOther } from './hook/useFetchOther';
import SellerInfo from './component/SellerInfo';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DeliverySection from './component/DeliverySection';
import BoughtTogether from './component/BoughtTogether';
import LoadingProduct from './component/LoadingProduct';
import AnimatedHeader from './component/AnimatedHeader';
import ReviewSection from './component/ReviewSection';
import ProductRow from '@components/product/ProductRow';
import ProductTwoRow from '@components/product/ProductTwoRow';
import RelateTag from './component/RelateTag';

const DetailProduct = () => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const {
        detail,
        category,
        shipResult,
        seller,
        boughtTogether,
        ratingDashboard,
        reviewRes,
        designAvailable,
        moreProducts,
        alsoLikeProd,
        relateTag,
    } = useFetchOther();

    const scrollY = useSharedValue(0);
    const onScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        //console.log(nativeEvent.contentOffset.y);
        scrollY.value = nativeEvent.contentOffset.y;
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 6 + insets.top / 1.5 }}>
            <AnimatedHeader title={productName} scrollY={scrollY} />

            {!!detail ? (
                <KeyboardAwareScrollView style={{ flex: 1 }} onScroll={onScroll} scrollEventThrottle={6}>
                    <FastImage
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                        source={{ uri: cdnImage(detail?.image_url, 630, 630) }}
                    />
                    <ProductTitle detail={detail} category={category} title={productName} />
                    <ProductFeature description={null} />

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
                    <View style={{ height: 60 }} />
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
