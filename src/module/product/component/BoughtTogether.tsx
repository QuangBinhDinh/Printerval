import React, { memo, useCallback, useState } from 'react';
import { TextNormal, TextSemiBold } from '@components/text';
import { ProductScreenRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { Product } from '@type/common';

import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import { sumBy } from 'lodash';
import FancyButton from '@components/FancyButton';

const BoughtTogether = ({ data, currentProd }: { data?: Product[]; currentProd?: Product }) => {
    const [selected, setSelected] = useState<number[]>([]);

    const selectProduct = useCallback((id: number) => {
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(i => i != id);
            return prev.concat(id);
        });
    }, []);

    const addAllToCart = () => {};

    if (!data || data.length == 0) return null;
    return (
        <View style={styles.container}>
            <TextSemiBold style={styles.sectionTitle}>Frequently bought together</TextSemiBold>
            <BoughtItem item={currentProd} disable selected={selected} />
            {data.map(item => (
                <BoughtItem item={item} key={item.id} select={selectProduct} selected={selected} />
            ))}

            <View style={styles.addAllRow}>
                <TextNormal>
                    Price:{'  '}
                    <TextNormal style={{ color: lightColor.price }}>
                        {formatPrice(sumBy(data, i => Number(i.price)))}
                    </TextNormal>
                </TextNormal>

                <FancyButton style={styles.addButton} backgroundColor={lightColor.secondary} onPress={addAllToCart}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Add add to cart</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default memo(BoughtTogether);

interface ItemProps {
    item?: Product;

    disable?: boolean;

    select?: any;

    selected: number[];
}
const BoughtItem = memo(({ item, disable, select, selected }: ItemProps) => {
    const checked = selected?.includes(item?.id) || disable;

    if (!item) return null;
    return (
        <View style={styles.item}>
            <Pressable
                style={[styles.checkBox, disable && { opacity: 0.5 }]}
                onPress={() => select(item?.id)}
                disabled={disable}
                hitSlop={20}
            >
                {checked && <Icon size={14} color={lightColor.bluesky} type="feather" name="check" />}
            </Pressable>
            <FastImage style={styles.prodImg} resizeMode="cover" source={{ uri: item.image_url }} />
            <View style={{ flex: 1, height: 100 }}>
                <TextSemiBold numberOfLines={1}>{item.name}</TextSemiBold>
                <TextNormal style={[styles.grayText, { marginTop: 6 }]} numberOfLines={1}>
                    Sample variants
                </TextNormal>
                <Pressable style={styles.editView}>
                    <Icon type="feather" size={16} color={lightColor.bluesky} name="edit" />
                    <TextNormal style={{ fontSize: 13, color: lightColor.bluesky, marginTop: 3 }}> Edit</TextNormal>
                </Pressable>

                <TextSemiBold style={styles.price}>
                    {item.display_price} <TextNormal style={styles.oldPrice}>{item.display_high_price}</TextNormal>
                </TextSemiBold>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 32,
        paddingHorizontal: 18,
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 24,
    },
    item: {
        width: '100%',
        height: 100,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderRadius: 6,
        borderColor: lightColor.bluesky,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    prodImg: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 6,
        overflow: 'hidden',
    },
    grayText: {
        fontSize: 13,
        lineHeight: 17,
        color: lightColor.grayout,
    },
    editView: {
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },

    price: {
        color: lightColor.price,
        fontSize: 18,
        marginTop: 4,
    },
    oldPrice: { fontSize: 14, color: lightColor.grayout, textDecorationLine: 'line-through' },

    addAllRow: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        paddingTop: 16,
    },
    addButton: {
        width: SCREEN_WIDTH * 0.55,
        height: 45,
        borderRadius: 6,
        backgroundColor: lightColor.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
