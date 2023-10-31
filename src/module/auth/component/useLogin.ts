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

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const [loginSuccess, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loginAccount] = usePostLoginMutation();
    const [loginSocial] = usePostLoginSocialMutation();
    const [createAccount] = useCreateAccountMutation();

    const doLogin = async ({ email, password }: { email: string; password: string }) => {
        setSuccess(false);
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
                setSuccess(true);
                dispatch(auth.actions.setNewUser({ user: customer, accessToken: access_token }));
            }
        } catch (e: any) {
            console.log('Error happened', e);
        } finally {
            setLoading(false);
        }
    };

    const doLoginSocial = (type: string) => async () => {
        setSuccess(false);

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
                    setSuccess(true);
                    dispatch(auth.actions.setNewUser({ user: customer, accessToken: access_token }));
                } else {
                    console.log('login error', message);
                }
            } catch (e: any) {
                var errMsg = e?.message?.type ?? e?.message ?? JSON.stringify(e);
                console.log('Error happened', errMsg.slice(0, 50));
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
            setSuccess(false);
            setLoading(true);
            const res = await createAccount(dataSend).unwrap();

            await doLogin({
                email: dataSend.email,
                password: dataSend.password,
            });
        } catch (e: any) {
            var err_msg = e.message?.email[0] ?? JSON.stringify(e);
        } finally {
            setLoading(false);
        }
    };

    return { doLogin, doLoginSocial, register, loginSuccess, loading };
};
