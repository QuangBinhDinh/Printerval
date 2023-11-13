import { useLogin } from '@auth/hook/useLogin';
import { useLoginFirstOpen } from '@auth/hook/useLoginFirstOpen';
import auth from '@auth/reducer';
import { POST_EXPIRE_DAY, STORAGE_KEY } from '@constant/index';
import { useLazyFetchPrintervalPostQuery } from '@home/service';
import { createSelector } from '@reduxjs/toolkit';
import config from '@store/configReducer';
import { useAppDispatch, useAppSelector } from '@store/hook';
import posts from '@store/postReducer';
import { RootState } from '@store/store';
import storage from '@util/storage';
import axios from 'axios';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { getUniqueId } from 'react-native-device-info';
import { useSelector } from 'react-redux';

// kiểm tra xem post đã expire chưa
const postCheckSelector = createSelector(
    (state: RootState) => state.posts?.expire_timestamp,
    time => !!time && time >= Date.now(),
);

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

    const validPost = useSelector(postCheckSelector);
    const [fetchPosts] = useLazyFetchPrintervalPostQuery();
    const fetchPrintervalPosts = async () => {
        if (!validPost) {
            try {
                var today = new Date();
                today.setDate(today.getDate() + POST_EXPIRE_DAY);

                var res = await fetchPosts().unwrap();
                dispatch(posts.actions.setPrintervalPosts({ timeStamp: today.getTime(), list: res.result }));
            } catch (e) {
                console.log(e);
            }
        } else {
            dispatch(posts.actions.shuffleBlog());
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
        fetchPrintervalPosts();
    }, []);
};
