import { TextNormal } from '@components/text';
import { Icon } from '@rneui/themed';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { lightColor } from '@styles/color';
import { DESIGN_RATIO } from '@util/index';
import React from 'react';
import { Image, Pressable, StyleSheet, View, InteractionManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserHeader from './UserHeader';
import { navigate } from '@navigation/service';
import auth from '@auth/reducer';
import UserLogged from './UserLogged';
import UserNotLogged from './UserNotLogged';

const UserScreen = () => {
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top / 1.5 }]}>
            {userInfo ? <UserLogged /> : <UserNotLogged />}
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
});
