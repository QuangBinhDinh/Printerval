import { Icon } from '@rneui/base';
import { normalize } from '@rneui/themed';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';

const TextSemiBold = ({ children, style, ...rest }: TextProps) => (
    <Text
        style={[
            { fontFamily: 'Poppins-Medium', color: '#5441B5' },
            style,
            { fontSize: normalize(StyleSheet.flatten(style)?.fontSize || 15) },
        ]}
        allowFontScaling={false}
        {...rest}
    >
        {children}
    </Text>
);

const TextNormal = ({ children, style, ...rest }: TextProps) => (
    <Text
        style={[
            { fontFamily: 'Poppins-Regular', color: '#444' },
            style,
            { fontSize: normalize(StyleSheet.flatten(style)?.fontSize || 15) },
        ]}
        allowFontScaling={false}
        {...rest}
    >
        {children}
    </Text>
);

const RadioText = ({
    selected,
    title,
    containerStyle,
    onPress,
}: {
    selected: boolean;
    title: string;
    containerStyle?: StyleProp<ViewStyle>;
    onPress: any;
}) => (
    <Pressable
        style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }, containerStyle]}
        onPress={onPress}
        hitSlop={10}
    >
        <View
            style={{
                height: 22,
                width: 22,
                borderRadius: 20,
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {selected && <View style={{ height: 9, width: 9, borderRadius: 9, backgroundColor: 'black' }} />}
        </View>
        <TextNormal style={{ marginLeft: 8, marginTop: 2 }}>{title}</TextNormal>
    </Pressable>
);

const CheckboxText = ({
    selected,
    title,
    containerStyle,
    onPress,
}: {
    selected: boolean;
    title: string;
    containerStyle?: StyleProp<ViewStyle>;
    onPress: any;
}) => (
    <Pressable
        style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }, containerStyle]}
        onPress={onPress}
        hitSlop={10}
    >
        <View
            style={{
                height: 24,
                width: 24,
                borderRadius: 6,
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {selected && <Icon type="feather" name="check" color={'#444'} size={18} />}
        </View>
        <TextNormal style={{ marginLeft: 8, marginTop: 2 }}>{title}</TextNormal>
    </Pressable>
);

export { TextSemiBold, TextNormal, RadioText, CheckboxText };
