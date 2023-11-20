import { CartEmpty } from '@assets/svg';
import { TextNormal, TextSemiBold } from '@components/text';
import { DESIGN_RATIO } from '@util/index';
import React, { memo } from 'react';
import { Image, View } from 'react-native';

const EmptyCartScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <CartEmpty
                width={306 * DESIGN_RATIO}
                height={306 * DESIGN_RATIO}
                style={{ marginTop: 60 * DESIGN_RATIO }}
            />
            <TextSemiBold style={{ fontSize: 20, lineHeight: 24, color: '#444' }}>
                Cart is currently empty!
            </TextSemiBold>
            <TextNormal style={{ lineHeight: 20, textAlign: 'center', marginTop: 32 * DESIGN_RATIO }}>
                Before proceed to checkout you must add{'\n'} some products to your shopping cart.{'\n'}
                {'\n'}
                You will find a lot of interesting products{'\n'} on our "shop" page
            </TextNormal>
        </View>
    );
};
export default memo(EmptyCartScreen);
