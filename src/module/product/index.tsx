import { Icon } from '@rneui/base';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import { ShareIcon } from '@assets/svg';
import { useFetchProductInfoQuery } from './service';
import { useRoute } from '@react-navigation/native';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import FastImage from 'react-native-fast-image';
import { cdnImage } from '@util/cdnImage';
import { goBack } from '@navigation/service';
import ProductTitle from './component/ProductTitle';
import ProductFeature from './component/ProductFeature';
import { SCREEN_WIDTH } from '@util/index';
import { TextNormal, TextSemiBold } from '@components/text';

const DetailProduct = () => {
    const {
        params: { productId, productName },
    } = useRoute<ProductScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const { data: { result } = {} } = useFetchProductInfoQuery(productId);

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 6 + insets.top / 1.5 }}>
            <View style={[styles.header, { height: 54 + insets.top / 1.5, paddingTop: 6 + insets.top / 1.5 }]}>
                <Pressable style={styles.button} onPress={goBack}>
                    <Icon type="antdesign" name="arrowleft" size={22} color={lightColor.secondary} />
                </Pressable>
                <Pressable style={styles.button}>
                    <ShareIcon width={26} height={22} />
                </Pressable>
            </View>
            {!!result && (
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    // contentContainerStyle={{ paddingTop: 6 + insets.top / 1.5 }}
                >
                    <FastImage
                        style={{ width: '100%', aspectRatio: 1 }}
                        resizeMode="cover"
                        source={{ uri: cdnImage(result?.product?.image_url, 630, 630) }}
                    />
                    <ProductTitle detail={result.product} category={result.category} title={productName} />
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

                    <View style={{ height: 60 }} />
                </KeyboardAwareScrollView>
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
