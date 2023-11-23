import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AddressView from './component/AddressView';
import { useLazyFetchCartCheckoutQuery, useLazyFetchShippingInfoQuery } from '@checkout/service';
import { useAppSelector } from '@store/hook';
import LoadingCheckout from './component/LoadingCheckout';
import CheckoutCart from './component/CheckoutCart';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalOptionShipping from './component/ModalOptionShipping';
import PromotionCode from './component/PromotionCode';
import TipSelection from './component/TipSelection';
import FancyButton from '@components/FancyButton';
import { TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CheckoutPreview = () => {
    const insets = useSafeAreaInsets();

    const { token, userInfo } = useAppSelector(state => state.auth);
    const shipAddress = useAppSelector(state => state.cart.defaultAddress);

    const { transfromShipping } = useAppSelector(state => state.cart);

    const [fetchCart, { isLoading: l1 }] = useLazyFetchCartCheckoutQuery();
    const [fetchShipping, { isLoading: l2 }] = useLazyFetchShippingInfoQuery();

    const toPayment = () => {};

    useEffect(() => {
        const prepare = async () => {
            if (!userInfo) return;
            try {
                await fetchCart({ token, customerId: userInfo.id });
                await fetchShipping({ token, customerId: userInfo.id, location_id: shipAddress?.id || 226 });
            } catch (e) {}
        };

        prepare();
    }, []);

    if (l1 || l2) return <LoadingCheckout />;
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
            >
                <AddressView />

                <CheckoutCart />

                <PromotionCode />

                <TipSelection />

                <FancyButton style={styles.button} backgroundColor={lightColor.secondary} onPress={toPayment}>
                    <TextSemiBold style={{ fontSize: 15, color: 'white' }}>Continue</TextSemiBold>
                </FancyButton>

                <View style={{ height: 16 + insets.bottom / 2 }} />
            </KeyboardAwareScrollView>

            <ModalOptionShipping />
        </View>
    );
};

export default CheckoutPreview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    bottomView: {
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
        marginTop: 32,
    },
});
