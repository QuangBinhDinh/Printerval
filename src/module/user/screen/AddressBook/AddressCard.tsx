import cart from '@cart/reducer';
import { showMessage } from '@components/popup/BottomMessage';
import { TextNormal, TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { Icon } from '@rneui/base';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { shadow } from '@styles/shadow';
import { ShippingAddress } from '@type/common';
import { useDeleteAddressMutation, useLazyFetchAddressBookQuery } from '@user/service';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { askBeforeRemove } from './PopupRemoveAddress';

interface IProps {
    item: ShippingAddress;

    index: number;

    removeAddress: any;
}
const AddressCard = ({ item, index, removeAddress }: IProps) => {
    const dispatch = useAppDispatch();
    const [postDelete] = useDeleteAddressMutation();
    const [fetchAddress] = useLazyFetchAddressBookQuery();

    const accessToken = useAppSelector(state => state.auth.accessToken);
    const defaultAddress = useAppSelector(state => state.cart.defaultAddress);

    const addressText = useMemo(() => {
        let address = item.country?.nicename + ', ';
        if (item.province?.name) address = address + item.province.name + ', ';
        if (item.city_name) address = address + item.city_name + ', ';
        if (item.address) address = address + item.address;

        return address;
    }, [item]);

    const setAsDefault = () => {
        dispatch(cart.actions.setDefaultAddress(item));
    };

    const deleteAddress = async () => {
        if (defaultAddress?.id == item.id) {
            showMessage('Cannot delete default address');
        } else if (accessToken) {
            askBeforeRemove(async () => {
                removeAddress(item.id);
                showMessage('Address is deleted');
                try {
                    var res = await postDelete({ api_token: accessToken, id: item.id }).unwrap();
                    fetchAddress(accessToken);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };

    const editAddress = () => {
        navigate('CreateAddress', { editAddress: item });
    };

    return (
        <View style={[styles.container, index == 0 && { backgroundColor: 'white' }, index == 0 && shadow]}>
            <View style={styles.header}>
                <TextSemiBold style={{ width: '50%', lineHeight: 20 }}>{item.full_name}</TextSemiBold>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {index != 0 && (
                        <Pressable hitSlop={10} style={{ marginRight: 16 }} onPress={setAsDefault}>
                            <TextNormal style={{ fontSize: 13, color: lightColor.secondary }}>
                                Set as defaults
                            </TextNormal>
                        </Pressable>
                    )}
                    <Pressable hitSlop={10} style={{ marginRight: 16 }} onPress={editAddress}>
                        <Icon type="feather" name="edit" size={20} color={lightColor.secondary} />
                    </Pressable>
                    <Pressable hitSlop={10} style={{}} onPress={deleteAddress}>
                        <Icon type="feather" name="trash-2" size={20} color={'#444'} />
                    </Pressable>
                </View>
            </View>
            <TextNormal style={{ fontSize: 15, lineHeight: 20, marginTop: 6 }}>{addressText}</TextNormal>
            <TextNormal style={{ fontSize: 15, lineHeight: 20, marginTop: 4 }}>{item.phone}</TextNormal>
        </View>
    );
};

export default memo(AddressCard);

const styles = StyleSheet.create({
    container: {
        height: 130,
        width: '100%',
        padding: 14,
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' },
    optionHeader: { flexDirection: 'row', alignItems: 'center', height: 22 },
});
