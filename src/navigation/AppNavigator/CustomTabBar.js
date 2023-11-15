import { CartWhite } from '@assets/svg';
import FancyButton from '@components/FancyButton';
import { TextNormal } from '@components/text';
import { useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { shadowTop } from '@styles/shadow';
import { SCREEN_WIDTH } from '@util/index';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const accessToken = useAppSelector(state => state.auth.accessToken);

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
                                        <CartWhite width={28} height={28} />
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
                                style={[
                                    styles.label,
                                    { color: isFocused ? lightColor.secondary : lightColor.lightBlack },
                                ]}
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
        fontSize: 13,
        marginTop: 3,
    },

    cartOuter: {
        height: 76,
        width: 76,
        backgroundColor: 'rgba(255, 205, 169, 1)',
        borderRadius: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,

        overflow: 'hidden',
    },
    cartInner: {
        height: 54,
        width: 54,
        backgroundColor: lightColor.secondary,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
