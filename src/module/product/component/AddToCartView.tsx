import React, { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import FancyButton from '@components/FancyButton';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { DynamicObject, Nullable } from '@type/base';
import { Product } from '@type/common';
import { ErrorField, NewVariants, ProdVariants } from '@type/product';
import { SCREEN_WIDTH, formatPrice, primitiveObj } from '@util/index';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddToCartMutation, useLazyFetchCartQuery } from '../../cart/service';
import { AddToCartBody } from '@cart/type';
import { useAppSelector } from '@store/hook';
import { navigate } from '@navigation/service';
import { alertSuccess } from '@components/popup/PopupSuccess';
import { debounce, isEqual } from 'lodash';

interface IProps {
    detail: Nullable<Product>;

    /**
     * Thông tin variant đang được chọn (nếu có)
     */
    detailVariant: Nullable<ProdVariants>;

    /**
     * Bộ ID của variant
     */
    inputs: any[] | null;

    configuration: Nullable<DynamicObject>;

    hasCustomText: boolean;

    quantity: string;

    printBack: boolean;

    errors: Nullable<ErrorField>;

    setError: any;

    /**
     * Offset 1 số element cần scroll đến
     */
    offset: {
        sizeOffset: number;
        textInputOffset: number;
        quantityOffset: number;
    };

