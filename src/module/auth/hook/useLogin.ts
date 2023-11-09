import auth from '@auth/reducer';
import {
    LoginArgs,
    LoginSocialArgs,
    RegisterArgs,
    useCreateAccountMutation,
    usePostLoginMutation,
    usePostLoginSocialMutation,
} from '@auth/service';
import { useAppDispatch } from '@store/hook';
import React, { useState } from 'react';
import { getDeviceId, getUniqueId } from 'react-native-device-info';
import { googleLogin, facebookLogin, appleLogin } from '@auth/loginSocial';
import { showLoginError } from '../component/LoginError';
import storage from '@util/storage';
import { STORAGE_KEY } from '@constant/index';
import { LoginScreenRouteProp } from '@navigation/navigationRoute';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, navigationRef, pop, replace } from '@navigation/service';

export const useLogin = () => {
    const { params: { onLogin, prevScreen } = {} } = useRoute<LoginScreenRouteProp>();
    const dispatch = useAppDispatch();
    const screenName = navigationRef?.getCurrentRoute()?.name;

    const [loginState, setState] = useState<'uninitialize' | 'success' | 'fail'>('uninitialize');
    const [loading, setLoading] = useState(false);

    const [loginAccount] = usePostLoginMutation();
    const [loginSocial] = usePostLoginSocialMutation();
    const [createAccount] = useCreateAccountMutation();

    const handleSuccess = async (newUser: any) => {
        setState('success');

        const id = await getUniqueId();
        const cusToken = id + '-' + Date.now(); //gen cart token mới khi login
        storage.save(STORAGE_KEY.CUSTOMER_TOKEN, cusToken);

        dispatch(auth.actions.setNewUser({ ...newUser, token: cusToken }));
        if (!!onLogin) {
            // gọi callback auto add to cart ở màn Product
            onLogin({ token: cusToken, customerId: newUser.user.id });
        }

        if (prevScreen == 'Product') {
            if (screenName == 'LoginScreen') goBack();
            else pop(2);
        } else if (prevScreen == 'Intro') replace('App');
        else navigate('HomeScreen');
    };

    const doLogin = async ({ email, password }: { email: string; password: string }) => {
        setState('uninitialize');
        setLoading(true);

        const deviceId = await getUniqueId();
        const dataSend: LoginArgs = {
            email,
            password,
            deviceId,
        };
        try {
            const { access_token, customer } = await loginAccount(dataSend).unwrap();
            if (access_token) {
                storage.save(STORAGE_KEY.AUTH_DATA, dataSend);
                handleSuccess({ user: customer, accessToken: access_token });
            }
        } catch (e: any) {
            console.log('Error happened', e);
            setState('fail');
            if (e.status == 401) showLoginError('Username or password is incorrect');
        } finally {
            setLoading(false);
        }
    };

    const doLoginSocial = (type: string) => async () => {
        setState('uninitialize');

        let credential;
        const deviceId = await getUniqueId();
        try {
            if (type == 'google') credential = await googleLogin();
            else if (type == 'facebook') credential = await facebookLogin();
            else if (type == 'apple') credential = await appleLogin();
        } catch (e) {
            console.log('Error happened', e);
        }

        if (credential) {
            let dataSend: LoginSocialArgs;
            var profile = credential.additionalUserInfo?.profile;
            if (!profile?.email) {
                setLoading(false);
                //handle facebook login with no email
            }
            if (type == 'google' || type == 'facebook') {
                dataSend = {
                    email: profile?.email,
                    full_name: credential.user.displayName ?? 'user',
                    type,
                    token: credential.user.uid, //uid của firebase
                    deviceId,
                };
            } else {
                dataSend = {
                    email: profile?.email,
                    type,
                    token: credential.user.uid, //uid của firebase
                    deviceId,
                };
                if (credential.fullName?.givenName) {
                    dataSend.full_name = credential.fullName.familyName + ' ' + credential.fullName.givenName;
                }
            }
            setLoading(true);
            try {
                var { access_token, customer, message } = await loginSocial(dataSend).unwrap();
                if (access_token) {
                    storage.save(STORAGE_KEY.AUTH_SOCIAL_DATA, dataSend);
                    handleSuccess({ user: customer, accessToken: access_token });
                } else {
                    console.log('login error', message);
                }
            } catch (e: any) {
                setState('fail');
                var errMsg = e?.message?.type ?? e?.message ?? JSON.stringify(e);
                showLoginError(errMsg.slice(0, 50));
            } finally {
                setLoading(false);
            }
        } else {
            //handle lỗi khi đăng nhập social
            setLoading(false);
        }
    };

    const register = async (dataSend: RegisterArgs) => {
        try {
            setState('uninitialize');
            setLoading(true);
            const res = await createAccount(dataSend).unwrap();

            await doLogin({
                email: dataSend.email,
                password: dataSend.password,
            });
        } catch (e: any) {
            setState('fail');
            var err_msg = e.message?.email[0] ?? JSON.stringify(e);
            showLoginError(err_msg.slice(0, 100));
        } finally {
            setLoading(false);
        }
    };

    return { doLogin, doLoginSocial, register, loginState, loading };
};
