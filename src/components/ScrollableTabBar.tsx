import React, { ClassAttributes, LegacyRef, memo, useEffect, useRef } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { SCREEN_WIDTH } from '@util/index';

interface IProps {
    goToPage?: (pageNumber: number) => void | undefined;
    tabs?: JSX.Element[] | undefined;
    activeTab?: number | undefined;
}
const ScrollableTabBar = ({ activeTab, goToPage, tabs }: IProps) => {
    const ref = useRef<any>();
    const goToTab = (index: number) => {
        if (goToPage) goToPage(index);
    };
    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            onPress={() => goToTab(index)}
            style={[styles.viewItem, activeTab === index && styles.viewActive]}
        >
            <TextNormal style={{ color: activeTab === index ? lightColor.secondary : '#444' }}>{item}</TextNormal>
        </TouchableOpacity>
    );

    useEffect(() => {
        ref.current?.scrollToIndex({ index: activeTab || 0, animated: true });
    }, [activeTab]);
    return (
        <View style={styles.container}>
            <FlatList
                data={tabs}
                ref={ref}
                horizontal
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
            ></FlatList>
        </View>
    );
};
export default memo(ScrollableTabBar);
const styles = StyleSheet.create({
    container: { borderBottomColor: lightColor.borderGray, borderBottomWidth: 1, backgroundColor: '#fff' },
    viewItem: { height: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    viewActive: { borderBottomWidth: 1.5, borderBottomColor: lightColor.secondary },
});
