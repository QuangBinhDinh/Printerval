import React, { memo } from 'react';
import { FlatList, InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import { useFetchDefaultTrendingQuery, useFetchSuggestWordQuery } from '../service';
import { TrendingUp } from '@assets/svg';
import { TextNormal } from '@components/text';
import FastImage from 'react-native-fast-image';
import { RANDOM_IMAGE_URL } from '@constant/index';
import { lightColor } from '@styles/color';
import { useAppDispatch, useAppSelector } from '@store/hook';
import category from '@category/reducer';
import { pushNavigate } from '@navigation/service';
import { Icon } from '@rneui/base';

const TrendingView = ({ searchTerm }: { searchTerm: string }) => {
    const dispatch = useAppDispatch();
    const { data: trend } = useFetchDefaultTrendingQuery();
    const { data: suggest } = useFetchSuggestWordQuery(searchTerm, { skip: !searchTerm });
    const displayText: any[] = suggest ?? trend ?? [];

    const history = useAppSelector(state => state.category.searchHistory);

    const searchByKeyword = (textSearch: string) => {
        pushNavigate('SearchResult', { title: `Result for ${textSearch}`, keyword: textSearch });
        InteractionManager.runAfterInteractions(() => {
            dispatch(category.actions.setHistory(textSearch));
        });
    };
    return (
        <View style={styles.container}>
            {history.map((item, index) => (
                <Pressable key={index} style={styles.trendItem} onPress={() => searchByKeyword(item)} hitSlop={12}>
                    <Icon type="material-icon" name="history" size={20} color={lightColor.price} />
                    <TextNormal style={styles.normalText}>{item}</TextNormal>
                </Pressable>
            ))}
            {displayText.map((item, index) => (
                <Pressable
                    key={index}
                    style={styles.trendItem}
                    onPress={() => searchByKeyword(item.keyword)}
                    hitSlop={12}
                >
                    <TrendingUp width={18} height={18} style={{ marginTop: 2 }} />
                    <TextNormal style={styles.normalText}>{item.keyword}</TextNormal>
                </Pressable>
            ))}
            <SuggestCategory data={[1, 2, 3, 4, 5]} />
        </View>
    );
};

export default memo(TrendingView);

const SuggestCategory = memo(({ data }: { data: any[] }) => {
    const renderItem = ({ item }: { item: any }) => (
        <Pressable style={styles.item}>
            <FastImage style={{ width: 200, height: 120, borderRadius: 6 }} source={{ uri: RANDOM_IMAGE_URL }} />
            <TextNormal style={styles.horizonText}>Sample Category</TextNormal>
        </Pressable>
    );
    return (
        <FlatList
            data={data}
            style={styles.list}
            contentContainerStyle={{ paddingRight: 16, paddingLeft: 4 }}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews
            horizontal
        />
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 24,

        width: '100%',
    },
    trendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginLeft: 16 },
    list: {
        marginTop: 26,
        height: 154,
        width: '100%',
    },
    item: {
        width: 200,
        height: 154,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    normalText: { fontSize: 15, marginLeft: 8, lineHeight: 21 },
    horizonText: { fontSize: 15, marginLeft: 3, lineHeight: 21 },
});
