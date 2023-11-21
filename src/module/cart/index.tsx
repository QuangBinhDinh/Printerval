import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColor } from '@styles/color';
import HeaderScreen from '@components/HeaderScreen';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useAppSelector } from '@store/hook';
import { useFetchCartQuery, useGetPreviewDesignMutation, useRemoveCartItemMutation } from './service';
import { CartItem } from '@type/common';
import CartItemCard from './component/CartItemCard';
import { SCREEN_WIDTH, formatPrice } from '@util/index';
import FancyButton from '@components/FancyButton';
import { TextSemiBold } from '@components/text';
import { shadowTop } from '@styles/shadow';
import InvisibleLoad from '@components/loading/InvisibleLoad';
import PopupRemoveCart from './component/PopupRemoveCart';
import LoadingCart from './component/LoadingCart';
import ProductEditModal from './component/ProductEditModal';
import PreviewDesign from './component/PreviewDesign';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import EmptyCartScreen from './component/EmptyCartScreen';
import { goBack, navigate } from '@navigation/service';

/**
 * Selector trả về giá trị boolean  có đang call api nào liên quan đến cart không
 */
const fetchSelector = createSelector(
    [(state: RootState) => state.api.mutations, (state: RootState) => state.api.queries],
    (mutation, query) => {
        const list_api = [
            'addToCart',
            'fetchCart',
            'updateQuantity',
            'updateCartConfig',
            'removeCartItem',
            'removeCartV2',
        ];
        return (
            Object.values(mutation).some(
                item => list_api.includes(item?.endpointName || '') && item?.status == 'pending',
            ) ||
            Object.values(query).some(item => list_api.includes(item?.endpointName || '') && item?.status == 'pending')
        );
    },
);

const CartScreen = () => {
    const { userInfo, token } = useAppSelector(state => state.auth);

    //payConfig phải khác null mới hiện cart !!!
    const payConfig = useAppSelector(state => state.cart.paymentConfig);

    //timestamp dùng để refresh lại qty input. Mặc định input qty của cart item sẽ chỉ nhận giá trị từ data trả vể lần đầu tiên
    //khi đuọc mount nên cần trường này để refresh lại cho 1 số trường hợp
    const [qtyTimestamp, setRefreshQty] = useState<number | null>(Date.now());
    const refreshQty = () => {
        setRefreshQty(Date.now());
    };

    const {
        data: { items, sub_total } = {},
        isFetching,
        isLoading,
        isSuccess,
        refetch,
    } = useFetchCartQuery({ customerId: userInfo?.id || 1, token });
    const [deleteCartItem] = useRemoveCartItemMutation();

    const finalSubTotal = useMemo(() => {
        var price = 0;
        if (!!items && items.length > 0 && payConfig) {
            price = items.reduce((prev, next) => {
                let design_fee = 0;
                if (next.configurations?.includes('buy_design')) {
                    if (next.is_include_design_fee) design_fee = payConfig.design_fee + payConfig.design_include_fee;
                    else design_fee = payConfig.design_fee;
                }
                return prev + next.price * next.quantity + design_fee;
            }, 0);
        }
        return price;
    }, [items, sub_total, payConfig]);

    const [displayCart, setDisplayCart] = useState<CartItem[]>([]);
    const removeCart = useCallback((id: number) => {
        setDisplayCart(prev => prev.filter(item => item.id !== id));
        deleteCartItem(id);
    }, []);

    // ID product đang được chỉnh sửa (nếu có)
    const [prodEditing, setEditing] = useState<CartItem | null>(null);

    useEffect(() => {
        if (isSuccess && !!items) {
            setDisplayCart(items);
        }
    }, [isSuccess, items, finalSubTotal]);

    const renderItem = ({ item }: { item: CartItem }) => (
        <CartItemCard item={item} removeCart={removeCart} editCart={setEditing} />
    );
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <InvisibleLoad visible={isFetching} /> */}

            <HeaderScreen title="Your Cart" />

            {isLoading ? (
                <LoadingCart />
            ) : (
                <KeyboardAwareFlatList
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid
                    enableResetScrollToCoords={false}
                    data={displayCart}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    refreshControl={<RefreshControl onRefresh={refetch} refreshing={false} />}
                    ListEmptyComponent={<EmptyCartScreen />}
                />
            )}

            {!isLoading && <CartBottom subTotal={finalSubTotal} isEmpty={displayCart.length == 0} />}

            <PopupRemoveCart />

            <PreviewDesign cartList={items} />

            {!!prodEditing && (
                <ProductEditModal prodEdit={prodEditing} setProduct={setEditing} refreshQty={refreshQty} />
            )}
        </View>
    );
};

export default CartScreen;

const CartBottom = ({ subTotal, isEmpty }: { subTotal: number; isEmpty: boolean }) => {
    const insets = useSafeAreaInsets();
    const cartLoading = useSelector(fetchSelector);
    const sub = useAppSelector(state => state.cart.cart_sub_total);

    const toCheckout = () => {
        console.log('Checkout');
    };

    const toShopping = () => {
        navigate('HomeScreen');
    };
    if (isEmpty)
        return (
            <View
                style={[
                    styles.bottomView,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2, justifyContent: 'center' },
                    shadowTop,
                ]}
            >
                <FancyButton
                    style={[styles.button, { width: '100%' }]}
                    backgroundColor={lightColor.secondary}
                    onPress={toShopping}
                >
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Shopping now</TextSemiBold>
                </FancyButton>
            </View>
        );

    return (
        <View
            style={[styles.bottomView, { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 }, shadowTop]}
        >
            <TextSemiBold style={styles.price}>{formatPrice(subTotal)}</TextSemiBold>

            <FancyButton
                style={styles.button}
                backgroundColor={lightColor.secondary}
                onPress={toCheckout}
                disabled={cartLoading}
            >
                <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Checkout</TextSemiBold>
            </FancyButton>
        </View>
    );
};

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
