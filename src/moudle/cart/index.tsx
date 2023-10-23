import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { lightColor } from '@styles/color';
import { goBack } from '@navigation/service';

const CartScreen = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 10 + insets.top / 1.5 }}>
            <Pressable style={{ padding: 12, alignSelf: 'baseline', marginLeft: 10 }} hitSlop={10} onPress={goBack}>
                <Icon type="antdesign" name="arrowleft" size={24} color={lightColor.secondary} />
            </Pressable>
        </View>
    );
};

export default CartScreen;
