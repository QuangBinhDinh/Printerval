import React, { memo, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import HeaderScreen from '@components/HeaderScreen';
import { useRoute } from '@react-navigation/native';
import { SubCollectionRouteProp } from '@navigation/navigationRoute';
import { useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import FastImage from 'react-native-fast-image';
import { TextNormal } from '@components/text';
import { Icon } from '@rneui/base';
import { cdnImage } from '@util/cdnImage';
import { SCREEN_WIDTH } from '@util/index';

const SubCollection = () => {
    const category = useAppSelector(state => state.category.categoryTree);
    const {
        params: { parentId, title },
    } = useRoute<SubCollectionRouteProp>();

    const subList: any[] = useMemo(() => category.find(item => item.id == parentId)?.children, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title={title} />
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 4 }}
                showsVerticalScrollIndicator={false}
            >
                {subList?.map((item, index, arr) => (
                    <SubItem item={item} key={item.id} last={index == arr.length - 1} />
                ))}
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

export default SubCollection;

const SubItem = memo(({ item, last }: { item: any; last: boolean }) => {
    return (
        <Pressable style={[styles.item, last && { borderBottomWidth: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage style={styles.image} source={{ uri: cdnImage(item.image_url, 250, 250) }} />
                <TextNormal style={{ fontSize: 17, width: SCREEN_WIDTH * 0.5 }} numberOfLines={2}>
                    {item.name}
                </TextNormal>
            </View>
            <Icon type="feather" name="chevron-right" size={26} color={lightColor.grayout} />
        </Pressable>
    );
});

const styles = StyleSheet.create({
    item: {
        height: 104,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: lightColor.graybg,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 60,
        overflow: 'hidden',
        marginRight: 18,
    },
});
