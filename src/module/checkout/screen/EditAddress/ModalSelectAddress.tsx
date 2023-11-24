import { SCREEN_WIDTH, getAddressText } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { TextSemiBold, TextNormal } from '@components/text';
import { ShippingAddress } from '@type/common';
import { lightColor } from '@styles/color';
import EventEmitter from '../../../../EventEmitter';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debounce } from 'lodash';

const EVENT_NAME = 'fill_address_from_book';

interface IProps {
    callback: (x: ShippingAddress) => void;
}

const ModalSelectAddress = ({ callback }: IProps) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [visible, setVisible] = useState(false);

    const addressList = useAppSelector(state => state.auth.addressBook);

    // const selectedAddress = useAppSelector(state => state.cart.defaultAddress)
    const [idSelect, setSelected] = useState(-1);

    const listHeight = (62 + 16) * addressList.length;

    const open = () => {
        setVisible(true);
    };

    const onSelect = (value: number) => {
        setSelected(value);

        var address = addressList.find(i => i.id == value);
        if (address) {
            callback(address);
            debounce(() => setVisible(false), 200)();
        }
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
                    <TextSemiBold style={{ color: 'black', fontSize: 15 }}>{'Select address'}</TextSemiBold>
                </View>

                <View style={{ height: listHeight }}>
                    {addressList.map((item, index) => (
                        <Pressable
                            key={item.id}
                            style={[styles.option, item.id == idSelect && { backgroundColor: 'rgba(255,115,0,0.1)' }]}
                            onPress={() => onSelect(item.id)}
                        >
                            <View style={{ height: '100%', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextSemiBold style={{ color: lightColor.black, fontSize: 13 }}>
                                        {item.full_name}
                                    </TextSemiBold>
                                </View>
                                <TextNormal style={{ fontSize: 13, lineHeight: 17 }} numberOfLines={1}>
                                    {getAddressText(item)}
                                </TextNormal>
                            </View>

                            <View style={styles.radio}>
                                {item.id == idSelect && <View style={styles.radioInner} />}
                            </View>
                        </Pressable>
                    ))}
                </View>

                <View style={{ height: 24 + insets.bottom / 2 }} />
            </View>
        </Modal>
    );
};

export default memo(ModalSelectAddress);

/**
 * Mở modal để chọn hình thức shipping
 * @param args
 */
export const openAddressBook = () => {
    EventEmitter.dispatch(EVENT_NAME);
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
