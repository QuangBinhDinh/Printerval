import { useLogin } from '@auth/hook/useLogin';
import { useLoginFirstOpen } from '@auth/hook/useLoginFirstOpen';
import auth from '@auth/reducer';
import { STORAGE_KEY } from '@constant/index';
import config from '@store/configReducer';
import { useAppDispatch, useAppSelector } from '@store/hook';
import storage from '@util/storage';
import axios from 'axios';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { getUniqueId } from 'react-native-device-info';

export const useFirstOpen = () => {
    const invalidConfig = useAppSelector(state => state.config.invalidPrintBack);
    const { doLogin, doLoginSocial, loginState } = useLoginFirstOpen();
    const dispatch = useAppDispatch();

    const loginAsGuest = async () => {
        var token = await storage.get(STORAGE_KEY.CUSTOMER_TOKEN);
        if (!token) {
            const did = await getUniqueId();
            token = `${did}-${Date.now()}`;
        }
        storage.save(STORAGE_KEY.CUSTOMER_TOKEN, token);
        dispatch(auth.actions.setCustomerToken(token));
    };

    const loginPrinterval = async () => {
        //Lấy username/password nếu có từ storage để login
        //không có thì gen token để login = guest
        var socialData = await storage.get(STORAGE_KEY.AUTH_SOCIAL_DATA);
        if (socialData) {
            doLoginSocial(socialData);
        } else {
            var emailData = await storage.get(STORAGE_KEY.AUTH_DATA);
            if (emailData) {
                doLogin(emailData);
            } else {
                await loginAsGuest();
                RNBootSplash.hide({ fade: true, duration: 1000 });
            }
        }
    };

    const fetchAppConfig = async () => {
        // fetch cấu hình app
        // có thể fix lại sau này (thêm expire date)
        if (!invalidConfig) {
            var res = await axios.get('https://api.printerval.com/option?filters=key=invalid_print_back');
            if (res.data.status == 'successful' && res.data.result) {
                var invalid_print_back = res.data.result[0].value;
                dispatch(config.actions.setInvalidPrintBack(invalid_print_back.split(',')));
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
        fetchAppConfig();
    }, []);
};
