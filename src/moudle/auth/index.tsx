import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { appleLogin, facebookLogin, googleLogin } from './loginSocial';

const Login = () => {
    const facebookAuth = async () => {
        var credit = await facebookLogin();
        console.log(credit);
    };

    const googleAuth = async () => {
        var credit = await googleLogin();
        console.log(credit);
    };

    const appleAuth = async () => {
        var credit = await appleLogin();
        console.log(credit);
    };
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 100 }}>
                <Pressable style={styles.social} onPress={facebookAuth}></Pressable>

                <Pressable style={styles.social} onPress={googleAuth}></Pressable>

                <Pressable style={styles.social} onPress={appleAuth}></Pressable>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },

    social: {
        width: 42,
        height: 42,
        borderWidth: 1,
        borderRadius: 6,
        marginHorizontal: 8,
    },
});
