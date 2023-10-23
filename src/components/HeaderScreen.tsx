import { goBack } from '@navigation/service';
import { lightColor } from '@styles/color';
import { shadow } from '@styles/shadow';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@rneui/base';
import { TextNormal } from './text';

interface IProps {
    title: string;
}

const HeaderScreen = ({ title }: IProps) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, shadow, { height: 50 + insets.top / 1.5, paddingTop: insets.top / 1.5 }]}>
            <Pressable style={styles.iconBack} hitSlop={10} onPress={goBack}>
                <Icon type="antdesign" name="arrowleft" size={24} color={lightColor.secondary} />
                <TextNormal style={{ fontSize: 18, color: lightColor.primaryBold }}>{title}</TextNormal>
            </Pressable>
        </View>
    );
};

export default memo(HeaderScreen);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
    },
    iconBack: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
});
