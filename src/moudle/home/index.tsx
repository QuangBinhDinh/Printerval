import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';
import TrendExplore from './component/TrendExplore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCategory from './component/MainCategory';

import { useFetchCategoryBannerQuery, useFetchExploreProdQuery } from './service';

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
