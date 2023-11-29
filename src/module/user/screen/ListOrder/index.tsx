import HeaderScreen from '@components/HeaderScreen';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScrollableTabBar from '@components/ScrollableTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useFetchOrderHistoryQuery } from '@user/service';
import { useAppSelector } from '@store/hook';
import OrderItem from './OrderItem';
import { OrderItemResponse } from '@user/type';

const ListOrderScreen = () => {
    const { accessToken } = useAppSelector(state => state.auth);

    const { data: total } = useFetchOrderHistoryQuery({ locale: 'us', accessToken: accessToken || '' });

    const orderPending = total?.filter(item => ['PENDING', 'PROCESSING', 'ISSUED'].includes(item.status));
    const orderDeliver = total?.filter(item => ['DELIVERING', 'READY_TO_SHIP'].includes(item.status));
    const orderFinish = total?.filter(item => ['FINISHED'].includes(item.status));
    const orderCancel = total?.filter(item => ['CANCELED', 'REQUEST_RETURN', 'RETURNED'].includes(item.status));

    const renderItem = ({ item }: { item: OrderItemResponse }) => <OrderItem data={item} />;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderScreen title="Order list" />
            <ScrollableTabView style={{ flex: 1 }} renderTabBar={props => <ScrollableTabBar {...props} />}>
                <View style={{ flex: 1 }} tabLabel={'All'}>
                    <FlatList style={{ flex: 1 }} removeClippedSubviews data={total} renderItem={renderItem} />
                </View>
                <View style={{ flex: 1 }} tabLabel={'Pending'}>
                    <FlatList style={{ flex: 1 }} removeClippedSubviews data={orderPending} renderItem={renderItem} />
                </View>
                <View style={{ flex: 1 }} tabLabel={'Delivering'}>
                    <FlatList style={{ flex: 1 }} removeClippedSubviews data={orderDeliver} renderItem={renderItem} />
                </View>
                <View style={{ flex: 1 }} tabLabel={'Finished'}>
                    <FlatList style={{ flex: 1 }} removeClippedSubviews data={orderFinish} renderItem={renderItem} />
                </View>
                <View style={{ flex: 1 }} tabLabel={'Canceled'}>
                    <FlatList style={{ flex: 1 }} removeClippedSubviews data={orderCancel} renderItem={renderItem} />
                </View>
            </ScrollableTabView>
        </View>
    );
};

export default ListOrderScreen;

const styles = StyleSheet.create({});
