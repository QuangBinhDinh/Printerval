import React from 'react';
import codePush from 'react-native-code-push';
import { LogBox } from 'react-native';
import Router from './navigation';
import { Provider } from 'react-redux';
import Store, { persistor } from '@store/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PersistGate } from 'redux-persist/integration/react';

LogBox.ignoreAllLogs(); //Ignore all log notifications
if (!__DEV__) {
    console.log = () => null;
    console.group = () => null;
    console.info = () => null;
}

GoogleSignin.configure({
    webClientId: '1066661762461-ojsjpaf0dqup6reb3s0g7fnc5jis3c4u.apps.googleusercontent.com',
});
const App = () => {
    return (
        <Provider store={Store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router></Router>
            </PersistGate>
        </Provider>
    );
};

export const IS_PRODUCT = false;

const codePushOptions =
    IS_PRODUCT || __DEV__
        ? { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME }
        : {
              updateDialog: {
                  title: 'Có bản cập nhật mới',
                  optionalUpdateMessage: 'Đã có bản cập nhật. Bạn có muốn cài đặt nó không?',
                  optionalInstallButtonLabel: 'Đồng ý',
                  optionalIgnoreButtonLabel: 'Đóng',
              },
              installMode: codePush.InstallMode.IMMEDIATE,
          };

export default codePush(codePushOptions)(App);
