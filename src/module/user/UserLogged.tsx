import { TextNormal, TextSemiBold } from '@components/text';
import { Icon } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO } from '@util/index';
import React from 'react';
import { Image, Pressable, StyleSheet, View, InteractionManager } from 'react-native';
import { navigate } from '@navigation/service';
import auth from '@auth/reducer';
import FastImage from 'react-native-fast-image';
import storage from '@util/storage';
import { STORAGE_KEY } from '@constant/index';
import { getUniqueId } from 'react-native-device-info';
import cart from '@cart/reducer';

const UserLogged = () => {
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const dispatch = useAppDispatch();

    const toLogout = () => {
        navigate('LoginScreen');
        dispatch(cart.actions.resetCart());

        InteractionManager.runAfterInteractions(async () => {
            dispatch(auth.actions.logout());
            const id = await getUniqueId();
            dispatch(auth.actions.setCustomerToken(`${id}-${Date.now()}`));

            storage.save(STORAGE_KEY.AUTH_DATA, null);
            storage.save(STORAGE_KEY.AUTH_SOCIAL_DATA, null);
            storage.save(STORAGE_KEY.CUSTOMER_TOKEN, null);
        });
    };
    return (
        <>
            <View style={styles.userHeader}>
                <FastImage
                    style={{ height: 70, width: 70, borderRadius: 70 }}
                    resizeMode="cover"
                    source={userInfo?.image_url ? { uri: userInfo.image_url } : require('@image/female-avatar.png')}
                />
                <View style={styles.contentHeader}>
                    <View>
                        <TextSemiBold style={{ fontSize: 16, color: '#444' }}>{userInfo?.full_name}</TextSemiBold>
                        <TextNormal style={{ fontSize: 15 }}>{userInfo?.email}</TextNormal>
                    </View>
                    <Image style={{ width: 20, height: 20 }} source={require('@image/user-setting.png')} />
                </View>
            </View>

            <View style={{ height: 70 * DESIGN_RATIO, width: '100%' }} />

            <Pressable style={styles.sectionView}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.sectionImage} source={require('@image/user-bell.png')} />
                    <TextNormal>Notification</TextNormal>
                </View>
                <Icon type="feather" name="chevron-right" size={20} color={'#444'} />
            </Pressable>

            <Pressable style={styles.sectionView} onPress={() => navigate('AddressBook')}>
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

            <Pressable style={[styles.sectionView, { borderBottomWidth: 0 }]} onPress={toLogout}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={[styles.sectionImage]} source={require('@image/user-logout.png')} />
                    <TextNormal>Logout</TextNormal>
                </View>
            </Pressable>
        </>
    );
};

export default UserLogged;

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
