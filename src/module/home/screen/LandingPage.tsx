import HeaderScreen from '@components/HeaderScreen';
import { RANDOM_IMAGE_URL } from '@constant/index';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '@store/hook';
import ProductRow from '@components/product/ProductRow';

const LandingPage = () => {
    const prodHistory = useAppSelector(state => state.category.productHistory);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Landing Page" />
            <ScrollView style={{ flex: 1 }} removeClippedSubviews>
                <FastImage style={styles.banner} source={{ uri: RANDOM_IMAGE_URL }} resizeMode="cover" />

                <ProductRow title="Custom T-shirts" data={prodHistory} />

                <ProductRow title="Custom Ornaments" data={prodHistory} />

                <ProductRow title="Passport covers" data={prodHistory} />

                <ProductRow title="Car Sun Shades" data={prodHistory} />

                <ProductRow title="Ancient Mugs" data={prodHistory} />

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default LandingPage;

const styles = StyleSheet.create({
    banner: {
        width: SCREEN_WIDTH,
        height: 240,
        //marginTop: 24,
    },
});
