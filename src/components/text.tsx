import React from 'react';
import { Text, TextProps } from 'react-native';

const TextSemiBold = ({ children, style, ...rest }: TextProps) => (
    <Text style={[{ fontFamily: 'Poppins-Medium', color: '#5441B5' }, style]}>{children}</Text>
);

const TextNormal = ({ children, style, ...rest }: TextProps) => (
    <Text style={[{ fontFamily: 'Poppins-Regular', color: 'black' }, style]}>{children}</Text>
);

export { TextSemiBold, TextNormal };
