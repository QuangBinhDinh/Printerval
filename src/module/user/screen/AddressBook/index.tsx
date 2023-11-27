import HeaderScreen from '@components/HeaderScreen';
import { createSelector } from '@reduxjs/toolkit';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import AddressCard from './AddressCard';
import { ShippingAddress } from '@type/common';
import { SCREEN_WIDTH } from '@util/index';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FancyButton from '@components/FancyButton';
import { TextSemiBold } from '@components/text';
import { useFetchAddressBookQuery } from '@user/service';
import { useAppSelector } from '@store/hook';
import { navigate } from '@navigation/service';

const addressSelector = createSelector(
    [(state: RootState) => state.auth.addressBook, (state: RootState) => state.cart.defaultAddress],
    (list, selected) => {
        var newList = [...list];
        if (selected) {
            var temp = newList.filter(i => i.id != selected.id);
            temp.unshift(selected);
            newList = [...temp];
        }
        return newList;
    },
);
const AddressBook = () => {
    const insets = useSafeAreaInsets();
    // const accessToken = useAppSelector(state => state.auth.accessToken);
    const defaultAddress = useAppSelector(state => state.cart.defaultAddress);

    const addressList = useSelector(addressSelector);

    //data dùng để đisplay
    const [data, setData] = useState<ShippingAddress[]>([]);

    const removeAddress = (id: number) => {
        setData(prev => prev.filter(i => i.id !== id));
    };

    const renderItem = ({ item, index }: { item: ShippingAddress; index: number }) => (
        <AddressCard item={item} index={index} removeAddress={removeAddress} />
    );

    const toCreateAddress = () => {
        navigate('CreateAddress');
    };

    useEffect(() => {
        //sắp xếp default address luôn ở trên cùng
        var newList = [...addressList];
        if (defaultAddress) {
            var temp = newList.filter(i => i.id != defaultAddress.id);
            temp.unshift(defaultAddress);
            newList = [...temp];
        }
        setData(newList);
    }, [addressList, defaultAddress]);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Address book" />
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 32 }}
                ListFooterComponent={<View style={{ height: 100 }} />}
            />
            <View
                style={[
                    styles.container,
                    shadowTop,
                    { height: 64 + insets.bottom / 2, paddingBottom: insets.bottom / 2 },
                ]}
            >
                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={toCreateAddress}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Add new address</TextSemiBold>
                </FancyButton>
            </View>
        </View>
    );
};

export default AddressBook;

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
    button: {
        width: '100%',
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: lightColor.secondary,
    },
});
