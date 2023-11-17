import auth from '@auth/reducer';
import { LoginArgs, LoginSocialArgs, usePostLoginMutation, usePostLoginSocialMutation } from '@auth/service';
import { useAppDispatch } from '@store/hook';
import { useState } from 'react';
import { getUniqueId } from 'react-native-device-info';
import { googleLogin, facebookLogin, appleLogin } from '@auth/loginSocial';
import { showLoginError } from '../component/LoginError';
import storage from '@util/storage';
import { STORAGE_KEY } from '@constant/index';

// dùng khi mới mở app
export const useLoginFirstOpen = () => {
    const dispatch = useAppDispatch();

    const [loginState, setState] = useState<'uninitialize' | 'success' | 'fail'>('uninitialize');
    const [loading, setLoading] = useState(false);

    const [loginAccount] = usePostLoginMutation();
    const [loginSocial] = usePostLoginSocialMutation();

    const handleSuccess = async (newUser: any) => {
        var token = await storage.get(STORAGE_KEY.CUSTOMER_TOKEN);
        // không nhất thiết phải gen token mới (giữ phiên)
        if (!token) {
            const id = await getUniqueId();
            token = id + '-' + Date.now();
        }
        storage.save(STORAGE_KEY.CUSTOMER_TOKEN, token);
        dispatch(auth.actions.setNewUser({ ...newUser, token }));
        setState('success');
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

    const loginAsGuest = async () => {
        var token = await storage.get(STORAGE_KEY.CUSTOMER_TOKEN);
        if (!token) {
            const did = await getUniqueId();
            token = `${did}-${Date.now()}`;
        }
        storage.save(STORAGE_KEY.CUSTOMER_TOKEN, token);
        dispatch(auth.actions.setCustomerToken(token));
        setState('success');
    };

    return { doLogin, doLoginSocial, loginState, loading, loginAsGuest };
};
