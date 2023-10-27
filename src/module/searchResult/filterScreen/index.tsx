import HeaderScreen from '@components/HeaderScreen';
import { TextNormal, TextSemiBold } from '@components/text';
import { RELEVANT } from '@constant/index';
import { FilterScreenRouteProp } from '@navigation/navigationRoute';
import { goBack } from '@navigation/service';
import { useRoute } from '@react-navigation/native';
import { ProductFilterArgs } from '@searchResult/service';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import { removeBracket } from '@util/string';
import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SIZE_PER_ROW = 4;
const COLOR_PER_ROW = 8;

const FilterScreen = () => {
    const insets = useSafeAreaInsets();

    const { params: { currentFilter, setFilter, filter, priceRange } = {} } = useRoute<FilterScreenRouteProp>();
    const { Color, Size, Type } = filter || {};

    const [subFilter, setSubFilter] = useState<Partial<ProductFilterArgs>>(currentFilter || {});

    const onApplyFilter = () => {
        //thay đổi filter ở màn ngoài
        var newFilter = { ...subFilter };
        delete newFilter.page_id;
        setFilter(newFilter);
        goBack();
    };

    const onClearFilter = () => {
        //giữ lại 1 số param cần thiết
        const { category_id, id, q } = currentFilter || {};
        setFilter({ category_id, id, q });
        goBack();
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Filter" />
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                <TextSemiBold style={styles.sectionTitle}>Most Relevant</TextSemiBold>
                <View style={styles.rowContent}>
                    {RELEVANT.map(item => (
                        <Pressable
                            hitSlop={8}
                            style={[
                                styles.buttonItem,
                                subFilter.order == item.param && {
                                    borderColor: lightColor.secondary,
                                    backgroundColor: 'white',
                                },
                            ]}
                            key={item.param}
                            onPress={() =>
                                setSubFilter(prev => ({
                                    ...prev,
                                    order: subFilter.order == item.param ? undefined : item.param,
                                }))
                            }
                        >
                            <TextNormal style={subFilter.order == item.param ? styles.textSelected : styles.textItem}>
                                {item.name}
                            </TextNormal>
                        </Pressable>
                    ))}
                </View>

                {!!Type && Type.length > 0 && (
                    <View>
                        <TextSemiBold style={styles.sectionTitle}>Type</TextSemiBold>
                        <View style={styles.rowContent}>
                            {Type.map(item => (
                                <Pressable
                                    hitSlop={8}
                                    style={[
                                        styles.buttonItem,
                                        subFilter.type_variant_id == item.id && {
                                            borderColor: lightColor.secondary,
                                            backgroundColor: 'white',
                                        },
                                    ]}
                                    key={item.id}
                                    onPress={() =>
                                        setSubFilter(prev => ({
                                            ...prev,
                                            type_variant_id: subFilter.type_variant_id == item.id ? undefined : item.id,
                                        }))
                                    }
                                >
                                    <TextNormal
                                        style={
                                            subFilter.type_variant_id == item.id ? styles.textSelected : styles.textItem
                                        }
                                    >
                                        {removeBracket(item.name || item.text)}
                                    </TextNormal>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}
                {!!Color && Color.length > 0 && (
                    <View>
                        <TextSemiBold style={styles.sectionTitle}>Color</TextSemiBold>
                        <View style={styles.rowContent}>
                            {Color.map(item => (
                                <Pressable
                                    hitSlop={8}
                                    style={[
                                        styles.buttonItem,
                                        subFilter.color_variant_id == item.id && {
                                            borderColor: lightColor.secondary,
                                            backgroundColor: 'white',
                                        },
                                    ]}
                                    key={item.id}
                                    onPress={() =>
                                        setSubFilter(prev => ({
                                            ...prev,
                                            color_variant_id:
                                                subFilter.color_variant_id == item.id ? undefined : item.id,
                                        }))
                                    }
                                >
                                    <TextNormal
                                        style={
                                            subFilter.color_variant_id == item.id
                                                ? styles.textSelected
                                                : styles.textItem
                                        }
                                    >
                                        {removeBracket(item.name || item.text)}
                                    </TextNormal>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {!!Size && Size.length > 0 && (
                    <View>
                        <TextSemiBold style={styles.sectionTitle}>Size</TextSemiBold>
                        <View style={styles.rowContent}>
                            {Size.map((item, index) => (
                                <Pressable
                                    hitSlop={8}
                                    style={[
                                        styles.buttonSize,
                                        subFilter.size_variant_id == item.id && {
                                            borderColor: lightColor.secondary,
                                            backgroundColor: 'white',
                                        },
                                        index % SIZE_PER_ROW == SIZE_PER_ROW - 1 && { marginRight: 0 },
                                    ]}
                                    onPress={() =>
                                        setSubFilter(prev => ({
                                            ...prev,
                                            size_variant_id: subFilter.size_variant_id == item.id ? undefined : item.id,
                                        }))
                                    }
                                    key={item.id}
                                >
                                    <TextNormal
                                        style={
                                            subFilter.size_variant_id == item.id ? styles.textSelected : styles.textItem
                                        }
                                    >
                                        {removeBracket(item.name || item.text)}
                                    </TextNormal>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {!!priceRange && priceRange.length > 0 && (
                    <View>
                        <TextSemiBold style={styles.sectionTitle}>Price</TextSemiBold>
                        <View style={styles.rowContent}>
                            {priceRange.map((item, index) => (
                                <Pressable
                                    hitSlop={8}
                                    style={[
                                        styles.buttonPrice,
                                        subFilter.minPrice == item.from &&
                                            subFilter.maxPrice == item.to && {
                                                borderColor: lightColor.secondary,
                                                backgroundColor: 'white',
                                            },
                                        index % 2 == 1 && { marginRight: 0 },
                                    ]}
                                    key={item.from + item.to}
                                    onPress={() =>
                                        setSubFilter(prev => ({
                                            ...prev,
                                            minPrice: subFilter.minPrice == item.from ? undefined : item.from,
                                            maxPrice: subFilter.maxPrice == item.to ? undefined : item.to,
                                        }))
                                    }
                                >
                                    <TextNormal
                                        style={
                                            subFilter.minPrice == item.from && subFilter.maxPrice == item.to
                                                ? styles.textSelected
                                                : styles.textItem
                                        }
                                    >{`${formatPrice(item.from)} - ${formatPrice(item.to)}`}</TextNormal>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: 90 }} />
            </ScrollView>
            <View
                style={[
                    styles.bottomContainer,
                    shadowTop,
                    { height: 70 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <TouchableOpacity style={styles.cancelButton} onPress={onClearFilter}>
                    <TextSemiBold style={{ fontSize: 15, color: lightColor.secondary }}>Clear</TextSemiBold>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={onApplyFilter}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Apply</TextSemiBold>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FilterScreen;

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 15,
        lineHeight: 21,
        marginTop: 16,
        color: lightColor.lightBlack,
    },
    rowContent: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
    textItem: {
        fontSize: 14.5,
        lineHeight: 21,
    },
    textSelected: {
        fontSize: 14.5,
        lineHeight: 21,
        color: lightColor.secondary,
    },
    buttonItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        marginRight: 8,
        marginTop: 8,
    },
    buttonSize: {
        width: (SCREEN_WIDTH - 34 - (SIZE_PER_ROW - 1) * 8) / SIZE_PER_ROW,
        alignItems: 'center',
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        marginRight: 8,
        marginTop: 8,
    },
    colorSize: {
        width: 36,
        height: 36,
        marginRight: 10,
        borderRadius: 36,
        overflow: 'hidden',
        marginTop: 8,
        justifyContent: 'center',
        alignItem: 'center',
    },
    buttonPrice: {
        width: (SCREEN_WIDTH - 34 - 8) / 2,
        alignItems: 'center',
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: lightColor.lightbg,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        marginRight: 8,
        marginTop: 8,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: 70,
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 100,
    },
    cancelButton: {
        width: '42%',
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: lightColor.secondary,
    },
    applyButton: {
        width: '42%',
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: lightColor.secondary,
        marginLeft: 12,
    },
});
