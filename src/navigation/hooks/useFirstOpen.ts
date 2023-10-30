import { debounce } from 'lodash';
import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

export const useFirstOpen = () => {
    useEffect(() => {
        debounce(() => {
            RNBootSplash.hide({ fade: true, duration: 1000 });
        }, 2000)();
    }, []);
};
