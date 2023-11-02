import { useLogin } from '@auth/component/useLogin';
import storage from '@util/storage';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

export const useFirstOpen = () => {
    const { doLogin, doLoginSocial, loginState } = useLogin();

    const loginPrinterval = async () => {
        var socialData = await storage.get('AuthSocialData');
        if (socialData) {
            doLoginSocial(socialData);
        } else {
            var emailData = await storage.get('AuthData');
            if (emailData) {
                doLogin(emailData);
            } else {
                RNBootSplash.hide({ fade: true, duration: 1000 });
            }
        }
    };

    useEffect(() => {
        if (loginState !== 'uninitialize') {
            RNBootSplash.hide({ fade: true, duration: 1000 });
        }
    }, [loginState]);

    useEffect(() => {
        loginPrinterval();
    }, []);
};
