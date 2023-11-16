import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { goBack } from '@navigation/service';
import HeaderScreen from '@components/HeaderScreen';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useAppSelector } from '@store/hook';
import { useFetchCartQuery, useRemoveCartItemMutation, useUpdateQuantityMutation } from './service';
import { CartItem } from '@type/common';
import CartItemCard from './component/CartItemCard';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import FancyButton from '@components/FancyButton';
import { TextSemiBold } from '@components/text';
import { shadowTop } from '@styles/shadow';
import InvisibleLoad from '@components/loading/InvisibleLoad';
import PopupRemoveCart from './component/PopupRemoveCart';

const CartScreen = () => {
    const insets = useSafeAreaInsets();
    const { userInfo, token } = useAppSelector(state => state.auth);
    const {
        data: { items, sub_total } = {},
        isFetching,
        isLoading,
        isSuccess,
    } = useFetchCartQuery({ customerId: userInfo?.id || 1, token });
    const [deleteCartItem] = useRemoveCartItemMutation();

    const [displayCart, setDisplayCart] = useState<CartItem[]>([]);
    const removeCart = useCallback((id: number) => {
        setDisplayCart(prev => prev.filter(item => item.id !== id));
        deleteCartItem(id);
    }, []);

    useEffect(() => {
        if (isSuccess && !!items) setDisplayCart(items);
    }, [isSuccess, items]);

    const renderItem = ({ item }: { item: CartItem }) => <CartItemCard item={item} removeCart={removeCart} />;
    const toCheckout = () => {};
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <InvisibleLoad visible={isLoading} />
            <HeaderScreen title="Your Cart" />
            <KeyboardAwareFlatList
                style={{ flex: 1 }}
                enableOnAndroid
                enableResetScrollToCoords={false}
                data={displayCart}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ListFooterComponent={<View style={{ height: 100 }} />}
            />

            <View
                style={[
                    styles.bottomView,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                    shadowTop,
                ]}
            >
                <TextSemiBold style={styles.price}>{sub_total}</TextSemiBold>

                <FancyButton
                    style={styles.button}
                    backgroundColor={lightColor.secondary}
                    onPress={toCheckout}
                    disabled={isLoading}
                >
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Checkout</TextSemiBold>
                </FancyButton>
            </View>

            <PopupRemoveCart />
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    bottomView: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        zIndex: 100,
    },
    price: {
        fontSize: 20,
        lineHeight: 24,
        color: lightColor.price,
    },
    button: {
        width: 220,
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
