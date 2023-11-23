import { useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import CheckoutItem from './CheckoutItem';
import { Icon } from '@rneui/base';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { TextNormal, TextSemiBold } from '@components/text';
import { formatPrice } from '@util/index';
import { openModalOption } from '@components/input/ModalOption';
import { selectShippingOption } from './ModalOptionShipping';

const CheckoutCart = () => {
    const data = useAppSelector(state => state.cart.transfromShipping);
    const configIndex = useAppSelector(state => state.cart.shippingConfigIndex);

    return (
        <View>
            {data.map((item, index) => {
                var selectedIndex = configIndex[index];
                var selectOption = item.shipping_info[selectedIndex];

                return (
                    <View style={styles.shipSection} key={item.key}>
                        {item.cart_list.map(i => (
                            <CheckoutItem key={i.id} item={i} />
                        ))}
                        <Pressable
                            style={styles.optionShipping}
                            onPress={() => selectShippingOption({ data: item.shipping_info, shipIndex: index })}
                        >
                            <View style={{ height: '100%', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextSemiBold style={{ color: lightColor.black, fontSize: 13 }}>
                                        {selectOption.name_shipping} shipping
                                    </TextSemiBold>
                                    <TextNormal style={{ color: lightColor.price, marginLeft: 24 }}>
                                        {formatPrice(selectOption.shipping_fee)}
                                    </TextNormal>
                                </View>

                                <TextNormal style={{ fontSize: 13, lineHeight: 17 }}>
                                    {selectOption.shipping_min_time}-{selectOption.shipping_max_time} business days with
                                    tracking
                                </TextNormal>
                            </View>
                            {item.shipping_info.length > 1 && (
                                <Icon type="feather" name="chevron-right" size={24} color={lightColor.primary} />
                            )}
                        </Pressable>
                    </View>
                );
            })}
        </View>
    );
};

export default memo(CheckoutCart);

const styles = StyleSheet.create({
    shipSection: {
        width: '100%',
        marginTop: 12,
    },

    optionShipping: {
        width: '100%',
        height: 62,
        backgroundColor: 'rgba(255,115,0,0.1)',
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        paddingHorizontal: 12,
        marginTop: 16,
    },
});
