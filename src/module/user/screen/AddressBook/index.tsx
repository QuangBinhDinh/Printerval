import HeaderScreen from '@components/HeaderScreen';
import { createSelector } from '@reduxjs/toolkit';
import React from 'react';
import { FlatList, View } from 'react-native';
import { RootState } from '@store/store';
import { useSelector } from 'react-redux';
import AddressCard from './AddressCard';
import { ShippingAddress } from '@type/common';

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
    const data = useSelector(addressSelector);

    const renderItem = ({ item, index }: { item: ShippingAddress; index: number }) => (
        <AddressCard item={item} index={index} />
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Address book" />
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 32 }}
                ListFooterComponent={<View style={{ height: 80 }} />}
            />
        </View>
    );
};

export default AddressBook;
