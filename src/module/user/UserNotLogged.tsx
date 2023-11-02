import { TextNormal, TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { Icon } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO } from '@util/index';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

const UserNotLogged = () => {
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const dispatch = useAppDispatch();

    const toLogin = () => {
        navigate('LoginScreen');
    };
    const toSignUp = () => {
        navigate('CreateAccount');
    };

    return (
        <>
            <View style={styles.loginSection}>
                <View style={styles.avatar}>
                    <Icon type="font-awesome" name="user" size={36} color={'#999999'} />
                </View>
                <TextSemiBold style={{ fontSize: 16, color: '#444', marginTop: 16 }}>Join Printerval</TextSemiBold>
                <TextNormal style={{ marginTop: 10 }}>Get deals. Shop everything you want</TextNormal>

                <View style={styles.buttonRow}>
                    <Pressable style={styles.buttonLogin} onPress={toLogin}>
                        <TextSemiBold style={{ color: 'white', marginTop: 2 }}>Login</TextSemiBold>
                    </Pressable>
                    <Pressable style={styles.buttonSignup} onPress={toSignUp}>
                        <TextSemiBold style={{ color: lightColor.secondary, marginTop: 2 }}>Sign up</TextSemiBold>
                    </Pressable>
                </View>
            </View>

            <View style={{ height: 40 }}></View>
            <Pressable style={[styles.sectionView]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-telephone.png')} />
                    <TextNormal>Support</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>
            <Pressable style={[styles.sectionView, { borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-FAQ.png')} />
                    <TextNormal>FAQ</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>
        </>
    );
};

export default UserNotLogged;

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

    sectionView: {
        width: '100%',
        height: 66 * DESIGN_RATIO,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F3F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionImage: {
        width: 21,
        height: 21,
        marginRight: 10,
        backgroundColor: lightColor.graybg,
    },
});
