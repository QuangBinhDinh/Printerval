import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TrendExplore from './component/TrendExplore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCategory from './component/MainCategory';

import { useFetchCategoryBannerQuery, useFetchExploreProdQuery } from './service';
import ExploreProd from './component/ExploreProd';
import IntroView from './component/IntroView';
import SupportArtist from './component/SupportArtist';
import Guarantee from './component/Guarantee';
import ReferFriend from './component/ReferFriend';

//testing commit
const HomeScreen = () => {
    const insets = useSafeAreaInsets();

    const { data: banner } = useFetchCategoryBannerQuery();
    const { data: explore } = useFetchExploreProdQuery();
    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} removeClippedSubviews>
                <View style={{ height: 10 + insets.top / 1.5 }} />
                <TrendExplore />
                <MainCategory data={banner?.result} />
                <ExploreProd data={explore?.result} />
                <IntroView />
                <SupportArtist />
                <Guarantee />
                <ReferFriend />
                <View style={{ height: 80 }} />
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
