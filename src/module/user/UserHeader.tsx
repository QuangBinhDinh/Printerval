import auth from '@auth/reducer';
import { TextNormal, TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { Icon } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO } from '@util/index';
import React, { memo } from 'react';
import { Image, InteractionManager, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UserHeader = () => {
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const dispatch = useAppDispatch();

    const toLogin = () => {
        navigate('LoginScreen');
    };

    if (!userInfo)
        return (
            <View style={styles.loginSection}>
                <View style={styles.avatar}>
                    <Icon type="font-awesome" name="user" size={36} color={'#999999'} />
                </View>
                <TextSemiBold style={{ fontSize: 16, color: '#444', marginTop: 16 }}>Join Printerval</TextSemiBold>
                <TextNormal style={{ marginTop: 10 }}>Get deals. Shop everything you want</TextNormal>

                <View style={styles.buttonRow}>
                    <Pressable style={styles.buttonLogin}>
                        <TextSemiBold style={{ color: 'white' }}>Login</TextSemiBold>
                    </Pressable>
                    <Pressable style={styles.buttonSignup}>
                        <TextSemiBold style={{ color: lightColor.secondary }}>Sign up</TextSemiBold>
                    </Pressable>
                </View>
            </View>
        );
    return (
        <View style={styles.userHeader}>
            <FastImage
                style={{ height: 70, width: 70, borderRadius: 70 }}
                resizeMode="cover"
                source={userInfo.image_url ? { uri: userInfo.image_url } : require('@image/female-avatar.png')}
            />
            <View style={styles.contentHeader}>
                <View>
                    <TextSemiBold style={{ fontSize: 16, color: '#444' }}>{userInfo.full_name}</TextSemiBold>
                    <TextNormal style={{ fontSize: 15 }}>{userInfo.email}</TextNormal>
                </View>
                <Image style={{ width: 20, height: 20 }} source={require('@image/user-setting.png')} />
            </View>
        </View>
    );
};

export default memo(UserHeader);
const styles = StyleSheet.create({
    userHeader: {
        height: 70,
        width: '100%',
        marginTop: 60 * DESIGN_RATIO,
        flexDirection: 'row',
        //borderWidth: 1,
        alignItems: 'center',
        paddingRight: 2,
    },
    contentHeader: {
        flexDirection: 'row',
        height: 70,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 16,
    },

    loginSection: {
        marginTop: 60 * DESIGN_RATIO,
        width: '100%',
        alignItems: 'center',
    },
    avatar: {
        width: 68,
        height: 68,
        borderRadius: 68,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.lightbg,
    },
    buttonRow: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    buttonSignup: {
        width: '48%',
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: lightColor.secondary,
    },
    buttonLogin: {
        width: '48%',
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: lightColor.secondary,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: lightColor.secondary,
    },
});
