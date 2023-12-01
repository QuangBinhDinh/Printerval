import { useLazyFetchCountriesQuery, useLazyFetchPaymentConfigQuery } from '@api/service';
import { useLoginFirstOpen } from '@auth/hook/useLoginFirstOpen';
import { POST_EXPIRE_DAY, STORAGE_KEY } from '@constant/index';
import { useLazyFetchPostByIdQuery, useLazyFetchPrintervalPostQuery } from '@home/service';
import { navigate } from '@navigation/service';
import { createSelector } from '@reduxjs/toolkit';
import config from '@store/configReducer';
import { useAppDispatch, useAppSelector } from '@store/hook';
import posts from '@store/postReducer';
import { RootState } from '@store/store';
import storage from '@util/storage';
import axios from 'axios';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';

// kiểm tra xem post đã expire hoặc đã có additonal post chưa
const postCheckSelector = createSelector(
    (state: RootState) => state.posts,
    posts => {
        const { expire_timestamp, policyPost } = posts;
        return (
            !!expire_timestamp &&
            expire_timestamp >= Date.now() &&
            policyPost.filter(i => [650, 651, 772].includes(i.id)).length == 3
        );
    },
);

export const useFirstOpen = () => {
    const invalidConfig = useAppSelector(state => state.config.invalidPrintBack);
    const countries = useAppSelector(state => state.config.countries);

    const { doLogin, doLoginSocial, loginAsGuest, loginState } = useLoginFirstOpen();
    const [fetchPayment] = useLazyFetchPaymentConfigQuery();
    const [fetchCountries] = useLazyFetchCountriesQuery();

    const dispatch = useAppDispatch();

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
                //RNBootSplash.hide({ fade: true, duration: 1000 });
            }
        }
    };

    const fetchAppConfig = async () => {
        // fetch cấu hình app
        // có thể fix lại sau này (thêm expire date)
        try {
            if (!invalidConfig) {
                var res = await axios.get('https://api.printerval.com/option?filters=key=invalid_print_back');
                if (res.data.status == 'successful' && res.data.result) {
                    var invalid_print_back = res.data.result[0].value;
                    dispatch(config.actions.setInvalidPrintBack(invalid_print_back.split(',')));
                }
            }

            await fetchPayment();

            await fetchCountries();
        } catch (e) {
            console.log(e);
        }
    };

    const validPost = useSelector(postCheckSelector);
    const [fetchPosts] = useLazyFetchPrintervalPostQuery();
    const [fetchPostById] = useLazyFetchPostByIdQuery();

    const fetchPrintervalPosts = async () => {
        if (!validPost) {
            try {
                var today = new Date();
                today.setDate(today.getDate() + POST_EXPIRE_DAY);

                //650, 651 là ID của Refund và Exchange policy mới tách
                //772 là ID của Sell Design policy
                var batch = await Promise.all([
                    fetchPosts().unwrap(),
                    fetchPostById(650).unwrap(),
                    fetchPostById(651).unwrap(),
                    fetchPostById(772).unwrap(),
                ]);

                var listPost = [...batch[0].result, ...batch[1].result, ...batch[2].result, ...batch[3].result];
                dispatch(posts.actions.setPrintervalPosts({ timeStamp: today.getTime(), list: listPost }));
            } catch (e) {
                console.log(e);
            }
        } else {
            dispatch(posts.actions.shuffleBlog());
        }
    };

    useEffect(() => {
        const checkIntro = async () => {
            if (loginState !== 'uninitialize') {
                RNBootSplash.hide({ fade: true, duration: 1000 });

                // var flag = await storage.get(STORAGE_KEY.INTRO_FLAG);
                // if (!!flag) {
                //     navigate('App');
                //     RNBootSplash.hide({ fade: true, duration: 1000 });
                // } else RNBootSplash.hide({ fade: true, duration: 1000 });
            }
        };

        checkIntro();
    }, [loginState]);

    useEffect(() => {
        loginPrinterval();
        fetchAppConfig();
        fetchPrintervalPosts();
    }, []);
};