    prodNoVariant: boolean;
}
const AddToCartView = forwardRef<any, IProps>(
    (
        {
            detail,
            detailVariant,
            inputs,
            configuration,
            hasCustomText,
            quantity,
            printBack,
            prodNoVariant,
            setError,
            offset,
        },
        ref,
    ) => {
        const insets = useSafeAreaInsets();
        const [pushCart, { isLoading }] = useAddToCartMutation();
        const [fetchCart] = useLazyFetchCartQuery();

        const { userInfo, token } = useAppSelector(state => state.auth);
        const cartList = useAppSelector(state => state.cart.items);

        const productPrice = detailVariant?.price || detail?.price || 0;
        const productOldPrice = detailVariant?.high_price || detail?.high_price || 0;
        const notSelectedVariant = !inputs || inputs.includes(null); // chưa chọn option (có ID null) thì k cho thao tác button

        const [sizeSelected, setSizeSelected] = useState<'none' | 'first' | 'second'>(); // nếu là first sẽ auto addToCart khi user chọn size lần kế tiếp

        const addToCart = () => {
            var timeStamp = Date.now();

            // kiểm tra sp custom có config đúng chưa
            if (notSelectedVariant) {
                setError({ timeStamp, type: 'size' });
                setSizeSelected('first');
                ref?.current?.scrollToPosition(0, offset.sizeOffset);
            } else if (!checkConfigImage(configuration || {})) {
                setError({ timeStamp, type: 'custom_image' });
                ref?.current?.scrollToPosition(0, offset.sizeOffset);
            } else if (!checkConfiguration(configuration || {})) {
                setError({ timeStamp, type: 'custom_text' });
                ref?.current?.scrollToPosition(0, offset.textInputOffset);
            } else {
                //phải login mới addToCart
                if (!userInfo) {
                    navigate('LoginScreen', { prevScreen: 'Product', onLogin: handleAddToCart });
                } else handleAddToCart({ token, customerId: userInfo.id });
            }
        };

        const handleAddToCart = async ({ token, customerId }: { token: string; customerId: number }) => {
            if (!detailVariant || !detail) return;

            let params: AddToCartBody = {
                productId: detail.id,
                productSkuId: detailVariant.id != -1 ? detailVariant.id : '',
                customerToken: token,
                customerId,
                quantity,
            };

            let configObject: DynamicObject = {};
            if (printBack) {
                configObject['print_location'] = 'back';
            } else if (printBack == false) configObject['print_location'] = 'front';

            if (configuration) {
                // add param còn lại (chỉ add khi value không rỗng)
                var filterConfiguration = Object.entries(configuration).reduce((prev: any, [key, value]) => {
                    if (value != '') prev[key] = value;
                    return prev;
                }, {});
                configObject = { ...configObject, ...filterConfiguration };
            }
            if (Object.keys(configObject).length > 0) params.configurations = JSON.stringify(configObject);

            //trường hợp thêm sp có config y hệt với sp đã ở trong cart
            if (cartList.length > 0) {
                var same_variant = cartList.find(
                    item => item.product_id == detail?.id && item.product_sku_id == detailVariant.id,
                );
                if (same_variant?.configurations) {
                    var old_config = primitiveObj(JSON.parse(same_variant.configurations));
                    delete old_config.buy_design;
                    delete old_config.design_fee;

                    if (isEqual(old_config, configObject)) {
                        console.log('THIS ITEM ALREADY IN CART !!!');
                        params.configurations = same_variant.configurations;
                    }
                }
            }
            setError(null);
            const res = await pushCart(params).unwrap();
            if (res.status == 'successful') {
                alertSuccess('Product added to cart!');
                fetchCart({ token, customerId });
            }
        };

        /**
         * Với sp không có variant
         */
        const addNoVariant = () => {
            var timeStamp = Date.now();

            if (!checkConfigImage(configuration || {})) {
                setError({ timeStamp, type: 'custom_image' });
                ref?.current?.scrollToPosition(0, offset.sizeOffset);
            } else if (!checkConfiguration(configuration || {})) {
                setError({ timeStamp, type: 'custom_text' });
                ref?.current?.scrollToPosition(0, offset.textInputOffset);
            } else {
                if (!userInfo) {
                    navigate('LoginScreen', { prevScreen: 'Product', onLogin: handleAddNoVariant });
                } else handleAddNoVariant({ token, customerId: userInfo.id });
            }
        };
        const handleAddNoVariant = async ({ token, customerId }: { token: string; customerId: number }) => {
            var params: AddToCartBody = {
                productId: detail?.id ?? '',
                customerToken: token,
                customerId,
                quantity,
            };
            let configObject: { [key: string]: any } = {};
            if (configuration) {
                // add param còn lại (chỉ add khi value không rỗng)
                var filterConfiguration = Object.entries(configuration).reduce((prev: any, [key, value]) => {
                    if (value != '') prev[key] = value;
                    return prev;
                }, {});
                configObject = { ...configObject, ...filterConfiguration };
            }
            if (Object.keys(configObject).length > 0) params.configurations = JSON.stringify(configObject);

            //trường hợp thêm sp có config y hệt với sp đã ở trong cart
            if (cartList.length > 0) {
                var same_variant = cartList.find(item => item.product_id == detail?.id);
                if (same_variant?.configurations) {
                    var old_config = primitiveObj(JSON.parse(same_variant.configurations));
                    delete old_config.buy_design;
                    delete old_config.design_fee;

                    if (isEqual(old_config, configObject)) {
                        console.log('THIS ITEM ALREADY IN CART !!!');
                        params.configurations = same_variant.configurations;
                    }
                }
            }
            setError(null); // clear error
            const res = await pushCart(params).unwrap();
            if (res.status == 'successful') {
                alertSuccess('Product added to cart!');
                fetchCart({ token, customerId });
            }
        };

        useEffect(() => {
            // auto add to cart nếu đã hiện wanring select size trước đó
            // không auto add to cart nếu sp có custom text hay chưa login
            if (!inputs?.includes(null) && sizeSelected == 'first' && !hasCustomText && !!userInfo) {
                // console.log('AUTO ADD TO CART HERE');
                setSizeSelected('second');
                handleAddToCart({ token, customerId: userInfo.id });
            }
        }, [sizeSelected, handleAddToCart, inputs, token, userInfo, hasCustomText]);

        /**
         * Show thanh add to cart ở dưới khi data sẵn sàng
         */
        const visible = useMemo(() => {
            var isVisible = false;
            if (!prodNoVariant) {
                isVisible = !!detail && !!detailVariant;
            } else {
                isVisible = !!detail;
            }
            return isVisible;
        }, [detail, detailVariant, prodNoVariant]);
        if (!visible) return null;
        return (
            <View
                style={[
                    styles.container,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                    shadowTop,
                ]}
            >
                <View>
                    <TextSemiBold style={styles.price}>{formatPrice(productPrice)}</TextSemiBold>
                    <TextNormal style={styles.oldPrice}>{formatPrice(productOldPrice)}</TextNormal>
                </View>

                <FancyButton
                    style={styles.button}
                    backgroundColor={lightColor.secondary}
                    onPress={prodNoVariant ? addNoVariant : addToCart}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                        <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Add to cart</TextSemiBold>
                    )}
                </FancyButton>
            </View>
        );
    },
);

export default memo(AddToCartView);

const styles = StyleSheet.create({
    container: {
        height: 64,
        width: SCREEN_WIDTH,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
    },
    price: {
        fontSize: 20,
        lineHeight: 24,
        color: lightColor.price,
    },
    oldPrice: {
        fontSize: 15,
        color: lightColor.grayout,
        lineHeight: 20,
        textDecorationLine: 'line-through',
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

/**
 * Kiểm tra configuration của object, mọi property phải có value mới thoả mãn
 * @param obj
 */
const checkConfiguration = (obj: DynamicObject) => {
    for (const key in obj) {
        if (!obj[key]) {
            return false;
        } else if (obj[key].type == 'image') {
            // trương hợp image rỗng
            if (!obj[key].value) return false;
        }
    }
    return true;
};

const checkConfigImage = (obj: DynamicObject) => {
    for (const key in obj) {
        if (obj[key]?.type == 'image' && !obj[key]?.value) return false;
    }
    return true;
};
