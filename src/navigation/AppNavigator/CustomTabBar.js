import { api } from '@api/service';
import { CartWhite } from '@assets/svg';
import FancyButton from '@components/FancyButton';
import { TextNormal, TextSemiBold } from '@components/text';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const accessToken = useAppSelector(state => state.auth.accessToken);
    const cartList = useAppSelector(state => state.cart.items);

    const dispatch = useAppDispatch();
    return (
        <View>
            <View style={[styles.rowContainer, shadowTop]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            var name = route.name;
                            if (name == 'Cart') {
                                if (accessToken) {
                                    name = 'CartNavigator';
                                    //invalid tag Cart để refetch lại giỏ hàng, nếu không sẽ bị cache
                                    dispatch(api.util.invalidateTags(['Cart']));
                                } else name = 'LoginScreen';
                            }
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name, merge: true });
                        }
                    };
                    if (label == 'Cart')
                        return (
                            <View
                                key={index}
                                style={styles.button}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                //onPress={onPress}
                            >
                                <FancyButton
                                    style={styles.cartOuter}
                                    onPress={onPress}
                                    backgroundColor="rgba(255, 205, 169, 1)"
                                >
                                    <View style={styles.cartInner}>
                                        <CartWhite width={24} height={24} />
                                        {cartList.length > 0 && (
                                            <View style={styles.qtyView}>
                                                <TextSemiBold style={{ fontSize: 10, color: lightColor.secondary }}>
                                                    {cartList.length}
                                                </TextSemiBold>
                                            </View>
                                        )}
                                    </View>
                                </FancyButton>
                            </View>
                        );
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                        >
                            {options.tabBarIcon({ focused: isFocused })}
                            <TextNormal
                                style={[styles.label, { color: isFocused ? lightColor.secondary : lightColor.black }]}
                            >
                                {label}
                            </TextNormal>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={{ width: SCREEN_WIDTH, height: insets.bottom / 2.5, backgroundColor: 'white' }} />
        </View>
    );
};

export default CustomTabBar;

const styles = StyleSheet.create({
    rowContainer: {
        width: SCREEN_WIDTH,
        height: 64,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    button: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    label: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 3,
    },

    cartOuter: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(255, 205, 169, 1)',
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -28,

        overflow: 'hidden',
    },
    cartInner: {
        height: 45,
        width: 45,
        backgroundColor: lightColor.secondary,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyView: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: 'white',
        position: 'absolute',
        top: 4,
        right: 5,
    },
});
