import { useLogin } from '@auth/component/useLogin';
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
    const { doLogin, doLoginSocial, loginState } = useLogin();
    const dispatch = useAppDispatch();

    const generateCustomerToken = async () => {
        var token = await storage.get(STORAGE_KEY.CUSTOMER_TOKEN);
        if (token) {
            dispatch(auth.actions.setCustomerToken(token));
        } else {
            var did = await getUniqueId();
            dispatch(auth.actions.setCustomerToken(`${did}-${Date.now()}`));
        }
    };

    const loginPrinterval = async () => {
        var socialData = await storage.get(STORAGE_KEY.AUTH_SOCIAL_DATA);
        if (socialData) {
            doLoginSocial(socialData);
        } else {
            var emailData = await storage.get(STORAGE_KEY.AUTH_DATA);
            if (emailData) {
                doLogin(emailData);
            } else {
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
        generateCustomerToken();
        loginPrinterval();
        fetchAppConfig();
    }, []);
};
