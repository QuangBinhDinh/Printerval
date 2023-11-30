import HeaderScreen from '@components/HeaderScreen';
import { useAppSelector } from '@store/hook';
import { SCREEN_WIDTH, splitColArray } from '@util/index';
import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import DynamicCard from '@components/product/DynamicCard';
import { lightColor } from '@styles/color';
import { TextNormal, TextSemiBold } from '@components/text';

const WishlistScreen = () => {
    //for testing UI
    const testData = useAppSelector(state => state.category.productHistory);

    //real data here
    const wishlist = useAppSelector(state => state.auth.wishlist);

    const newData = splitColArray(testData);
    const isEmpty = !newData || newData.length == 0;

    const addAllToCart = () => {};

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Wishlist" />

            {!isEmpty && (
                <ScrollView style={{ flex: 1 }} removeClippedSubviews stickyHeaderIndices={[0]}>
                    <View style={{ height: 75, width: SCREEN_WIDTH }}>
                        <View style={styles.rowHeader}>
                            <TextNormal>Have 14 products</TextNormal>
                            <Pressable style={styles.buttonAll} onPress={addAllToCart}>
                                <TextSemiBold style={{ color: 'white', marginTop: 1 }}>All add to cart</TextSemiBold>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.productList}>
                        {newData.map((col, index) => (
                            <View key={index} style={[{ width: '48%' }]}>
                                {col.map(item => (
                                    <DynamicCard item={item} key={item.id} wishlist />
                                ))}
                            </View>
                        ))}
                    </View>
                    <View style={{ height: 70 }} />
                </ScrollView>
            )}
        </View>
    );
};

export default WishlistScreen;

const styles = StyleSheet.create({
    rowHeader: {
        height: 75,
        width: SCREEN_WIDTH,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    productList: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    buttonAll: {
        height: 45,
        width: 146,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
    },
});
