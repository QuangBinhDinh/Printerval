import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { TextSemiBold, TextNormal } from '@components/text';
import { ShipMethod } from '@type/common';
import { lightColor } from '@styles/color';
import { formatPrice } from '@util/index';
import { Icon } from '@rneui/base';
import EventEmitter from '../../../../../EventEmitter';
import { useAppDispatch, useAppSelector } from '@store/hook';
import cart from '@cart/reducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debounce } from 'lodash';

const EVENT_NAME = 'open-shipping-option';

interface OptionShipping {
    /**
     * List các hình thức vận chuyển
     */
    data: ShipMethod[];

    /**
     * Index để phân biệt đang edit đơn nào (shipping info tách đơn)
     */
    shipIndex: number;
}

const ModalOptionShipping = () => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const configIndex = useAppSelector(state => state.cart.shippingConfigIndex);

    const [visible, setVisible] = useState(false);

    const [{ data, shipIndex }, setMethod] = useState<OptionShipping>({
        data: [],
        shipIndex: 0,
    });
    const [indexSelect, setSelected] = useState(0);

    const listHeight = (62 + 16) * data.length;

    const open = (option: OptionShipping) => {
        setVisible(true);
        setMethod(option);

        //Set option đang được chọn
        setSelected(configIndex[option.shipIndex]);
    };

    const onSelect = (value: number) => {
        setSelected(value);
        dispatch(cart.actions.setShippingOption({ index: shipIndex, newValue: value }));

        debounce(() => setVisible(false), 150)();
    };

    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, open);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, open);
        };
    }, []);

    return (
        <Modal
            useNativeDriverForBackdrop
            useNativeDriver
            hideModalContentWhileAnimating
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            onBackButtonPress={() => setVisible(false)}
            backdropOpacity={0.2}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', width: '100%', marginTop: 24 }}>
                    <TextSemiBold style={{ color: 'black', fontSize: 15 }}>{'Shipping method'}</TextSemiBold>
                </View>

                <View style={{ height: listHeight }}>
                    {data.map((item, index) => (
                        <Pressable
                            key={item.id}
                            style={[styles.option, index == indexSelect && { backgroundColor: 'rgba(255,115,0,0.1)' }]}
                            onPress={() => onSelect(index)}
                        >
                            <View style={{ height: '100%', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextSemiBold style={{ color: lightColor.black, fontSize: 13 }}>
                                        {item.name_shipping} shipping
                                    </TextSemiBold>
                                    <TextNormal style={{ color: lightColor.price, marginLeft: 24 }}>
                                        {formatPrice(item.shipping_fee)}
                                    </TextNormal>
                                </View>
                                <TextNormal style={{ fontSize: 13, lineHeight: 17 }}>
                                    {item.shipping_min_time}-{item.shipping_max_time} business days with tracking
                                </TextNormal>
                            </View>

                            <View style={styles.radio}>
                                {index == indexSelect && <View style={styles.radioInner} />}
                            </View>
                        </Pressable>
                    ))}
                </View>

                <View style={{ height: 24 + insets.bottom / 2 }} />
            </View>
        </Modal>
    );
};

export default memo(ModalOptionShipping);

/**
 * Mở modal để chọn hình thức shipping
 * @param args
 */
export const selectShippingOption = (args: { data: ShipMethod[]; shipIndex: number }) => {
    if (args.data.length > 1) {
        EventEmitter.dispatch(EVENT_NAME, args);
    }
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 18,

        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'white',
    },

    option: {
        width: '100%',
        height: 62,
        backgroundColor: lightColor.lightbg,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        paddingHorizontal: 12,
        marginTop: 16,
    },
    radio: {
        height: 22,
        width: 22,
        borderRadius: 22,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: lightColor.primary,
    },
    radioInner: {
        height: 9,
        width: 9,
        borderRadius: 9,
        backgroundColor: lightColor.primary,
    },
});
