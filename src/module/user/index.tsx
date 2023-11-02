import auth from '@auth/reducer';
import { TextNormal, TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { Icon } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO } from '@util/index';
import React from 'react';
import { Image, InteractionManager, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UserScreen = () => {
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const toLogin = () => {
        navigate('LoginScreen');
    };

    const toLogout = () => {
        navigate('LoginScreen');
        InteractionManager.runAfterInteractions(() => {
            dispatch(auth.actions.logout());
        });
    };

    const renderHeader = () => {
        if (!userInfo)
            return (
                <TouchableOpacity
                    style={{
                        marginTop: 90,
                        width: 200,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: lightColor.primary,
                    }}
                    onPress={toLogin}
                >
                    <TextSemiBold style={{ fontSize: 18, color: 'white' }}>Log In</TextSemiBold>
                </TouchableOpacity>
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
    return (
        <View style={[styles.container, { paddingTop: insets.top / 1.5 }]}>
            {renderHeader()}
            <View style={{ height: 80 * DESIGN_RATIO }} />
            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-bell.png')} />
                    <TextNormal>Notification</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-address.png')} />
                    <TextNormal>Address</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-order.png')} />
                    <TextNormal>My order</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-fav.png')} />
                    <TextNormal>Wishlist</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-FAQ.png')} />
                    <TextNormal>FAQ</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            {!!userInfo && (
                <Pressable style={styles.sectionView} onPress={toLogout}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            style={[styles.sectionImage, { borderBottomWidth: 0 }]}
                            source={require('@image/user-logout.png')}
                        />
                        <TextNormal>Logout</TextNormal>
                    </View>
                </Pressable>
            )}
        </View>
    );
};

export default UserScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
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
