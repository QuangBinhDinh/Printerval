import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

/**
 * Hook dùng để gọi hàm khi animation navigation kết thúc (smooth transition)
 * @param {*} navigation // truyền props navigation
 * @param {()=> void} callBack  // truyền callback
 */
export const useAnimationEnd = callBack => {
    const navigation = useNavigation();
    useEffect(() => {
        const unsub = navigation.addListener('transitionEnd', e => {
            if (e.data.closing) callBack();
        });
        return unsub;
    }, [navigation]);
};

/**
 * Hook dùng để gọi hàm khi user focus vao screen
 * @param {*} navigation // truyền props navigation
 * @param {()=> void} callBack  // truyền callback
 * @param {any[]} deps //truyền các deps phụ thuộc
 */
export const useFocus = (callBack, deps = []) => {
    const navigation = useNavigation();

    useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            callBack();
        });
        return unsub;
    }, [navigation].concat(deps));
};

/**
 * Hook dùng để gọi hàm khi user leave screen
 * @param {*} navigation // truyền props navigation
 * @param {()=> void} callBack  // truyền callback
 * @param {any[]} deps //truyền các deps phụ thuộc
 * @param {number} delay //delay function 1 khoảng thời gian sau khi blur (smooth transition, default 500 ms)
 */
export const useBlur = (callBack, deps = [], delay = 500) => {
    const navigation = useNavigation();
    let timer;
    useEffect(() => {
        const unsub = navigation.addListener('blur', () => {
            timer = setTimeout(callBack, delay);
        });
        return () => {
            unsub();
            if (timer) clearTimeout(timer);
        };
    }, [navigation].concat(deps));
};

/**
 * Hook dùng để prevent không cho user nhấn back
 */
export const usePreventGoBack = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const prevent = navigation.addListener('beforeRemove', e => {
            if (e.data.action.type == 'GO_BACK') e.preventDefault();
        });
        return prevent;
    }, [navigation]);
};
