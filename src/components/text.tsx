import React from 'react';
import { Text, TextProps } from 'react-native';

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

export { TextSemiBold, TextNormal };
