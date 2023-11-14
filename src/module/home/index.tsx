import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TrendExplore from './component/TrendExplore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCategory from './component/MainCategory';

import {
    useFetchCategoryBannerQuery,
    useFetchExploreProdQuery,
    useFetchExploreTrendQuery,
    useFetchHomeBannerQuery,
} from './service';
import ExploreProd from './component/ExploreProd';
import SpiceUpView from './component/SpiceUpView';
import SupportArtist from './component/SupportArtist';
import Guarantee from './component/Guarantee';
import ReferFriend from './component/ReferFriend';
import HeaderBanner from './component/HeaderBanner';
import BlogHome from './component/BlogHome';
import PopularDesign from './component/PopularDesign';
import { PrintervalLogo } from '@assets/svg';
import { usePreventGoBack } from '@navigation/customHook';
import { useAppSelector } from '@store/hook';
import ProductRow from '@components/product/ProductRow';
import FastImage from 'react-native-fast-image';

const SPICE_UP_IMG = [
    'https://picsum.photos/id/162/300/300',
    'https://picsum.photos/id/163/300/300',
    'https://picsum.photos/id/164/300/300',
];

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const prodHistory = useAppSelector(state => state.category.productHistory);

    const { data: banner0 } = useFetchHomeBannerQuery();
    const { data: trendExplore } = useFetchExploreTrendQuery();

    const { data: banner } = useFetchCategoryBannerQuery();
    const { data: explore } = useFetchExploreProdQuery();

    usePreventGoBack();

    useLayoutEffect(() => {
        //testing purpose
        FastImage.preload(SPICE_UP_IMG.map(item => ({ uri: item })));
    }, []);
    return (
        <View style={[styles.container, { paddingTop: 10 + insets.top / 1.25 }]}>
            <View style={{ width: '100%', paddingBottom: 10 }}>
                <PrintervalLogo width={144} height={36} style={{ marginLeft: 20 }} />
            </View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} removeClippedSubviews>
                <HeaderBanner data={banner0} />
                <TrendExplore data={trendExplore ?? []} />
                <MainCategory data={banner?.result} />
                <ExploreProd data={explore?.result} />
                <SpiceUpView listImg={SPICE_UP_IMG} />
                <PopularDesign />
                <SupportArtist />
                <Guarantee />
                <ReferFriend />
                <BlogHome />
                <ProductRow data={prodHistory} title="Recently viewed" />
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});
