import { TextNormal, TextSemiBold } from '@components/text';
import { useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { getAddressText, getBillingText } from '@util/index';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { navigate } from '@navigation/service';

const AddressView = () => {
    const shipAddress = useAppSelector(state => state.cart.defaultAddress);
    const billAddress = useAppSelector(state => state.cart.billAddress);

    const editShipAddress = () => {
        navigate('EditShipAddress');
    };

    const editBillAddress = () => {
        navigate('EditBillAddress');
    };

    const billingName = billAddress?.name || 'Billing address';
    const billingDetail = getBillingText(billAddress) || 'Billing address matches shipping address';

    return (
        <View style={{ width: '100%' }}>
            <Pressable style={styles.addressCard} onPress={editShipAddress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextSemiBold style={{ color: lightColor.black, lineHeight: 20 }}>
                        {shipAddress?.full_name}
                    </TextSemiBold>
                    <Icon type="feather" name="edit" size={20} color={lightColor.secondary} />
                </View>

                <TextNormal style={styles.addressText}>{getAddressText(shipAddress)}</TextNormal>
            </Pressable>

            <Pressable style={styles.addressCard} onPress={editBillAddress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextSemiBold style={{ color: lightColor.black, lineHeight: 20 }}>{billingName}</TextSemiBold>
                    <Icon type="feather" name="edit" size={20} color={lightColor.secondary} />
                </View>
                <TextNormal style={styles.addressText}>{billingDetail}</TextNormal>
            </Pressable>
        </View>
    );
};

export default memo(AddressView);

const styles = StyleSheet.create({
    addressCard: {
        borderBottomWidth: 1,
        borderBottomColor: lightColor.borderGray,
        paddingVertical: 22,
    },
    addressText: {
        color: '#999',
        lineHeight: 20,
        marginTop: 6,
        width: '90%',
        //borderWidth: 1,
    },
});
