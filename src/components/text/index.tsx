import React from 'react';
import { Pressable, StyleProp, Text, TextProps, View, ViewStyle } from 'react-native';

const TextSemiBold = ({ children, style, ...rest }: TextProps) => (
    <Text style={[{ fontFamily: 'Poppins-Medium', color: '#5441B5' }, style]} allowFontScaling={false} {...rest}>
        {children}
    </Text>
);

const TextNormal = ({ children, style, ...rest }: TextProps) => (
    <Text
        style={[{ fontFamily: 'Poppins-Regular', color: '#444', fontSize: 15 }, style]}
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
                height: 20,
                width: 20,
                borderRadius: 20,
                borderWidth: 1.5,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {selected && <View style={{ height: 9, width: 9, borderRadius: 9, backgroundColor: 'black' }} />}
        </View>
        <TextNormal style={{ marginLeft: 8, marginTop: 2 }}>{title}</TextNormal>
    </Pressable>
);

export { TextSemiBold, TextNormal, RadioText };
