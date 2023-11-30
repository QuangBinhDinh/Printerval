import React, { memo, useEffect, useState } from 'react';
import { Alert, InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import EventEmitter from '../../../../EventEmitter';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@util/index';
import { Icon } from '@rneui/base';
import WebView from 'react-native-webview';
import { navigate } from '@navigation/service';

const EVENT_NAME = 'open_paypal_checkout';

interface IProps {
    orderCode: string;
    orderEmail: string;
}

const PaypalWebview = ({ orderCode, orderEmail }: IProps) => {
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState('');

    const open = (url: string) => {
        setVisible(true);
        setUrl(url);
    };
    const onCloseWithAlert = () => {
        Alert.alert('Cancel payment', 'Are you sure to cancel this payment?', [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', style: 'destructive', onPress: onClose },
        ]);
    };

    const onClose = () => {
        setVisible(false);
        InteractionManager.runAfterInteractions(() => {
            setUrl('');
        });
    };

    const handleUrlChange = ({ url }: { url: string }) => {
        if (url.includes('finish')) {
            //const priceNum = subTotal ? Number.parseFloat(subTotal.substring(1)) : 0;
            // if (IS_PRODUCT && !EXCLUDE_EMAIL_CHECKOUT.includes(customerInfo?.email)) {
            //     analytics().logPurchase({
            //         currency: 'USD',
            //         value: priceNum,
            //         transaction_id: orderNum,
            //     });
            // }

            onClose();
            navigate('CheckoutSuccess', { orderCode, orderEmail });
            return false;
        } else return true;
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
            onBackdropPress={onCloseWithAlert}
            onBackButtonPress={onCloseWithAlert}
            statusBarTranslucent
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable hitSlop={10} onPress={onCloseWithAlert}>
                        <Icon type="antdesign" name="close" size={20} color={'#444'} />
                    </Pressable>
                </View>

                {!!url && (
                    <WebView style={{ flex: 1 }} source={{ uri: url }} onShouldStartLoadWithRequest={handleUrlChange} />
                )}
            </View>
        </Modal>
    );
};

export default memo(PaypalWebview);

/**
 * Mở webview paypal để checkout với redirect url
 * @param url
 */
export const openPaypal = (url: string) => {
    EventEmitter.dispatch(EVENT_NAME, url);
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.9,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'white',
    },
    header: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
});
