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
import TipSelection, { showTipsError } from './component/TipSelection';
import FancyButton from '@components/FancyButton';
import { TextNormal, TextSemiBold } from '@components/text';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '@navigation/service';

const CheckoutPreview = () => {
    const insets = useSafeAreaInsets();

    const { token, userInfo } = useAppSelector(state => state.auth);
    const shipAddress = useAppSelector(state => state.cart.defaultAddress);
    const tips = useAppSelector(state => state.cart.tipsAmount);

    const [fetchCart, { isLoading: l1 }] = useLazyFetchCartCheckoutQuery();
    const [fetchShipping, { isLoading: l2, isFetching: l3 }] = useLazyFetchShippingInfoQuery();

    const toPayment = () => {
        if (tips.amount == -1) {
            showTipsError();
        } else navigate('PaymentMethod');
    };

    useEffect(() => {
        const prepare = async () => {
            if (!userInfo) return;
            try {
                await fetchCart({ token, customerId: userInfo.id });
                await fetchShipping({ token, customerId: userInfo.id, location_id: shipAddress?.country_id || 226 });
            } catch (e) {}
        };

        prepare();
    }, []);

    if (l1 || l2 || l3) return <LoadingCheckout />;
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                enableOnAndroid
                enableResetScrollToCoords={false}
                extraHeight={50}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18 }}
            >
                <AddressView />

                <TextSemiBold style={{ fontSize: 18, color: '#444', marginTop: 24 }}>Order review</TextSemiBold>

                <CheckoutCart />

                <PromotionCode />

                <TipSelection />

                {/* <TestComp /> */}

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
        marginTop: 48,
    },
});
