import React, { useState, useMemo, memo } from 'react';
import { NewVariants, VariantPrice, ProdVariants, Options, ErrorField } from '@type/product';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { capitalize } from 'lodash';
import { TextNormal, TextSemiBold } from '@components/text';
import ColorView from './ColorView';
import { formatPrice } from '@util/index';
import SelectView from './SelectView';
import { lightColor } from '@styles/color';

interface IProps {
    changeValue: (field: string) => (id: number) => void;
    options: Options;
    mappings: NewVariants | null;
    selected: any[] | null;
    variantPrice: VariantPrice;
    detailVariant: ProdVariants | null;
    colIndex: number;
    errors: ErrorField | null;
}
const VariantSection = ({
    changeValue,
    options,
    mappings,
    selected,
    variantPrice,
    detailVariant,
    colIndex,
    errors,
}: IProps) => {
    const curPrice = ` (${formatPrice(detailVariant?.price ?? '')})`; // hiển thị giá biến thể đang được chọn

    const fieldList = Object.keys(options);
    if (fieldList.length == 0 || !mappings || !selected || !variantPrice || !detailVariant) return null;

    /**
     * Color mặc định ở đầu khi display => sắp xếp là thứ tự trong bộ ID selected
     */
    const displaySelected = useMemo(() => {
        if (colIndex == -1) return selected;
        var colorId = selected[colIndex];
        return [colorId, ...selected.filter(id => id !== colorId)];
    }, [selected, colIndex]);

    //console.log('Display selected', displaySelected);

    return (
        <View style={{ width: '100%', marginTop: 24 }}>
            {Object.entries(options).map(([title, ids], index) => {
                const priceList = variantPrice[title];
                const varDetails = ids.map(num => mappings[num]);
                if (title == 'color') {
                    return (
                        <View key={title}>
                            <TextSemiBold style={styles.optionTitle}>
                                {capitalize(title)}: <TextNormal>{mappings[displaySelected[index]].name}</TextNormal>
                            </TextSemiBold>
                            <ScrollView
                                style={styles.optionRow}
                                contentContainerStyle={styles.optionScroll}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {varDetails.map(item => (
                                    <ColorView
                                        input={displaySelected}
                                        item={item}
                                        setColor={changeValue(title)}
                                        key={item.id}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    );
                }
                if (priceList) {
                    var priceOptions = varDetails.map((i, j) => ({
                        ...i,
                        nameWithPrice: i.name + ` (${formatPrice(priceList[j])})`,
                    }));

                    return (
                        <View key={title} style={{ marginTop: 16 }}>
                            <TextSemiBold style={styles.optionTitle}>{capitalize(title)}</TextSemiBold>
                            <ScrollView
                                style={styles.optionRow}
                                contentContainerStyle={styles.optionScroll}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {priceOptions.map(item => (
                                    <SelectView
                                        input={displaySelected}
                                        item={item}
                                        setVariant={changeValue(title)}
                                        key={item.id}
                                    />
                                ))}
                            </ScrollView>
                            {!displaySelected[index] && errors?.type == 'size' && (
                                <TextNormal style={styles.errorText}>Please select a size</TextNormal>
                            )}
                        </View>
                    );
                }
                return (
                    <View key={title} style={{ marginTop: 16 }}>
                        <TextSemiBold style={styles.optionTitle}>{capitalize(title)}</TextSemiBold>
                        <ScrollView
                            style={styles.optionRow}
                            contentContainerStyle={styles.optionScroll}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {varDetails.map(item => (
                                <SelectView
                                    input={displaySelected}
                                    item={item}
                                    setVariant={changeValue(title)}
                                    key={item.id}
                                />
                            ))}
                        </ScrollView>
                    </View>
                );
            })}
        </View>
    );
};

export default memo(VariantSection);

const styles = StyleSheet.create({
    optionRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 4,
    },
    optionScroll: {
        alignItems: 'center',
        paddingLeft: 18,
        paddingRight: 6,
    },
    colorView: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 12,
    },
    optionTitle: { fontSize: 15, color: 'black', marginLeft: 18 },

    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 18,
        marginTop: 24,
    },
    printContainer: {
        height: 40,
        width: 150,
        flexDirection: 'row',
    },
    optionFront: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,

        borderColor: lightColor.grayout,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
    },
    optionBack: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,

        borderColor: lightColor.grayout,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    text: {
        fontSize: 15,
        marginTop: 2,
    },
    textSelected: { color: lightColor.secondary },
    errorText: {
        fontSize: 13,
        color: lightColor.error,
        marginLeft: 22,
        marginTop: 8,
        lineHeight: 15,
    },
});