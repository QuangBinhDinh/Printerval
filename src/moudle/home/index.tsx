import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TrendExplore from './component/TrendExplore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCategory from './component/MainCategory';

import { useFetchCategoryBannerQuery, useFetchExploreProdQuery } from './service';
import ExploreProd from './component/ExploreProd';
import SpiceUpView from './component/SpiceUpView';
import SupportArtist from './component/SupportArtist';
import Guarantee from './component/Guarantee';
import ReferFriend from './component/ReferFriend';
import HeaderBanner from './component/HeaderBanner';
import BlogHome from './component/BlogHome';
import PopularDesign from './component/PopularDesign';

//testing commit
const HomeScreen = () => {
    const insets = useSafeAreaInsets();

    const { data: banner } = useFetchCategoryBannerQuery();
    const { data: explore } = useFetchExploreProdQuery();
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} removeClippedSubviews>
                <View style={{ height: 16 + insets.top / 1.5 }} />
                <HeaderBanner />
                <TrendExplore />
                <MainCategory data={banner?.result} />
                <ExploreProd data={explore?.result} />
                <SpiceUpView />
                <PopularDesign />
                <SupportArtist />
                <Guarantee />
                <ReferFriend />
                <BlogHome />
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
