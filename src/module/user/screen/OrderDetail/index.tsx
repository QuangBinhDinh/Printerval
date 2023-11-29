import { OrderDetailRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

const OrderDetail = () => {
    const {
        params: { email, orderCode },
    } = useRoute<OrderDetailRouteProp>();
    return <View style={{ flex: 1, backgroundColor: 'white' }}></View>;
};
