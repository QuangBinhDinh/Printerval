import { TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';
import { lightColor } from '@styles/color';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const UserScreen = () => {
    const toLogin = () => {
        navigate('LoginScreen');
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <TouchableOpacity
                style={{
                    marginTop: 100,
                    width: 200,
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: lightColor.primary,
                }}
                onPress={toLogin}
            >
                <TextSemiBold style={{ fontSize: 18, color: 'white' }}>Log In</TextSemiBold>
            </TouchableOpacity>
        </View>
    );
};

export default UserScreen;
const styles = StyleSheet.create({});
